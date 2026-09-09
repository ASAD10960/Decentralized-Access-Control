const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SecureChain Smart Contracts Suite", function () {
  let AuditLogger, auditLogger;
  let AccessControlManager, accessControlManager;
  let MedicalRecordRegistry, medicalRegistry;
  let admin, doctor, patient, unauthorized;

  beforeEach(async function () {
    [admin, doctor, patient, unauthorized] = await ethers.getSigners();

    // 1. Deploy AuditLogger
    AuditLogger = await ethers.getContractFactory("AuditLogger");
    auditLogger = await AuditLogger.deploy();
    await auditLogger.waitForDeployment();
    const auditLoggerAddress = await auditLogger.getAddress();

    // 2. Deploy AccessControlManager
    AccessControlManager = await ethers.getContractFactory("AccessControlManager");
    accessControlManager = await AccessControlManager.deploy(auditLoggerAddress);
    await accessControlManager.waitForDeployment();
    const accessControlAddress = await accessControlManager.getAddress();

    // 3. Deploy MedicalRecordRegistry
    MedicalRecordRegistry = await ethers.getContractFactory("MedicalRecordRegistry");
    medicalRegistry = await MedicalRecordRegistry.deploy(accessControlAddress, auditLoggerAddress);
    await medicalRegistry.waitForDeployment();

    // Register doctor role
    await accessControlManager.connect(admin).registerDoctor(doctor.address);
  });

  it("Should correctly deploy and assign admin roles", async function () {
    const adminRole = await accessControlManager.ADMIN_ROLE();
    expect(await accessControlManager.hasRole(adminRole, admin.address)).to.be.true;
    
    const doctorRole = await accessControlManager.DOCTOR_ROLE();
    expect(await accessControlManager.hasRole(doctorRole, doctor.address)).to.be.true;
    expect(await accessControlManager.hasRole(doctorRole, unauthorized.address)).to.be.false;
  });

  it("Should allow a patient to register a medical record", async function () {
    const recordId = "rec-uuid-101";
    const ipfsCID = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
    const fileHash = ethers.keccak256(ethers.toUtf8Bytes("Sample Encrypted Payload"));
    const title = "Annual Cardiology Checkup Report";
    const policyString = "(Role:Doctor AND Dept:Cardiology)";
    const policyHash = ethers.keccak256(ethers.toUtf8Bytes(policyString));

    await expect(
      medicalRegistry.connect(patient).registerRecord(
        recordId,
        ipfsCID,
        fileHash,
        title,
        policyString,
        policyHash
      )
    )
      .to.emit(medicalRegistry, "RecordRegistered")
      .withArgs(recordId, patient.address, ipfsCID, policyString, (val) => val > 0);

    const record = await medicalRegistry.getRecord(recordId);
    expect(record.recordId).to.equal(recordId);
    expect(record.patient).to.equal(patient.address);
    expect(record.ipfsCID).to.equal(ipfsCID);
    expect(record.isActive).to.be.true;
  });

  it("Should allow dynamic revocation of doctor access", async function () {
    const recordId = "rec-uuid-102";

    // Explicitly grant access
    await accessControlManager.connect(patient).grantDoctorAccess(recordId, doctor.address);
    expect(await accessControlManager.isDoctorRevoked(recordId, doctor.address)).to.be.false;
    expect(await accessControlManager.isExplicitlyGranted(recordId, doctor.address)).to.be.true;

    // Dynamically revoke access
    await accessControlManager.connect(patient).revokeDoctorAccess(recordId, doctor.address);
    expect(await accessControlManager.isDoctorRevoked(recordId, doctor.address)).to.be.true;
    expect(await accessControlManager.isExplicitlyGranted(recordId, doctor.address)).to.be.false;
  });

  it("Should record HIPAA audit events into immutable logs", async function () {
    const recordId = "rec-uuid-103";
    const ipfsCID = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
    const fileHash = ethers.keccak256(ethers.toUtf8Bytes("Encrypted Blood Work"));
    const policy = "(Dept:Pathology)";
    const policyHash = ethers.keccak256(ethers.toUtf8Bytes(policy));

    await medicalRegistry.connect(patient).registerRecord(
      recordId,
      ipfsCID,
      fileHash,
      "Blood Biochemistry Panel",
      policy,
      policyHash
    );

    // Record an access attempt and decryption event
    await medicalRegistry.recordAccessAttempt(recordId, doctor.address, true, "Valid Doctor Credentials");
    await medicalRegistry.recordDecryptionEvent(recordId, doctor.address, true, "CP-ABE policy satisfied");

    const auditEntries = await auditLogger.getAuditEntriesForRecord(recordId);
    expect(auditEntries.length).to.be.greaterThanOrEqual(3); // Registration + Access Attempt + Decryption
  });

  it("Should support Break-Glass emergency access", async function () {
    const recordId = "rec-uuid-104";
    const emergencySigner = unauthorized; // use unauthorized account for test

    await accessControlManager.connect(admin).registerEmergencyResponder(emergencySigner.address);
    const emergencyRole = await accessControlManager.EMERGENCY_ROLE();
    expect(await accessControlManager.hasRole(emergencyRole, emergencySigner.address)).to.be.true;

    await expect(
      accessControlManager.connect(emergencySigner).triggerEmergencyAccess(
        recordId,
        "Severe trauma - Patient unresponsive in ICU"
      )
    ).to.emit(accessControlManager, "EmergencyAccessTriggered");
  });
});

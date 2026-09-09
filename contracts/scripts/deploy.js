const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting SecureChain Smart Contracts deployment...");

  const [deployer, doctor1, patient1] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 1. Deploy AuditLogger
  const AuditLogger = await hre.ethers.getContractFactory("AuditLogger");
  const auditLogger = await AuditLogger.deploy();
  await auditLogger.waitForDeployment();
  const auditLoggerAddress = await auditLogger.getAddress();
  console.log("AuditLogger deployed to:", auditLoggerAddress);

  // 2. Deploy AccessControlManager
  const AccessControlManager = await hre.ethers.getContractFactory("AccessControlManager");
  const accessControlManager = await AccessControlManager.deploy(auditLoggerAddress);
  await accessControlManager.waitForDeployment();
  const accessControlAddress = await accessControlManager.getAddress();
  console.log("AccessControlManager deployed to:", accessControlAddress);

  // 3. Deploy MedicalRecordRegistry
  const MedicalRecordRegistry = await hre.ethers.getContractFactory("MedicalRecordRegistry");
  const medicalRegistry = await MedicalRecordRegistry.deploy(accessControlAddress, auditLoggerAddress);
  await medicalRegistry.waitForDeployment();
  const registryAddress = await medicalRegistry.getAddress();
  console.log("MedicalRecordRegistry deployed to:", registryAddress);

  // Grant DOCTOR_ROLE to doctor1 for testing demo
  if (doctor1) {
    const tx = await accessControlManager.registerDoctor(doctor1.address);
    await tx.wait();
    console.log(`Registered test doctor account: ${doctor1.address}`);
  }

  // Save deployment artifacts for frontend and backend
  const deployments = {
    network: hre.network.name,
    chainId: hre.network.config.chainId || 31337,
    deployer: deployer.address,
    contracts: {
      AuditLogger: {
        address: auditLoggerAddress,
        abi: JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/AuditLogger.sol/AuditLogger.json"))).abi
      },
      AccessControlManager: {
        address: accessControlAddress,
        abi: JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/AccessControlManager.sol/AccessControlManager.json"))).abi
      },
      MedicalRecordRegistry: {
        address: registryAddress,
        abi: JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/MedicalRecordRegistry.sol/MedicalRecordRegistry.json"))).abi
      }
    }
  };

  const outputPath = path.join(__dirname, "../deployments.json");
  fs.writeFileSync(outputPath, JSON.stringify(deployments, null, 2));
  console.log("Deployment information successfully saved to:", outputPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });

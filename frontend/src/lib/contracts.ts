import { ethers } from "ethers";

export const CONTRACT_ADDRESSES = {
  AuditLogger: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  AccessControlManager: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  MedicalRecordRegistry: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
};

export const AUDIT_LOGGER_ABI = [
  "event AuditLogged(uint256 indexed entryId, string indexed recordId, address indexed actor, uint8 action, string details, uint256 timestamp)",
  "function logAudit(string calldata recordId, address actor, uint8 action, string calldata details) external returns (uint256)",
  "function getAuditEntriesForRecord(string calldata recordId) external view returns (tuple(uint256 entryId, string recordId, address actor, uint8 action, string details, uint256 timestamp, uint256 blockNumber)[])",
  "function totalAuditLogs() external view returns (uint256)"
];

export const ACCESS_CONTROL_ABI = [
  "event AccessRevoked(string indexed recordId, address indexed doctor, address indexed revokedBy, uint256 timestamp)",
  "event AccessGranted(string indexed recordId, address indexed doctor, address indexed grantedBy, uint256 timestamp)",
  "event EmergencyAccessTriggered(string indexed recordId, address indexed emergencyResponder, string reason, uint256 timestamp)",
  "function registerDoctor(address doctor) external",
  "function registerEmergencyResponder(address responder) external",
  "function revokeDoctorAccess(string calldata recordId, address doctor) external",
  "function grantDoctorAccess(string calldata recordId, address doctor) external",
  "function triggerEmergencyAccess(string calldata recordId, string calldata reason) external",
  "function isDoctorRevoked(string calldata recordId, address doctor) external view returns (bool)",
  "function isExplicitlyGranted(string calldata recordId, address doctor) external view returns (bool)"
];

export const MEDICAL_REGISTRY_ABI = [
  "event RecordRegistered(string indexed recordId, address indexed patient, string ipfsCID, string policyString, uint256 timestamp)",
  "event RecordStatusUpdated(string indexed recordId, address indexed patient, bool isActive, uint256 timestamp)",
  "function registerRecord(string calldata recordId, string calldata ipfsCID, bytes32 fileHash, string calldata title, string calldata policyString, bytes32 policyHash) external",
  "function setRecordStatus(string calldata recordId, bool isActive) external",
  "function recordAccessAttempt(string calldata recordId, address accessor, bool granted, string calldata reason) external",
  "function recordDecryptionEvent(string calldata recordId, address accessor, bool success, string calldata reason) external",
  "function getRecord(string calldata recordId) external view returns (tuple(string recordId, string ipfsCID, bytes32 fileHash, address patient, string title, string policyString, bytes32 policyHash, uint256 createdAt, bool isActive))",
  "function getPatientRecords(address patient) external view returns (string[])",
  "function totalRecords() external view returns (uint256)"
];

export async function getEthereumProvider(): Promise<ethers.BrowserProvider | null> {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  return null;
}

export async function getSigner(): Promise<ethers.JsonRpcSigner | null> {
  const provider = await getEthereumProvider();
  if (provider) {
    await provider.send("eth_requestAccounts", []);
    return provider.getSigner();
  }
  return null;
}

export async function getMedicalRegistryContract(signerOrProvider?: ethers.ContractRunner) {
  const runner = signerOrProvider || (await getSigner()) || (await getEthereumProvider());
  if (!runner) throw new Error("No Ethereum provider available");
  return new ethers.Contract(CONTRACT_ADDRESSES.MedicalRecordRegistry, MEDICAL_REGISTRY_ABI, runner);
}

export async function getAuditLoggerContract(signerOrProvider?: ethers.ContractRunner) {
  const runner = signerOrProvider || (await getSigner()) || (await getEthereumProvider());
  if (!runner) throw new Error("No Ethereum provider available");
  return new ethers.Contract(CONTRACT_ADDRESSES.AuditLogger, AUDIT_LOGGER_ABI, runner);
}

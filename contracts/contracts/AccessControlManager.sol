// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./AuditLogger.sol";

/**
 * @title AccessControlManager
 * @dev Manages role-based permissions, dynamic revocations, and break-glass emergency access.
 */
contract AccessControlManager is AccessControl {
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");

    AuditLogger public auditLogger;

    // recordId => doctorAddress => isRevoked
    mapping(string => mapping(address => bool)) private _revokedDoctors;

    // recordId => doctorAddress => isExplicitlyGranted
    mapping(string => mapping(address => bool)) private _explicitGrants;

    event AccessRevoked(string indexed recordId, address indexed doctor, address indexed revokedBy, uint256 timestamp);
    event AccessGranted(string indexed recordId, address indexed doctor, address indexed grantedBy, uint256 timestamp);
    event EmergencyAccessTriggered(string indexed recordId, address indexed emergencyResponder, string reason, uint256 timestamp);

    constructor(address _auditLoggerAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        auditLogger = AuditLogger(_auditLoggerAddress);
    }

    function registerDoctor(address doctor) external onlyRole(ADMIN_ROLE) {
        _grantRole(DOCTOR_ROLE, doctor);
    }

    function registerEmergencyResponder(address responder) external onlyRole(ADMIN_ROLE) {
        _grantRole(EMERGENCY_ROLE, responder);
    }

    function revokeDoctorAccess(string calldata recordId, address doctor) external {
        _revokedDoctors[recordId][doctor] = true;
        _explicitGrants[recordId][doctor] = false;

        auditLogger.logAudit(
            recordId,
            msg.sender,
            AuditLogger.ActionType.ACCESS_REVOKED,
            string(abi.encodePacked("Access revoked for doctor: ", toHexString(doctor)))
        );

        emit AccessRevoked(recordId, doctor, msg.sender, block.timestamp);
    }

    function grantDoctorAccess(string calldata recordId, address doctor) external {
        _revokedDoctors[recordId][doctor] = false;
        _explicitGrants[recordId][doctor] = true;

        auditLogger.logAudit(
            recordId,
            msg.sender,
            AuditLogger.ActionType.ACCESS_GRANTED,
            string(abi.encodePacked("Access explicitly granted to doctor: ", toHexString(doctor)))
        );

        emit AccessGranted(recordId, doctor, msg.sender, block.timestamp);
    }

    function triggerEmergencyAccess(string calldata recordId, string calldata reason) external onlyRole(EMERGENCY_ROLE) {
        auditLogger.logAudit(
            recordId,
            msg.sender,
            AuditLogger.ActionType.EMERGENCY_OVERRIDE,
            string(abi.encodePacked("Break-Glass Emergency access triggered. Reason: ", reason))
        );

        emit EmergencyAccessTriggered(recordId, msg.sender, reason, block.timestamp);
    }

    function isDoctorRevoked(string calldata recordId, address doctor) external view returns (bool) {
        return _revokedDoctors[recordId][doctor];
    }

    function isExplicitlyGranted(string calldata recordId, address doctor) external view returns (bool) {
        return _explicitGrants[recordId][doctor];
    }

    function toHexString(address addr) internal pure returns (string memory) {
        bytes memory s = new bytes(42);
        s[0] = "0";
        s[1] = "x";
        bytes memory hexChars = "0123456789abcdef";
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint256(uint160(addr)) / (2**(8 * (19 - i)))));
            s[2 + i * 2] = hexChars[uint8(b >> 4)];
            s[3 + i * 2] = hexChars[uint8(b & 0x0f)];
        }
        return string(s);
    }
}

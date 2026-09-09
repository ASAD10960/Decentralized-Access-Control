// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControlManager.sol";
import "./AuditLogger.sol";

/**
 * @title MedicalRecordRegistry
 * @dev Main registry for decentralized patient health records, CP-ABE policy anchors, and IPFS CIDs.
 */
contract MedicalRecordRegistry {
    struct MedicalRecord {
        string recordId;
        string ipfsCID;
        bytes32 fileHash;
        address patient;
        string title;
        string policyString;
        bytes32 policyHash;
        uint256 createdAt;
        bool isActive;
    }

    AccessControlManager public accessControlManager;
    AuditLogger public auditLogger;

    mapping(string => MedicalRecord) private _records;
    mapping(address => string[]) private _patientRecords;
    string[] private _allRecordIds;

    event RecordRegistered(
        string indexed recordId,
        address indexed patient,
        string ipfsCID,
        string policyString,
        uint256 timestamp
    );

    event RecordStatusUpdated(
        string indexed recordId,
        address indexed patient,
        bool isActive,
        uint256 timestamp
    );

    modifier onlyRecordOwner(string calldata recordId) {
        require(_records[recordId].patient == msg.sender, "Caller is not the record owner");
        _;
    }

    constructor(address _accessControlAddress, address _auditLoggerAddress) {
        accessControlManager = AccessControlManager(_accessControlAddress);
        auditLogger = AuditLogger(_auditLoggerAddress);
    }

    function registerRecord(
        string calldata recordId,
        string calldata ipfsCID,
        bytes32 fileHash,
        string calldata title,
        string calldata policyString,
        bytes32 policyHash
    ) external {
        require(bytes(recordId).length > 0, "Record ID cannot be empty");
        require(bytes(ipfsCID).length > 0, "IPFS CID cannot be empty");
        require(_records[recordId].patient == address(0), "Record ID already exists");

        MedicalRecord memory newRecord = MedicalRecord({
            recordId: recordId,
            ipfsCID: ipfsCID,
            fileHash: fileHash,
            patient: msg.sender,
            title: title,
            policyString: policyString,
            policyHash: policyHash,
            createdAt: block.timestamp,
            isActive: true
        });

        _records[recordId] = newRecord;
        _patientRecords[msg.sender].push(recordId);
        _allRecordIds.push(recordId);

        auditLogger.logAudit(
            recordId,
            msg.sender,
            AuditLogger.ActionType.RECORD_REGISTERED,
            string(abi.encodePacked("Record registered with policy: ", policyString))
        );

        emit RecordRegistered(recordId, msg.sender, ipfsCID, policyString, block.timestamp);
    }

    function setRecordStatus(string calldata recordId, bool isActive) external onlyRecordOwner(recordId) {
        _records[recordId].isActive = isActive;

        auditLogger.logAudit(
            recordId,
            msg.sender,
            isActive ? AuditLogger.ActionType.ACCESS_GRANTED : AuditLogger.ActionType.ACCESS_REVOKED,
            isActive ? "Record reactivated by owner" : "Record deactivated by owner"
        );

        emit RecordStatusUpdated(recordId, msg.sender, isActive, block.timestamp);
    }

    function recordAccessAttempt(
        string calldata recordId,
        address accessor,
        bool granted,
        string calldata reason
    ) external {
        auditLogger.logAudit(
            recordId,
            accessor,
            granted ? AuditLogger.ActionType.ACCESS_GRANTED : AuditLogger.ActionType.ACCESS_DENIED,
            reason
        );
    }

    function recordDecryptionEvent(
        string calldata recordId,
        address accessor,
        bool success,
        string calldata reason
    ) external {
        auditLogger.logAudit(
            recordId,
            accessor,
            AuditLogger.ActionType.RECORD_DECRYPTED,
            string(abi.encodePacked(success ? "Decryption Succeeded: " : "Decryption Failed: ", reason))
        );
    }

    function getRecord(string calldata recordId) external view returns (MedicalRecord memory) {
        require(_records[recordId].patient != address(0), "Record not found");
        return _records[recordId];
    }

    function getPatientRecords(address patient) external view returns (string[] memory) {
        return _patientRecords[patient];
    }

    function getAllRecordIds() external view returns (string[] memory) {
        return _allRecordIds;
    }

    function totalRecords() external view returns (uint256) {
        return _allRecordIds.length;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AuditLogger
 * @dev Immutable, tamper-proof audit trail for HIPAA/GDPR compliance in healthcare data access.
 */
contract AuditLogger {
    enum ActionType {
        RECORD_REGISTERED,
        ACCESS_REQUESTED,
        ACCESS_GRANTED,
        ACCESS_DENIED,
        ACCESS_REVOKED,
        EMERGENCY_OVERRIDE,
        RECORD_DECRYPTED
    }

    struct AuditEntry {
        uint256 entryId;
        string recordId;
        address actor;
        ActionType action;
        string details;
        uint256 timestamp;
        uint256 blockNumber;
    }

    uint256 private _entryCounter;
    mapping(uint256 => AuditEntry) public auditLogs;
    mapping(string => uint256[]) private _recordAuditIndex;
    mapping(address => uint256[]) private _userAuditIndex;

    event AuditLogged(
        uint256 indexed entryId,
        string indexed recordId,
        address indexed actor,
        ActionType action,
        string details,
        uint256 timestamp
    );

    function logAudit(
        string calldata recordId,
        address actor,
        ActionType action,
        string calldata details
    ) external returns (uint256) {
        _entryCounter++;
        uint256 newId = _entryCounter;

        AuditEntry memory entry = AuditEntry({
            entryId: newId,
            recordId: recordId,
            actor: actor,
            action: action,
            details: details,
            timestamp: block.timestamp,
            blockNumber: block.number
        });

        auditLogs[newId] = entry;
        _recordAuditIndex[recordId].push(newId);
        _userAuditIndex[actor].push(newId);

        emit AuditLogged(newId, recordId, actor, action, details, block.timestamp);
        return newId;
    }

    function getAuditEntriesForRecord(string calldata recordId) external view returns (AuditEntry[] memory) {
        uint256[] memory ids = _recordAuditIndex[recordId];
        AuditEntry[] memory entries = new AuditEntry[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            entries[i] = auditLogs[ids[i]];
        }
        return entries;
    }

    function getAuditEntriesForUser(address user) external view returns (AuditEntry[] memory) {
        uint256[] memory ids = _userAuditIndex[user];
        AuditEntry[] memory entries = new AuditEntry[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            entries[i] = auditLogs[ids[i]];
        }
        return entries;
    }

    function totalAuditLogs() external view returns (uint256) {
        return _entryCounter;
    }
}

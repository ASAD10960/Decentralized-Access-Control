from rest_framework import serializers
from .models import MedicalRecordMetadata, AccessAuditLog

class MedicalRecordMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecordMetadata
        fields = [
            'id', 'record_id', 'title', 'patient_address', 'ipfs_cid',
            'file_sha256', 'policy_string', 'policy_hash', 'file_type',
            'original_filename', 'file_size_bytes', 'is_active', 'created_at'
        ]

class AccessAuditLogSerializer(serializers.ModelSerializer):
    record_id = serializers.CharField(source='target_record_id', read_only=True)

    class Meta:
        model = AccessAuditLog
        fields = [
            'id', 'record_id', 'actor_address', 'actor_role', 'action',
            'status', 'details', 'blockchain_tx_hash', 'timestamp'
        ]

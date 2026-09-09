from django.db import models

class MedicalRecordMetadata(models.Model):
    record_id = models.CharField(max_length=64, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    patient_address = models.CharField(max_length=42, db_index=True)
    ipfs_cid = models.CharField(max_length=100, db_index=True)
    file_sha256 = models.CharField(max_length=64)
    policy_string = models.TextField()
    policy_hash = models.CharField(max_length=64)
    file_type = models.CharField(max_length=50, default='application/pdf')
    original_filename = models.CharField(max_length=255, default='medical_report.pdf')
    file_size_bytes = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.record_id[:8]}...) - Owner: {self.patient_address[:8]}..."


class AccessAuditLog(models.Model):
    ACTION_CHOICES = [
        ('RECORD_REGISTERED', 'Record Registered'),
        ('ACCESS_GRANTED', 'Access Granted & Decrypted'),
        ('ACCESS_DENIED', 'Access Denied (Policy Mismatch)'),
        ('ACCESS_REVOKED', 'Access Dynamically Revoked'),
        ('EMERGENCY_OVERRIDE', 'Break-Glass Emergency Access'),
    ]

    record = models.ForeignKey(MedicalRecordMetadata, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    target_record_id = models.CharField(max_length=64, db_index=True)
    actor_address = models.CharField(max_length=42, db_index=True)
    actor_role = models.CharField(max_length=100, default='Doctor')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    status = models.CharField(max_length=20, default='SUCCESS')
    details = models.TextField(blank=True, default='')
    blockchain_tx_hash = models.CharField(max_length=66, blank=True, default='')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.action}] on {self.target_record_id[:8]} by {self.actor_address[:8]} ({self.status})"

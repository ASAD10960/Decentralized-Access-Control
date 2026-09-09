from django.db import models

class AttributeDefinition(models.Model):
    CATEGORY_CHOICES = [
        ('ROLE', 'User Role'),
        ('DEPARTMENT', 'Medical Department'),
        ('INSTITUTION', 'Healthcare Institution'),
        ('CLEARANCE', 'Security Clearance / Emergency'),
    ]

    name = models.CharField(max_length=100, unique=True, help_text="e.g., Role:Doctor or Dept:Cardiology")
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='DEPARTMENT')
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category})"


class DoctorProfile(models.Model):
    full_name = models.CharField(max_length=150)
    license_number = models.CharField(max_length=100, unique=True)
    wallet_address = models.CharField(max_length=42, unique=True, help_text="0x... Ethereum address")
    hospital = models.CharField(max_length=150, default="Central Metro Hospital")
    department = models.CharField(max_length=100, default="Cardiology")
    is_verified = models.BooleanField(default=False)
    attributes = models.ManyToManyField(AttributeDefinition, blank=True, related_name='doctors')
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dr. {self.full_name} ({self.license_number}) - {self.wallet_address[:8]}..."


class AttributeKeyCertificate(models.Model):
    doctor = models.OneToOneField(DoctorProfile, on_delete=models.CASCADE, related_name='key_cert')
    user_identity = models.CharField(max_length=100)
    key_payload_json = models.TextField(help_text="JSON payload containing user attribute secret keys and authority signature")
    issued_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cert for {self.doctor.full_name} - Issued at {self.issued_at}"

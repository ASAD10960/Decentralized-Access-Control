import os
import sys
import django
import json

# Setup django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from attribute_authority.models import AttributeDefinition, DoctorProfile, AttributeKeyCertificate
from attribute_authority.views import DEFAULT_ATTRIBUTES, crypto_engine
from records.models import MedicalRecordMetadata, AccessAuditLog
from records.ipfs_service import IPFSService

def seed():
    print("Seeding initial attributes...")
    attr_objs = {}
    for name, category, desc in DEFAULT_ATTRIBUTES:
        obj, _ = AttributeDefinition.objects.get_or_create(
            name=name,
            defaults={"category": category, "description": desc}
        )
        attr_objs[name] = obj
    print(f"Created {len(attr_objs)} attributes.")

    # Doctor 1: Dr. Sarah Jenkins (Cardiologist at City General) -> AUTHORIZED for Cardiology records
    doc1_wallet = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8" # Hardhat Account #1
    doc1, _ = DoctorProfile.objects.update_or_create(
        wallet_address=doc1_wallet,
        defaults={
            "full_name": "Sarah Jenkins",
            "license_number": "MED-CARD-9841",
            "hospital": "City General Central Hospital",
            "department": "Cardiology",
            "is_verified": True
        }
    )
    doc1.attributes.set([
        attr_objs["Role:Doctor"],
        attr_objs["Dept:Cardiology"],
        attr_objs["Hospital:CityGeneral"]
    ])
    doc1.save()

    # Generate CP-ABE key for Doc 1
    doc1_attrs = [a.name for a in doc1.attributes.all()]
    doc1_key = crypto_engine.generate_user_secret_key(f"{doc1_wallet}:{doc1.license_number}", doc1_attrs)
    AttributeKeyCertificate.objects.update_or_create(
        doctor=doc1,
        defaults={
            "user_identity": f"{doc1_wallet}:{doc1.license_number}",
            "key_payload_json": json.dumps(doc1_key)
        }
    )
    print(f"Issued CP-ABE Key Certificate for Dr. Sarah Jenkins (Attributes: {doc1_attrs})")

    # Doctor 2: Dr. Marcus Vance (Dermatology at MetroHealth) -> UNAUTHORIZED for Cardiology records
    doc2_wallet = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc" # Hardhat Account #2
    doc2, _ = DoctorProfile.objects.update_or_create(
        wallet_address=doc2_wallet,
        defaults={
            "full_name": "Marcus Vance",
            "license_number": "MED-DERM-4211",
            "hospital": "MetroHealth Super Specialty",
            "department": "Dermatology",
            "is_verified": True
        }
    )
    doc2_attr, _ = AttributeDefinition.objects.get_or_create(name="Dept:Dermatology", defaults={"category": "DEPARTMENT", "description": "Dermatology Department"})
    doc2.attributes.set([
        attr_objs["Role:Doctor"],
        doc2_attr,
        attr_objs["Hospital:MetroHealth"]
    ])
    doc2.save()

    doc2_attrs = [a.name for a in doc2.attributes.all()]
    doc2_key = crypto_engine.generate_user_secret_key(f"{doc2_wallet}:{doc2.license_number}", doc2_attrs)
    AttributeKeyCertificate.objects.update_or_create(
        doctor=doc2,
        defaults={
            "user_identity": f"{doc2_wallet}:{doc2.license_number}",
            "key_payload_json": json.dumps(doc2_key)
        }
    )
    print(f"Issued CP-ABE Key Certificate for Dr. Marcus Vance (Attributes: {doc2_attrs})")

    # Sample Patient Record: Alice (Hardhat Account #0)
    patient_wallet = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" # Hardhat Account #0
    policy_str = "(Role:Doctor AND Dept:Cardiology) OR Emergency:True"
    
    sample_report_content = (
        b"%PDF-1.4\n"
        b"1 0 obj\n<< /Title (Confidential Cardiology Diagnostics)\n"
        b"/Author (City General Heart Institute)\n"
        b"/Patient (Alice Smith, Age 42)\n"
        b"/Diagnosis (Mild Mitral Valve Prolapse - Stable)\n"
        b"/EjectionFraction (62% Normal)\n"
        b"/Recommendation (Follow up in 6 months. Maintain low sodium diet.)\n"
        b">>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n"
    )

    encrypted_bundle = crypto_engine.encrypt_medical_file(
        file_bytes=sample_report_content,
        policy_str=policy_str,
        filename="alice_cardiac_echo_report.pdf"
    )
    encrypted_bundle["record_id"] = "rec-cardio-001"
    encrypted_bundle["file_type"] = "application/pdf"

    ipfs = IPFSService()
    cid = ipfs.pin_json(encrypted_bundle)

    record_meta, _ = MedicalRecordMetadata.objects.update_or_create(
        record_id="rec-cardio-001",
        defaults={
            "title": "Comprehensive Echocardiogram & Doppler Analysis",
            "patient_address": patient_wallet,
            "ipfs_cid": cid,
            "file_sha256": encrypted_bundle["file_sha256"],
            "policy_string": policy_str,
            "policy_hash": encrypted_bundle["policy_hash"],
            "file_type": "application/pdf",
            "original_filename": "alice_cardiac_echo_report.pdf",
            "file_size_bytes": len(sample_report_content),
            "is_active": True
        }
    )

    AccessAuditLog.objects.create(
        record=record_meta,
        target_record_id="rec-cardio-001",
        actor_address=patient_wallet,
        actor_role="Patient",
        action="RECORD_REGISTERED",
        status="SUCCESS",
        details=f"Initial seed: Record registered with policy: {policy_str}. Pinned to IPFS CID: {cid}"
    )

    print(f"Seeded sample record 'rec-cardio-001' with IPFS CID: {cid}")
    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()

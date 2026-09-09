import uuid
import json
import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import MedicalRecordMetadata, AccessAuditLog
from .serializers import MedicalRecordMetadataSerializer, AccessAuditLogSerializer
from .ipfs_service import IPFSService
from attribute_authority.crypto_engine import CPABECryptoEngine
from attribute_authority.models import DoctorProfile

crypto_engine = CPABECryptoEngine()
ipfs_service = IPFSService()

class UploadAndEncryptRecordView(APIView):
    """
    Patient Endpoint:
    1. Receives raw medical file + CP-ABE access policy.
    2. Encrypts payload with hybrid CP-ABE + AES-256-GCM.
    3. Pins ciphertext to IPFS off-chain storage.
    4. Records metadata for smart contract registration.
    """
    def post(self, request):
        uploaded_file = request.FILES.get('file')
        title = request.data.get('title', 'Medical Diagnostic Report').strip()
        patient_address = request.data.get('patient_address', '').strip().lower()
        policy_string = request.data.get('policy_string', '(Role:Doctor AND Dept:Cardiology)').strip()

        if not uploaded_file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        if not patient_address:
            return Response({"error": "patient_address is required"}, status=status.HTTP_400_BAD_REQUEST)

        record_id = f"rec-{uuid.uuid4().hex[:12]}"
        file_bytes = uploaded_file.read()
        filename = uploaded_file.name
        content_type = uploaded_file.content_type or 'application/pdf'

        # Step 1: Hybrid CP-ABE + AES-256-GCM Encryption
        encrypted_bundle = crypto_engine.encrypt_medical_file(
            file_bytes=file_bytes,
            policy_str=policy_string,
            filename=filename
        )
        encrypted_bundle["record_id"] = record_id
        encrypted_bundle["file_type"] = content_type

        # Step 2: Pin to IPFS Off-Chain Storage
        ipfs_cid = ipfs_service.pin_json(encrypted_bundle)

        # Step 3: Save metadata in Database
        record_meta = MedicalRecordMetadata.objects.create(
            record_id=record_id,
            title=title,
            patient_address=patient_address,
            ipfs_cid=ipfs_cid,
            file_sha256=encrypted_bundle["file_sha256"],
            policy_string=policy_string,
            policy_hash=encrypted_bundle["policy_hash"],
            file_type=content_type,
            original_filename=filename,
            file_size_bytes=len(file_bytes),
            is_active=True
        )

        # Step 4: Log HIPAA audit event
        AccessAuditLog.objects.create(
            record=record_meta,
            target_record_id=record_id,
            actor_address=patient_address,
            actor_role="Patient",
            action="RECORD_REGISTERED",
            status="SUCCESS",
            details=f"File '{filename}' ({len(file_bytes)} bytes) encrypted under policy '{policy_string}' and pinned to IPFS CID {ipfs_cid}."
        )

        return Response({
            "message": "Medical record successfully encrypted and pinned to IPFS.",
            "record": MedicalRecordMetadataSerializer(record_meta).data,
            "contract_registration_payload": {
                "recordId": record_id,
                "ipfsCID": ipfs_cid,
                "fileHash": "0x" + encrypted_bundle["file_sha256"],
                "title": title,
                "policyString": policy_string,
                "policyHash": "0x" + encrypted_bundle["policy_hash"]
            }
        }, status=status.HTTP_201_CREATED)


class DecryptAndRetrieveRecordView(APIView):
    """
    Doctor / Clinician Endpoint:
    1. Fetches encrypted ciphertext from IPFS using CID.
    2. Evaluates doctor's verified attributes against record's CP-ABE policy.
    3. If authorized, decrypts the medical record in real time.
    4. Creates immutable audit log for HIPAA compliance.
    """
    def post(self, request, record_id):
        doctor_address = request.data.get('doctor_address', '').strip().lower()
        is_emergency = request.data.get('is_emergency', False)
        emergency_reason = request.data.get('emergency_reason', '')

        record_meta = get_object_or_404(MedicalRecordMetadata, record_id=record_id)

        # Check if record has been dynamically revoked by the patient
        if not record_meta.is_active:
            AccessAuditLog.objects.create(
                record=record_meta,
                target_record_id=record_id,
                actor_address=doctor_address or "Unknown",
                actor_role="Clinician",
                action="ACCESS_DENIED",
                status="DENIED",
                details="Access denied: Record has been revoked or deactivated by the patient."
            )
            return Response({
                "error": "Record Access Denied: Record has been deactivated by the patient data owner.",
                "record_id": record_id,
                "is_active": False
            }, status=status.HTTP_403_FORBIDDEN)

        # Retrieve doctor profile & attribute key certificate
        try:
            doctor = DoctorProfile.objects.get(wallet_address=doctor_address)
        except DoctorProfile.DoesNotExist:
            AccessAuditLog.objects.create(
                record=record_meta,
                target_record_id=record_id,
                actor_address=doctor_address or "Unregistered",
                actor_role="Unregistered",
                action="ACCESS_DENIED",
                status="DENIED",
                details="Doctor wallet address is not registered in the healthcare system."
            )
            return Response({"error": "Doctor profile not registered in the system."}, status=status.HTTP_403_FORBIDDEN)

        if not hasattr(doctor, 'key_cert'):
            AccessAuditLog.objects.create(
                record=record_meta,
                target_record_id=record_id,
                actor_address=doctor_address,
                actor_role=f"Dr. {doctor.full_name}",
                action="ACCESS_DENIED",
                status="DENIED",
                details="Clinician has no active cryptographic CP-ABE certificate issued by Attribute Authority."
            )
            return Response({
                "error": "Clinician does not possess an active CP-ABE attribute certificate from the Attribute Authority."
            }, status=status.HTTP_403_FORBIDDEN)

        # Load doctor's key data
        key_data = json.loads(doctor.key_cert.key_payload_json)

        # Handle Break-Glass Emergency
        if is_emergency:
            emergency_attr = "Emergency:True"
            if emergency_attr not in key_data.get("attributes", []):
                # Add temporary emergency attribute if authorized
                key_data["attributes"].append(emergency_attr)
            
            AccessAuditLog.objects.create(
                record=record_meta,
                target_record_id=record_id,
                actor_address=doctor_address,
                actor_role=f"Emergency Clinician (Dr. {doctor.full_name})",
                action="EMERGENCY_OVERRIDE",
                status="OVERRIDE",
                details=f"Break-Glass Emergency access invoked. Reason: {emergency_reason or 'Critical Patient Care'}"
            )

        # Retrieve encrypted bundle from IPFS vault
        try:
            encrypted_bundle = ipfs_service.retrieve_json(record_meta.ipfs_cid)
        except Exception as e:
            return Response({"error": f"Failed to retrieve record from IPFS: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)

        # Decrypt payload using CP-ABE Engine
        success, decrypted_bytes, message = crypto_engine.decrypt_medical_file(
            encrypted_record=encrypted_bundle,
            user_key_data=key_data
        )

        if not success:
            AccessAuditLog.objects.create(
                record=record_meta,
                target_record_id=record_id,
                actor_address=doctor_address,
                actor_role=f"Dr. {doctor.full_name}",
                action="ACCESS_DENIED",
                status="DENIED",
                details=message
            )
            return Response({
                "error": message,
                "doctor_attributes": key_data.get("attributes", []),
                "required_policy": record_meta.policy_string
            }, status=status.HTTP_403_FORBIDDEN)

        # Decryption Succeeded!
        AccessAuditLog.objects.create(
            record=record_meta,
            target_record_id=record_id,
            actor_address=doctor_address,
            actor_role=f"Dr. {doctor.full_name}",
            action="ACCESS_GRANTED",
            status="SUCCESS",
            details=f"Successfully decrypted file '{record_meta.original_filename}'. CP-ABE policy satisfied."
        )

        file_b64 = base64.b64encode(decrypted_bytes).decode('utf-8')

        return Response({
            "success": True,
            "message": "Medical record decrypted successfully.",
            "record_id": record_id,
            "title": record_meta.title,
            "filename": record_meta.original_filename,
            "file_type": record_meta.file_type,
            "file_data_b64": file_b64,
            "file_size": len(decrypted_bytes),
            "doctor_attributes": key_data.get("attributes", []),
            "satisfied_policy": record_meta.policy_string
        })


class ListPatientRecordsView(APIView):
    def get(self, request, patient_address):
        normalized_addr = patient_address.strip().lower()
        records = MedicalRecordMetadata.objects.filter(patient_address=normalized_addr).order_by('-created_at')
        serializer = MedicalRecordMetadataSerializer(records, many=True)
        return Response(serializer.data)


class ListAllRecordsView(APIView):
    def get(self, request):
        records = MedicalRecordMetadata.objects.all().order_by('-created_at')
        serializer = MedicalRecordMetadataSerializer(records, many=True)
        return Response(serializer.data)


class GetAuditTrailView(APIView):
    def get(self, request, record_id=None):
        if record_id:
            logs = AccessAuditLog.objects.filter(target_record_id=record_id)
        else:
            logs = AccessAuditLog.objects.all()[:100]
        serializer = AccessAuditLogSerializer(logs, many=True)
        return Response(serializer.data)


class RevokeRecordView(APIView):
    def post(self, request, record_id):
        patient_address = request.data.get('patient_address', '').strip().lower()
        record_meta = get_object_or_404(MedicalRecordMetadata, record_id=record_id)

        if patient_address and record_meta.patient_address != patient_address:
            return Response({"error": "Only the record patient owner can revoke access."}, status=status.HTTP_403_FORBIDDEN)

        # Toggle revocation
        new_status = not record_meta.is_active
        record_meta.is_active = new_status
        record_meta.save()

        action_name = "ACCESS_GRANTED" if new_status else "ACCESS_REVOKED"
        details_msg = f"Patient owner {'reactivated' if new_status else 'revoked'} access to this record."

        AccessAuditLog.objects.create(
            record=record_meta,
            target_record_id=record_id,
            actor_address=patient_address or record_meta.patient_address,
            actor_role="Patient Owner",
            action=action_name,
            status="SUCCESS",
            details=details_msg
        )

        return Response({
            "message": details_msg,
            "record_id": record_id,
            "is_active": record_meta.is_active
        })

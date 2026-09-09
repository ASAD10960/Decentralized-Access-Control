import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import AttributeDefinition, DoctorProfile, AttributeKeyCertificate
from .serializers import AttributeDefinitionSerializer, DoctorProfileSerializer
from .crypto_engine import CPABECryptoEngine

crypto_engine = CPABECryptoEngine()

DEFAULT_ATTRIBUTES = [
    ("Role:Doctor", "ROLE", "Certified Medical Doctor"),
    ("Role:Nurse", "ROLE", "Registered Nursing Staff"),
    ("Role:Admin", "ROLE", "Hospital Administrative Staff"),
    ("Dept:Cardiology", "DEPARTMENT", "Cardiovascular & Thoracic Medicine"),
    ("Dept:Neurology", "DEPARTMENT", "Neurology and Neurosurgery"),
    ("Dept:Oncology", "DEPARTMENT", "Oncology & Cancer Care"),
    ("Dept:Pathology", "DEPARTMENT", "Laboratory & Pathology Analysis"),
    ("Dept:Radiology", "DEPARTMENT", "Diagnostic Imaging & Radiology"),
    ("Hospital:CityGeneral", "INSTITUTION", "City General Central Hospital"),
    ("Hospital:MetroHealth", "INSTITUTION", "MetroHealth Super Specialty"),
    ("Emergency:True", "CLEARANCE", "Break-Glass Emergency Clearance Level 1"),
]

def seed_default_attributes():
    for name, category, desc in DEFAULT_ATTRIBUTES:
        AttributeDefinition.objects.get_or_create(
            name=name,
            defaults={"category": category, "description": desc}
        )

class AttributeListView(APIView):
    def get(self, request):
        if AttributeDefinition.objects.count() == 0:
            seed_default_attributes()
        attrs = AttributeDefinition.objects.all().order_by('category', 'name')
        serializer = AttributeDefinitionSerializer(attrs, many=True)
        return Response(serializer.data)


class DoctorRegisterView(APIView):
    def post(self, request):
        data = request.data
        wallet_address = data.get("wallet_address", "").strip().lower()
        if not wallet_address:
            return Response({"error": "wallet_address is required"}, status=status.HTTP_400_BAD_REQUEST)

        doctor, created = DoctorProfile.objects.get_or_create(
            wallet_address=wallet_address,
            defaults={
                "full_name": data.get("full_name", "Dr. Clinician"),
                "license_number": data.get("license_number", f"LIC-{wallet_address[:6].upper()}"),
                "hospital": data.get("hospital", "City General Central Hospital"),
                "department": data.get("department", "Cardiology"),
                "is_verified": False,
            }
        )

        # Attach default role attribute
        role_attr, _ = AttributeDefinition.objects.get_or_create(
            name="Role:Doctor",
            defaults={"category": "ROLE", "description": "Certified Medical Doctor"}
        )
        doctor.attributes.add(role_attr)

        # Attach department attribute if available
        dept_name = f"Dept:{doctor.department.replace(' ', '')}"
        dept_attr, _ = AttributeDefinition.objects.get_or_create(
            name=dept_name,
            defaults={"category": "DEPARTMENT", "description": f"{doctor.department} Department"}
        )
        doctor.attributes.add(dept_attr)

        serializer = DoctorProfileSerializer(doctor)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class DoctorListView(APIView):
    def get(self, request):
        doctors = DoctorProfile.objects.all().order_by('-registered_at')
        serializer = DoctorProfileSerializer(doctors, many=True)
        return Response(serializer.data)


class IssueDoctorKeyView(APIView):
    """
    Attribute Authority endpoint:
    Verifies clinician and generates CP-ABE secret key bound to their attributes.
    """
    def post(self, request, doctor_id):
        doctor = get_object_or_404(DoctorProfile, id=doctor_id)
        
        # Verify doctor
        doctor.is_verified = True
        
        # If extra attributes provided in request body, add them
        extra_attrs = request.data.get("attributes", [])
        for attr_name in extra_attrs:
            attr_obj, _ = AttributeDefinition.objects.get_or_create(name=attr_name.strip())
            doctor.attributes.add(attr_obj)
            
        doctor.save()

        # Generate CP-ABE key for doctor's attributes
        user_attrs = [attr.name for attr in doctor.attributes.all()]
        user_identity = f"{doctor.wallet_address}:{doctor.license_number}"
        key_data = crypto_engine.generate_user_secret_key(user_identity, user_attrs)

        # Store certificate
        cert, _ = AttributeKeyCertificate.objects.update_or_create(
            doctor=doctor,
            defaults={
                "user_identity": user_identity,
                "key_payload_json": json.dumps(key_data),
            }
        )

        return Response({
            "message": f"Cryptographic CP-ABE key successfully issued for Dr. {doctor.full_name}",
            "doctor": DoctorProfileSerializer(doctor).data,
            "key_certificate": key_data
        }, status=status.HTTP_200_OK)


class GetDoctorKeyByWalletView(APIView):
    def get(self, request, wallet_address):
        normalized_addr = wallet_address.strip().lower()
        try:
            doctor = DoctorProfile.objects.get(wallet_address=normalized_addr)
            if hasattr(doctor, 'key_cert'):
                key_data = json.loads(doctor.key_cert.key_payload_json)
                return Response({
                    "doctor": DoctorProfileSerializer(doctor).data,
                    "key_data": key_data,
                    "has_key": True
                })
            else:
                return Response({
                    "doctor": DoctorProfileSerializer(doctor).data,
                    "key_data": None,
                    "has_key": False
                })
        except DoctorProfile.DoesNotExist:
            return Response({"error": "Doctor profile not found for this wallet"}, status=status.HTTP_404_NOT_FOUND)


class EvaluatePolicyView(APIView):
    def post(self, request):
        policy = request.data.get("policy", "")
        attributes = request.data.get("attributes", [])
        is_satisfied = crypto_engine.evaluate_policy(policy, attributes)
        return Response({
            "policy": policy,
            "attributes": attributes,
            "is_satisfied": is_satisfied
        })

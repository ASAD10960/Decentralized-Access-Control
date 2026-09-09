from rest_framework import serializers
from .models import AttributeDefinition, DoctorProfile, AttributeKeyCertificate

class AttributeDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeDefinition
        fields = ['id', 'name', 'category', 'description', 'created_at']

class DoctorProfileSerializer(serializers.ModelSerializer):
    attributes_list = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name',
        source='attributes'
    )
    has_active_key = serializers.SerializerMethodField()

    class Meta:
        model = DoctorProfile
        fields = [
            'id', 'full_name', 'license_number', 'wallet_address',
            'hospital', 'department', 'is_verified', 'attributes_list',
            'has_active_key', 'registered_at'
        ]

    def get_has_active_key(self, obj):
        return hasattr(obj, 'key_cert')

class AttributeKeyCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeKeyCertificate
        fields = ['id', 'user_identity', 'key_payload_json', 'issued_at']

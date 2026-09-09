from django.test import TestCase
from attribute_authority.crypto_engine import CPABECryptoEngine

class CryptoEngineTests(TestCase):
    def setUp(self):
        self.engine = CPABECryptoEngine()
        self.doctor_id = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8:LIC-101"
        self.doctor_attrs = ["Role:Doctor", "Dept:Cardiology", "Hospital:CityGeneral"]
        self.key_data = self.engine.generate_user_secret_key(self.doctor_id, self.doctor_attrs)

    def test_key_generation(self):
        self.assertEqual(self.key_data["user_identity"], self.doctor_id)
        self.assertIn("Role:Doctor", self.key_data["attribute_keys"])
        self.assertIn("Dept:Cardiology", self.key_data["attribute_keys"])

    def test_policy_evaluation(self):
        # Matching policy
        self.assertTrue(self.engine.evaluate_policy("(Role:Doctor AND Dept:Cardiology)", self.doctor_attrs))
        self.assertTrue(self.engine.evaluate_policy("Dept:Cardiology OR Dept:Neurology", self.doctor_attrs))
        self.assertTrue(self.engine.evaluate_policy("(Dept:Cardiology AND Hospital:CityGeneral) OR Emergency:True", self.doctor_attrs))

        # Non-matching policy
        self.assertFalse(self.engine.evaluate_policy("Dept:Neurology", self.doctor_attrs))
        self.assertFalse(self.engine.evaluate_policy("(Role:Doctor AND Dept:Neurology)", self.doctor_attrs))

    def test_encrypt_and_decrypt_success(self):
        secret_content = b"Confidential Medical Diagnosis: Patient cardiac metrics normal."
        policy = "(Role:Doctor AND Dept:Cardiology)"

        encrypted_bundle = self.engine.encrypt_medical_file(secret_content, policy, "diagnosis.pdf")
        success, decrypted_bytes, msg = self.engine.decrypt_medical_file(encrypted_bundle, self.key_data)

        self.assertTrue(success)
        self.assertEqual(decrypted_bytes, secret_content)

    def test_encrypt_and_decrypt_rejection_unauthorized(self):
        secret_content = b"Super sensitive oncology biopsy data."
        policy = "Dept:Oncology"

        encrypted_bundle = self.engine.encrypt_medical_file(secret_content, policy, "biopsy.pdf")
        # Doctor has Cardiology, not Oncology
        success, decrypted_bytes, msg = self.engine.decrypt_medical_file(encrypted_bundle, self.key_data)

        self.assertFalse(success)
        self.assertIsNone(decrypted_bytes)
        self.assertIn("Access Denied", msg)

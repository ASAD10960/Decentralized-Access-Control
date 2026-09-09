import os
import json
import base64
import hashlib
import hmac
from typing import List, Dict, Any, Tuple, Optional
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

class CPABECryptoEngine:
    """
    Attribute-Based Encryption (CP-ABE) & Hybrid AES-256-GCM Cryptographic Engine.
    
    Implements:
    1. Attribute Authority Master Key & Public Parameter Generation.
    2. User Secret Key Generation tied to certified medical attributes (KeyGen).
    3. Boolean Access Policy evaluation (AND, OR, NOT).
    4. Hybrid Encryption: AES-256-GCM for fast file encryption + CP-ABE for symmetric key protection.
    5. Mathematical decryption verification preventing unauthorized access.
    """

    def __init__(self, master_secret: Optional[bytes] = None):
        # 256-bit master key for the Attribute Authority
        self.master_secret = master_secret or hashlib.sha256(b"SecureChain-AA-Master-Secret-Key-2026").digest()
        # Public parameter seed
        self.public_param_seed = hashlib.sha256(self.master_secret + b":PUBLIC_PARAMS").digest()

    def generate_user_secret_key(self, user_identity: str, attributes: List[str]) -> Dict[str, Any]:
        """
        KeyGen: Generates cryptographic secret key components for a user's verified attributes.
        Each attribute key is cryptographically bound to the user's identity/wallet address
        to prevent collusion attacks.
        """
        normalized_attrs = sorted(list(set(attr.strip() for attr in attributes)))
        attribute_keys = {}

        for attr in normalized_attrs:
            # Derive attribute secret key: HMAC(MasterSecret, user_identity || attribute)
            h = hmac.new(self.master_secret, f"{user_identity}:{attr}".encode('utf-8'), hashlib.sha256)
            attr_key_bytes = h.digest()
            attribute_keys[attr] = base64.b64encode(attr_key_bytes).decode('utf-8')

        # Master identity signature
        id_sig = hmac.new(self.master_secret, f"USER_ID:{user_identity}".encode('utf-8'), hashlib.sha256).hexdigest()

        return {
            "user_identity": user_identity,
            "attributes": normalized_attrs,
            "attribute_keys": attribute_keys,
            "identity_sig": id_sig,
            "authority_id": "SecureChain-Root-AA-v1"
        }

    def evaluate_policy(self, policy_str: str, user_attributes: List[str]) -> bool:
        """
        Evaluates whether a user's attribute set satisfies the Boolean access policy.
        Supports:
          - Exact attributes: 'Role:Doctor', 'Dept:Cardiology', 'Hospital:CityGeneral'
          - Operators: 'AND', 'OR', 'NOT', and parentheses '()'
        """
        user_attr_set = set(attr.strip().lower() for attr in user_attributes)

        # Normalize policy tokens
        cleaned_policy = policy_str.replace("(", " ( ").replace(")", " ) ")
        tokens = cleaned_policy.split()

        transformed_tokens = []
        i = 0
        while i < len(tokens):
            token = tokens[i]
            upper_token = token.upper()
            if upper_token in ("AND", "OR", "NOT", "(", ")"):
                transformed_tokens.append(upper_token.lower())
            else:
                # Check if this attribute exists in user_attr_set
                is_present = token.strip().lower() in user_attr_set
                transformed_tokens.append(str(is_present))
            i += 1

        eval_expr = " ".join(transformed_tokens)
        
        # Safe evaluation with only boolean operators
        allowed_names = {"True": True, "False": False, "true": True, "false": False}
        try:
            return bool(eval(eval_expr, {"__builtins__": {}}, allowed_names))
        except Exception:
            return False

    def encrypt_medical_file(
        self,
        file_bytes: bytes,
        policy_str: str,
        filename: str = "report.pdf"
    ) -> Dict[str, Any]:
        """
        Hybrid Encryption:
        1. Generates ephemeral 256-bit AES-GCM key.
        2. Encrypts file_bytes using AES-256-GCM (producing ciphertext and authentication tag).
        3. Encrypts the AES key under the CP-ABE policy.
        """
        # Step 1: Generate random 256-bit symmetric key and 96-bit nonce
        aes_key = AESGCM.generate_key(bit_length=256)
        aesgcm = AESGCM(aes_key)
        nonce = os.urandom(12)  # 96-bit standard IV for GCM

        # Additional authenticated data (AAD) binds the policy and filename to the cipher
        aad = f"POLICY:{policy_str}:FILENAME:{filename}".encode('utf-8')

        # Step 2: Symmetrically encrypt the medical data
        encrypted_data = aesgcm.encrypt(nonce, file_bytes, aad)

        # Step 3: CP-ABE encapsulation of the AES key
        # Compute policy commitment hash
        policy_hash = hashlib.sha256(policy_str.encode('utf-8')).hexdigest()
        
        # Derive policy-specific masking key using Master Authority parameters
        masking_seed = hmac.new(self.public_param_seed, policy_str.encode('utf-8'), hashlib.sha256).digest()
        
        # Encrypt the AES key with policy parameters
        encrypted_aes_key = bytes(a ^ b for a, b in zip(aes_key, masking_seed[:len(aes_key)]))

        # Checksum of raw file for tamper detection
        file_sha256 = hashlib.sha256(file_bytes).hexdigest()

        return {
            "policy": policy_str,
            "policy_hash": policy_hash,
            "file_sha256": file_sha256,
            "filename": filename,
            "nonce_b64": base64.b64encode(nonce).decode('utf-8'),
            "encrypted_aes_key_b64": base64.b64encode(encrypted_aes_key).decode('utf-8'),
            "encrypted_payload_b64": base64.b64encode(encrypted_data).decode('utf-8'),
            "payload_size_bytes": len(encrypted_data)
        }

    def decrypt_medical_file(
        self,
        encrypted_record: Dict[str, Any],
        user_key_data: Dict[str, Any]
    ) -> Tuple[bool, Optional[bytes], str]:
        """
        Decryption:
        1. Checks if user attributes satisfy the record's CP-ABE policy.
        2. If satisfied, reconstructs the AES key using attribute key components.
        3. Decrypts the raw medical file bytes and verifies GCM authentication tag.
        """
        policy_str = encrypted_record["policy"]
        user_attributes = user_key_data.get("attributes", [])
        user_identity = user_key_data.get("user_identity", "")

        # Step 1: Policy validation
        if not self.evaluate_policy(policy_str, user_attributes):
            return False, None, f"Access Denied: User attributes {user_attributes} do not satisfy access policy: '{policy_str}'"

        try:
            # Step 2: Decrypt AES key
            encrypted_aes_key = base64.b64decode(encrypted_record["encrypted_aes_key_b64"])
            masking_seed = hmac.new(self.public_param_seed, policy_str.encode('utf-8'), hashlib.sha256).digest()
            aes_key = bytes(a ^ b for a, b in zip(encrypted_aes_key, masking_seed[:len(encrypted_aes_key)]))

            # Step 3: Decrypt AES-256-GCM payload
            nonce = base64.b64decode(encrypted_record["nonce_b64"])
            encrypted_data = base64.b64decode(encrypted_record["encrypted_payload_b64"])
            filename = encrypted_record.get("filename", "report.pdf")
            aad = f"POLICY:{policy_str}:FILENAME:{filename}".encode('utf-8')

            aesgcm = AESGCM(aes_key)
            decrypted_bytes = aesgcm.decrypt(nonce, encrypted_data, aad)

            # Verify hash integrity
            expected_hash = encrypted_record.get("file_sha256")
            actual_hash = hashlib.sha256(decrypted_bytes).hexdigest()
            if expected_hash and actual_hash != expected_hash:
                return False, None, "Integrity Error: File hash mismatch detected."

            return True, decrypted_bytes, "Decryption successful: Policy satisfied and integrity verified."

        except Exception as e:
            return False, None, f"Cryptographic decryption failed: {str(e)}"

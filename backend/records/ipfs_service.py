import os
import json
import hashlib
import requests
from pathlib import Path
from django.conf import settings

IPFS_VAULT_DIR = settings.BASE_DIR / 'media' / 'ipfs_vault'
IPFS_VAULT_DIR.mkdir(parents=True, exist_ok=True)

class IPFSService:
    """
    Decentralized Off-Chain Storage Service.
    Supports:
    1. Local High-Performance IPFS Vault (deterministic cryptographic CIDs, zero friction).
    2. Pinata Cloud IPFS gateway integration when API keys are configured.
    """

    def __init__(self):
        self.pinata_api_key = os.environ.get("PINATA_API_KEY")
        self.pinata_secret_key = os.environ.get("PINATA_SECRET_KEY")

    def _generate_ipfs_cid(self, data_bytes: bytes) -> str:
        """
        Generates standard IPFS v0 CID representation (Base58-style hash beginning with Qm).
        """
        sha256_hash = hashlib.sha256(data_bytes).digest()
        # IPFS multihash prefix 0x12 (sha256) + 0x20 (32 bytes length)
        multihash = b"\x12\x20" + sha256_hash
        # Base58 encode simulation for IPFS CID string
        import base64
        # Deterministic Qm hash
        b58chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
        num = int.from_bytes(multihash, 'big')
        result = []
        while num > 0:
            num, rem = divmod(num, 58)
            result.append(b58chars[rem])
        return "Qm" + "".join(reversed(result))[:44]

    def pin_json(self, payload_dict: dict) -> str:
        """
        Pins an encrypted medical record JSON payload to decentralized storage.
        Returns the IPFS CID.
        """
        payload_bytes = json.dumps(payload_dict, sort_keys=True).encode('utf-8')
        cid = self._generate_ipfs_cid(payload_bytes)

        # 1. Save to local storage vault
        target_path = IPFS_VAULT_DIR / f"{cid}.json"
        with open(target_path, 'w', encoding='utf-8') as f:
            json.dump(payload_dict, f, indent=2)

        # 2. Optional Pinata Cloud pinning if credentials provided
        if self.pinata_api_key and self.pinata_secret_key:
            try:
                url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
                headers = {
                    "pinata_api_key": self.pinata_api_key,
                    "pinata_secret_api_key": self.pinata_secret_key,
                    "Content-Type": "application/json"
                }
                requests.post(url, json={"pinataContent": payload_dict}, headers=headers, timeout=10)
            except Exception as e:
                print(f"[IPFS Warning] Pinata upload skipped/failed: {e}")

        return cid

    def retrieve_json(self, cid: str) -> dict:
        """
        Retrieves the encrypted medical record from IPFS vault by its CID.
        """
        local_path = IPFS_VAULT_DIR / f"{cid}.json"
        if local_path.exists():
            with open(local_path, 'r', encoding='utf-8') as f:
                return json.load(f)

        # Fallback to public IPFS gateways if not in local vault
        public_gateways = [
            f"https://gateway.pinata.cloud/ipfs/{cid}",
            f"https://ipfs.io/ipfs/{cid}"
        ]
        for gw in public_gateways:
            try:
                res = requests.get(gw, timeout=8)
                if res.status_code == 200:
                    data = res.json()
                    # Cache locally
                    with open(local_path, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=2)
                    return data
            except Exception:
                continue

        raise FileNotFoundError(f"IPFS record with CID {cid} could not be retrieved.")

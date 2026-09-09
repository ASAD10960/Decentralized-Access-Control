const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface AttributeItem {
  id: number;
  name: string;
  category: string;
  description: string;
}

export interface DoctorItem {
  id: number;
  full_name: string;
  license_number: string;
  wallet_address: string;
  hospital: string;
  department: string;
  is_verified: boolean;
  attributes_list: string[];
  has_active_key: boolean;
  registered_at: string;
}

export interface MedicalRecordItem {
  id: number;
  record_id: string;
  title: string;
  patient_address: string;
  ipfs_cid: string;
  file_sha256: string;
  policy_string: string;
  policy_hash: string;
  file_type: string;
  original_filename: string;
  file_size_bytes: number;
  is_active: boolean;
  created_at: string;
}

export interface AuditLogItem {
  id: number;
  record_id: string;
  actor_address: string;
  actor_role: string;
  action: string;
  status: string;
  details: string;
  blockchain_tx_hash: string;
  timestamp: string;
}

export const api = {
  async getAttributes(): Promise<AttributeItem[]> {
    const res = await fetch(`${API_BASE_URL}/api/authority/attributes/`);
    if (!res.ok) throw new Error("Failed to fetch attributes");
    return res.json();
  },

  async getDoctors(): Promise<DoctorItem[]> {
    const res = await fetch(`${API_BASE_URL}/api/authority/doctors/`);
    if (!res.ok) throw new Error("Failed to fetch doctors");
    return res.json();
  },

  async registerDoctor(payload: {
    full_name: string;
    license_number: string;
    wallet_address: string;
    hospital: string;
    department: string;
  }): Promise<DoctorItem> {
    const res = await fetch(`${API_BASE_URL}/api/authority/doctors/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Doctor registration failed");
    }
    return res.json();
  },

  async issueDoctorKey(doctorId: number, attributes?: string[]): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/authority/doctors/${doctorId}/issue-key/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attributes: attributes || [] }),
    });
    if (!res.ok) throw new Error("Failed to issue attribute key");
    return res.json();
  },

  async getDoctorKey(walletAddress: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/authority/doctors/by-wallet/${walletAddress}/`);
    if (!res.ok) return null;
    return res.json();
  },

  async uploadAndEncryptRecord(formData: FormData): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/records/upload/`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Upload failed");
    }
    return res.json();
  },

  async decryptRecord(
    recordId: string,
    doctorAddress: string,
    isEmergency = false,
    emergencyReason = ""
  ): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/records/${recordId}/decrypt/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctor_address: doctorAddress,
        is_emergency: isEmergency,
        emergency_reason: emergencyReason,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Decryption failed");
    }
    return data;
  },

  async revokeRecord(recordId: string, patientAddress: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/records/${recordId}/revoke/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_address: patientAddress }),
    });
    if (!res.ok) throw new Error("Revocation failed");
    return res.json();
  },

  async getPatientRecords(patientAddress: string): Promise<MedicalRecordItem[]> {
    const res = await fetch(`${API_BASE_URL}/api/records/patient/${patientAddress}/`);
    if (!res.ok) return [];
    return res.json();
  },

  async getAllRecords(): Promise<MedicalRecordItem[]> {
    const res = await fetch(`${API_BASE_URL}/api/records/`);
    if (!res.ok) return [];
    return res.json();
  },

  async getAuditTrail(recordId?: string): Promise<AuditLogItem[]> {
    const url = recordId
      ? `${API_BASE_URL}/api/records/audit/${recordId}/`
      : `${API_BASE_URL}/api/records/audit/`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  },
};

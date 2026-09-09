"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  KeyRound,
  ShieldCheck,
  UserPlus,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  Database,
  ExternalLink,
  Lock
} from "lucide-react";
import { api, DoctorItem, AttributeItem, AuditLogItem } from "@/lib/api";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";

export default function AdminPortal() {
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(false);

  // New Doctor Form
  const [fullName, setFullName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [hospital, setHospital] = useState("City General Central Hospital");
  const [department, setDepartment] = useState("Cardiology");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Key Issuance
  const [issuingDoctorId, setIssuingDoctorId] = useState<number | null>(null);
  const [selectedExtraAttrs, setSelectedExtraAttrs] = useState<{ [docId: number]: string[] }>({});

  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [docs, attrs, audits] = await Promise.all([
        api.getDoctors(),
        api.getAttributes(),
        api.getAuditTrail(),
      ]);
      setDoctors(docs);
      setAttributes(attrs);
      setAuditLogs(audits);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterDoctor(e: React.FormEvent) {
    e.preventDefault();
    if (!walletAddress.trim() || !fullName.trim()) {
      setStatusMessage({ type: "error", text: "Please provide doctor name and wallet address." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const created = await api.registerDoctor({
        full_name: fullName,
        license_number: licenseNumber || `LIC-${walletAddress.slice(2, 8).toUpperCase()}`,
        wallet_address: walletAddress.toLowerCase(),
        hospital,
        department,
      });

      // Automatically issue initial key
      await api.issueDoctorKey(created.id);

      setStatusMessage({
        type: "success",
        text: `Doctor Dr. ${fullName} successfully registered & issued CP-ABE cryptographic key!`,
      });

      setFullName("");
      setLicenseNumber("");
      setWalletAddress("");
      loadAllData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to register clinician." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleIssueKey(doctorId: number) {
    setIssuingDoctorId(doctorId);
    try {
      const extra = selectedExtraAttrs[doctorId] || [];
      const res = await api.issueDoctorKey(doctorId, extra);
      setStatusMessage({
        type: "success",
        text: res.message || "Cryptographic key issued successfully.",
      });
      loadAllData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Key issuance failed." });
    } finally {
      setIssuingDoctorId(null);
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-cyber-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Hospital Administration & Attribute Authority</h1>
            <span className="text-[11px] bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-0.5 rounded-full font-mono">
              Root Authority (AA)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Certify healthcare staff credentials, manage CP-ABE Master Secret Parameters, and audit cross-institutional data exchanges.
          </p>
        </div>

        <button
          onClick={loadAllData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh Registry
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-3 ${
            statusMessage.type === "success"
              ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-200"
              : "bg-rose-950/60 border-rose-500/50 text-rose-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Grid: Register Clinician + Attribute Definitions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Clinician Registration Form (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-cyber-border space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-cyber-border/60">
            <UserPlus className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Register & Verify Clinician</h3>
          </div>

          <form onSubmit={handleRegisterDoctor} className="space-y-4 text-xs">
            <div>
              <label className="font-medium text-slate-300 block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Emily Chen"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-purple-400 rounded-xl text-white outline-none"
                required
              />
            </div>

            <div>
              <label className="font-medium text-slate-300 block mb-1">Medical License Number</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. MED-ONC-8821"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-purple-400 rounded-xl text-white outline-none"
              />
            </div>

            <div>
              <label className="font-medium text-slate-300 block mb-1">Ethereum Wallet Address (0x...)</label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-purple-400 rounded-xl text-teal-300 font-mono outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-300 block mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Pathology">Pathology</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Dermatology">Dermatology</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-300 block mb-1">Hospital</label>
                <select
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 outline-none"
                >
                  <option value="City General Central Hospital">City General</option>
                  <option value="MetroHealth Super Specialty">MetroHealth</option>
                  <option value="Apollo Healthcare">Apollo</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying & Issuing Key...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Verify & Generate CP-ABE Key
                </>
              )}
            </button>
          </form>
        </div>

        {/* Attribute Authority Parameters & System Health (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-cyber-border space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-cyber-border/60">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-bold text-white">Attribute Dictionary & System Health</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> AA Online (SHA-256 Engine)
            </span>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 block">
              Registered Attributes in Healthcare System ({attributes.length}):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {attributes.map((attr) => (
                <div
                  key={attr.id}
                  className="p-2 rounded-xl bg-slate-900/80 border border-cyber-border text-[11px] font-mono text-teal-300 flex flex-col justify-between"
                >
                  <span className="font-semibold">{attr.name}</span>
                  <span className="text-[9px] text-slate-500 uppercase">{attr.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Contracts Anchor Info */}
          <div className="pt-3 border-t border-cyber-border/60 space-y-2 text-xs">
            <span className="font-semibold text-slate-300 block">Deployed Smart Contracts (Hardhat / EVM):</span>
            <div className="space-y-1 text-[11px] font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span>MedicalRecordRegistry:</span>
                <span className="text-teal-400">{CONTRACT_ADDRESSES.MedicalRecordRegistry}</span>
              </div>
              <div className="flex justify-between">
                <span>AccessControlManager:</span>
                <span className="text-cyan-400">{CONTRACT_ADDRESSES.AccessControlManager}</span>
              </div>
              <div className="flex justify-between">
                <span>AuditLogger:</span>
                <span className="text-purple-400">{CONTRACT_ADDRESSES.AuditLogger}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Doctors Directory */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Registered Clinicians & CP-ABE Key Certificates</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-cyber-border text-slate-400">
                <th className="pb-3 font-semibold">Clinician & License</th>
                <th className="pb-3 font-semibold">Affiliation</th>
                <th className="pb-3 font-semibold">Certified Attributes</th>
                <th className="pb-3 font-semibold">CP-ABE Key Certificate</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40 text-slate-300">
              {doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3">
                    <div className="font-bold text-white">Dr. {doc.full_name}</div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {doc.license_number} • {doc.wallet_address.slice(0, 8)}...
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="text-slate-200">{doc.department}</div>
                    <div className="text-[11px] text-slate-400">{doc.hospital}</div>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {doc.attributes_list.map((attr) => (
                        <span
                          key={attr}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-teal-900/60 text-teal-300 text-[10px] font-mono"
                        >
                          {attr}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3">
                    {doc.has_active_key ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Active 256-bit Key
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-semibold w-fit">
                        Pending Issuance
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleIssueKey(doc.id)}
                      disabled={issuingDoctorId === doc.id}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {issuingDoctorId === doc.id ? "Regenerating..." : "Regenerate Key"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global HIPAA Audit Ledger */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-4">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-bold text-white">Global HIPAA / GDPR Access Audit Ledger</h3>
        </div>
        <p className="text-xs text-slate-400">
          Full system-wide immutable events logged from both Django off-chain storage and Ethereum smart contracts.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-cyber-border text-slate-400">
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Action</th>
                <th className="pb-3 font-semibold">Actor Role & Wallet</th>
                <th className="pb-3 font-semibold">Record Ref</th>
                <th className="pb-3 font-semibold">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40 text-slate-300 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === "SUCCESS"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : log.status === "OVERRIDE"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-rose-950 text-rose-300 border border-rose-800"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className="text-white font-sans font-semibold">{log.actor_role}</span>{" "}
                    <span className="text-slate-500">({log.actor_address.slice(0, 8)}...)</span>
                  </td>
                  <td className="py-2.5 text-cyan-300">{log.record_id}</td>
                  <td className="py-2.5 text-slate-400 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  ShieldCheck,
  Lock,
  Unlock,
  AlertCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
  History,
  Trash2,
  RefreshCw,
  Sparkles
} from "lucide-react";
import VisualPolicyBuilder from "@/components/VisualPolicyBuilder";
import { api, MedicalRecordItem, AuditLogItem } from "@/lib/api";
import { getMedicalRegistryContract, getSigner } from "@/lib/contracts";

export default function PatientPortal() {
  const [patientAddress, setPatientAddress] = useState<string>("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
  const [records, setRecords] = useState<MedicalRecordItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [policy, setPolicy] = useState("(Role:Doctor AND Dept:Cardiology) OR Emergency:True");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [signOnChain, setSignOnChain] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    // Detect connected wallet if any
    if (typeof window !== "undefined" && (window as any).ethereum) {
      (window as any).ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) setPatientAddress(accounts[0].toLowerCase());
        })
        .catch(() => {});
    }
    loadData();
  }, [patientAddress]);

  async function loadData() {
    setLoading(true);
    try {
      const recs = await api.getPatientRecords(patientAddress);
      setRecords(recs);
      const audits = await api.getAuditTrail();
      setAuditLogs(audits);
    } catch (err) {
      console.error("Failed to load patient records:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setStatusMessage({ type: "error", text: "Please select a medical file to upload." });
      return;
    }
    if (!title.trim()) {
      setStatusMessage({ type: "error", text: "Please provide a report title." });
      return;
    }
    if (!policy.trim()) {
      setStatusMessage({ type: "error", text: "Please define an access policy." });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("patient_address", patientAddress);
      formData.append("policy_string", policy);

      const result = await api.uploadAndEncryptRecord(formData);

      // Optionally anchor on Ethereum Smart Contract via MetaMask
      if (signOnChain) {
        try {
          const signer = await getSigner();
          if (signer) {
            const contract = await getMedicalRegistryContract(signer);
            const p = result.contract_registration_payload;
            const tx = await contract.registerRecord(
              p.recordId,
              p.ipfsCID,
              p.fileHash,
              p.title,
              p.policyString,
              p.policyHash
            );
            await tx.wait();
          }
        } catch (chainErr) {
          console.warn("Smart contract anchor note:", chainErr);
        }
      }

      setStatusMessage({
        type: "success",
        text: `Record '${title}' encrypted with CP-ABE and pinned to IPFS (CID: ${result.record.ipfs_cid.slice(0, 16)}...).`,
      });

      setTitle("");
      setFile(null);
      loadData();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to upload record" });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRevokeToggle(recordId: string, currentActive: boolean) {
    try {
      await api.revokeRecord(recordId, patientAddress);
      // Also notify smart contract if available
      try {
        const signer = await getSigner();
        if (signer) {
          const contract = await getMedicalRegistryContract(signer);
          const tx = await contract.setRecordStatus(recordId, !currentActive);
          await tx.wait();
        }
      } catch (e) {
        // contract local sync
      }
      loadData();
    } catch (err) {
      console.error("Revocation error:", err);
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-cyber-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Patient Ownership Portal</h1>
            <span className="text-[11px] bg-teal-950 text-teal-300 border border-teal-800 px-2.5 py-0.5 rounded-full font-mono">
              Self-Sovereign Identity
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            You hold total cryptographic authority over your medical history. Define access policies and revoke anytime.
          </p>
        </div>

        {/* Patient Wallet Address */}
        <div className="flex items-center gap-3 bg-slate-900/90 p-3 rounded-2xl border border-cyber-border">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Patient Wallet</span>
            <input
              type="text"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value.toLowerCase())}
              className="text-xs font-mono text-teal-300 bg-transparent outline-none w-48 text-right"
              placeholder="0x..."
            />
          </div>
          <button
            onClick={loadData}
            title="Refresh records"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
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

      {/* Main Grid: Upload Form + Visual Policy Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-cyber-border/60">
              <Upload className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-bold text-white">Upload New Health Record</h3>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Record Title / Description</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cardiology Echocardiogram & ECG"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-teal-400 rounded-xl text-xs text-white outline-none"
                  required
                />
              </div>

              {/* File Dropzone */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Medical Document (PDF/Scan)</label>
                <div className="border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-900/40">
                  <input
                    type="file"
                    id="medical-file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.dicom,.txt"
                  />
                  <label htmlFor="medical-file" className="cursor-pointer block">
                    <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2 hover:text-teal-400 transition-colors" />
                    {file ? (
                      <div className="text-xs text-teal-300 font-mono">
                        {file.name} ({Math.round(file.size / 1024)} KB)
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-slate-300 font-medium">Click to browse or drop file</p>
                        <p className="text-[10px] text-slate-500 mt-1">PDF, DICOM, PNG, JPEG up to 25MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* On-Chain Sign toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <span className="text-slate-300">Anchor Metadata on Ethereum Blockchain</span>
                <input
                  type="checkbox"
                  checked={signOnChain}
                  onChange={(e) => setSignOnChain(e.target.checked)}
                  className="accent-teal-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-glow-teal transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Encrypting & Pinning to IPFS...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Encrypt & Pin to IPFS
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Visual Policy Builder (7 cols) */}
        <div className="lg:col-span-7">
          <VisualPolicyBuilder policy={policy} onChange={setPolicy} />
        </div>
      </div>

      {/* My Medical Records Table */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-white">My Encrypted Health Records ({records.length})</h3>
          </div>
          <span className="text-xs text-slate-400">Owner: {patientAddress.slice(0, 8)}...</span>
        </div>

        {records.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No records found for this patient wallet. Upload a report above to begin!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cyber-border text-slate-400">
                  <th className="pb-3 font-semibold">Record & File</th>
                  <th className="pb-3 font-semibold">CP-ABE Access Policy</th>
                  <th className="pb-3 font-semibold">IPFS CID</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Instant Revocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/40 text-slate-300">
                {records.map((rec) => (
                  <tr key={rec.record_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3">
                      <div className="font-semibold text-white">{rec.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {rec.original_filename} • {Math.round(rec.file_size_bytes / 1024)} KB
                      </div>
                    </td>
                    <td className="py-3">
                      <code className="text-teal-300 bg-slate-900 px-2 py-0.5 rounded border border-teal-900/60 font-mono text-[11px]">
                        {rec.policy_string}
                      </code>
                    </td>
                    <td className="py-3 font-mono text-cyan-300 text-[11px]">
                      <span title={rec.ipfs_cid}>{rec.ipfs_cid.slice(0, 14)}...</span>
                    </td>
                    <td className="py-3">
                      {rec.is_active ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold">
                          Active / Accessible
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-semibold">
                          Revoked / Locked
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleRevokeToggle(rec.record_id, rec.is_active)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                          rec.is_active
                            ? "bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-800/60"
                            : "bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800/60"
                        }`}
                      >
                        {rec.is_active ? (
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Revoke Access
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Unlock className="w-3 h-3" /> Reactivate Access
                          </span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* HIPAA Compliance Access Audit Trail */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-bold text-white">Immutable HIPAA Access Audit Trail</h3>
        </div>
        <p className="text-xs text-slate-400">
          Every query, successful decryption, unauthorized attempt, or revocation is permanently recorded.
        </p>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-cyber-border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      log.status === "SUCCESS"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : log.status === "OVERRIDE"
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-rose-950 text-rose-300 border border-rose-800"
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="font-semibold text-slate-200">{log.actor_role}</span>
                  <span className="text-slate-500 font-mono text-[11px]">({log.actor_address.slice(0, 8)}...)</span>
                </div>
                <p className="text-slate-400 text-[11px]">{log.details}</p>
              </div>
              <div className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

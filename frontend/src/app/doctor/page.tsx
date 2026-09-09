"use client";

import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Search,
  FileText,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Zap,
  Building2,
  Eye
} from "lucide-react";
import ReportViewerModal from "@/components/ReportViewerModal";
import { api, MedicalRecordItem, DoctorItem } from "@/lib/api";

export default function DoctorPortal() {
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem | null>(null);
  const [records, setRecords] = useState<MedicalRecordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Decryption & Emergency State
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [decryptingRecordId, setDecryptingRecordId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [decryptedReport, setDecryptedReport] = useState<any>(null);

  useEffect(() => {
    loadDoctorsAndRecords();
  }, []);

  async function loadDoctorsAndRecords() {
    setLoading(true);
    try {
      const docs = await api.getDoctors();
      setDoctors(docs);
      if (docs.length > 0 && !selectedDoctor) {
        setSelectedDoctor(docs[0]);
      }
      const recs = await api.getAllRecords();
      setRecords(recs);
    } catch (err) {
      console.error("Failed to load doctor data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDecrypt(record: MedicalRecordItem) {
    if (!selectedDoctor) {
      setStatusMessage({ type: "error", text: "Please select a doctor profile first." });
      return;
    }

    setDecryptingRecordId(record.record_id);
    setStatusMessage(null);

    try {
      const result = await api.decryptRecord(
        record.record_id,
        selectedDoctor.wallet_address,
        isEmergency,
        emergencyReason
      );

      setDecryptedReport(result);
      setModalOpen(true);
      setStatusMessage({
        type: "success",
        text: `Access Granted! Record '${record.title}' successfully decrypted. Attributes satisfied CP-ABE policy.`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Decryption rejected: Doctor attributes do not satisfy the record's CP-ABE policy.",
      });
    } finally {
      setDecryptingRecordId(null);
    }
  }

  const filteredRecords = records.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.record_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.policy_string.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-cyber-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Doctor & Clinician Portal</h1>
            <span className="text-[11px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-0.5 rounded-full font-mono">
              CP-ABE Decryption Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Access confidential patient records authenticated through your certified cryptographic attribute keys.
          </p>
        </div>

        {/* Doctor Preset Switcher for Demo */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-cyber-border">
          <span className="text-xs text-slate-400 pl-2">Active Doctor:</span>
          <select
            value={selectedDoctor?.id || ""}
            onChange={(e) => {
              const doc = doctors.find((d) => d.id === parseInt(e.target.value));
              if (doc) setSelectedDoctor(doc);
            }}
            className="bg-slate-800 text-teal-300 text-xs font-semibold px-3 py-2 rounded-xl outline-none border border-slate-700 cursor-pointer"
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.full_name} ({d.department} @ {d.hospital})
              </option>
            ))}
          </select>
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
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Clinician Identity Card & Break-Glass Emergency Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Clinician Identity (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-cyber-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Dr. {selectedDoctor?.full_name || "Clinician"}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedDoctor?.hospital} • License: {selectedDoctor?.license_number}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AA Verified
            </span>
          </div>

          <div className="pt-2 border-t border-cyber-border/60 space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Certified Cryptographic Attributes (Tied to Doctor's Secret Key):
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedDoctor?.attributes_list?.map((attr) => (
                <span
                  key={attr}
                  className="px-2.5 py-1 rounded-lg bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-mono"
                >
                  {attr}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Break-Glass Emergency Panel (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-amber-500/40 space-y-4 bg-amber-950/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Break-Glass Emergency Mode</span>
            </div>
            <input
              type="checkbox"
              id="emergency-mode"
              checked={isEmergency}
              onChange={(e) => setIsEmergency(e.target.checked)}
              className="accent-amber-500 w-5 h-5 cursor-pointer"
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Emergency override grants instantaneous medical access for unresponsive ICU patients. This triggers a
            mandatory, high-priority audit event on the blockchain ledger.
          </p>

          {isEmergency && (
            <input
              type="text"
              value={emergencyReason}
              onChange={(e) => setEmergencyReason(e.target.value)}
              placeholder="Mandatory medical reason (e.g., Acute cardiac arrest in ER)"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/50 text-xs text-amber-200 outline-none placeholder:text-amber-700"
            />
          )}
        </div>
      </div>

      {/* Records Directory & Decryption Action */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white">Patient Records Directory</h3>
            <p className="text-xs text-slate-400">Search and decrypt medical records governed by CP-ABE access policies</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, ID, or policy..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No medical records matching search query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecords.map((rec) => {
              const isDecrypting = decryptingRecordId === rec.record_id;
              return (
                <div
                  key={rec.record_id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-cyber-border/80 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">
                          {rec.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ID: {rec.record_id} • {Math.round(rec.file_size_bytes / 1024)} KB
                        </span>
                      </div>
                      {rec.is_active ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-semibold">
                          Revoked
                        </span>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                        Required Access Policy
                      </span>
                      <code className="text-xs font-mono text-teal-300 block break-words">
                        {rec.policy_string}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <span className="text-slate-500 font-mono text-[11px]">
                      IPFS: {rec.ipfs_cid.slice(0, 10)}...
                    </span>

                    <button
                      onClick={() => handleDecrypt(rec)}
                      disabled={isDecrypting || !rec.is_active}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-glow-teal transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isDecrypting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Evaluating CP-ABE...
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Decrypt & View
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Report Viewer Modal */}
      <ReportViewerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        reportData={decryptedReport}
      />
    </div>
  );
}

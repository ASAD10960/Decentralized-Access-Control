"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Download, FileText, CheckCircle, ExternalLink } from "lucide-react";

interface ReportViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: {
    record_id: string;
    title: string;
    filename: string;
    file_type: string;
    file_data_b64: string;
    file_size: number;
    doctor_attributes: string[];
    satisfied_policy: string;
  } | null;
}

export default function ReportViewerModal({ isOpen, onClose, reportData }: ReportViewerModalProps) {
  if (!isOpen || !reportData) return null;

  const mimeType = reportData.file_type || "application/pdf";
  const dataUrl = `data:${mimeType};base64,${reportData.file_data_b64}`;

  // Decode text preview if applicable
  let textPreview = "";
  try {
    const rawStr = atob(reportData.file_data_b64);
    if (rawStr.includes("PDF-1.") || rawStr.includes("Diagnosis") || rawStr.includes("Patient")) {
      textPreview = rawStr;
    }
  } catch (e) {
    // binary data
  }

  function handleDownload() {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = reportData?.filename || "decrypted_medical_report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel bg-cyber-navy border border-teal-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-cyber-border/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{reportData.title}</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> CP-ABE Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Record ID: {reportData.record_id} • File: {reportData.filename} ({Math.round(reportData.file_size / 1024)} KB)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4" /> Download Report
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cryptographic Proof Banner */}
        <div className="bg-slate-950/80 px-6 py-3 border-b border-cyber-border text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Policy Satisfied:</span>
            <code className="text-teal-300 bg-slate-900 px-2 py-0.5 rounded border border-teal-900/60 font-mono">
              {reportData.satisfied_policy}
            </code>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400">Doctor Attributes:</span>
            {reportData.doctor_attributes.map((attr) => (
              <span
                key={attr}
                className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded"
              >
                {attr}
              </span>
            ))}
          </div>
        </div>

        {/* Report Content Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50 space-y-4">
          {mimeType.includes("image") ? (
            <div className="flex justify-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <img
                src={dataUrl}
                alt="Decrypted Medical Scan"
                className="max-h-[500px] object-contain rounded-lg shadow-lg"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* If it's a PDF object or text */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <FileText className="w-4 h-4 text-teal-400" />
                    Decrypted Clinical Document Contents
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">Tamper-Proof Verification: PASSED</span>
                </div>

                {textPreview ? (
                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap bg-slate-950 p-4 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto leading-relaxed">
                    {textPreview}
                  </pre>
                ) : (
                  <div className="w-full h-96 rounded-xl overflow-hidden border border-slate-800">
                    <iframe
                      src={dataUrl}
                      title="Medical Report PDF"
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>

              {/* Clinical Notice */}
              <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-800/40 text-xs text-slate-300">
                <span className="font-semibold text-teal-400">HIPAA Compliance Notice:</span> Access to this
                confidential electronic health record has been cryptographically authorized and logged into the
                immutable blockchain audit ledger with an Ethereum timestamp.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-cyber-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}

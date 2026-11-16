"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Zap,
  Lock,
  Unlock,
  KeyRound,
  FileText,
  Activity,
  Layers,
  Database,
  Server,
  Scale,
  Cpu,
  Users,
  Eye,
  Flame,
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Compass,
  HeartPulse,
  Share2,
  ShieldAlert
} from "lucide-react";

export default function WhySecureChainPage() {
  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const [activeTab, setActiveTab] = useState<"what-it-does" | "why-different" | "benefits" | "real-world">("what-it-does");

  const storySteps = [
    {
      num: "01",
      title: "Patient Generates Sensitive Medical Report",
      actor: "Patient (Alice)",
      icon: FileText,
      color: "text-teal-400",
      bgColor: "bg-teal-950/40 border-teal-500/50",
      summary: "Alice visits a diagnostic center and receives a confidential Cardiac MRI and Echo report.",
      detail:
        "In a conventional hospital, Alice has zero control. The clinic uploads the cleartext file to a centralized hospital database. Hospital IT staff, billing clerks, database administrators, and cloud hosting staff can all view or accidentally leak Alice's confidential diagnosis.",
      secureChainAction:
        "In SecureChain, Alice keeps complete ownership. She opens her Patient Portal, selects her Cardiac MRI PDF, and personally specifies who is allowed to read it using a mathematical formula.",
    },
    {
      num: "02",
      title: "Dual-Layer Hybrid Cryptographic Locking",
      actor: "Cryptographic Engine (CP-ABE + AES-256)",
      icon: Lock,
      color: "text-cyan-400",
      bgColor: "bg-cyan-950/40 border-cyan-500/50",
      summary: "The medical file is locked with two mathematically coordinated cryptographic keys.",
      detail:
        "Encrypting a 500MB MRI with pairing-based math alone would take minutes and create massive file expansion. SecureChain invents a hybrid pipeline: high-speed AES-256-GCM scrambles the file in milliseconds with hardware acceleration. Then, Ciphertext-Policy Attribute-Based Encryption (CP-ABE) encapsulates only the 32-byte AES key under Alice's policy.",
      secureChainAction:
        "Alice sets the policy: `(Role:Doctor AND Dept:Cardiology) OR Emergency:True`. The file is now a mathematically unreadable cipher block.",
    },
    {
      num: "03",
      title: "Zero-Knowledge P2P Storage on IPFS",
      actor: "Decentralized IPFS Vault",
      icon: Database,
      color: "text-sky-400",
      bgColor: "bg-sky-950/40 border-sky-500/50",
      summary: "Ciphertext is pinned to the InterPlanetary File System without exposing any cleartext.",
      detail:
        "Unlike AWS S3 or Google Cloud where server hosts can be subpoenaed or breached, IPFS only stores ciphertext chunks addressed by their cryptographic Content Identifier (CID).",
      secureChainAction:
        "Even if hackers break into the IPFS node or intercept the network transmission, they only retrieve encrypted binary noise. Decryption without the patient-authorized attribute key is mathematically impossible.",
    },
    {
      num: "04",
      title: "Smart Contract Anchoring on Ethereum",
      actor: "Solidity Smart Contracts (EVM)",
      icon: Layers,
      color: "text-amber-400",
      bgColor: "bg-amber-950/40 border-amber-500/50",
      summary: "The IPFS CID, file hash, and audit trail are anchored on-chain with zero single point of failure.",
      detail:
        "The smart contract MedicalRecordRegistry.sol records the binding between Alice's wallet address, the record ID, and the IPFS CID. Simultaneously, AuditLogger.sol creates an append-only, tamper-proof HIPAA audit trail.",
      secureChainAction:
        "No database administrator can delete, alter, or backdate access records. The blockchain guarantees non-repudiation.",
    },
    {
      num: "05",
      title: "Clinician Decryption via Certified Attributes",
      actor: "Clinician (Dr. Sarah vs Dr. Marcus)",
      icon: KeyRound,
      color: "text-emerald-400",
      bgColor: "bg-emerald-950/40 border-emerald-500/50",
      summary: "Access is granted purely by mathematical pairing satisfaction, not administrative privilege.",
      detail:
        "Dr. Sarah Jenkins (Cardiologist) possesses attributes {Role:Doctor, Dept:Cardiology}. Her attribute private key components satisfy Alice's policy tree. Bilinear pairings reconstruct the session key e(g,g)^s, and the report decrypts in 0.78s.",
      secureChainAction:
        "If Dr. Marcus Vance (Dermatologist) attempts access, his attributes fail the boolean tree. The system mathematically rejects decryption in 0.12s and logs an unauthorized breach attempt to the blockchain.",
    },
    {
      num: "06",
      title: "Sub-Second Dynamic Revocation (<0.5s)",
      actor: "On-Chain AccessControlManager",
      icon: Zap,
      color: "text-rose-400",
      bgColor: "bg-rose-950/40 border-rose-500/50",
      summary: "Alice revokes doctor access instantly with 1 click without re-encrypting the file.",
      detail:
        "In traditional ABE, revoking one person requires decrypting and re-encrypting the entire dataset. SecureChain solves this through a dual-layer architecture: AccessControlManager.sol toggles an on-chain status flag in <0.5 seconds.",
      secureChainAction:
        "Dr. Sarah is locked out immediately on her next attempt, achieving instant dynamic revocation with zero re-encryption cost.",
    },
  ];

  return (
    <div className="space-y-12 py-2">
      {/* Hero Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyber-border shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-gradient-to-br from-teal-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-4 max-w-4xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Compass className="w-4 h-4 text-teal-400" /> Executive Project Overview & Rationale
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-900 text-cyan-300 text-xs font-mono border border-slate-700">
              Plain-English & In-Depth Technical Guide
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            What SecureChain Actually Does,{" "}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
              Why It Is Beneficial & Why It Is Different
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Healthcare data breaches leaked over <strong className="text-rose-400">133 million patient records</strong>{" "}
            in recent years due to centralized hospital databases. <strong className="text-teal-300">SecureChain</strong> replaces
            vulnerable centralized databases with a decentralized architecture combining{" "}
            <strong className="text-white">Ciphertext-Policy Attribute-Based Encryption (CP-ABE)</strong>,{" "}
            <strong className="text-white">Ethereum Smart Contracts</strong>, and{" "}
            <strong className="text-white">IPFS Off-Chain Storage</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/viva-defense"
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-glow-teal flex items-center gap-2 transition-all hover:scale-105"
            >
              <GraduationCap className="w-4 h-4" /> Open Viva Defense Simulator
            </Link>
            <Link
              href="/keywords"
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-2 transition-all hover:scale-105"
            >
              <BookOpen className="w-4 h-4" /> Study Keywords Glossary
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-cyber-border pb-3">
        {[
          { id: "what-it-does", label: "1. What It Actually Does", icon: Cpu },
          { id: "why-different", label: "2. Why It Is Different (Comparison)", icon: Scale },
          { id: "benefits", label: "3. Core Benefits & Real Value", icon: Sparkles },
          { id: "real-world", label: "4. Clinical Scenarios & Break-Glass", icon: HeartPulse },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-teal-500 text-slate-950 shadow-glow-teal scale-102"
                  : "bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-cyber-border"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WHAT IT ACTUALLY DOES (STEP-BY-STEP FLOW) */}
      {/* ========================================================================= */}
      {activeTab === "what-it-does" && (
        <div className="space-y-8 animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-teal-400" /> The End-to-End Journey of a Medical Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Click through the 6 stages below to see exactly how a patient’s confidential diagnostic report travels from upload
              to cryptographic encryption, IPFS pinning, smart contract anchoring, and doctor decryption.
            </p>
          </div>

          {/* Stepper Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {storySteps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStoryStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStoryStep(idx)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "bg-teal-500/20 border-teal-500 shadow-glow-teal ring-1 ring-teal-500"
                      : "bg-slate-900/60 border-cyber-border hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400 font-bold">{step.num}</span>
                    <Icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                  <div className="text-xs font-bold text-white mt-1 line-clamp-1">{step.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">{step.actor}</div>
                </button>
              );
            })}
          </div>

          {/* Active Story Card */}
          {storySteps[activeStoryStep] && (
            <div className="glass-panel p-8 rounded-3xl border border-teal-500/40 shadow-2xl space-y-6 relative overflow-hidden animate-fadeIn">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 font-mono text-teal-400 text-xs font-bold">
                      STAGE {storySteps[activeStoryStep].num} / 06
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Actor: <strong className="text-cyan-300">{storySteps[activeStoryStep].actor}</strong>
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    {storySteps[activeStoryStep].title}
                  </h3>
                </div>

                <div className="hidden sm:flex p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  {React.createElement(storySteps[activeStoryStep].icon, {
                    className: `w-8 h-8 ${storySteps[activeStoryStep].color}`,
                  })}
                </div>
              </div>

              {/* What Happens */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block mb-1">
                    Summary Overview:
                  </span>
                  {storySteps[activeStoryStep].summary}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Problem in Traditional Hospital System:
                    </span>
                    <p className="text-slate-300 leading-relaxed text-xs">{storySteps[activeStoryStep].detail}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/40 space-y-1 shadow-glow-teal">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> How SecureChain Solves It:
                    </span>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {storySteps[activeStoryStep].secureChainAction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  disabled={activeStoryStep === 0}
                  onClick={() => setActiveStoryStep((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold disabled:opacity-40 transition-all"
                >
                  ← Previous Stage
                </button>
                <span className="text-xs text-slate-500 font-mono">Stage {activeStoryStep + 1} of 6</span>
                <button
                  disabled={activeStoryStep === storySteps.length - 1}
                  onClick={() => setActiveStoryStep((prev) => Math.min(storySteps.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold shadow-glow-teal hover:bg-teal-400 disabled:opacity-40 transition-all"
                >
                  Next Stage →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WHY IT IS DIFFERENT (COMPARISONS) */}
      {/* ========================================================================= */}
      {activeTab === "why-different" && (
        <div className="space-y-8 animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-400" /> Why SecureChain is Fundamentally Different
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Evaluating SecureChain against both legacy hospital architectures and earlier blockchain research projects
              (MIT MedRec and FHIRChain).
            </p>
          </div>

          {/* Three Dimensional Difference Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dimension 1 */}
            <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-4">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-base">
                <Lock className="w-5 h-5" /> 1. Encryption Dimension
              </div>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <strong className="text-slate-400 block mb-1">Standard Public Key (RSA/ECC):</strong>
                  If 100 doctors need access, you must encrypt 100 separate copies or manage 100 keys. Impossible to scale for emergency care.
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <strong className="text-slate-400 block mb-1">Simple Symmetric (AES alone):</strong>
                  Everyone shares one password. If one doctor is compromised, all records are leaked.
                </div>
                <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/40 text-teal-100">
                  <strong className="text-teal-300 block mb-1">SecureChain (Hybrid CP-ABE):</strong>
                  Encrypt <em>once</em> with an expressive boolean policy. Any verified doctor matching the policy decrypts instantly. Zero key duplication!
                </div>
              </div>
            </div>

            {/* Dimension 2 */}
            <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                <Database className="w-5 h-5" /> 2. Storage Dimension
              </div>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <strong className="text-slate-400 block mb-1">Hospital Central Cloud (AWS/Azure):</strong>
                  Subject to cloud outages, third-party subpoenas, administrator snooping, and massive ransomware lockouts.
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <strong className="text-slate-400 block mb-1">On-Chain Blockchain Storage:</strong>
                  Storing 500MB on Ethereum costs $50,000+ in gas and makes records permanently public to every node on Earth.
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-cyan-100">
                  <strong className="text-cyan-300 block mb-1">SecureChain (Off-Chain IPFS Vault):</strong>
                  Encrypted files stay in a zero-knowledge peer-to-peer vault. Only 32-byte cryptographic hashes and CIDs touch the blockchain.
                </div>
              </div>
            </div>

            {/* Dimension 3 */}
            <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Zap className="w-5 h-5" /> 3. Revocation Dimension
              </div>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <strong className="text-slate-400 block mb-1">Traditional ABE Systems:</strong>
                  The "revocation dilemma": revoking one doctor requires re-encrypting the entire patient database. Massive computational cost.
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <strong className="text-slate-400 block mb-1">MedRec / FHIRChain:</strong>
                  Takes 1.5s to 2.0s to update database states or consortium consensus nodes.
                </div>
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-100">
                  <strong className="text-amber-300 block mb-1">SecureChain (Smart Contract Check):</strong>
                  Takes &lt;0.5 seconds via on-chain mapping check in AccessControlManager.sol with zero file re-encryption overhead!
                </div>
              </div>
            </div>
          </div>

          {/* Direct Architecture Comparison Table */}
          <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-400" /> Detailed Feature Comparison
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300">
                    <th className="py-3 px-4 font-semibold">Architectural Feature</th>
                    <th className="py-3 px-4 font-semibold text-rose-400">Traditional EHR (Epic/Cerner)</th>
                    <th className="py-3 px-4 font-semibold text-slate-400">MedRec (MIT)</th>
                    <th className="py-3 px-4 font-semibold text-slate-400">FHIRChain</th>
                    <th className="py-3 px-4 font-semibold text-teal-300">SecureChain (This Project)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-white">Who Owns the Data?</td>
                    <td className="py-3 px-4 text-rose-400">Hospital Database Admin</td>
                    <td className="py-3 px-4 text-amber-400">Consortium Node</td>
                    <td className="py-3 px-4 text-amber-400">Hospital Node</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">The Patient Directly (Sovereign)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-white">Access Policy Flexibility</td>
                    <td className="py-3 px-4 text-rose-400">Coarse (All-or-Nothing)</td>
                    <td className="py-3 px-4 text-rose-400">Coarse (Role-Based)</td>
                    <td className="py-3 px-4 text-amber-400">Single Public Key</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">Fine-Grained Boolean Logic (AND/OR)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-white">Storage Security</td>
                    <td className="py-3 px-4 text-rose-400">Cleartext / Central DB</td>
                    <td className="py-3 px-4 text-amber-400">Off-Chain Database</td>
                    <td className="py-3 px-4 text-amber-400">Cloud Storage</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">Zero-Knowledge IPFS P2P Vault</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-white">Revocation Latency</td>
                    <td className="py-3 px-4 text-rose-400">Minutes / Manual IT</td>
                    <td className="py-3 px-4 text-amber-400">2.0 seconds</td>
                    <td className="py-3 px-4 text-amber-400">1.5 seconds</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">&lt; 0.5 seconds (Dynamic)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-white">Audit Trail Integrity</td>
                    <td className="py-3 px-4 text-rose-400">Mutable SQL Tables</td>
                    <td className="py-3 px-4 text-amber-400">Internal DB Logs</td>
                    <td className="py-3 px-4 text-amber-400">Consortium Chain</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">Ethereum Smart Contract (Tamper-Proof)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-white">Life-Threatening Emergency</td>
                    <td className="py-3 px-4 text-rose-400">Unaudited Master Key</td>
                    <td className="py-3 px-4 text-rose-400">Not Supported</td>
                    <td className="py-3 px-4 text-rose-400">Not Supported</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">Cryptographic Break-Glass Protocol</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CORE BENEFITS & VALUE */}
      {/* ========================================================================= */}
      {activeTab === "benefits" && (
        <div className="space-y-8 animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" /> The 6 Pillars of Real-World Value
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Why hospital networks, clinical research institutes, and patients benefit from deploying SecureChain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "1. Patient Data Sovereignty",
                desc: "Patients are no longer passive bystanders. They construct the exact mathematical conditions under which their confidential reports can be decrypted.",
                icon: ShieldCheck,
                color: "text-teal-400",
                badge: "Self-Sovereign Identity",
              },
              {
                title: "2. Ransomware Immunity",
                desc: "Even if an entire hospital server is compromised by ransomware, patient reports stored in IPFS are already encrypted with CP-ABE and cannot be extorted.",
                icon: Lock,
                color: "text-cyan-400",
                badge: "Zero-Trust",
              },
              {
                title: "3. Collusion Resistance",
                desc: "Prevents corrupt doctors from pooling their attribute keys together to decrypt unauthorized VIP records. User keys embed randomized polynomial factors.",
                icon: Users,
                color: "text-amber-400",
                badge: "Mathematical Guarantee",
              },
              {
                title: "4. Sub-Second Revocation (<0.5s)",
                desc: "If a patient switches doctors or leaves a clinical trial, they revoke access instantly via smart contracts without requiring costly file re-encryption.",
                icon: Zap,
                color: "text-rose-400",
                badge: "Dynamic On-Chain",
              },
              {
                title: "5. Tamper-Proof HIPAA Audit",
                desc: "Every registration, access attempt, and decryption is permanently anchored to the Ethereum ledger. Corrupt insiders cannot alter or cover up breach logs.",
                icon: Layers,
                color: "text-emerald-400",
                badge: "HIPAA §164.312",
              },
              {
                title: "6. GDPR Cryptographic Shredding",
                desc: "Satisfies GDPR Article 17 ('Right to Erasure'). By destroying or revoking CP-ABE decryption parameters, files become permanently irrecoverable mathematical noise.",
                icon: Flame,
                color: "text-purple-400",
                badge: "GDPR Article 17",
              },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                      {p.badge}
                    </span>
                    <Icon className={`w-5 h-5 ${p.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: REAL-WORLD CLINICAL SCENARIOS */}
      {/* ========================================================================= */}
      {activeTab === "real-world" && (
        <div className="space-y-8 animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-teal-400" /> Real-World Clinical Use Cases
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              How SecureChain handles routine diagnostics, multi-hospital cross-consultations, and emergency ER trauma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scenario 1 */}
            <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <CheckCircle2 className="w-5 h-5" /> Scenario A: Routine Cross-Hospital Cardiology Referral
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Alice has heart surgery in Hospital X and travels to Hospital Y for a second opinion.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-300">
                  <strong className="text-teal-300">Policy Configured:</strong>{" "}
                  <code className="text-teal-200 font-mono">(Role:Doctor AND Dept:Cardiology)</code>
                </div>
                <div className="text-slate-300">
                  <strong className="text-cyan-300">Outcome:</strong> Any licensed cardiologist from Hospital Y can decrypt Alice’s scan without waiting days for IT departments to transfer records via fax or unencrypted email.
                </div>
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                <ShieldAlert className="w-5 h-5" /> Scenario B: Insider Snooping by Unauthorized Staff
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                A celebrity or high-profile patient is admitted. An inquisitive dermatologist or technician attempts to open their cardiac report.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-300">
                  <strong className="text-rose-400">Policy:</strong> Requires <code>Dept:Cardiology</code>. Attacker has <code>Dept:Dermatology</code>.
                </div>
                <div className="text-slate-300">
                  <strong className="text-rose-300">Outcome:</strong> Decryption is mathematically rejected in 0.12s. The smart contract immediately records the unauthorized attempt, alerting compliance officers.
                </div>
              </div>
            </div>

            {/* Scenario 3 */}
            <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Flame className="w-5 h-5" /> Scenario C: Trauma ER Break-Glass Life-Saving Override
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Alice is involved in a severe car crash and brought into the ER unconscious. A trauma surgeon (not a cardiologist) needs her cardiac history immediately.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-300">
                  <strong className="text-amber-400">Action:</strong> Trauma doctor activates Break-Glass emergency mode and enters medical reason: <em>"Severe vehicular trauma, unconscious"</em>.
                </div>
                <div className="text-slate-300">
                  <strong className="text-amber-300">Outcome:</strong> The system decrypts the file via the <code>Emergency:True</code> branch. An immutable audit record is committed to Ethereum to prevent fraud.
                </div>
              </div>
            </div>

            {/* Scenario 4 */}
            <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-base">
                <Zap className="w-5 h-5" /> Scenario D: Dynamic Revocation After Treatment Ends
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Alice completes her cardiology treatment and no longer wants the doctor to access her records.
              </p>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-300">
                  <strong className="text-purple-400">Action:</strong> Alice clicks "Revoke Access" in her Patient Portal.
                </div>
                <div className="text-slate-300">
                  <strong className="text-purple-300">Outcome:</strong> The smart contract updates its revocation mapping in &lt;0.5 seconds. Even though the doctor still possesses their cryptographic key, the contract locks them out permanently.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Cross-Navigation Card */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
            <GraduationCap className="w-4 h-4 text-teal-400" /> Want to see the live cryptographic simulator or study questions?
          </h4>
          <p className="text-xs text-slate-400">
            Open the Viva Defense Showcase or the Keywords Guide to prepare for your defense presentation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/viva-defense"
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-glow-teal flex items-center gap-1.5 transition-all hover:scale-105"
          >
            Viva Defense Simulator <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/keywords"
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all hover:scale-105"
          >
            Keywords Guide <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}


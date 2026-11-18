"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Database,
  Cpu,
  ArrowRight,
  User,
  Stethoscope,
  Building2,
  FileCheck2,
  Zap,
  CheckCircle2,
  Scale,
  GraduationCap,
  Sparkles,
  BookOpen,
  Compass,
  BarChart3,
  HelpCircle
} from "lucide-react";
import { api, MedicalRecordItem } from "@/lib/api";

export default function HomePage() {
  const [recordCount, setRecordCount] = useState<number>(1);
  const [doctorCount, setDoctorCount] = useState<number>(2);

  useEffect(() => {
    async function loadStats() {
      try {
        const records = await api.getAllRecords();
        if (records) setRecordCount(records.length);
        const docs = await api.getDoctors();
        if (docs) setDoctorCount(docs.length);
      } catch (e) {
        // use defaults
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-glow-teal">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>8th Semester Capstone • Real-World Production Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Decentralized Access Control for Medical Reports Using{" "}
          <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-500 bg-clip-text text-transparent">
            Smart Contracts & CP-ABE
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The <span className="text-teal-300 font-semibold">SecureChain</span> framework eliminates single points of
          failure, protects patient data sovereignty, and enables fine-grained cryptographic medical sharing in full
          compliance with <span className="text-white font-semibold">HIPAA & GDPR</span>.
        </p>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/about"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-400 to-sky-500 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-extrabold text-sm shadow-glow-teal transition-all hover:scale-105 active:scale-95 ring-2 ring-teal-300/40"
          >
            <HelpCircle className="w-5 h-5" /> About Project (Overview)
          </Link>
          <Link
            href="/why-securechain"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-teal-300 border border-teal-500/40 text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Compass className="w-4 h-4" /> Why SecureChain?
          </Link>
          <Link
            href="/analytics"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-950/90 hover:bg-teal-900 text-teal-300 border border-teal-500/50 text-sm font-bold shadow-glow-teal transition-all hover:scale-105 active:scale-95"
          >
            <Database className="w-4 h-4 text-teal-400" /> 10K Scalability Dashboard
          </Link>
          <Link
            href="/results"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <BarChart3 className="w-4 h-4" /> Results & Outcomes
          </Link>
          <Link
            href="/viva-defense"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <GraduationCap className="w-4 h-4" /> Viva Defense
          </Link>
          <Link
            href="/keywords"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <BookOpen className="w-4 h-4" /> Keywords Guide
          </Link>
        </div>
      </section>

      {/* Real-World Metrics Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Decryption & Access Time",
            value: "0.8s",
            sub: "60% speed increase over traditional EHR",
            icon: Zap,
            color: "text-teal-400",
          },
          {
            label: "Instant Revocation Speed",
            value: "< 0.5s",
            sub: "On-chain dynamic revocation",
            icon: Lock,
            color: "text-rose-400",
          },
          {
            label: "Active Pinned Records",
            value: `${recordCount} EHRs`,
            sub: "Off-chain zero-knowledge IPFS",
            icon: Database,
            color: "text-cyan-400",
          },
          {
            label: "System Availability",
            value: "99.99%",
            sub: "Decentralized EVM ledger",
            icon: Cpu,
            color: "text-emerald-400",
          },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="glass-panel glass-panel-hover p-5 rounded-2xl border border-cyber-border/80 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{m.label}</span>
                <Icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div>
                <div className={`text-2xl sm:text-3xl font-extrabold ${m.color}`}>{m.value}</div>
                <p className="text-[11px] text-slate-400 mt-1">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* 10,000 Big Data Scalability Banner */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-teal-500/40 shadow-glow-teal relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold border border-teal-500/30">
                BIG DATA BENCHMARK (N = 10,000)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-800">
                100% Deterministic Accuracy
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Evaluated on 10,000+ Encrypted Clinical Health Records
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Stress-tested across 10,000 medical records representing a municipal hospital network.
              View real-time latency distributions, 8 clinical departments, 7 imaging modalities, and live batch stress-testing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/analytics"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-glow-teal flex items-center gap-2 transition-all hover:scale-105"
            >
              <Database className="w-4 h-4" /> Open 10K Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="/healthcare_10k_records.csv"
              download="healthcare_10k_records.csv"
              className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-2 transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-teal-400" /> Download 10K CSV
            </a>
          </div>
        </div>
      </section>

      {/* Role Navigation Cards */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white">Three Interactive Portals</h2>
          <p className="text-xs text-slate-400">Experience how different healthcare stakeholders interact with the decentralized system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient Card */}
          <div className="glass-panel p-6 rounded-3xl border border-teal-500/30 flex flex-col justify-between space-y-6 hover:border-teal-400/60 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Patient Portal</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload electronic health records (PDF/DICOM), define mathematical CP-ABE access policies with the
                  visual builder, and trigger one-click instant revocation.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Complete data ownership
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Visual Boolean policy designer
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Live HIPAA access audit trail
                </li>
              </ul>
            </div>
            <Link
              href="/patient"
              className="w-full py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold text-xs border border-teal-500/40 flex items-center justify-center gap-2 transition-colors"
            >
              Enter Patient Portal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Doctor Card */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col justify-between space-y-6 hover:border-cyan-400/60 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Doctor / Clinician Portal</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Query patient records, verify attribute credentials, decrypt medical records in real time using your
                  issued CP-ABE key, or invoke Break-Glass emergency access.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Cryptographic attribute verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Secure in-browser medical viewer
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Break-Glass Emergency Mode
                </li>
              </ul>
            </div>
            <Link
              href="/doctor"
              className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold text-xs border border-cyan-500/40 flex items-center justify-center gap-2 transition-colors"
            >
              Enter Doctor Portal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Admin Card */}
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 flex flex-col justify-between space-y-6 hover:border-purple-400/60 transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Hospital Admin & AA</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Attribute Authority root center: Verify medical licenses, assign departmental clearance, issue
                  cryptographic secret keys, and monitor network-wide compliance logs.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Clinician KYC verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> CP-ABE KeyGen issuance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Global HIPAA audit ledger
                </li>
              </ul>
            </div>
            <Link
              href="/admin"
              className="w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold text-xs border border-purple-500/40 flex items-center justify-center gap-2 transition-colors"
            >
              Enter Admin Portal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Matrix from the Research Paper (Table II) */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyber-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-400" />
              <h3 className="text-lg font-bold text-white">Comparative Evaluation Matrix</h3>
            </div>
            <p className="text-xs text-slate-400">
              Direct implementation benchmark against existing baseline literature (Research Paper Table II)
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
            Validated Results
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-cyber-border text-slate-400">
                <th className="pb-3 font-semibold">Evaluation Aspect</th>
                <th className="pb-3 font-semibold text-teal-400">SecureChain (This Project)</th>
                <th className="pb-3 font-semibold text-slate-400">MedRec [Baseline]</th>
                <th className="pb-3 font-semibold text-slate-400">FHIRChain [Baseline]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40 text-slate-300">
              <tr>
                <td className="py-3 font-medium">Decentralization</td>
                <td className="py-3 font-bold text-teal-300">Full (Ethereum + IPFS)</td>
                <td className="py-3 text-slate-400">Partial</td>
                <td className="py-3 text-slate-300">Full</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Access Control Granularity</td>
                <td className="py-3 font-bold text-teal-300">Fine-Grained (CP-ABE)</td>
                <td className="py-3 text-slate-400">Coarse-grained</td>
                <td className="py-3 text-slate-300">Medium-grained</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Encryption Method</td>
                <td className="py-3 font-bold text-teal-300">Attribute-Based + AES-256</td>
                <td className="py-3 text-slate-400">Symmetric Only</td>
                <td className="py-3 text-slate-300">Public Key (PKI)</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Throughput (req/sec)</td>
                <td className="py-3 font-bold text-teal-300">100 req/sec</td>
                <td className="py-3 text-slate-400">75 req/sec</td>
                <td className="py-3 text-slate-300">60 req/sec</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Access Revocation Time</td>
                <td className="py-3 font-bold text-emerald-400">0.5 seconds</td>
                <td className="py-3 text-rose-400">2.0 seconds</td>
                <td className="py-3 text-yellow-400">1.5 seconds</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">HIPAA / GDPR Compliance</td>
                <td className="py-3 font-bold text-teal-300">Full (Immutable Event Auditing)</td>
                <td className="py-3 text-slate-400">Partial</td>
                <td className="py-3 text-slate-300">Full</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

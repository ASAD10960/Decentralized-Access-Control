"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Activity, User, Stethoscope, Building2, Wallet, ExternalLink, CheckCircle2, GraduationCap, BookOpen, Compass, BarChart3 } from "lucide-react";
import { getSigner } from "@/lib/contracts";

export default function Navbar() {
  const pathname = usePathname();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnectedWallet();
    if (typeof window !== "undefined" && (window as any).ethereum) {
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0].toLowerCase());
        } else {
          setWalletAddress("");
        }
      });
    }
  }, []);

  async function checkConnectedWallet() {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: "eth_accounts" });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0].toLowerCase());
        }
      } catch (err) {
        console.error("Failed to check wallet:", err);
      }
    }
  }

  async function connectWallet() {
    setIsConnecting(true);
    try {
      const signer = await getSigner();
      if (signer) {
        const addr = await signer.getAddress();
        setWalletAddress(addr.toLowerCase());
      }
    } catch (err) {
      console.error("MetaMask connection failed:", err);
    } finally {
      setIsConnecting(false);
    }
  }

  const navLinks = [
    { href: "/", label: "Overview", icon: Activity },
    { href: "/why-securechain", label: "Why SecureChain?", icon: Compass },
    { href: "/results", label: "Results & Outcomes", icon: BarChart3 },
    { href: "/patient", label: "Patient Portal", icon: User },
    { href: "/doctor", label: "Doctor Portal", icon: Stethoscope },
    { href: "/admin", label: "Hospital Admin", icon: Building2 },
    { href: "/viva-defense", label: "Viva Defense", icon: GraduationCap },
    { href: "/keywords", label: "Keywords Guide", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-cyber-border/40 bg-cyber-navy/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-glow-teal group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-cyber-navy rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-teal-300 transition-colors">
                SecureChain
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider bg-teal-950/80 text-teal-400 border border-teal-800 px-2 py-0.5 rounded-full">
                CP-ABE + EVM
              </span>
            </div>
            <p className="text-xs text-slate-400">Decentralized Healthcare Access Control</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-cyber-card/60 p-1.5 rounded-xl border border-cyber-border">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Wallet & Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Hardhat Local / EVM</span>
          </div>

          {walletAddress ? (
            <div className="flex items-center gap-2 bg-slate-900/80 border border-teal-500/40 px-3.5 py-2 rounded-xl text-sm font-mono text-teal-300 shadow-glow-teal">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm shadow-glow-teal transition-all active:scale-95 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              {isConnecting ? "Connecting..." : "Connect MetaMask"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

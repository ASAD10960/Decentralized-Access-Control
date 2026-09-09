"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Code2, Check, RefreshCw, Layers } from "lucide-react";
import { api, AttributeItem } from "@/lib/api";

interface VisualPolicyBuilderProps {
  policy: string;
  onChange: (newPolicy: string) => void;
}

export default function VisualPolicyBuilder({ policy, onChange }: VisualPolicyBuilderProps) {
  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAttributes();
  }, []);

  async function loadAttributes() {
    setLoading(true);
    try {
      const data = await api.getAttributes();
      setAttributes(data);
    } catch (err) {
      console.error("Failed to load attributes:", err);
    } finally {
      setLoading(false);
    }
  }

  const presets = [
    {
      label: "Cardiologists Only",
      value: "(Role:Doctor AND Dept:Cardiology)",
      desc: "Restricts access strictly to verified Cardiology doctors",
    },
    {
      label: "Cardiology + Emergency",
      value: "(Role:Doctor AND Dept:Cardiology) OR Emergency:True",
      desc: "Standard cardiology care with Break-Glass ICU override",
    },
    {
      label: "City General Hospital",
      value: "(Role:Doctor AND Hospital:CityGeneral)",
      desc: "All certified physicians affiliated with City General",
    },
    {
      label: "Multi-Disciplinary",
      value: "(Dept:Cardiology OR Dept:Neurology) AND Role:Doctor",
      desc: "Collaborative access between Cardiology and Neurology",
    },
  ];

  function addToken(token: string) {
    if (!policy || policy.trim() === "") {
      onChange(token);
    } else {
      onChange(`${policy} ${token}`);
    }
  }

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-cyber-border p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Visual Access Policy Builder</h4>
            <p className="text-xs text-slate-400">Ciphertext-Policy Attribute-Based Encryption (CP-ABE)</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Clear
        </button>
      </div>

      {/* Preset Pills */}
      <div>
        <label className="text-xs font-medium text-slate-300 block mb-2">Recommended Policy Presets</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map((preset) => {
            const isSelected = policy === preset.value;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.value)}
                className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? "bg-teal-950/60 border-teal-500 text-teal-200 shadow-glow-teal"
                    : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold flex items-center gap-1.5">
                    {preset.label}
                    {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </span>
                  <span className="text-[10px] text-teal-400 font-mono bg-teal-950 px-1.5 py-0.5 rounded border border-teal-800/40">
                    Preset
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{preset.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Attribute Badges */}
      <div>
        <label className="text-xs font-medium text-slate-300 block mb-2">
          Insert Cryptographic Attributes
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
          {attributes.map((attr) => (
            <button
              key={attr.id}
              type="button"
              onClick={() => addToken(attr.name)}
              className="px-2.5 py-1 rounded-lg bg-cyber-navy/80 hover:bg-teal-950 border border-teal-900/50 hover:border-teal-500/50 text-[11px] font-mono text-teal-300 transition-all hover:scale-105"
            >
              +{attr.name}
            </button>
          ))}
        </div>
      </div>

      {/* Logic Operators */}
      <div>
        <label className="text-xs font-medium text-slate-300 block mb-1.5">Logic Operators</label>
        <div className="flex flex-wrap gap-2">
          {["AND", "OR", "NOT", "(", ")"].map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => addToken(op)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-cyan-300 transition-colors"
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      {/* Policy Text Box / Output */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-teal-400" /> Compiled Boolean Policy String
          </label>
          <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Ready for CP-ABE Encapsulation
          </span>
        </div>
        <input
          type="text"
          value={policy}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. (Role:Doctor AND Dept:Cardiology) OR Emergency:True"
          className="w-full px-3.5 py-2.5 bg-slate-950 border border-teal-500/40 focus:border-teal-400 rounded-xl text-xs font-mono text-teal-300 outline-none shadow-inner"
        />
      </div>
    </div>
  );
}

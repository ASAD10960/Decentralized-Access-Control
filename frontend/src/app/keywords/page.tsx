"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  KeyRound,
  Shield,
  Layers,
  Database,
  FileText,
  Lock,
  Cpu,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Code,
  Tag,
  CheckCircle2,
  HelpCircle,
  Shuffle,
  ChevronRight,
  BookmarkCheck,
  Zap,
  Flame,
  ArrowRight
} from "lucide-react";

interface Keyword {
  id: string;
  term: string;
  acronymFor?: string;
  category: "crypto" | "blockchain" | "storage" | "healthcare" | "fullstack";
  briefIntro: string;
  useInProject: string;
  codeLocation: string;
  vivaTip: string;
  difficulty: "Fundamental" | "Intermediate" | "Advanced";
}

const ALL_KEYWORDS: Keyword[] = [
  // CRYPTOGRAPHY
  {
    id: "cp-abe",
    term: "CP-ABE",
    acronymFor: "Ciphertext-Policy Attribute-Based Encryption",
    category: "crypto",
    briefIntro: "A cryptographic primitive where encrypted data is bound to a logical access policy tree (e.g., '(Doctor AND Cardiology) OR Emergency'), and private keys are issued based on user attributes.",
    useInProject: "Acts as the cryptographic access gateway. Patients specify the policy string during file upload. The backend uses CP-ABE to encrypt the AES-256 session key so only doctors with matching attributes can decrypt it.",
    codeLocation: "backend/attribute_authority/crypto_engine.py -> CPABECryptoEngine.encrypt_medical_file()",
    vivaTip: "Always emphasize that in CP-ABE the POLICY is attached to the ciphertext (decided by the patient), guaranteeing Patient Data Sovereignty.",
    difficulty: "Advanced",
  },
  {
    id: "kp-abe",
    term: "KP-ABE",
    acronymFor: "Key-Policy Attribute-Based Encryption",
    category: "crypto",
    briefIntro: "The inverse of CP-ABE: ciphertexts are tagged with attributes, while user secret keys contain access policies. The encryptor has no say over who decrypts.",
    useInProject: "Studied and contrasted against CP-ABE. We deliberately chose CP-ABE instead of KP-ABE because KP-ABE would require a centralized authority to dictate read policies, violating patient autonomy.",
    codeLocation: "README.md & backend/attribute_authority/crypto_engine.py (design rationale)",
    vivaTip: "Examiners love asking: 'Why not KP-ABE?'. Answer: KP-ABE is publisher-driven (like news feeds), while CP-ABE is data-owner driven (mandatory for healthcare privacy).",
    difficulty: "Intermediate",
  },
  {
    id: "hybrid-encryption",
    term: "Hybrid Encryption (KEM / DEM)",
    acronymFor: "Key Encapsulation + Data Encapsulation Mechanism",
    category: "crypto",
    briefIntro: "Combining the computational speed of symmetric encryption (AES) with the fine-grained flexibility of asymmetric or pairing-based cryptography (CP-ABE).",
    useInProject: "The raw medical PDF/scan is encrypted using high-speed AES-256-GCM. The 32-byte AES key is then encapsulated using CP-ABE. This eliminates performance bottlenecks on 500MB+ medical scans.",
    codeLocation: "backend/attribute_authority/crypto_engine.py -> encrypt_medical_file() & decrypt_medical_file()",
    vivaTip: "Say: 'CP-ABE on large files causes massive computational overhead; Hybrid encryption gives us constant-time key encapsulation with sub-second streaming decryption.'",
    difficulty: "Fundamental",
  },
  {
    id: "aes-256-gcm",
    term: "AES-256-GCM",
    acronymFor: "Advanced Encryption Standard - Galois/Counter Mode",
    category: "crypto",
    briefIntro: "An authenticated symmetric cipher providing both confidential encryption and cryptographic data integrity verification using Galois field multiplication.",
    useInProject: "Encrypts the actual medical report payload. Generates a 128-bit authentication tag; if even 1 bit of the ciphertext in IPFS is altered, decryption immediately fails.",
    codeLocation: "backend/attribute_authority/crypto_engine.py (AES.MODE_GCM, 16-byte nonce)",
    vivaTip: "Highlight the 'GCM' part: it gives Authenticated Encryption with Associated Data (AEAD), guarding against ciphertext bit-flipping attacks.",
    difficulty: "Fundamental",
  },
  {
    id: "bilinear-pairing",
    term: "Bilinear Pairing",
    acronymFor: "e: G1 x G2 -> GT (Pairing-Based Cryptography)",
    category: "crypto",
    briefIntro: "A mathematical mapping between two algebraic groups to a target group that preserves linearity in both arguments: e(aP, bQ) = e(P, Q)^(ab).",
    useInProject: "The foundational mathematical engine of CP-ABE. Decryption multiplies doctor attribute key components with ciphertext components; if attributes satisfy the policy, bilinear pairings reconstruct e(g,g)^s.",
    codeLocation: "backend/attribute_authority/crypto_engine.py (Waters pairing simulation)",
    vivaTip: "Mention that pairing equations enable access verification in the exponent without revealing the underlying private keys.",
    difficulty: "Advanced",
  },
  {
    id: "dbdh",
    term: "DBDH Assumption",
    acronymFor: "Decisional Bilinear Diffie-Hellman",
    category: "crypto",
    briefIntro: "A computational hardness problem stating that given g, g^a, g^b, g^c, it is computationally infeasible for a polynomial-time attacker to distinguish e(g,g)^(abc) from random.",
    useInProject: "Provides the formal mathematical security proof that unauthorized clinicians or outside eavesdroppers cannot decrypt patient files without valid attribute keys.",
    codeLocation: "README.md & Research Paper Foundation",
    vivaTip: "If asked 'What proves your system is secure?', answer: 'The Waters CP-ABE scheme reduces to the Decisional Bilinear Diffie-Hellman hardness assumption.'",
    difficulty: "Advanced",
  },
  {
    id: "collusion-resistance",
    term: "Collusion Resistance",
    category: "crypto",
    briefIntro: "A security guarantee preventing two or more unauthorized users from pooling their attribute keys together to decrypt a ciphertext neither can access alone.",
    useInProject: "Each doctor's attribute key is randomized with a unique secret seed q_u(0) by the Attribute Authority. Even if Doctor A has {Role:Doctor} and Doctor B has {Dept:Cardiology}, their randomized factors cannot cancel out.",
    codeLocation: "backend/attribute_authority/crypto_engine.py -> generate_doctor_keys()",
    vivaTip: "A core viva topic: 'How do you stop doctors sharing keys?'. Answer: 'Key components embed user-specific randomized polynomial shares that cannot cross-cancel.'",
    difficulty: "Intermediate",
  },
  {
    id: "attribute-authority",
    term: "Attribute Authority (AA)",
    category: "crypto",
    briefIntro: "A trusted entity responsible for verifying real-world credentials (e.g. medical licenses) and issuing collusion-resistant cryptographic attribute keys to users.",
    useInProject: "Implemented as a Django service. Generates the Master Public Key (MPK) and Master Secret Key (MSK), verifies doctors' medical credentials, and issues their CP-ABE attribute keys.",
    codeLocation: "backend/attribute_authority/views.py & backend/attribute_authority/models.py",
    vivaTip: "Point out that Hospital Admins act as the AA in the Admin Portal (/admin) to verify doctor KYC before issuing keys.",
    difficulty: "Intermediate",
  },

  // BLOCKCHAIN & SMART CONTRACTS
  {
    id: "evm",
    term: "EVM",
    acronymFor: "Ethereum Virtual Machine",
    category: "blockchain",
    briefIntro: "The decentralized runtime environment executing smart contract bytecode deterministically across all participating blockchain nodes.",
    useInProject: "Runs our Solidity contracts compiled via Solidity 0.8.20. Provides the decentralized consensus layer for access control and immutable audit logging.",
    codeLocation: "contracts/hardhat.config.js (EVM target chainId: 31337 / localhost)",
    vivaTip: "Mention that the EVM guarantees zero single-point-of-failure: smart contract logic cannot be shut down or tampered with by any single party.",
    difficulty: "Fundamental",
  },
  {
    id: "smart-contract",
    term: "Smart Contract",
    category: "blockchain",
    briefIntro: "Self-executing code stored on the blockchain that runs automatically when predetermined conditions are met, without intermediaries.",
    useInProject: "We wrote and deployed 3 core contracts: MedicalRecordRegistry (ownership & IPFS binding), AccessControlManager (on-chain revocation & emergency), and AuditLogger (HIPAA log ledger).",
    codeLocation: "contracts/contracts/MedicalRecordRegistry.sol, AccessControlManager.sol, AuditLogger.sol",
    vivaTip: "Know the 3 contract names by heart. Be ready to explain the responsibility of each one.",
    difficulty: "Fundamental",
  },
  {
    id: "dynamic-revocation",
    term: "Dynamic Revocation",
    category: "blockchain",
    briefIntro: "Instantly revoking access permissions in real time without having to decrypt, re-key, and re-encrypt massive datasets.",
    useInProject: "When a patient toggles 'Revoke Access', AccessControlManager.sol updates an on-chain boolean mapping in <0.5 seconds. Decryption checks this contract state before computing pairings.",
    codeLocation: "contracts/contracts/AccessControlManager.sol -> revokeDoctorAccess() & isDoctorRevoked()",
    vivaTip: "Traditional ABE takes minutes/hours to re-encrypt large files for revocation. Our dual-layer smart contract approach does it in under 0.5s with zero file re-encryption.",
    difficulty: "Intermediate",
  },
  {
    id: "break-glass",
    term: "Break-Glass Protocol",
    category: "blockchain",
    briefIntro: "An emergency override mechanism allowing clinicians to bypass strict access policies in life-or-death scenarios with non-repudiable audit accountability.",
    useInProject: "If an unconscious trauma patient is in ER, a doctor toggles Emergency Mode with a medical reason. The report decrypts under the 'Emergency:True' policy branch, and an immutable event is committed to the blockchain.",
    codeLocation: "frontend/src/app/doctor/page.tsx & contracts/contracts/AccessControlManager.sol -> triggerEmergencyAccess()",
    vivaTip: "Examiners will ask: 'What if a doctor misuses Break-Glass?'. Answer: 'Every override is permanently timestamped on the Ethereum ledger with the doctor’s wallet address for post-hoc HIPAA penalization.'",
    difficulty: "Intermediate",
  },
  {
    id: "hardhat",
    term: "Hardhat",
    category: "blockchain",
    briefIntro: "A flexible and robust local Ethereum development environment for compiling, deploying, and testing Solidity smart contracts.",
    useInProject: "Runs a local Ethereum RPC node on port 8545 with 20 pre-funded test accounts, compiles contracts with 200 optimizer runs, and executes automated smart contract unit tests.",
    codeLocation: "contracts/hardhat.config.js & contracts/scripts/deploy.js",
    vivaTip: "Explain that Hardhat simulates the real Ethereum Mainnet/Sepolia network locally, offering instantaneous sub-second block confirmations.",
    difficulty: "Fundamental",
  },
  {
    id: "ethers-js",
    term: "Ethers.js (v6)",
    category: "blockchain",
    briefIntro: "A complete, compact, and secure TypeScript/JavaScript library for interacting with the Ethereum Blockchain and its ecosystem.",
    useInProject: "Connects the Next.js frontend to MetaMask and the Hardhat node. Handles wallet signer extraction, ABI encoding, contract method execution, and event listening.",
    codeLocation: "frontend/src/lib/contracts.ts -> getMedicalRegistryContract(), getSigner()",
    vivaTip: "Say: 'We use Ethers.js v6 with BrowserProvider to request signatures and broadcast transactions directly from the patient’s MetaMask wallet.'",
    difficulty: "Fundamental",
  },
  {
    id: "gas-optimization",
    term: "Gas & Gas Optimization",
    category: "blockchain",
    briefIntro: "The computational fee required to execute operations on Ethereum. Optimization reduces costs for patients and hospitals.",
    useInProject: "We enabled the Solidity optimizer (200 runs), used calldata instead of memory for strings, and minimized storage slots. Record registration costs ~114k gas; revocation costs only ~42k gas.",
    codeLocation: "contracts/hardhat.config.js (settings.optimizer.enabled = true)",
    vivaTip: "Highlight that only cryptographic hashes and status flags are stored on-chain, keeping gas costs minimal and predictable.",
    difficulty: "Intermediate",
  },
  {
    id: "audit-logger",
    term: "Immutable Audit Ledger",
    category: "blockchain",
    briefIntro: "An append-only, tamper-proof blockchain log recording all security events (registration, access attempts, decryptions, and revocations).",
    useInProject: "Implemented in AuditLogger.sol. Every authorized access or rejected attempt emits an AuditLogged event containing the actor address, record ID, action code, and block timestamp.",
    codeLocation: "contracts/contracts/AuditLogger.sol & backend/records/models.py -> AccessAuditLog",
    vivaTip: "Contrast this with traditional hospital SQL logs where database administrators can tamper with or erase breach records.",
    difficulty: "Fundamental",
  },

  // DECENTRALIZED STORAGE
  {
    id: "ipfs",
    term: "IPFS",
    acronymFor: "InterPlanetary File System",
    category: "storage",
    briefIntro: "A peer-to-peer hypermedia protocol designed to store and share data in a distributed, content-addressed file system.",
    useInProject: "Acts as our off-chain decentralized storage vault. The encrypted medical bundles (ciphertext + IV + tag) are stored here, keeping large file payloads off the expensive Ethereum chain.",
    codeLocation: "backend/records/ipfs_service.py -> IPFSService.pin_file()",
    vivaTip: "Remember the core phrase: 'Off-Chain Storage, On-Chain Verification'. Files live in IPFS; hashes live on Ethereum.",
    difficulty: "Fundamental",
  },
  {
    id: "cid",
    term: "CID",
    acronymFor: "Content Identifier",
    category: "storage",
    briefIntro: "A self-describing cryptographic content address (hash) that points to data on IPFS, typically starting with 'Qm...' or 'bafy...'.",
    useInProject: "When a file is encrypted and pinned, IPFSService computes its cryptographic CID. This CID is anchored directly into the MedicalRecordRegistry smart contract to prevent data tampering.",
    codeLocation: "backend/records/ipfs_service.py & contracts/contracts/MedicalRecordRegistry.sol",
    vivaTip: "Explain that CIDs are based on the cryptographic hash of the content itself; if the file changes by a single byte, its CID changes completely.",
    difficulty: "Fundamental",
  },
  {
    id: "zero-knowledge-vault",
    term: "Zero-Knowledge Storage Vault",
    category: "storage",
    briefIntro: "A storage paradigm where the storage node host has zero visibility or mathematical ability to decipher the data stored on it.",
    useInProject: "Even if an attacker hacks the IPFS cluster or Pinata account, all payloads are encrypted with AES-256 and CP-ABE. Without the patient-approved attribute key, files are pure mathematical noise.",
    codeLocation: "backend/records/views.py -> UploadAndEncryptRecordView",
    vivaTip: "Use this to explain HIPAA compliance: cloud storage providers never handle unencrypted Protected Health Information (PHI).",
    difficulty: "Intermediate",
  },

  // HEALTHCARE & COMPLIANCE
  {
    id: "hipaa",
    term: "HIPAA Compliance",
    acronymFor: "Health Insurance Portability and Accountability Act",
    category: "healthcare",
    briefIntro: "U.S. healthcare regulation mandating strict technical, physical, and administrative safeguards to protect patient health information (PHI).",
    useInProject: "Meets HIPAA §164.312 standards: AES-256 for encryption in transit and at rest, immutable blockchain audit trails for access tracking, and strict role-attribute separation.",
    codeLocation: "README.md & contracts/contracts/AuditLogger.sol",
    vivaTip: "Always cite §164.312 (Technical Safeguards: Access Control & Audit Controls) to show examiners real-world regulatory depth.",
    difficulty: "Intermediate",
  },
  {
    id: "gdpr-erasure",
    term: "GDPR Cryptographic Shredding",
    acronymFor: "General Data Protection Regulation - Article 17",
    category: "healthcare",
    briefIntro: "GDPR guarantees patients the 'Right to Erasure'. On an immutable blockchain, data cannot be erased; cryptographic shredding solves this paradox.",
    useInProject: "Patients can revoke or destroy encryption parameters. Without the CP-ABE key, the ciphertext remaining on IPFS or blockchain hashes cannot be decrypted by anyone, satisfying GDPR Article 17.",
    codeLocation: "backend/records/views.py -> RevokeRecordView",
    vivaTip: "Examiners often ask: 'How does blockchain immutability comply with the GDPR right to be forgotten?'. Answer: 'Through Cryptographic Shredding!'",
    difficulty: "Advanced",
  },
  {
    id: "patient-sovereignty",
    term: "Patient Data Sovereignty",
    category: "healthcare",
    briefIntro: "The principle that patients own and control their own medical data, including who can view it, for what purpose, and for how long.",
    useInProject: "The core design philosophy of SecureChain. Patients define access policies directly on the file upload UI (/patient) and can revoke individual doctor access anytime with one click.",
    codeLocation: "frontend/src/app/patient/page.tsx",
    vivaTip: "Use this term in your project introduction: it highlights the paradigm shift from hospital-centric to patient-centric healthcare.",
    difficulty: "Fundamental",
  },
  {
    id: "kyc-doctor",
    term: "Doctor KYC Verification",
    acronymFor: "Know Your Customer / Clinical Credentialing",
    category: "healthcare",
    briefIntro: "The vetting process verifying that a clinician actually possesses valid medical licenses and hospital appointments before cryptographic keys are issued.",
    useInProject: "Hospital Administrators review doctor registrations on the /admin portal, verify their license number and department, and then trigger attribute key generation.",
    codeLocation: "frontend/src/app/admin/page.tsx & backend/attribute_authority/models.py -> DoctorProfile",
    vivaTip: "Explain that KYC bridges the off-chain medical world with on-chain cryptographic identity.",
    difficulty: "Fundamental",
  },

  // FULL-STACK SYSTEM
  {
    id: "nextjs-14",
    term: "Next.js 14 & App Router",
    category: "fullstack",
    briefIntro: "A React framework for building high-performance web applications with server-side rendering, client components, and nested layouts.",
    useInProject: "Drives our entire web frontend (Patient Portal, Doctor Portal, Admin Portal, Viva Showcase, and Keywords Guide) with client-side Web3 wallet state and modern Tailwind UI.",
    codeLocation: "frontend/src/app/ (layout.tsx, page.tsx, patient/, doctor/, admin/, viva-defense/, keywords/)",
    vivaTip: "Explain that Next.js 14 client components ('use client') interact seamlessly with MetaMask in the browser.",
    difficulty: "Fundamental",
  },
  {
    id: "django-drf",
    term: "Django REST Framework (DRF)",
    category: "fullstack",
    briefIntro: "A powerful and flexible toolkit for building web APIs in Python, backed by the robust Django ORM and security middleware.",
    useInProject: "Serves as our backend API layer and cryptographic orchestrator. Manages doctor models, executes CP-ABE pairing algorithms via Python crypto libraries, and serves JSON endpoints.",
    codeLocation: "backend/records/views.py & backend/attribute_authority/views.py",
    vivaTip: "Mention that Python was chosen for the backend because the most mature pairing-based cryptographic libraries (Charm, PyCryptodome) run natively in Python.",
    difficulty: "Fundamental",
  },
];

export default function KeywordsGuidePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("cp-abe");
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  // Filtered keywords
  const filteredKeywords = useMemo(() => {
    return ALL_KEYWORDS.filter((k) => {
      const matchesSearch =
        k.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (k.acronymFor && k.acronymFor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        k.briefIntro.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.useInProject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === "all" || k.category === selectedCategory;
      const matchesDiff = selectedDifficulty === "all" || k.difficulty === selectedDifficulty;

      return matchesSearch && matchesCat && matchesDiff;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const categories = [
    { id: "all", label: "All Keywords", count: ALL_KEYWORDS.length },
    { id: "crypto", label: "Cryptography & ABE", count: ALL_KEYWORDS.filter((k) => k.category === "crypto").length },
    { id: "blockchain", label: "Blockchain & EVM", count: ALL_KEYWORDS.filter((k) => k.category === "blockchain").length },
    { id: "storage", label: "Decentralized IPFS", count: ALL_KEYWORDS.filter((k) => k.category === "storage").length },
    { id: "healthcare", label: "Healthcare & HIPAA", count: ALL_KEYWORDS.filter((k) => k.category === "healthcare").length },
    { id: "fullstack", label: "Full-Stack Tech", count: ALL_KEYWORDS.filter((k) => k.category === "fullstack").length },
  ];

  // Flashcard helpers
  const currentCard = filteredKeywords[flashcardIndex] || filteredKeywords[0];

  function nextCard() {
    setFlashcardFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % filteredKeywords.length);
  }

  function prevCard() {
    setFlashcardFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + filteredKeywords.length) % filteredKeywords.length);
  }

  return (
    <div className="space-y-10 py-2">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-cyber-border shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
                <BookOpen className="w-4 h-4 text-cyan-400" /> New Learner Master Reference
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 text-teal-400 text-xs font-mono border border-slate-700">
                {ALL_KEYWORDS.length} Terms Documented
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              SecureChain Project Keywords & Concepts Guide
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              A comprehensive technical dictionary designed for new learners, examiners, and evaluators.
              Each keyword explains <strong className="text-teal-300">What It Is</strong>,{" "}
              <strong className="text-cyan-300">How It Is Used in This Project</strong>, exact{" "}
              <strong className="text-white">File Locations</strong>, and golden{" "}
              <strong className="text-amber-300">Viva Tips</strong>.
            </p>
          </div>

          {/* Quick Study Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-cyber-border">
            <button
              onClick={() => {
                setFlashcardMode(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                !flashcardMode ? "bg-teal-500 text-slate-950 shadow-glow-teal" : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" /> Glossary View
            </button>
            <button
              onClick={() => {
                setFlashcardMode(true);
                setFlashcardFlipped(false);
                setFlashcardIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                flashcardMode ? "bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-glow-teal" : "text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Viva Flashcard Mode
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLASHCARD MODE (VIVA PREPARATION) */}
      {/* ========================================================================= */}
      {flashcardMode && currentCard && (
        <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Flashcard {flashcardIndex + 1} of {filteredKeywords.length}
            </span>
            <span className="font-mono text-teal-400 uppercase tracking-wider">
              Category: {currentCard.category}
            </span>
          </div>

          <div
            onClick={() => setFlashcardFlipped(!flashcardFlipped)}
            className="cursor-pointer min-h-[340px] glass-panel p-8 rounded-3xl border border-teal-500/40 shadow-2xl flex flex-col justify-between transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group"
          >
            <div className="absolute top-4 right-4 text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-700">
              Click to Flip {flashcardFlipped ? "to Front" : "to Back"}
            </div>

            {!flashcardFlipped ? (
              <div className="my-auto space-y-4 text-center">
                <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-mono border border-teal-500/20">
                  {currentCard.difficulty} Level
                </span>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">{currentCard.term}</h2>
                {currentCard.acronymFor && (
                  <p className="text-base text-cyan-300 font-mono">{currentCard.acronymFor}</p>
                )}
                <p className="text-xs text-slate-400 max-w-md mx-auto pt-4">
                  (Test yourself: What is it, how is it used in SecureChain, and what is its role in the viva?)
                </p>
              </div>
            ) : (
              <div className="space-y-4 my-auto animate-fadeIn">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" /> {currentCard.term} Explained
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <p>
                    <strong className="text-white">Brief Introduction:</strong> {currentCard.briefIntro}
                  </p>
                  <p className="pt-1">
                    <strong className="text-teal-300">Use in Project:</strong> {currentCard.useInProject}
                  </p>
                  <div className="pt-2 p-3 rounded-xl bg-amber-950/30 border border-amber-800/60 text-amber-200 text-xs">
                    <strong>Viva Defense Tip:</strong> {currentCard.vivaTip}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 pt-1">
                    Code: <code>{currentCard.codeLocation}</code>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center text-[11px] text-slate-500">
              {flashcardFlipped ? "Showing Answer & Project Use" : "Card Question • Tap anywhere to flip"}
            </div>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevCard}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-all"
            >
              ← Previous Card
            </button>
            <button
              onClick={() => setFlashcardFlipped(!flashcardFlipped)}
              className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold shadow-glow-teal hover:bg-teal-400 transition-all"
            >
              Flip Card
            </button>
            <button
              onClick={nextCard}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-all"
            >
              Next Card →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GLOSSARY VIEW (SEARCHABLE LIST) */}
      {/* ========================================================================= */}
      {!flashcardMode && (
        <div className="space-y-6">
          {/* Search & Category Filter Controls */}
          <div className="glass-panel p-6 rounded-3xl border border-cyber-border space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search keywords, abbreviations (CP-ABE, EVM, IPFS), or concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-1.5 self-start md:self-auto text-xs bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
                <span className="text-slate-400 px-2 font-medium">Difficulty:</span>
                {["all", "Fundamental", "Intermediate", "Advanced"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                      selectedDifficulty === d
                        ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === c.id
                      ? "bg-teal-500 text-slate-950 font-bold shadow-glow-teal"
                      : "bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  <span>{c.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === c.id ? "bg-slate-950 text-teal-300" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {c.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>
              Showing <strong className="text-teal-300">{filteredKeywords.length}</strong> keywords matching criteria
            </span>
            <span>Click any keyword to expand technical details and code mapping</span>
          </div>

          {/* Keywords Accordion Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredKeywords.map((k) => {
              const isExpanded = expandedId === k.id;
              return (
                <div
                  key={k.id}
                  className={`rounded-3xl border transition-all overflow-hidden ${
                    isExpanded
                      ? "bg-slate-900/90 border-teal-500/80 shadow-2xl ring-1 ring-teal-500/40"
                      : "bg-slate-900/50 border-cyber-border hover:border-slate-700"
                  }`}
                >
                  {/* Clickable Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : k.id)}
                    className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-lg font-extrabold text-white tracking-tight">{k.term}</h3>
                        {k.acronymFor && (
                          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded-lg">
                            {k.acronymFor}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                            k.difficulty === "Fundamental"
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                              : k.difficulty === "Intermediate"
                              ? "bg-cyan-950/80 text-cyan-300 border-cyan-800"
                              : "bg-amber-950/80 text-amber-300 border-amber-800"
                          }`}
                        >
                          {k.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-1">{k.briefIntro}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-[11px] font-mono text-teal-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        {k.category.toUpperCase()}
                      </span>
                      <ChevronRight
                        className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-90 text-teal-400" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="p-6 pt-2 border-t border-slate-800/80 space-y-4 animate-fadeIn text-xs sm:text-sm">
                      {/* Section 1: Brief Intro */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> 1. Brief Introduction (What is it?)
                        </span>
                        <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                          {k.briefIntro}
                        </p>
                      </div>

                      {/* Section 2: Use in this Project */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5" /> 2. Role & Exact Use in SecureChain
                        </span>
                        <p className="text-slate-200 leading-relaxed bg-cyan-950/20 p-3 rounded-xl border border-cyan-800/40">
                          {k.useInProject}
                        </p>
                      </div>

                      {/* Section 3: File Location & Viva Tip */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5 text-teal-400" /> Source Code Location
                          </span>
                          <code className="text-[11px] font-mono text-teal-300 block break-all">
                            {k.codeLocation}
                          </code>
                        </div>

                        <div className="bg-amber-950/20 p-3 rounded-xl border border-amber-800/50 space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Viva Defense Winning Answer
                          </span>
                          <p className="text-xs text-amber-100 italic leading-relaxed">{k.vivaTip}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Cross-Navigation */}
      <div className="glass-panel p-6 rounded-3xl border border-cyber-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
            <GraduationCap className="w-4 h-4 text-teal-400" /> Ready to test your defense with the Live Simulator?
          </h4>
          <p className="text-xs text-slate-400">
            Head to the Viva Defense page to run the animated CP-ABE pipeline and test doctor verification.
          </p>
        </div>
        <Link
          href="/viva-defense"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-glow-teal flex items-center gap-2 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
        >
          Open Viva Defense Showcase <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}


import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SecureChain | Decentralized Healthcare Access Control",
  description:
    "Decentralized Access Control for Medical Reports Using Smart Contracts and Attribute-Based Encryption (CP-ABE)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col selection:bg-teal-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-cyber-border/40 py-6 text-center text-xs text-slate-500 bg-cyber-navy/40">
          <p>SecureChain: 8th Semester Capstone Project • Powered by Next.js, Django, Ethereum & CP-ABE</p>
        </footer>
      </body>
    </html>
  );
}

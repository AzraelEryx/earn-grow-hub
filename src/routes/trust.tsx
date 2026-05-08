import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { IconArrowLeft, IconShield, IconUser, IconDoc, IconLock, IconChevronDown, IconSeal } from "@/components/icons";
import { PLATFORM_NAME } from "@/lib/mock";

export const Route = createFileRoute("/trust")({
  head: () => ({ meta: [{ title: "Trust & Verified — ChinexEarn" }] }),
  component: TrustPage,
});

function TrustPage() {
  const [viewers, setViewers] = useState(247);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setViewers((v) => Math.max(150, v + Math.floor(Math.random() * 11) - 5)), 4000);
    return () => clearInterval(id);
  }, []);

  const credentials = [
    { Icon: IconShield, n: "01", t: "CBN", s: "Compliant", d: "Operating in line with Central Bank of Nigeria fintech guidelines." },
    { Icon: IconUser, n: "02", t: "CAC", s: "Registered", d: "Officially registered with the Corporate Affairs Commission." },
    { Icon: IconDoc, n: "03", t: "NDPR", s: "Data Protected", d: "Your data is processed under Nigeria's NDPR framework." },
    { Icon: IconLock, n: "04", t: "SSL", s: "Encrypted", d: "All traffic uses 256-bit TLS encryption end to end." },
  ];

  const pillars = [
    { t: "Infrastructure", d: "Edge-deployed worldwide" },
    { t: "Surveillance", d: "24/7 fraud monitoring" },
    { t: "Identity", d: "Verified user system" },
    { t: "Live Support", d: "Human agents in minutes" },
  ];

  const proof = [
    "Daily payment proofs in Telegram", "Verified leadership team",
    "Independent payout audits", "On-chain transaction records",
    "Public uptime monitoring", "Two-factor account security",
    "Encrypted bank submissions", "Independent legal counsel",
  ];

  const faqs = [
    ["Is this a registered company?", "Yes. We are duly registered with the Corporate Affairs Commission of Nigeria with full operational compliance."],
    ["Are you regulated by the Central Bank of Nigeria?", "We follow CBN fintech guidelines for all referral and payout operations."],
    ["How is my personal data protected?", "We adhere to the NDPR. Data is encrypted at rest and in transit, and never sold to third parties."],
    ["How do I know withdrawals are real?", "Daily payment proofs are posted publicly in our Telegram channel for full transparency."],
    ["What protects me from fraud?", "Two-factor security, manual verification on payouts, and 24/7 monitoring of suspicious activity."],
    ["How do I reach a real human if I need help?", "Our support team responds on Telegram in minutes — no bots, no queues."],
  ];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between mb-5">
          <Link to="/dashboard" className="w-10 h-10 rounded-full border border-border flex items-center justify-center"><IconArrowLeft /></Link>
          <span className="px-3 py-1.5 rounded-full bg-secondary text-[10px] uppercase tracking-widest text-muted-foreground">Verified Dossier · MMXXVI</span>
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden p-8 rounded-3xl bg-card border border-border text-center">
          <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(0,201,167,.5), transparent 60%)" }} />
          <div className="relative inline-block">
            <span className="absolute inset-0 rounded-full gradient-accent animate-pulse-ring" />
            <div className="relative w-20 h-20 rounded-full gradient-accent flex items-center justify-center"><IconShield width={36} height={36} stroke="#08110F" strokeWidth={2.4} /></div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Authenticated</div>
          <div className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {viewers} VIEWERS · LIVE
          </div>
          <div className="mt-5 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Certificate of Authenticity</div>
          <h1 className="mt-2 text-3xl sm:text-5xl font-extrabold">Trust <span className="text-gradient-accent">&</span> Verified</h1>
          <p className="mt-2 text-sm text-muted-foreground">A registered Nigerian fintech committed to transparent, secure earnings.</p>
          <div className="mt-3 text-[11px] text-muted-foreground tracking-wider">09°04'N —— LAGOS · NIGERIA —— 07°29'E</div>
        </div>

        {/* Credentials */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {credentials.map((c) => (
            <div key={c.t} className="p-5 rounded-2xl bg-card border border-border card-glow">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-widest text-muted-foreground">No. {c.n}</span>
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center"><c.Icon stroke="#08110F" /></div>
              </div>
              <div className="mt-3 font-bold text-lg">{c.t}</div>
              <div className="text-[10px] uppercase tracking-widest text-emerald-400">{c.s}</div>
              <div className="mt-1 h-px w-12 bg-emerald-500" />
              <p className="mt-3 text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>

        {/* Pillars */}
        <div className="mt-6 -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-3 w-max">
            {pillars.map((p) => (
              <div key={p.t} className="w-56 p-4 rounded-2xl bg-card border border-border">
                <div className="font-semibold">{p.t}</div>
                <div className="text-xs text-muted-foreground">{p.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[["50K+","Active Users"],["N500M+","Paid Out"],["99.9%","Uptime"],["MMXXV","Established"]].map(([v,l])=>(
            <div key={l} className="p-4 rounded-2xl bg-card border border-border">
              <div className="text-lg font-bold text-gradient-accent">{v}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>

        {/* Proof */}
        <div className="mt-6 p-5 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Proof of Legitimacy</div>
          <ol className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {proof.map((p, i) => <li key={i} className="flex gap-2"><span className="text-muted-foreground">{(i+1).toString().padStart(2,"0")}.</span> {p}</li>)}
          </ol>
        </div>

        {/* FAQ */}
        <div className="mt-6 space-y-2">
          {faqs.map(([q, a], i) => (
            <button key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-left p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-sm">{q}</span>
                <IconChevronDown className={`transition ${openFaq === i ? "rotate-180" : ""}`} />
              </div>
              {openFaq === i && <p className="mt-2 text-sm text-muted-foreground">{a}</p>}
            </button>
          ))}
        </div>

        {/* Issued by */}
        <div className="mt-6 relative p-6 rounded-2xl bg-card border border-border">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full gradient-accent flex items-center justify-center"><IconSeal stroke="#08110F" /></div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Issued by</div>
          <div className="mt-1 text-xl font-bold">{PLATFORM_NAME}</div>
          <div className="text-sm text-muted-foreground">Federal Republic of Nigeria</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Registered","Compliant","Operational"].map((t) => (
              <span key={t} className="px-3 py-1 rounded-full bg-secondary text-xs">{t}</span>
            ))}
          </div>
        </div>

        <button onClick={() => setAboutOpen((v) => !v)}
          className="mt-5 w-full p-4 rounded-2xl bg-card border border-border text-sm font-medium flex items-center justify-between">
          Tap to Reveal — About {PLATFORM_NAME} <IconChevronDown className={`transition ${aboutOpen ? "rotate-180" : ""}`} />
        </button>
        {aboutOpen && (
          <div className="mt-2 p-4 rounded-2xl bg-card border border-border text-sm text-muted-foreground">
            {PLATFORM_NAME} is a Nigerian fintech committed to making earning accessible — through verified referrals, daily tasks, and structured investment plans backed by transparent, audited operations.
          </div>
        )}
        <div className="mt-6 text-center text-xs text-muted-foreground">Copyright 2026 {PLATFORM_NAME}. All Rights Reserved.</div>
      </div>
    </AppShell>
  );
}

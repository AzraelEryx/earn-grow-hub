import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "@/components/AppShell";
import { PLATFORM_NAME, PLACEHOLDERS, randAmount, randName } from "@/lib/mock";
import { fmtNGN, maskName, timeAgo } from "@/lib/format";
import { useLiveStats } from "@/lib/stats";
import {
  IconShield, IconArrowRight, IconUsers, IconBolt, IconChart, IconCheck,
  IconClose,
} from "@/components/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chixx9ja — Refer, Earn & Invest in Nigeria" },
      { name: "description", content: "Join thousands earning daily through referrals, tasks and verified investment plans. N5,000 welcome bonus." },
      { property: "og:title", content: "Chixx9ja — Refer, Earn & Invest" },
      { property: "og:description", content: "Earn N3,500 per referral. Verified, regulated, instant payouts." },
    ],
  }),
  component: Landing,
});

function Ticker() {
  const items = useMemo(
    () => Array.from({ length: 14 }, () => `${randName()} just withdrew ${fmtNGN(randAmount())} · Paid`),
    []
  );
  const doubled = [...items, ...items];
  return (
    <div className="bg-surface border-b border-border overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2 text-xs">
        {doubled.map((t, i) => (
          <span key={i} className="px-6 inline-flex items-center gap-2 text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function GateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState([false, false]);
  const steps = [
    { title: "Join Telegram Channel", desc: "Get instant withdrawal proofs", url: PLACEHOLDERS.telegram1, action: "Open Telegram" },
    { title: "Join WhatsApp Channel", desc: "Daily tips & community updates", url: PLACEHOLDERS.whatsapp, action: "Open WhatsApp" },
  ];
  if (!open) return null;
  const allDone = done.every(Boolean);
  const totalSteps = steps.length + 1;
  const progress = ((step + (done[step] ? 1 : 0)) / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface rounded-3xl border border-border p-6 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border flex items-center justify-center"><IconClose /></button>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Step {Math.min(step + 1, totalSteps)} of {totalSteps}</div>
        <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full gradient-accent transition-all" style={{ width: `${Math.max(8, progress)}%` }} />
        </div>

        {step < steps.length ? (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">{steps[step].title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{steps[step].desc}</p>
            <a href={steps[step].url} target="_blank" rel="noreferrer"
              className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium hover:border-primary/50">
              {steps[step].action}
            </a>
            <label className="mt-5 flex items-center gap-3 text-sm cursor-pointer">
              <input type="checkbox" checked={done[step]}
                onChange={(e) => setDone((d) => d.map((v, i) => (i === step ? e.target.checked : v)))}
                className="w-5 h-5 rounded accent-[#00C9A7]" />
              I have completed this step
            </label>
            <button
              disabled={!done[step]}
              onClick={() => setStep(step + 1)}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full gradient-accent text-[#08110F] px-5 py-3 text-sm font-semibold disabled:opacity-40">
              Continue <IconArrowRight />
            </button>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full gradient-accent flex items-center justify-center">
              <IconCheck stroke="#08110F" strokeWidth={3} />
            </div>
            <h3 className="mt-4 text-xl font-semibold">All Set</h3>
            <p className="mt-1 text-sm text-muted-foreground">You're ready to claim your welcome bonus.</p>
            <Link to="/signup"
              className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full gradient-accent text-[#08110F] px-5 py-3 text-sm font-semibold ${!allDone && "opacity-40 pointer-events-none"}`}>
              Create Your Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Landing() {
  const [gate, setGate] = useState(false);
  const [feed, setFeed] = useState(() =>
    Array.from({ length: 6 }, () => ({
      name: randName(), action: ["claimed", "withdrew", "earned via referral"][Math.floor(Math.random() * 3)],
      amount: randAmount(20000, 200000), ts: Date.now() - Math.floor(Math.random() * 60 * 60 * 1000),
    }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setFeed((f) => [{ name: randName(), action: "withdrew", amount: randAmount(50000, 500000), ts: Date.now() }, ...f.slice(0, 5)]);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Ticker />
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center">
              <IconShield width={18} height={18} stroke="#08110F" strokeWidth={2.4} />
            </div>
            <span className="font-semibold tracking-wide">{PLATFORM_NAME}</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="hidden sm:inline-flex px-4 py-2 text-sm rounded-full border border-border hover:border-primary/50">Login</Link>
            <button onClick={() => setGate(true)} className="px-4 py-2 text-sm rounded-full gradient-accent text-[#08110F] font-semibold">Get Started</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30" style={{
          background: "radial-gradient(circle at 30% 20%, rgba(0,201,167,.25), transparent 60%), radial-gradient(circle at 70% 80%, rgba(0,180,216,.2), transparent 60%)"
        }}/>
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-16 sm:pt-20 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Welcome bonus · {fmtNGN(PLACEHOLDERS.welcomeBonus)} on signup
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Earn Daily With <span className="text-gradient-accent">{PLATFORM_NAME}</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Refer friends, complete tasks, and grow with verified investment plans. Built for Nigerians who hustle smart.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-sm">
            <span className="text-gold font-semibold">{fmtNGN(PLACEHOLDERS.perReferral)}</span>
            <span className="text-muted-foreground">per referral</span>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => setGate(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full gradient-accent text-[#08110F] px-7 py-4 font-semibold shadow-lg shadow-primary/20">
              Start Earning Now <IconArrowRight />
            </button>
            <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-border px-7 py-4 text-sm font-medium hover:border-primary/50">
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-center">How It Works</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { n: "01", t: "Sign Up Free", d: "Create your account in under a minute and instantly receive your N5,000 welcome bonus.", icon: IconUsers },
            { n: "02", t: "Refer & Complete Tasks", d: "Share your unique link, complete daily tasks and unlock more rewards every day.", icon: IconBolt },
            { n: "03", t: "Withdraw or Invest", d: "Cash out securely or grow it through one of our verified investment tiers.", icon: IconChart },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="p-6 rounded-2xl bg-card border border-border card-glow">
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest text-muted-foreground">STEP {s.n}</span>
                  <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center"><Icon stroke="#08110F" /></div>
                </div>
                <h3 className="mt-4 font-semibold text-lg">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      <LiveStatsBar />


      {/* Social proof */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-center">Live Activity</h2>
        <div className="mt-8 max-w-xl mx-auto rounded-2xl border border-border bg-card overflow-hidden">
          {feed.map((f, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-0 animate-fade-in">
              <div>
                <div className="text-sm font-medium">{maskName(f.name)}</div>
                <div className="text-xs text-muted-foreground capitalize">{f.action} · {timeAgo(f.ts)}</div>
              </div>
              <div className="text-sm font-semibold text-gradient-accent">{fmtNGN(f.amount)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { t: "CBN", s: "Compliant" },
            { t: "CAC", s: "Registered" },
            { t: "NDPR", s: "Data Protected" },
            { t: "SSL", s: "Encrypted" },
          ].map((b) => (
            <div key={b.t} className="p-4 rounded-xl border border-border bg-card text-center">
              <div className="font-semibold">{b.t}</div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-0.5">{b.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <div className="p-10 rounded-3xl gradient-accent text-[#08110F]">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to start earning?</h2>
          <p className="mt-2 opacity-80">Join thousands of Nigerians earning daily.</p>
          <button onClick={() => setGate(true)} className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#08110F] text-white px-7 py-4 font-semibold">
            Start Earning Now <IconArrowRight />
          </button>
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Copyright 2026 {PLATFORM_NAME}. All Rights Reserved.
      </footer>

      <GateModal open={gate} onClose={() => setGate(false)} />
    </div>
  );
}

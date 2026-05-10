import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useRate } from "@/contexts/RateContext";
import { RateBadge } from "@/components/RateBadge";
import { fmtNGN, fmtUSD, ngnToUsd } from "@/lib/format";
import { PLATFORM_NAME } from "@/lib/mock";
import { IconShield, IconLock, IconBolt, IconCheck, IconChart } from "@/components/icons";
import { setCurrentPlan } from "@/lib/plan";

export const Route = createFileRoute("/invest")({
  head: () => ({ meta: [{ title: "Invest — Chixx9ja" }] }),
  component: InvestPage,
});

const PLANS = [
  { t: "Starter",   s: "Basic",    d: 10000,  m: 4, badge: "",            key: "starter" as const },
  { t: "Growth",    s: "Standard", d: 15000,  m: 4, badge: "",            key: "growth" as const },
  { t: "Balanced",  s: "Premium",  d: 25000,  m: 4, badge: "Popular",     key: "balanced" as const },
  { t: "Premium",   s: "Elite",    d: 40000,  m: 4, badge: "",            key: "premium" as const },
  { t: "Elite",     s: "VIP",      d: 60000,  m: 4, badge: "",            key: "elite" as const },
  { t: "Executive", s: "Royal",    d: 100000, m: 4, badge: "Highest ROI", key: "executive" as const },
];

function InvestPage() {
  const { rate } = useRate();
  const [amount, setAmount] = useState(10000);
  const nav = useNavigate();
  useAuth(); // ensure context loads

  const activate = (key: typeof PLANS[number]["key"], deposit: number) => {
    setCurrentPlan(key);
    setAmount(deposit);
    nav({ to: "/withdraw" });
  };

  const matchedPlan = [...PLANS].reverse().find((p) => amount >= p.d) ?? PLANS[0];
  const expected = amount * 4;
  const profit = expected - amount;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-5 pb-44">
        <h1 className="text-xl font-bold">Investment</h1>
        <div className="mt-4 p-5 rounded-3xl bg-card border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center"><IconShield stroke="#08110F" /></div>
          <div className="flex-1">
            <div className="font-semibold">{PLATFORM_NAME}</div>
            <div className="text-xs text-muted-foreground">Verified · CBN-aligned · CAC-registered</div>
          </div>
          <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Live</span>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h2 className="font-semibold">Choose a Plan</h2>
          <span className="text-xs text-muted-foreground">6 TIERS</span>
        </div>
        <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLANS.map((p) => {
            const ret = p.d * p.m, prof = ret - p.d;
            return (
              <div key={p.t} className="p-5 rounded-2xl bg-card border border-border card-glow relative">
                {p.badge && <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full gradient-accent text-[#08110F] text-[10px] font-bold">{p.badge}</span>}
                <div className="font-bold text-lg">{p.t}</div>
                <div className="text-xs text-muted-foreground">({p.s})</div>
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Deposit</span><span className="font-semibold">{fmtNGN(p.d)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Return</span><span className="font-semibold text-gold">{fmtNGN(ret)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Profit</span><span className="font-semibold text-emerald-400">+{fmtNGN(prof)}</span></div>
                  <div className="text-[11px] text-muted-foreground">≈ {fmtUSD(ngnToUsd(p.d, rate))} → {fmtUSD(ngnToUsd(ret, rate))}</div>
                  <div className="text-[11px] text-cyan-400">400% ROI</div>
                </div>
                <button onClick={() => activate(p.key, p.d)} className="mt-4 w-full rounded-full gradient-accent text-[#08110F] py-2.5 text-sm font-semibold">Continue with {p.s}</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky calculator */}
      <div className="fixed bottom-16 lg:bottom-0 inset-x-0 lg:left-64 bg-surface border-t border-border p-4 z-30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Smart Calculator</div>
              <div className="font-bold">{matchedPlan.t} ({matchedPlan.s})</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-muted-foreground">Return</div>
              <div className="font-bold text-gold">{fmtNGN(expected)}</div>
              <div className="text-[10px] text-muted-foreground">{fmtUSD(ngnToUsd(expected, rate))}</div>
            </div>
          </div>
          <input type="range" min={10000} max={100000} step={1000} value={amount} onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-3 w-full accent-[#00C9A7]" />
          <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{fmtNGN(10000)}</span><span>+{fmtNGN(profit)} profit</span><span>{fmtNGN(100000)}</span></div>
          <div className="mt-2 flex items-center gap-3"><RateBadge />
            <button className="ml-auto rounded-full gradient-accent text-[#08110F] px-5 py-2.5 text-sm font-semibold">Invest {fmtNGN(amount)}</button>
          </div>
          <div className="mt-2 hidden sm:flex flex-wrap gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><IconShield width={12} height={12} /> Bank-grade security</span>
            <span className="inline-flex items-center gap-1"><IconBolt width={12} height={12} /> Instant payout</span>
            <span className="inline-flex items-center gap-1"><IconCheck width={12} height={12} /> Manual verification</span>
            <span className="inline-flex items-center gap-1"><IconLock width={12} height={12} /> Encrypted transactions</span>
            <span className="inline-flex items-center gap-1"><IconChart width={12} height={12} /> Audited returns</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

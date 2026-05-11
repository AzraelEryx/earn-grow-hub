import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useRate } from "@/contexts/RateContext";
import { fmtNGN, fmtUSD, ngnToUsd } from "@/lib/format";
import { PLATFORM_NAME, PLACEHOLDERS } from "@/lib/mock";
import { IconShield, IconLock, IconBolt, IconCheck, IconChart, IconTelegram, IconGift } from "@/components/icons";
import { PAID_PLANS, getCurrentPlan, setCurrentPlan, type PlanKey } from "@/lib/plan";
import { redeemVoucher } from "@/lib/voucher";
import { showToast } from "@/components/Toast";

export const Route = createFileRoute("/invest")({
  head: () => ({ meta: [{ title: "Invest — Chixx9ja" }] }),
  component: InvestPage,
});

const PAYMENT_BOT_URL = "https://t.me/chixx9ja_pay_bot"; // placeholder — replace with real bot

function InvestPage() {
  const { rate, user, loading } = { ...useRate(), ...useAuth() } as any;
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ planLabel: string } | null>(null);
  const current = useMemo(() => getCurrentPlan(), [success]);

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);
  if (!user) return null;

  const handleRedeem = () => {
    setError(null);
    const r = redeemVoucher(code);
    if (!r.ok || !r.plan) { setError(r.error || "Could not redeem"); return; }
    setCurrentPlan(r.plan as PlanKey);
    const planLabel = PAID_PLANS.find((p) => p.key === r.plan)?.label || r.plan;
    setSuccess({ planLabel });
    setCode("");
    showToast("Plan activated");
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-5 pb-10 space-y-6">
        <div>
          <h1 className="text-xl font-bold">Upgrade Your Plan</h1>
          <p className="text-sm text-muted-foreground">Pick a plan, pay via our Telegram bot, then redeem your voucher to unlock daily claims.</p>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center"><IconShield stroke="#08110F" /></div>
          <div className="flex-1">
            <div className="font-semibold">{PLATFORM_NAME}</div>
            <div className="text-xs text-muted-foreground">Verified · CBN-aligned · CAC-registered</div>
          </div>
          <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Live</span>
        </div>

        {/* STEP 1: Pay via Telegram */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-sky-500/15 to-cyan-500/5 border border-border">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="w-6 h-6 rounded-full gradient-accent text-[#08110F] flex items-center justify-center text-[11px] font-bold">1</span>
            Pay via Telegram bot
          </div>
          <h3 className="mt-2 font-bold">Get payment account & voucher</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Open our Telegram payment bot. You'll receive bank account details for your chosen plan, and after payment a unique voucher code will be sent to you.
          </p>
          <a href={PAYMENT_BOT_URL} target="_blank" rel="noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full gradient-accent text-[#08110F] px-6 py-3 text-sm font-semibold">
            <IconTelegram width={18} height={18} /> Open Payment Bot
          </a>
          <div className="mt-3 text-[11px] text-muted-foreground">
            Support: <span className="font-semibold">{PLACEHOLDERS.supportHandle}</span>
          </div>
        </div>

        {/* STEP 2: Redeem voucher */}
        <div className="p-5 rounded-3xl bg-card border border-border">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="w-6 h-6 rounded-full gradient-accent text-[#08110F] flex items-center justify-center text-[11px] font-bold">2</span>
            Redeem your voucher
          </div>
          <h3 className="mt-2 font-bold">Activate your plan</h3>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. BASIC-DEMO-2026"
              className="flex-1 px-4 py-3 rounded-xl bg-input border border-border text-sm uppercase tracking-wider" />
            <button onClick={handleRedeem} className="rounded-xl gradient-accent text-[#08110F] px-6 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2">
              <IconGift stroke="#08110F" width={16} height={16} /> Redeem
            </button>
          </div>
          {error && <div className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">{error}</div>}
          {current.key !== "free" && !success && (
            <div className="mt-3 text-xs text-emerald-400">Active plan: <span className="font-semibold">{current.label}</span></div>
          )}
          {success && (
            <div className="mt-3 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2">
              {success.planLabel} activated. You can now claim daily from your dashboard.
            </div>
          )}
        </div>

        {/* Plan tiers */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Available Plans</h2>
            <span className="text-xs text-muted-foreground">{PAID_PLANS.length} TIERS</span>
          </div>
          <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PAID_PLANS.map((p) => {
              const totalClaim = p.dailyClaim * p.durationDays;
              return (
                <div key={p.key} className="p-5 rounded-2xl bg-card border border-border card-glow relative">
                  {p.badge && <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full gradient-accent text-[#08110F] text-[10px] font-bold">{p.badge}</span>}
                  <div className="font-bold text-lg">{p.short}</div>
                  <div className="text-xs text-muted-foreground">{p.label}</div>
                  <div className="mt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Deposit</span><span className="font-semibold">{fmtNGN(p.deposit)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Daily Claim</span><span className="font-semibold text-gold">{fmtNGN(p.dailyClaim)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Days</span><span className="font-semibold">{p.durationDays}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Total Claimable</span><span className="font-semibold text-emerald-400">{fmtNGN(totalClaim)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Min Withdrawal</span><span className="font-semibold">{fmtNGN(p.withdrawMin)}</span></div>
                    <div className="text-[11px] text-muted-foreground">≈ {fmtUSD(ngnToUsd(p.deposit, rate))} → {fmtUSD(ngnToUsd(totalClaim, rate))}</div>
                  </div>
                  <a href={PAYMENT_BOT_URL} target="_blank" rel="noreferrer"
                    className="mt-4 w-full inline-flex items-center justify-center rounded-full gradient-accent text-[#08110F] py-2.5 text-sm font-semibold">
                    Pay & Get {p.short} Voucher
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><IconShield width={14} height={14} /> Bank-grade security</span>
          <span className="inline-flex items-center gap-1.5"><IconBolt width={14} height={14} /> Daily claims</span>
          <span className="inline-flex items-center gap-1.5"><IconCheck width={14} height={14} /> Manual verification</span>
          <span className="inline-flex items-center gap-1.5"><IconLock width={14} height={14} /> Encrypted transactions</span>
          <span className="inline-flex items-center gap-1.5"><IconChart width={14} height={14} /> Audited returns</span>
          <Link to="/withdraw" className="inline-flex items-center gap-1.5 hover:text-foreground">→ Go to withdrawals</Link>
        </div>
      </div>
    </AppShell>
  );
}

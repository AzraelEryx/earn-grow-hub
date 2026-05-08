import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useRate } from "@/contexts/RateContext";
import { RateBadge } from "@/components/RateBadge";
import { fmtNGN, fmtUSD, ngnToUsd } from "@/lib/format";
import { NIGERIAN_BANKS } from "@/lib/mock";
import { IconArrowLeft, IconDollar, IconClose, IconCopy, IconCheck } from "@/components/icons";

export const Route = createFileRoute("/withdraw")({
  head: () => ({ meta: [{ title: "Withdraw — ChinexEarn" }] }),
  component: WithdrawPage,
});

function WithdrawPage() {
  const { user, loading } = useAuth();
  const { rate } = useRate();
  const nav = useNavigate();
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  const [tab, setTab] = useState<"with" | "without">("with");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);
  if (!user) return null;
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${user.referralCode}`;

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-5">
        <div className="flex items-center gap-3 mb-5">
          <Link to="/dashboard" className="w-10 h-10 rounded-full border border-border flex items-center justify-center"><IconArrowLeft /></Link>
          <div className="flex items-center gap-2"><IconDollar /><h1 className="text-xl font-bold">Withdraw Funds</h1></div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border">
          <div className="font-semibold text-sm mb-3">Choose your preferred currency</div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setCurrency("NGN")}
              className={`p-4 rounded-2xl border text-left ${currency === "NGN" ? "border-emerald-500 bg-emerald-500/10" : "border-border bg-secondary"}`}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">N</div>
                {currency === "NGN" && <IconCheck className="text-emerald-400" />}
              </div>
              <div className="mt-2 font-semibold text-sm">Nigerian Naira</div>
              <div className="text-xs text-muted-foreground">NGN</div>
            </button>
            <button onClick={() => setCurrency("USD")}
              className={`p-4 rounded-2xl border text-left ${currency === "USD" ? "border-blue-500 bg-blue-500/10" : "border-border bg-secondary"}`}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">$</div>
                {currency === "USD" && <IconCheck className="text-blue-400" />}
              </div>
              <div className="mt-2 font-semibold text-sm">US Dollar</div>
              <div className="text-xs text-muted-foreground">USD</div>
            </button>
          </div>
          <div className="mt-3"><RateBadge /></div>
        </div>

        <div className="mt-5 flex gap-2 p-1 bg-secondary rounded-full text-sm">
          <button onClick={() => setTab("with")} className={`flex-1 py-2 rounded-full font-medium ${tab === "with" ? "gradient-accent text-[#08110F]" : "text-muted-foreground"}`}>With Referrals</button>
          <button onClick={() => setTab("without")} className={`flex-1 py-2 rounded-full font-medium ${tab === "without" ? "gradient-accent text-[#08110F]" : "text-muted-foreground"}`}>Without Referrals</button>
        </div>

        {tab === "with" ? (
          <div className="mt-5 space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/5 border border-border text-sm">
              Invite 10 friends, complete 5 tasks and 5 claims to unlock withdrawals
            </div>
            <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
              {[
                { l: "Refer 10 Friends", v: 0, m: 10 },
                { l: "Complete 5 Tasks", v: 0, m: 5 },
                { l: "Make 5 Claims", v: 0, m: 5 },
              ].map((p) => (
                <div key={p.l}>
                  <div className="flex justify-between text-sm"><span>{p.l}</span><span className="text-muted-foreground">{p.v}/{p.m}</span></div>
                  <div className="mt-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full gradient-accent" style={{ width: `${(p.v / p.m) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border">
              <div className="text-xs text-muted-foreground mb-2">Your referral link</div>
              <div className="flex gap-2">
                <input readOnly value={link} className="flex-1 px-3 py-2.5 rounded-xl bg-input border border-border text-xs" />
                <button onClick={() => navigator.clipboard.writeText(link)} className="w-11 h-11 rounded-xl border border-border flex items-center justify-center"><IconCopy /></button>
              </div>
            </div>
            <button disabled className="w-full rounded-full bg-secondary text-muted-foreground py-3 text-sm font-semibold">Complete Requirements First</button>
            <button onClick={() => setShowForm(true)} className="w-full rounded-full border border-border py-3 text-sm font-medium">Open withdrawal form (preview)</button>
          </div>
        ) : (
          <div className="mt-5 p-5 rounded-2xl bg-card border border-border text-center">
            <div className="font-semibold">Top-Up Required</div>
            <p className="text-sm text-muted-foreground mt-1">Minimum top-up: {fmtNGN(5000)} ({fmtUSD(ngnToUsd(5000, rate))})</p>
            <button className="mt-4 rounded-full gradient-accent text-[#08110F] px-6 py-2.5 text-sm font-semibold">Top Up Now</button>
          </div>
        )}
      </div>

      {showForm && <WithdrawForm currency={currency} rate={rate} onClose={() => setShowForm(false)} />}
    </AppShell>
  );
}

function WithdrawForm({ currency, rate, onClose }: { currency: "NGN" | "USD"; rate: number; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const ngnEq = currency === "USD" ? Number(amount || 0) * rate : Number(amount || 0);
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface rounded-3xl border border-border p-6 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border flex items-center justify-center"><IconClose /></button>
        <h3 className="font-semibold text-lg">Withdrawal Request</h3>
        <div className="mt-5 space-y-3">
          <input placeholder="Account Number" className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm" />
          <select className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm">
            <option value="">Select Bank</option>
            {NIGERIAN_BANKS.map((b) => <option key={b}>{b}</option>)}
          </select>
          <input placeholder="Account Name" className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm" />
          <div>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder={`Amount in ${currency}`}
              className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm" />
            {currency === "USD" && amount && <div className="mt-1 text-xs text-muted-foreground">≈ {fmtNGN(ngnEq)}</div>}
          </div>
          <button onClick={onClose} className="w-full rounded-full gradient-accent text-[#08110F] py-3 text-sm font-semibold">Submit Request</button>
        </div>
      </div>
    </div>
  );
}

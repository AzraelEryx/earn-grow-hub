import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useRate } from "@/contexts/RateContext";
import { RateBadge } from "@/components/RateBadge";
import { fmtNGN, fmtUSD, ngnToUsd } from "@/lib/format";
import { NIGERIAN_BANKS } from "@/lib/mock";
import { getCurrentPlan, isWithdrawDayAllowed, DAY_NAMES, type UserPlan } from "@/lib/plan";
import { IconArrowLeft, IconDollar, IconClose, IconCheck, IconLock, IconShield } from "@/components/icons";

export const Route = createFileRoute("/withdraw")({
  head: () => ({ meta: [{ title: "Withdraw — Chixx9ja" }] }),
  component: WithdrawPage,
});

function WithdrawPage() {
  const { user, loading, balance, setBalance } = useAuth();
  const { rate } = useRate();
  const nav = useNavigate();
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState<{ amount: number; ref: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const plan = useMemo(() => getCurrentPlan(), []);

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);
  if (!user) return null;

  // ---- Free users are locked out ----
  if (plan.key === "free") {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3 mb-5">
            <Link to="/dashboard" className="w-10 h-10 rounded-full border border-border flex items-center justify-center"><IconArrowLeft /></Link>
            <div className="flex items-center gap-2"><IconDollar /><h1 className="text-xl font-bold">Withdraw Funds</h1></div>
          </div>

          <div className="p-7 rounded-3xl bg-card border border-border text-center relative overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-30" style={{ background: "radial-gradient(circle at 50% 0%, rgba(245,197,24,.4), transparent 70%)" }} />
            <div className="mx-auto w-16 h-16 rounded-full bg-gold/20 text-gold flex items-center justify-center">
              <IconLock />
            </div>
            <h2 className="mt-4 text-xl font-bold">Upgrade to Withdraw</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Withdrawals are only available to investors. Choose any verified investment plan to unlock secure payouts directly to your bank account.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-left">
              {[
                { t: "Verified", d: "CBN-aligned plans", Icon: IconShield },
                { t: "Higher ROI", d: "Up to 400% returns", Icon: IconCheck },
                { t: "Fast Payouts", d: "On chosen days", Icon: IconDollar },
              ].map((b) => (
                <div key={b.t} className="p-3 rounded-2xl bg-secondary border border-border">
                  <b.Icon /><div className="mt-2 text-xs font-semibold">{b.t}</div>
                  <div className="text-[11px] text-muted-foreground">{b.d}</div>
                </div>
              ))}
            </div>
            <Link to="/invest" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full gradient-accent text-[#08110F] px-7 py-3 text-sm font-semibold">
              View Investment Plans
            </Link>
            <div className="mt-3 text-xs text-muted-foreground">Your current plan: Free</div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ---- Paid users ----
  const dayOk = isWithdrawDayAllowed(plan);
  const allowedDayLabels = plan.withdrawDays.map((d) => DAY_NAMES[d]).join(", ");

  const submitWithdraw = (amount: number) => {
    setError(null);
    if (!amount || amount < plan.withdrawMin) {
      setError(`Minimum withdrawal for ${plan.label} is ${fmtNGN(plan.withdrawMin)}`);
      return;
    }
    if (amount > balance) {
      setError("Amount exceeds your available balance");
      return;
    }
    if (!dayOk) {
      setError(`Withdrawals on your plan are only allowed on: ${allowedDayLabels}`);
      return;
    }
    setBalance((b) => b - amount);
    setShowForm(false);
    setSuccess({ amount, ref: "TXN" + Date.now().toString().slice(-8) });
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-5">
        <div className="flex items-center gap-3 mb-5">
          <Link to="/dashboard" className="w-10 h-10 rounded-full border border-border flex items-center justify-center"><IconArrowLeft /></Link>
          <div className="flex items-center gap-2"><IconDollar /><h1 className="text-xl font-bold">Withdraw Funds</h1></div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Active Plan</div>
              <div className="font-bold">{plan.label}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${dayOk ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
              {dayOk ? "Withdraw Open" : "Closed Today"}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-secondary">
              <div className="text-[11px] text-muted-foreground">Min Withdrawal</div>
              <div className="font-semibold text-gold">{fmtNGN(plan.withdrawMin)}</div>
            </div>
            <div className="p-3 rounded-xl bg-secondary">
              <div className="text-[11px] text-muted-foreground">Allowed Days</div>
              <div className="font-semibold">{allowedDayLabels}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 p-5 rounded-2xl bg-card border border-border">
          <div className="font-semibold text-sm mb-3">Withdrawal Currency</div>
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

        <div className="mt-5 p-5 rounded-2xl bg-card border border-border">
          <div className="text-xs text-muted-foreground">Available Balance</div>
          <div className="mt-1 text-3xl font-extrabold text-gold">
            {currency === "NGN" ? fmtNGN(balance) : fmtUSD(ngnToUsd(balance, rate))}
          </div>
          <button onClick={() => setShowForm(true)}
            className="mt-4 w-full rounded-full gradient-accent text-[#08110F] py-3 text-sm font-semibold">
            Request Withdrawal
          </button>
          {!dayOk && (
            <p className="mt-3 text-xs text-amber-400 text-center">
              Today is not a payout day for your plan. Allowed: {allowedDayLabels}.
            </p>
          )}
        </div>
      </div>

      {showForm && (
        <WithdrawForm
          plan={plan}
          currency={currency}
          rate={rate}
          balance={balance}
          error={error}
          onClose={() => { setShowForm(false); setError(null); }}
          onSubmit={submitWithdraw}
        />
      )}

      {success && <WithdrawSuccessModal amount={success.amount} ref={success.ref} onClose={() => setSuccess(null)} />}
    </AppShell>
  );
}

function WithdrawForm({
  plan, currency, rate, balance, error, onClose, onSubmit,
}: {
  plan: UserPlan; currency: "NGN" | "USD"; rate: number; balance: number;
  error: string | null; onClose: () => void; onSubmit: (ngnAmount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const ngn = currency === "USD" ? Number(amount || 0) * rate : Number(amount || 0);
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface rounded-3xl border border-border p-6 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border flex items-center justify-center"><IconClose /></button>
        <h3 className="font-semibold text-lg">Withdrawal Request</h3>
        <div className="mt-1 text-xs text-muted-foreground">
          Plan {plan.label} · Min {fmtNGN(plan.withdrawMin)} · Balance {fmtNGN(balance)}
        </div>
        <div className="mt-5 space-y-3">
          <input placeholder="Account Number" className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm" />
          <select defaultValue="" className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm">
            <option value="" disabled>Select Bank</option>
            {NIGERIAN_BANKS.map((b) => <option key={b}>{b}</option>)}
          </select>
          <input placeholder="Account Name" className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm" />
          <div>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder={`Amount in ${currency}`}
              className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm" />
            {currency === "USD" && amount && <div className="mt-1 text-xs text-muted-foreground">≈ {fmtNGN(ngn)}</div>}
          </div>
          {error && <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">{error}</div>}
          <button onClick={() => onSubmit(Math.round(ngn))} className="w-full rounded-full gradient-accent text-[#08110F] py-3 text-sm font-semibold">Submit Request</button>
        </div>
      </div>
    </div>
  );
}

function WithdrawSuccessModal({ amount, ref, onClose }: { amount: number; ref: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface rounded-3xl border border-border p-7 text-center animate-slide-up overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,201,167,.5), transparent 70%)" }} />
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border flex items-center justify-center"><IconClose /></button>
        <div className="mx-auto w-20 h-20 rounded-full gradient-accent flex items-center justify-center">
          <IconCheck stroke="#08110F" strokeWidth={3} width={36} height={36} />
        </div>
        <div className="mt-5 text-xs uppercase tracking-[0.25em] text-muted-foreground">Payout Approved</div>
        <h3 className="mt-2 text-2xl font-bold">Withdrawal Successful</h3>
        <p className="mt-1 text-sm text-muted-foreground">Your funds are on the way to your bank.</p>
        <div className="mt-4 text-3xl font-extrabold text-gradient-accent">{fmtNGN(amount)}</div>
        <div className="mt-3 text-[11px] text-muted-foreground">Reference: {ref}</div>
        <button onClick={onClose} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full gradient-accent text-[#08110F] px-5 py-3 text-sm font-semibold">
          Done
        </button>
      </div>
    </div>
  );
}

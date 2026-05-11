import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useRate } from "@/contexts/RateContext";
import { RateBadge } from "@/components/RateBadge";
import { fmtNGN, fmtUSD, ngnToUsd } from "@/lib/format";
import { NIGERIAN_BANKS } from "@/lib/mock";
import {
  getCurrentPlan, isWithdrawDayAllowed, DAY_NAMES, getClaimState, claimedTodayAlready,
} from "@/lib/plan";
import { getBankDetails, saveBankDetails, type BankDetails } from "@/lib/bank";
import { logWithdrawalRequest } from "@/lib/stats";
import { IconArrowLeft, IconDollar, IconClose, IconCheck, IconShield, IconLock } from "@/components/icons";

export const Route = createFileRoute("/withdraw")({
  head: () => ({ meta: [{ title: "Withdraw — Chixx9ja" }] }),
  component: WithdrawPage,
});

const FREE_MIN_WITHDRAW = 10000;

function WithdrawPage() {
  const { user, loading, balance, setBalance } = useAuth();
  const { rate } = useRate();
  const nav = useNavigate();
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState<{ amount: number; ref: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const plan = useMemo(() => getCurrentPlan(), []);
  const claim = useMemo(() => getClaimState(), [showForm]);
  const claimedToday = claimedTodayAlready(claim);

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);
  if (!user) return null;

  const dayOk = isWithdrawDayAllowed(plan);
  const allowedDayLabels = plan.withdrawDays.length === 7 ? "Any day" : plan.withdrawDays.map((d) => DAY_NAMES[d]).join(", ");
  const minWithdraw = plan.key === "free" ? FREE_MIN_WITHDRAW : plan.withdrawMin;

  const submitWithdraw = (amount: number, bank: BankDetails) => {
    setError(null);
    if (!amount || amount < minWithdraw) {
      setError(`Minimum withdrawal is ${fmtNGN(minWithdraw)}`);
      return;
    }
    if (amount > balance) {
      setError("Amount exceeds your available balance");
      return;
    }
    if (!dayOk) {
      setError(`Today is not a payout day. Allowed: ${allowedDayLabels}.`);
      return;
    }
    if (plan.key !== "free" && !claimedToday) {
      setError("You must claim today from your investment plan before requesting withdrawal.");
      return;
    }
    saveBankDetails(bank);
    setBalance((b) => b - amount);
    // Log txn
    try {
      const list = JSON.parse(localStorage.getItem("txns_v1") || "[]");
      list.unshift({ id: crypto.randomUUID(), ts: Date.now(), type: "debit", name: "Withdrawal request", amount });
      localStorage.setItem("txns_v1", JSON.stringify(list));
    } catch {}
    const rec = logWithdrawalRequest({
      user: user.name, email: user.email, amount,
      bank: bank.bank, accountNumber: bank.accountNumber, accountName: bank.accountName,
    });
    setShowForm(false);
    setSuccess({ amount, ref: "TXN" + rec.id.slice(0, 8).toUpperCase() });
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
              <div className="font-semibold text-gold">{fmtNGN(minWithdraw)}</div>
            </div>
            <div className="p-3 rounded-xl bg-secondary">
              <div className="text-[11px] text-muted-foreground">Allowed Days</div>
              <div className="font-semibold">{allowedDayLabels}</div>
            </div>
          </div>
          {plan.key !== "free" && (
            <div className={`mt-3 text-xs px-3 py-2 rounded-xl border ${claimedToday ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-amber-500/30 bg-amber-500/10 text-amber-400"}`}>
              {claimedToday ? "You have claimed today — eligible to withdraw." : "Claim today's plan amount before withdrawing."}
            </div>
          )}
          {plan.key === "free" && (
            <div className="mt-3 p-3 rounded-xl border border-border bg-secondary text-xs">
              <div className="font-semibold flex items-center gap-2"><IconLock width={14} height={14} /> Free tier withdrawal</div>
              <div className="text-muted-foreground mt-1">
                Free users can withdraw once balance reaches {fmtNGN(FREE_MIN_WITHDRAW)}. Upgrade for higher limits & daily claims.
              </div>
              <Link to="/invest" className="mt-2 inline-flex items-center gap-1 text-primary"><IconShield width={12} height={12} /> View plans →</Link>
            </div>
          )}
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
              Today is not a payout day. Allowed: {allowedDayLabels}.
            </p>
          )}
        </div>
      </div>

      {showForm && (
        <WithdrawForm
          minWithdraw={minWithdraw}
          currency={currency}
          rate={rate}
          balance={balance}
          error={error}
          onClose={() => { setShowForm(false); setError(null); }}
          onSubmit={submitWithdraw}
        />
      )}

      {success && <WithdrawSuccessModal amount={success.amount} txnRef={success.ref} onClose={() => setSuccess(null)} />}
    </AppShell>
  );
}

function WithdrawForm({
  minWithdraw, currency, rate, balance, error, onClose, onSubmit,
}: {
  minWithdraw: number; currency: "NGN" | "USD"; rate: number; balance: number;
  error: string | null; onClose: () => void; onSubmit: (ngnAmount: number, bank: BankDetails) => void;
}) {
  const saved = getBankDetails();
  const [accountName, setAccountName] = useState(saved?.accountName || "");
  const [accountNumber, setAccountNumber] = useState(saved?.accountNumber || "");
  const [bank, setBank] = useState(saved?.bank || "");
  const [amount, setAmount] = useState("");
  const ngn = currency === "USD" ? Number(amount || 0) * rate : Number(amount || 0);

  const submit = () => {
    if (!accountName.trim() || !accountNumber.trim() || !bank) return;
    onSubmit(Math.round(ngn), { accountName: accountName.trim(), accountNumber: accountNumber.trim(), bank });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface rounded-3xl border border-border p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border flex items-center justify-center"><IconClose /></button>
        <h3 className="font-semibold text-lg">Withdrawal Request</h3>
        <div className="mt-1 text-xs text-muted-foreground">
          Min {fmtNGN(minWithdraw)} · Balance {fmtNGN(balance)}
        </div>
        {saved && <div className="mt-2 text-[11px] text-emerald-400">Bank details auto-filled from your profile.</div>}
        <div className="mt-5 space-y-3">
          <input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Account Name"
            className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm" />
          <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Account Number"
            inputMode="numeric"
            className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm" />
          <select value={bank} onChange={(e) => setBank(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm">
            <option value="" disabled>Select Bank</option>
            {NIGERIAN_BANKS.map((b) => <option key={b}>{b}</option>)}
          </select>
          <div>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder={`Amount in ${currency}`}
              className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm" />
            {currency === "USD" && amount && <div className="mt-1 text-xs text-muted-foreground">≈ {fmtNGN(ngn)}</div>}
          </div>
          {error && <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">{error}</div>}
          <button onClick={submit}
            disabled={!accountName.trim() || !accountNumber.trim() || !bank || !amount}
            className="w-full rounded-full gradient-accent text-[#08110F] py-3 text-sm font-semibold disabled:opacity-50">Submit Request</button>
          <p className="text-[11px] text-muted-foreground text-center">Your bank details will be saved for next time. Edit anytime in Profile.</p>
        </div>
      </div>
    </div>
  );
}

function WithdrawSuccessModal({ amount, txnRef, onClose }: { amount: number; txnRef: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface rounded-3xl border border-border p-7 text-center animate-slide-up overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,201,167,.5), transparent 70%)" }} />
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border flex items-center justify-center"><IconClose /></button>
        <div className="mx-auto w-20 h-20 rounded-full gradient-accent flex items-center justify-center">
          <IconCheck stroke="#08110F" strokeWidth={3} width={36} height={36} />
        </div>
        <div className="mt-5 text-xs uppercase tracking-[0.25em] text-muted-foreground">Request Approved</div>
        <h3 className="mt-2 text-2xl font-bold">Withdrawal Approved</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your request has been forwarded to our payments team. You'll receive payment within 24 hours on the next payout day.
        </p>
        <div className="mt-4 text-3xl font-extrabold text-gradient-accent">{fmtNGN(amount)}</div>
        <div className="mt-3 text-[11px] text-muted-foreground">Reference: {txnRef}</div>
        <button onClick={onClose} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full gradient-accent text-[#08110F] px-5 py-3 text-sm font-semibold">Done</button>
      </div>
    </div>
  );
}

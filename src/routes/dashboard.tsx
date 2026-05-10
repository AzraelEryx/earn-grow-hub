import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell, ThemeToggle } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useRate } from "@/contexts/RateContext";
import { RateBadge } from "@/components/RateBadge";
import { fmtNGN, fmtUSD, ngnToUsd, maskName, timeAgo } from "@/lib/format";
import { randAmount, randName, PLACEHOLDERS } from "@/lib/mock";
import {
  IconBell, IconWallet, IconFlame, IconLock, IconCheck, IconGift, IconCopy,
  IconUsers, IconHistory, IconSpin, IconBolt, IconTrophy, IconArrowRight,
  IconTelegram, IconWhatsapp, IconInstagram, IconLinkedin, IconTiktok, IconClose,
} from "@/components/icons";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Chixx9ja" }] }),
  component: DashboardPage,
});

const DAILY_KEY = "daily_claim_v1";
const MICRO_KEY = "micro_claim_v1";
const TXNS_KEY = "txns_v1";
const DAILY_AMOUNT = 2000;
const MICRO_AMOUNT = 200;
const MICRO_INTERVAL_MS = 30 * 60 * 1000;
const MICRO_DAILY_MAX = 10;

function getDayStart() {
  const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime();
}

function pushTxn(t: { type: "credit" | "debit"; name: string; amount: number }) {
  const list = (() => { try { return JSON.parse(localStorage.getItem(TXNS_KEY) || "[]"); } catch { return []; } })();
  list.unshift({ id: crypto.randomUUID(), ts: Date.now(), ...t });
  localStorage.setItem(TXNS_KEY, JSON.stringify(list.slice(0, 200)));
}

function DashboardPage() {
  const { user, balance, setBalance, loading } = useAuth();
  const { rate } = useRate();
  const nav = useNavigate();
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  const [claimPopup, setClaimPopup] = useState<{ amount: number; label: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);

  if (!user) return null;
  const greet = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  })();

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full gradient-accent flex items-center justify-center text-[#08110F] font-bold">
              {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{greet},</div>
              <div className="font-semibold leading-tight">{user.name.split(" ")[0]}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center"><IconBell /></button>
            <ThemeToggle />
          </div>
        </div>

        <FloatingPaidNotice />

        {/* Balance card */}
        <div className="relative overflow-hidden p-5 rounded-3xl bg-card border border-border card-glow">
          <div className="absolute inset-0 -z-10 opacity-30" style={{
            background: "radial-gradient(circle at 80% 20%, rgba(0,201,167,.4), transparent 60%)"
          }}/>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <IconWallet width={14} height={14} /> Total Balance
            </div>
            <div className="flex rounded-full bg-secondary p-0.5 text-xs">
              {(["NGN", "USD"] as const).map((c) => (
                <button key={c} onClick={() => setCurrency(c)}
                  className={`px-3 py-1 rounded-full ${currency === c ? "gradient-accent text-[#08110F] font-semibold" : "text-muted-foreground"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 text-4xl font-extrabold text-gold">
            {currency === "NGN" ? fmtNGN(balance) : fmtUSD(ngnToUsd(balance, rate))}
          </div>
          <div className="mt-2"><RateBadge /></div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className="rounded-full border border-border py-2.5 text-sm font-medium hover:border-primary/50">Top-Up</button>
            <Link to="/invest" className="rounded-full gradient-accent text-[#08110F] py-2.5 text-sm font-semibold text-center">Upgrade</Link>
          </div>
        </div>

        <DailyClaim onClaim={(amount) => { setBalance((b) => b + amount); pushTxn({ type: "credit", name: "Daily claim", amount }); setClaimPopup({ amount, label: "Daily Claim" }); }} />

        <MicroClaim onClaim={(amount) => { setBalance((b) => b + amount); pushTxn({ type: "credit", name: "30-min claim", amount }); setClaimPopup({ amount, label: "30-Minute Claim" }); }} />

        {/* Status + Withdraw */}
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-3 rounded-full bg-secondary text-sm font-medium">Status</button>
          <Link to="/withdraw" className="flex-1 px-4 py-3 rounded-full gradient-accent text-[#08110F] text-sm font-semibold text-center">Withdraw</Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {([
            { to: "/referrals", t: "Refer & Earn", icon: IconUsers, tint: "from-teal-500/30 to-teal-500/5" },
            { to: "/tasks", t: "Daily Tasks", icon: IconBell, tint: "from-blue-500/30 to-blue-500/5" },
            { to: "/history", t: "History", icon: IconHistory, tint: "from-purple-500/30 to-purple-500/5" },
            { to: "/profile", t: "Spin & Win", icon: IconSpin, tint: "from-amber-500/30 to-amber-500/5" },
          ] as const).map((q, i) => {
            const Icon = q.icon;
            return (
              <Link key={i} to={q.to}
                className={`p-4 rounded-2xl border border-border bg-gradient-to-br ${q.tint} card-glow text-left`}>
                <Icon />
                <div className="mt-3 font-semibold text-sm">{q.t}</div>
              </Link>
            );
          })}
        </div>

        <Link to="/tasks" className="block text-sm text-primary text-center">View Daily Tasks</Link>

        <Achievements />

        <LiveActivity />

        <ReferralSection user={user} />
      </div>
      {claimPopup && <ClaimSuccessModal amount={claimPopup.amount} label={claimPopup.label} onClose={() => setClaimPopup(null)} />}
    </AppShell>
  );
}

function ClaimSuccessModal({ amount, label, onClose }: { amount: number; label: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface rounded-3xl border border-border p-7 text-center animate-slide-up overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,201,167,.5), transparent 70%)" }} />
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border flex items-center justify-center"><IconClose /></button>
        <div className="relative mx-auto w-20 h-20">
          <span className="absolute inset-0 rounded-full gradient-accent animate-pulse-ring opacity-60" />
          <span className="absolute inset-0 rounded-full gradient-accent animate-pulse-ring opacity-60" style={{ animationDelay: ".5s" }} />
          <div className="relative w-20 h-20 rounded-full gradient-accent flex items-center justify-center">
            <IconCheck stroke="#08110F" strokeWidth={3} width={36} height={36} />
          </div>
        </div>
        <div className="mt-5 text-xs uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
        <h3 className="mt-2 text-2xl font-bold">Claim Successful</h3>
        <p className="mt-1 text-sm text-muted-foreground">You've earned</p>
        <div className="mt-2 text-4xl font-extrabold text-gradient-accent">{fmtNGN(amount)}</div>
        <p className="mt-3 text-xs text-muted-foreground">Credited to your balance instantly.</p>
        <button onClick={onClose} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full gradient-accent text-[#08110F] px-5 py-3 text-sm font-semibold">
          Continue
        </button>
      </div>
    </div>
  );
}

function FloatingPaidNotice() {
  const list = useMemo(() => Array.from({ length: 8 }, () => ({ name: randName(), amount: randAmount(50000, 800000) })), []);
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((x) => (x + 1) % list.length), 4000); return () => clearInterval(id); }, [list.length]);
  const cur = list[i];
  return (
    <div className="hidden sm:flex fixed top-4 right-4 z-40 items-center gap-3 px-4 py-2.5 rounded-2xl bg-surface/95 backdrop-blur border border-border shadow-lg animate-fade-in">
      <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-[#08110F] text-xs font-bold">
        {cur.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
      </div>
      <div className="text-xs">
        <div className="font-medium">{cur.name} just withdrew</div>
        <div className="text-gradient-accent font-semibold">{fmtNGN(cur.amount)}</div>
      </div>
      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-semibold uppercase tracking-wider">Paid</span>
    </div>
  );
}

function DailyCheckin({ onClaim }: { onClaim: (amount: number, day: number) => void }) {
  const [state, setState] = useState<{ day: number; lastTs: number }>({ day: 1, lastTs: 0 });
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(CHECKIN_KEY) || "null");
      if (s) {
        // reset if more than 48h missed
        if (Date.now() - s.lastTs > 48 * 3600 * 1000) setState({ day: 1, lastTs: 0 });
        else setState(s);
      }
    } catch {}
  }, []);
  const todayStart = getDayStart();
  const claimedToday = state.lastTs >= todayStart;
  const currentDay = Math.min(state.day, 7);
  const amount = checkinAmounts[currentDay - 1];
  const handle = () => {
    if (claimedToday) return;
    const next = { day: currentDay >= 7 ? 1 : currentDay + 1, lastTs: Date.now() };
    setState(next);
    localStorage.setItem(CHECKIN_KEY, JSON.stringify(next));
    onClaim(amount, currentDay);
  };
  return (
    <div className="p-5 rounded-3xl bg-card border border-border">
      <div className="flex items-center gap-2 text-sm font-semibold"><IconFlame /> Daily Check-In</div>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }, (_, i) => i + 1).map((d) => {
          const unlocked = d < currentDay || (d === currentDay && claimedToday);
          const isCurrent = d === currentDay && !claimedToday;
          return (
            <div key={d} className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${unlocked ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : isCurrent ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                {unlocked ? <IconCheck width={16} height={16} /> : isCurrent ? <span className="text-xs font-bold">{d}</span> : <IconLock width={14} height={14} />}
              </div>
              <span className="text-[10px] text-muted-foreground">D{d}</span>
            </div>
          );
        })}
      </div>
      <button onClick={handle} disabled={claimedToday}
        className="mt-4 w-full rounded-full py-3 text-sm font-semibold text-[#08110F] disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #F59E0B, #F5C518)" }}>
        {claimedToday ? `Day ${currentDay} claimed — come back tomorrow` : `Check In (Day ${currentDay}) — ${fmtNGN(amount)}`}
      </button>
    </div>
  );
}

function ClaimSection({ onClaim }: { onClaim: () => void }) {
  const [state, setState] = useState<{ count: number; ts: number }>({ count: 0, ts: 0 });
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(CLAIMS_KEY) || "null");
      if (s) {
        if (s.ts < getDayStart()) setState({ count: 0, ts: getDayStart() });
        else setState(s);
      }
    } catch {}
  }, []);
  const handle = () => {
    if (state.count >= 30) return;
    const next = { count: state.count + 1, ts: getDayStart() };
    setState(next); localStorage.setItem(CLAIMS_KEY, JSON.stringify(next));
    onClaim();
  };
  return (
    <div className="p-5 rounded-3xl bg-card border border-border flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center"><IconGift stroke="#08110F" /></div>
      <div className="flex-1">
        <div className="font-semibold">Claim {fmtNGN(2000)}</div>
        <div className="text-xs text-muted-foreground">{state.count}/30 claims today</div>
      </div>
      <button onClick={handle} disabled={state.count >= 30}
        className="px-5 py-2.5 rounded-full bg-emerald-500 text-emerald-950 text-sm font-semibold disabled:opacity-50">
        Claim
      </button>
    </div>
  );
}

function Achievements() {
  const [open, setOpen] = useState(false);
  const badges = [
    "First Login","First Referral","First Withdrawal","10 Referrals","25 Referrals",
    "First Investment","Daily Streak 7","Task Master","Top Earner","Verified",
  ];
  return (
    <>
      <button onClick={() => setOpen(true)} className="w-full p-4 rounded-2xl bg-card border border-border flex items-center gap-3 card-glow text-left">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400"><IconTrophy /></div>
        <div className="flex-1">
          <div className="font-semibold text-sm">Achievements</div>
          <div className="text-xs text-muted-foreground">0/10 badges unlocked</div>
        </div>
        <IconArrowRight />
      </button>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md bg-surface rounded-3xl border border-border p-5 animate-slide-up">
            <div className="flex items-center justify-between"><h3 className="font-semibold">Achievements</h3>
              <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full border border-border flex items-center justify-center"><IconClose /></button></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {badges.map((b) => (
                <div key={b} className="p-4 rounded-2xl bg-card border border-border text-center opacity-60">
                  <div className="mx-auto w-10 h-10 rounded-full bg-secondary flex items-center justify-center"><IconLock width={16} height={16} /></div>
                  <div className="mt-2 text-xs font-medium">{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LiveActivity() {
  const [feed, setFeed] = useState(() =>
    Array.from({ length: 5 }, () => ({ name: randName(), action: ["claimed", "withdrew", "earned bonus"][Math.floor(Math.random() * 3)], amount: randAmount(10000, 200000), ts: Date.now() - Math.random() * 60 * 60 * 1000 }))
  );
  useEffect(() => { const id = setInterval(() => setFeed((f) => [{ name: randName(), action: "withdrew", amount: randAmount(50000, 400000), ts: Date.now() }, ...f.slice(0, 4)]), 3000); return () => clearInterval(id); }, []);
  return (
    <div className="p-5 rounded-3xl bg-card border border-border">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Activity
      </div>
      <div className="mt-3 divide-y divide-border">
        {feed.map((f, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 animate-fade-in">
            <div>
              <div className="text-sm font-medium">{maskName(f.name)}</div>
              <div className="text-xs text-muted-foreground capitalize">{f.action} · {timeAgo(f.ts)}</div>
            </div>
            <div className="text-sm font-semibold text-gradient-accent">{fmtNGN(f.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferralSection({ user }: { user: { referralCode: string; name: string } }) {
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${user.referralCode}`;
  const copy = () => { navigator.clipboard.writeText(link); };
  const copyAll = () => {
    const msg = `Hey, join ${"Chixx9ja"} and get ${fmtNGN(PLACEHOLDERS.welcomeBonus)} welcome bonus. Use my code ${user.referralCode} or sign up here: ${link}`;
    navigator.clipboard.writeText(msg);
  };
  const shareOn = (url: string) => window.open(url, "_blank");
  return (
    <div className="p-5 rounded-3xl bg-card border border-border">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Total Referrals</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Per Referral</div>
          <div className="text-2xl font-bold text-gold">{fmtNGN(PLACEHOLDERS.perReferral)}</div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <input readOnly value={link} className="flex-1 px-3 py-2.5 rounded-xl bg-input border border-border text-xs" />
        <button onClick={copy} className="w-11 h-11 rounded-xl border border-border flex items-center justify-center"><IconCopy /></button>
      </div>
      <button onClick={copyAll} className="mt-3 w-full rounded-full gradient-accent text-[#08110F] py-3 text-sm font-semibold">Copy Link, Code & Message</button>
      <div className="mt-4 flex items-center justify-around">
        {[
          { Icon: IconTelegram, url: `https://t.me/share/url?url=${encodeURIComponent(link)}` },
          { Icon: IconWhatsapp, url: `https://wa.me/?text=${encodeURIComponent(link)}` },
          { Icon: IconInstagram, url: "https://instagram.com" },
          { Icon: IconLinkedin, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}` },
          { Icon: IconTiktok, url: "https://tiktok.com" },
        ].map(({ Icon, url }, i) => (
          <button key={i} onClick={() => shareOn(url)}
            className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:border-primary/50">
            <Icon />
          </button>
        ))}
      </div>
    </div>
  );
}

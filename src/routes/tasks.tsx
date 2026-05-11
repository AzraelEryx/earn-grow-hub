import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { fmtNGN } from "@/lib/format";
import { getInviteCount } from "@/lib/plan";
import { PLACEHOLDERS } from "@/lib/mock";
import { IconArrowLeft, IconCheck } from "@/components/icons";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Daily Tasks — Chixx9ja" }] }),
  component: TasksPage,
});

const TASKS = [
  { id: "tg1",     t: "Join Telegram Channel",     d: "Get instant payment proofs",      r: 200, u: PLACEHOLDERS.telegram1 },
  { id: "wa",      t: "Join WhatsApp Channel",     d: "Daily updates & tips",            r: 200, u: PLACEHOLDERS.whatsapp },
  { id: "profile", t: "Complete Profile",          d: "Add your bank details",           r: 150, u: "/profile" },
  { id: "checkin", t: "Daily Check-In",            d: "Open the app today",              r: 50,  u: "/dashboard" },
  { id: "ig",      t: "Follow on Instagram",       d: "Follow our page",                 r: 100, u: "https://instagram.com" },
  { id: "fb",      t: "Like Facebook Page",        d: "Like our page",                   r: 100, u: "https://facebook.com" },
  { id: "tt",      t: "Follow on TikTok",          d: "Follow us",                       r: 100, u: "https://tiktok.com" },
  { id: "stg",     t: "Share on Telegram",         d: "Share your invite",               r: 100, u: "https://t.me" },
  { id: "sig",     t: "Share Instagram Story",     d: "Story share",                     r: 100, u: "https://instagram.com" },
  { id: "yt",      t: "Watch YouTube Video",       d: "Watch our latest video",          r: 100, u: "https://youtube.com" },
  { id: "subyt",   t: "Subscribe on YouTube",      d: "Hit subscribe",                   r: 150, u: "https://youtube.com" },
  { id: "tgg",     t: "Join Telegram Group",       d: "Join the discussion",             r: 100, u: "https://t.me" },
  { id: "i3",      t: "Invite 3 Friends Today",    d: "Send 3 invites",                  r: 200, u: "/referrals" },
  { id: "i5",      t: "Refer 5 Friends",           d: "Auto-completes when you reach 5", r: 3000, u: "/referrals", auto: true },
];

const KEY = "tasks_v1";
function dayStart() { const d = new Date(); d.setHours(0,0,0,0); return d.getTime(); }

function TasksPage() {
  const { user, setBalance, loading } = useAuth();
  const nav = useNavigate();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const invites = useMemo(() => getInviteCount(), []);

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s && s.ts >= dayStart()) setDone(s.done);
    } catch {}
  }, []);

  // Auto-complete "refer 5 friends" if invites >= 5 and not done today
  useEffect(() => {
    if (invites >= 5 && !done["i5"]) {
      const next = { ...done, i5: true };
      setDone(next);
      localStorage.setItem(KEY, JSON.stringify({ ts: dayStart(), done: next }));
      setBalance((b) => b + 3000);
      try {
        const list = JSON.parse(localStorage.getItem("txns_v1") || "[]");
        list.unshift({ id: crypto.randomUUID(), ts: Date.now(), type: "credit", name: "Refer 5 friends bonus", amount: 3000 });
        localStorage.setItem("txns_v1", JSON.stringify(list));
      } catch {}
    }
  }, [invites, done, setBalance]);

  const complete = (id: string, reward: number) => {
    if (done[id]) return;
    const next = { ...done, [id]: true };
    setDone(next); localStorage.setItem(KEY, JSON.stringify({ ts: dayStart(), done: next }));
    setBalance((b) => b + reward);
    try {
      const list = JSON.parse(localStorage.getItem("txns_v1") || "[]");
      list.unshift({ id: crypto.randomUUID(), ts: Date.now(), type: "credit", name: TASKS.find((t) => t.id === id)?.t || "Task", amount: reward });
      localStorage.setItem("txns_v1", JSON.stringify(list));
    } catch {}
  };

  const completedCount = Object.values(done).filter(Boolean).length;

  if (!user) return null;
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-5">
        <div className="flex items-center gap-3 mb-5">
          <Link to="/dashboard" className="w-10 h-10 rounded-full border border-border flex items-center justify-center"><IconArrowLeft /></Link>
          <h1 className="text-xl font-bold">Daily Tasks</h1>
        </div>
        <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-border">
          <div className="font-semibold">Earn Extra Rewards</div>
          <p className="text-sm text-muted-foreground mt-1">Tasks reset every 24 hours. Small daily wins add up fast.</p>
          <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full gradient-accent transition-all" style={{ width: `${(completedCount / TASKS.length) * 100}%` }} />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">{completedCount}/{TASKS.length}</div>
        </div>

        <div className="mt-5 space-y-3">
          {TASKS.map((t) => {
            const isDone = done[t.id];
            return (
              <div key={t.id} className={`p-4 rounded-2xl bg-card border border-border flex items-center gap-4 ${isDone ? "opacity-60" : "card-glow"}`}>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{t.t}</div>
                  <div className="text-xs text-muted-foreground">{t.d}</div>
                  <div className="text-xs text-gold font-semibold mt-0.5">{fmtNGN(t.r)}</div>
                </div>
                {isDone ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><IconCheck /></div>
                ) : t.auto ? (
                  <div className="text-[11px] text-muted-foreground text-right">{invites}/5<br/>invites</div>
                ) : (
                  <button onClick={() => { window.open(t.u, "_blank"); complete(t.id, t.r); }}
                    className="px-4 py-2 rounded-full gradient-accent text-[#08110F] text-xs font-semibold">Start</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

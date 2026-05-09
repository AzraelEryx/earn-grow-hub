import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { fmtNGN } from "@/lib/format";
import { IconArrowLeft, IconCheck } from "@/components/icons";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Daily Tasks — Chixx9ja" }] }),
  component: TasksPage,
});

const TASKS = [
  { id: "tg1", t: "Join Telegram Channel", d: "Get instant payment proofs", r: 5000, u: "https://t.me/chinex0i" },
  { id: "tg2", t: "Join Telegram Channel 2", d: "Community channel", r: 5000, u: "https://t.me/chinex0i" },
  { id: "profile", t: "Complete Profile", d: "Add your details", r: 2000, u: "/profile" },
  { id: "ref1", t: "Make First Referral", d: "Invite a friend", r: 10000, u: "/referrals" },
  { id: "checkin", t: "Daily Check-In", d: "Open the app today", r: 1000, u: "/dashboard" },
  { id: "ig", t: "Follow on Instagram", d: "Follow our page", r: 3000, u: "https://instagram.com" },
  { id: "x", t: "Follow on X (Twitter)", d: "Follow our handle", r: 3000, u: "https://x.com" },
  { id: "fb", t: "Like Facebook Page", d: "Like our page", r: 3000, u: "https://facebook.com" },
  { id: "tt", t: "Follow on TikTok", d: "Follow us", r: 3000, u: "https://tiktok.com" },
  { id: "stg", t: "Share on Telegram", d: "Share invite", r: 2000, u: "https://t.me" },
  { id: "sig", t: "Share Instagram Story", d: "Story share", r: 2000, u: "https://instagram.com" },
  { id: "yt", t: "Watch YouTube Video", d: "Watch our video", r: 2500, u: "https://youtube.com" },
  { id: "subyt", t: "Subscribe on YouTube", d: "Hit subscribe", r: 3000, u: "https://youtube.com" },
  { id: "tgg", t: "Join Telegram Group", d: "Join the group", r: 2000, u: "https://t.me" },
  { id: "rx", t: "Repost on X", d: "Repost our pinned tweet", r: 2000, u: "https://x.com" },
  { id: "cfb", t: "Comment on Facebook Post", d: "Drop a comment", r: 1500, u: "https://facebook.com" },
  { id: "i3", t: "Invite 3 Friends Today", d: "Send 3 invites", r: 5000, u: "/referrals" },
  { id: "rate", t: "Rate Our App", d: "Leave a rating", r: 1500, u: "https://play.google.com" },
];

const KEY = "tasks_v1";
function dayStart() { const d = new Date(); d.setHours(0,0,0,0); return d.getTime(); }

function TasksPage() {
  const { user, setBalance, loading } = useAuth();
  const nav = useNavigate();
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s && s.ts >= dayStart()) setDone(s.done);
    } catch {}
  }, []);

  const complete = (id: string, reward: number) => {
    if (done[id]) return;
    const next = { ...done, [id]: true };
    setDone(next); localStorage.setItem(KEY, JSON.stringify({ ts: dayStart(), done: next }));
    setBalance((b) => b + reward);
    const list = (() => { try { return JSON.parse(localStorage.getItem("txns_v1") || "[]"); } catch { return []; } })();
    list.unshift({ id: crypto.randomUUID(), ts: Date.now(), type: "credit", name: TASKS.find((t) => t.id === id)?.t || "Task", amount: reward });
    localStorage.setItem("txns_v1", JSON.stringify(list));
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
          <p className="text-sm text-muted-foreground mt-1">Tasks reset every 24 hours</p>
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

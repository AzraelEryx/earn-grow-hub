import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { fmtNGN } from "@/lib/format";
import { PLACEHOLDERS } from "@/lib/mock";
import { getInviteCount } from "@/lib/plan";
import { IconArrowLeft, IconGift, IconUsers, IconBolt, IconChart, IconCopy, IconShare } from "@/components/icons";
import { ShareModal, buildReferralLink } from "@/components/ShareModal";
import { showToast } from "@/components/Toast";

export const Route = createFileRoute("/referrals")({
  head: () => ({ meta: [{ title: "Refer & Earn — Chixx9ja" }] }),
  component: ReferralsPage,
});

type LeaderRow = { name: string; refs: number; earned: number };

function getLeaderboard(perInvite: number): LeaderRow[] {
  if (typeof window === "undefined") return [];
  try {
    const db = JSON.parse(localStorage.getItem("users_db_v1") || "{}");
    const counts: Record<string, { name: string; refs: number }> = {};
    for (const key of Object.keys(db)) {
      const u = db[key]?.user;
      if (!u) continue;
      const refs = u.referralsCount || 0;
      counts[u.id] = { name: u.name, refs };
    }
    // Add self if has invites
    const self = parseInt(localStorage.getItem("invites_v1") || "0", 10) || 0;
    const me = JSON.parse(localStorage.getItem("auth_user_v1") || "null");
    if (me && self > 0) {
      counts[me.id] = { name: me.name + " (you)", refs: self };
    }
    return Object.values(counts)
      .filter((r) => r.refs > 0)
      .sort((a, b) => b.refs - a.refs)
      .slice(0, 20)
      .map((r) => ({ ...r, earned: r.refs * perInvite }));
  } catch { return []; }
}

function ReferralsPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"invite" | "leaders">("invite");
  const [share, setShare] = useState(false);
  const invites = useMemo(() => getInviteCount(), []);
  const perInvite = PLACEHOLDERS.perReferral;
  const totalEarned = invites * perInvite;
  const leaders = useMemo(() => getLeaderboard(perInvite), [perInvite, tab]);

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);
  if (!user) return null;
  const link = buildReferralLink(user.referralCode);
  const message = `Join Chixx9ja and earn ${fmtNGN(PLACEHOLDERS.welcomeBonus)} welcome bonus. Use my code ${user.referralCode}.`;
  const copy = async () => { try { await navigator.clipboard.writeText(link); showToast("Link copied"); } catch {} };
  const milestones = [{ t: 5, r: 3000 }, { t: 10, r: 8000 }, { t: 25, r: 25000 }, { t: 50, r: 60000 }];

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-5">
        <div className="flex items-center gap-3 mb-5">
          <Link to="/dashboard" className="w-10 h-10 rounded-full border border-border flex items-center justify-center"><IconArrowLeft /></Link>
          <div className="flex items-center gap-2"><IconGift /><h1 className="text-xl font-bold">Refer & Earn</h1></div>
        </div>
        <p className="text-sm text-muted-foreground -mt-3">Invite friends, earn rewards</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { Icon: IconUsers, l: "Total Referrals", v: String(invites) },
            { Icon: IconBolt, l: "Per Invite", v: fmtNGN(perInvite) },
            { Icon: IconChart, l: "Total Earned", v: fmtNGN(totalEarned) },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-2xl bg-card border border-border">
              <s.Icon /><div className="mt-2 text-[11px] text-muted-foreground">{s.l}</div>
              <div className="font-bold text-sm sm:text-base">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-2 p-1 bg-secondary rounded-full text-sm">
          {(["invite", "leaders"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-full font-medium capitalize ${tab === t ? "gradient-accent text-[#08110F]" : "text-muted-foreground"}`}>{t}</button>
          ))}
        </div>

        {tab === "invite" ? (
          <div className="mt-5 space-y-5">
            <div className="p-4 rounded-2xl bg-card border border-border">
              <div className="text-xs text-muted-foreground">Your referral link</div>
              <div className="mt-2 flex gap-2">
                <input readOnly value={link} className="flex-1 px-3 py-2.5 rounded-xl bg-input border border-border text-xs" />
                <button onClick={copy} className="w-11 h-11 rounded-xl border border-border flex items-center justify-center" title="Copy"><IconCopy /></button>
                <button onClick={() => setShare(true)} className="w-11 h-11 rounded-xl gradient-accent text-[#08110F] flex items-center justify-center" title="Share"><IconShare stroke="#08110F" /></button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-border">
              <div className="font-semibold">Boost your earnings</div>
              <p className="text-sm text-muted-foreground mt-1">Refer 5 friends and earn N3,000 bonus instantly.</p>
              <Link to="/invest" className="mt-3 inline-flex items-center justify-center px-5 py-2.5 rounded-full gradient-accent text-[#08110F] text-sm font-semibold">Upgrade for daily claims</Link>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold">How It Works</h3>
              <ol className="mt-3 space-y-3 text-sm">
                {[
                  "Share your unique referral link",
                  `They sign up and get ${fmtNGN(PLACEHOLDERS.welcomeBonus)} welcome bonus`,
                  `You earn ${fmtNGN(perInvite)} instantly`,
                ].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full gradient-accent text-[#08110F] flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                    <span className="pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold">Milestone Rewards</h3>
              <div className="mt-4 space-y-4">
                {milestones.map((m) => {
                  const pct = Math.min(100, (invites / m.t) * 100);
                  return (
                    <div key={m.t}>
                      <div className="flex items-center justify-between text-sm">
                        <span>{m.t} Referrals — <span className="text-gold font-semibold">{fmtNGN(m.r)}</span> bonus</span>
                        <span className="text-xs text-muted-foreground">{Math.min(invites, m.t)}/{m.t}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full gradient-accent" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 p-5 rounded-2xl bg-card border border-border">
            <h3 className="font-semibold mb-1">Top Referrers</h3>
            <p className="text-xs text-muted-foreground mb-3">Real users on this device. Cross-device leaderboard requires the cloud backend.</p>
            {leaders.length === 0 ? (
              <div className="py-8 text-center">
                <div className="text-sm text-muted-foreground">No referrers yet.</div>
                <div className="text-xs text-muted-foreground mt-1">Be the first on the leaderboard.</div>
                <button onClick={() => setShare(true)} className="mt-4 inline-flex items-center justify-center gap-2 rounded-full gradient-accent text-[#08110F] px-5 py-2.5 text-sm font-semibold">
                  <IconShare width={14} height={14} stroke="#08110F" /> Share invite
                </button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {leaders.map((row, i) => (
                  <div key={row.name + i} className="flex items-center gap-3 py-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "gradient-accent text-[#08110F]" : "bg-secondary"}`}>#{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{row.name}</div>
                      <div className="text-xs text-muted-foreground">{row.refs} referral{row.refs === 1 ? "" : "s"}</div>
                    </div>
                    <div className="text-sm font-semibold text-gold">{fmtNGN(row.earned)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <ShareModal open={share} onClose={() => setShare(false)} link={link} message={message} />
    </AppShell>
  );
}

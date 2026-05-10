import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { fmtNGN } from "@/lib/format";
import { randName, PLACEHOLDERS } from "@/lib/mock";
import { getInviteCount } from "@/lib/plan";
import { IconArrowLeft, IconGift, IconUsers, IconBolt, IconChart, IconCopy, IconShare } from "@/components/icons";

export const Route = createFileRoute("/referrals")({
  head: () => ({ meta: [{ title: "Refer & Earn — Chixx9ja" }] }),
  component: ReferralsPage,
});

function ReferralsPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"invite" | "leaders">("invite");
  const invites = useMemo(() => getInviteCount(), []);
  const perInvite = PLACEHOLDERS.perReferral;
  const totalEarned = invites * perInvite;
  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);
  if (!user) return null;
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${user.referralCode}`;
  const copy = () => navigator.clipboard.writeText(link);
  const milestones = [{ t: 10, r: 5000 }, { t: 25, r: 15000 }, { t: 50, r: 35000 }, { t: 100, r: 75000 }];

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
                <button onClick={copy} className="w-11 h-11 rounded-xl border border-border flex items-center justify-center"><IconCopy /></button>
                <button onClick={() => navigator.share?.({ url: link })} className="w-11 h-11 rounded-xl border border-border flex items-center justify-center"><IconShare /></button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-border">
              <div className="font-semibold">Boost your earnings</div>
              <p className="text-sm text-muted-foreground mt-1">Upgrade to premium and earn up to N40,000 per referral</p>
              <Link to="/invest" className="mt-3 inline-flex items-center justify-center px-5 py-2.5 rounded-full gradient-accent text-[#08110F] text-sm font-semibold">View Upgrade Options</Link>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold">How It Works</h3>
              <ol className="mt-3 space-y-3 text-sm">
                {[
                  "Share your unique referral link",
                  "They sign up and get N5,000 welcome bonus",
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
                {milestones.map((m) => (
                  <div key={m.t}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{m.t} Referrals — <span className="text-gold font-semibold">{fmtNGN(m.r)}</span> bonus</span>
                      <span className="text-xs text-muted-foreground">0/{m.t}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full gradient-accent" style={{ width: `0%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 p-5 rounded-2xl bg-card border border-border">
            <h3 className="font-semibold mb-3">Top Referrers</h3>
            <div className="divide-y divide-border">
              {Array.from({ length: 10 }, (_, i) => ({ rank: i + 1, name: randName(), refs: 200 - i * 12 - Math.floor(Math.random() * 5), earned: (200 - i * 12) * perInvite })).map((row) => (
                <div key={row.rank} className="flex items-center gap-3 py-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${row.rank <= 3 ? "gradient-accent text-[#08110F]" : "bg-secondary"}`}>#{row.rank}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{row.name}</div>
                    <div className="text-xs text-muted-foreground">{row.refs} referrals</div>
                  </div>
                  <div className="text-sm font-semibold text-gold">{fmtNGN(row.earned)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

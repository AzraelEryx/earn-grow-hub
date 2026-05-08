import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { IconArrowLeft, IconUsers, IconTelegram, IconBell, IconLightbulb, IconGift } from "@/components/icons";
import { PLACEHOLDERS } from "@/lib/mock";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community — ChinexEarn" }] }),
  component: () => (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-5">
        <div className="flex items-center gap-3 mb-5">
          <Link to="/dashboard" className="w-10 h-10 rounded-full border border-border flex items-center justify-center"><IconArrowLeft /></Link>
          <h1 className="text-xl font-bold">Community</h1>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/5 border border-border text-center">
          <div className="mx-auto w-14 h-14 rounded-full gradient-accent flex items-center justify-center"><IconUsers stroke="#08110F" /></div>
          <h2 className="mt-3 font-semibold">Join Our Community</h2>
          <p className="text-sm text-muted-foreground mt-1">Connect with thousands of earners</p>
        </div>
        <div className="mt-5 space-y-3">
          {[
            { t: "Telegram Channel 1 (Official)", d: "Announcements & payment proofs", u: PLACEHOLDERS.telegram1 },
            { t: "Telegram Channel 2 (Community)", d: "Tips, winners & chat", u: PLACEHOLDERS.telegram2 },
          ].map((c) => (
            <div key={c.t} className="p-4 rounded-2xl bg-card border border-border flex items-center gap-3 card-glow">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center"><IconTelegram /></div>
              <div className="flex-1"><div className="font-semibold text-sm">{c.t}</div><div className="text-xs text-muted-foreground">{c.d}</div></div>
              <a href={c.u} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full gradient-accent text-[#08110F] text-xs font-semibold">Join</a>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Why Join</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { Icon: IconBell, t: "Instant updates" },
              { Icon: IconUsers, t: "Connect with earners" },
              { Icon: IconLightbulb, t: "Exclusive tips" },
              { Icon: IconGift, t: "Special contests" },
            ].map((f, i) => (
              <div key={i} className="p-4 rounded-2xl bg-card border border-border">
                <f.Icon /><div className="mt-2 text-sm font-medium">{f.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  ),
});

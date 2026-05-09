import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useRate } from "@/contexts/RateContext";
import { fmtNGN, fmtUSD, ngnToUsd } from "@/lib/format";
import { randName, PLACEHOLDERS } from "@/lib/mock";
import { IconShield } from "@/components/icons";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Chixx9ja" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [pwd, setPwd] = useState("");
  const [ok, setOk] = useState(false);
  const { rate, updatedAt } = useRate();

  if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-sm p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center gap-2"><IconShield /><h1 className="font-bold">Admin Access</h1></div>
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password"
            className="mt-4 w-full px-4 py-3 rounded-xl bg-input border border-border text-sm" />
          <button onClick={() => setOk(pwd === PLACEHOLDERS.adminPassword)}
            className="mt-3 w-full rounded-full gradient-accent text-[#08110F] py-2.5 text-sm font-semibold">Enter</button>
        </div>
      </div>
    );
  }

  const users = Array.from({ length: 8 }, () => ({ name: randName(), email: "user@example.com", phone: "0801XXXXXXX", refs: Math.floor(Math.random()*40), bal: Math.floor(Math.random()*500000)+30000, joined: "2026-01-12", status: "Active" }));
  const wds = Array.from({ length: 6 }, () => ({ user: randName(), amount: Math.floor(Math.random()*300000)+30000, currency: "NGN", bank: "GTBank", acct: "0123456789", date: "2026-05-08", status: "Pending" }));
  const inv = Array.from({ length: 5 }, () => ({ user: randName(), plan: "Balanced", deposit: 80000, ret: 320000, status: "Active", date: "2026-04-20" }));

  return (
    <div className="min-h-screen bg-background p-5">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="text-xs text-muted-foreground">
            Live rate: 1 USD = N{Math.round(rate).toLocaleString()} {updatedAt && `· updated ${new Date(updatedAt).toLocaleTimeString()}`}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            ["Total Users", "1,248"], ["Total Referrals", "5,302"],
            ["Total Payouts", fmtNGN(58_000_000)], ["Pending Withdrawals", "12"], ["Active Today", "342"],
          ].map(([l, v]) => (
            <div key={l} className="p-4 rounded-2xl bg-card border border-border">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{l}</div>
              <div className="mt-1 text-lg font-bold text-gradient-accent">{v}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <Chart title="Daily Signups (7d)" data={[42, 58, 49, 71, 68, 95, 113]} color="#00C9A7" />
          <Chart title="Payouts (7d)" data={[120000, 200000, 180000, 240000, 310000, 280000, 360000]} color="#F5C518" bars />
        </div>

        <Section title="Users">
          <Table head={["Name","Email","Phone","Refs","Balance","USD","Joined","Status"]}>
            {users.map((u, i) => (
              <tr key={i} className="border-t border-border"><td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td><td>{u.refs}</td><td>{fmtNGN(u.bal)}</td><td className="text-muted-foreground">{fmtUSD(ngnToUsd(u.bal, rate))}</td><td>{u.joined}</td><td><span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">{u.status}</span></td></tr>
            ))}
          </Table>
        </Section>

        <Section title="Withdrawals">
          <Table head={["User","Amount","USD","Currency","Bank","Account","Date","Status","Actions"]}>
            {wds.map((w, i) => (
              <tr key={i} className="border-t border-border"><td>{w.user}</td><td>{fmtNGN(w.amount)}</td><td className="text-muted-foreground">{fmtUSD(ngnToUsd(w.amount, rate))}</td><td>{w.currency}</td><td>{w.bank}</td><td>{w.acct}</td><td>{w.date}</td><td><span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px]">{w.status}</span></td><td className="space-x-2"><button className="px-2 py-1 rounded-full bg-emerald-500 text-emerald-950 text-[10px] font-semibold">Approve</button><button className="px-2 py-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold">Reject</button></td></tr>
            ))}
          </Table>
        </Section>

        <Section title="Investments">
          <Table head={["User","Plan","Deposit","Expected Return","Status","Date"]}>
            {inv.map((x, i) => (
              <tr key={i} className="border-t border-border"><td>{x.user}</td><td>{x.plan}</td><td>{fmtNGN(x.deposit)}</td><td className="text-gold font-semibold">{fmtNGN(x.ret)}</td><td><span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">{x.status}</span></td><td>{x.date}</td></tr>
            ))}
          </Table>
        </Section>

        <Section title="Announcement">
          <textarea placeholder="Type your announcement..." rows={4}
            className="w-full px-4 py-3 rounded-xl bg-input border border-border text-sm" />
          <button className="mt-3 rounded-full gradient-accent text-[#08110F] px-5 py-2.5 text-sm font-semibold">Push Announcement</button>
        </Section>

        <Section title="Analytics Configuration">
          <div className="space-y-3 text-sm">
            <div><label className="text-xs text-muted-foreground">GA4 Measurement ID</label>
              <input placeholder="G-XXXXXXX" className="mt-1 w-full px-4 py-2.5 rounded-xl bg-input border border-border text-sm" /></div>
            <div><label className="text-xs text-muted-foreground">Meta Pixel ID</label>
              <input placeholder="000000000000000" className="mt-1 w-full px-4 py-2.5 rounded-xl bg-input border border-border text-sm" /></div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead><tr className="text-left text-muted-foreground">{head.map((h) => <th key={h} className="py-2 pr-4">{h}</th>)}</tr></thead>
        <tbody className="[&_td]:py-2 [&_td]:pr-4">{children}</tbody>
      </table>
    </div>
  );
}
function Chart({ title, data, color, bars }: { title: string; data: number[]; color: string; bars?: boolean }) {
  const max = Math.max(...data);
  const w = 320, h = 120, step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - (v / max) * h}`).join(" ");
  return (
    <div className="p-5 rounded-2xl bg-card border border-border">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{title}</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 w-full h-32">
        {bars
          ? data.map((v, i) => <rect key={i} x={i * (w / data.length) + 4} y={h - (v / max) * h} width={(w / data.length) - 8} height={(v / max) * h} fill={color} rx={3} />)
          : <polyline fill="none" stroke={color} strokeWidth={2.5} points={points} />}
      </svg>
    </div>
  );
}

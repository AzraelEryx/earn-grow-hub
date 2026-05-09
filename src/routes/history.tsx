import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useRate } from "@/contexts/RateContext";
import { fmtNGN, fmtUSD, ngnToUsd } from "@/lib/format";
import { IconArrowLeft, IconArrowUpRight, IconArrowDownLeft, IconHistory } from "@/components/icons";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — Chixx9ja" }] }),
  component: HistoryPage,
});

type Txn = { id: string; ts: number; type: "credit" | "debit"; name: string; amount: number };

function HistoryPage() {
  const { user, loading } = useAuth();
  const { rate } = useRate();
  const nav = useNavigate();
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");
  const [txns, setTxns] = useState<Txn[]>([]);

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);
  useEffect(() => {
    try { setTxns(JSON.parse(localStorage.getItem("txns_v1") || "[]")); } catch {}
  }, []);
  if (!user) return null;
  const filtered = txns.filter((t) => filter === "all" ? true : t.type === filter);

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-5">
        <div className="flex items-center gap-3 mb-5">
          <Link to="/dashboard" className="w-10 h-10 rounded-full border border-border flex items-center justify-center"><IconArrowLeft /></Link>
          <h1 className="text-xl font-bold">Transaction History</h1>
        </div>
        <div className="flex gap-2 p-1 bg-secondary rounded-full text-sm">
          {(["all", "credit", "debit"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-full font-medium capitalize ${filter === f ? "gradient-accent text-[#08110F]" : "text-muted-foreground"}`}>
              {f === "all" ? "All" : f === "credit" ? "Credits" : "Debits"}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"><IconHistory /></div>
            <p className="mt-4 text-sm text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <div className="mt-5 divide-y divide-border bg-card border border-border rounded-2xl overflow-hidden">
            {filtered.map((t) => (
              <div key={t.id} className="px-5 py-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === "credit" ? "bg-emerald-500/20 text-emerald-400" : "bg-destructive/20 text-destructive"}`}>
                  {t.type === "credit" ? <IconArrowDownLeft /> : <IconArrowUpRight />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{new Date(t.ts).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${t.type === "credit" ? "text-emerald-400" : "text-destructive"}`}>
                    {t.type === "credit" ? "+" : "-"}{fmtNGN(t.amount)}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{fmtUSD(ngnToUsd(t.amount, rate))}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

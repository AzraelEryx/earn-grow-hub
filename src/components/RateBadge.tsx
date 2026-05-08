import { useRate } from "@/contexts/RateContext";

export function RateBadge({ className = "" }: { className?: string }) {
  const { rate, stale, loading } = useRate();
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary text-[11px] ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${stale ? "bg-amber-500" : "bg-emerald-500"} ${!stale && "animate-pulse"}`} />
      <span className="text-muted-foreground">1 USD = </span>
      <span className="font-medium">N{loading && !rate ? "…" : Math.round(rate).toLocaleString()}</span>
      {stale && <span className="text-amber-500">(may be outdated)</span>}
    </div>
  );
}

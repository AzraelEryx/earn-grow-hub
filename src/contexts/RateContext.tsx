import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type RateState = {
  rate: number;
  updatedAt: number | null;
  stale: boolean;
  loading: boolean;
};

const RateCtx = createContext<RateState>({ rate: 1650, updatedAt: null, stale: true, loading: true });

const KEY = "ngn_rate_cache_v1";
const REFRESH_MS = 60 * 1000; // every minute
const FALLBACK_RATE = 1650;

const SOURCES = [
  { url: "https://open.er-api.com/v6/latest/USD", parse: (j: any) => j?.rates?.NGN },
  { url: "https://api.exchangerate-api.com/v4/latest/USD", parse: (j: any) => j?.rates?.NGN },
  { url: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json", parse: (j: any) => j?.usd?.ngn },
];

export function RateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RateState>({ rate: FALLBACK_RATE, updatedAt: null, stale: true, loading: true });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const cached = JSON.parse(raw) as { rate: number; updatedAt: number };
        if (cached?.rate) setState({ rate: cached.rate, updatedAt: cached.updatedAt, stale: true, loading: true });
      }
    } catch {}

    let cancelled = false;
    const fetchRate = async () => {
      for (const src of SOURCES) {
        try {
          const r = await fetch(src.url, { cache: "no-store" });
          if (!r.ok) continue;
          const j = await r.json();
          const rate = src.parse(j);
          if (typeof rate === "number" && rate > 100 && !cancelled) {
            const next = { rate, updatedAt: Date.now() };
            localStorage.setItem(KEY, JSON.stringify(next));
            setState({ ...next, stale: false, loading: false });
            return;
          }
        } catch {}
      }
      if (!cancelled) setState((s) => ({ ...s, stale: true, loading: false }));
    };
    fetchRate();
    const id = setInterval(fetchRate, REFRESH_MS);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return <RateCtx.Provider value={state}>{children}</RateCtx.Provider>;
}

export const useRate = () => useContext(RateCtx);

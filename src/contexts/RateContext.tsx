import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type RateState = {
  rate: number;
  updatedAt: number | null;
  stale: boolean;
  loading: boolean;
};

const RateCtx = createContext<RateState>({ rate: 1600, updatedAt: null, stale: true, loading: true });

const KEY = "ngn_rate_cache_v1";
const REFRESH_MS = 5 * 60 * 1000;
const FALLBACK_RATE = 1600;

export function RateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RateState>({ rate: FALLBACK_RATE, updatedAt: null, stale: true, loading: true });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const cached = JSON.parse(raw) as { rate: number; updatedAt: number };
        setState({ rate: cached.rate, updatedAt: cached.updatedAt, stale: true, loading: true });
      }
    } catch {}

    let cancelled = false;
    const fetchRate = async () => {
      try {
        const r = await fetch("https://api.frankfurter.app/latest?from=USD&to=NGN");
        const j = await r.json();
        const rate = j?.rates?.NGN;
        if (rate && !cancelled) {
          const next = { rate, updatedAt: Date.now() };
          localStorage.setItem(KEY, JSON.stringify(next));
          setState({ ...next, stale: false, loading: false });
        }
      } catch {
        setState((s) => ({ ...s, stale: true, loading: false }));
      }
    };
    fetchRate();
    const id = setInterval(fetchRate, REFRESH_MS);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return <RateCtx.Provider value={state}>{children}</RateCtx.Provider>;
}

export const useRate = () => useContext(RateCtx);

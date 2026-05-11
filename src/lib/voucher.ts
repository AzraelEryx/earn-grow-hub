import { PAID_PLANS, type PlanKey } from "./plan";

// Voucher → plan mapping. Stored in localStorage so admin can mint more.
// Format: { code: { plan: PlanKey, used: boolean, createdAt: number } }
const KEY = "vouchers_v1";

export type VoucherRecord = { plan: PlanKey; used: boolean; createdAt: number };
type VoucherMap = Record<string, VoucherRecord>;

// Seed a few demo codes so the flow is testable out of the box.
const SEED: VoucherMap = {
  "BASIC-DEMO-2026":     { plan: "basic",     used: false, createdAt: Date.now() },
  "GROWTH-DEMO-2026":    { plan: "growth",    used: false, createdAt: Date.now() },
  "BALANCED-DEMO-2026":  { plan: "balanced",  used: false, createdAt: Date.now() },
  "PREMIUM-DEMO-2026":   { plan: "premium",   used: false, createdAt: Date.now() },
  "ELITE-DEMO-2026":     { plan: "elite",     used: false, createdAt: Date.now() },
  "EXECUTIVE-DEMO-2026": { plan: "executive", used: false, createdAt: Date.now() },
};

function load(): VoucherMap {
  if (typeof window === "undefined") return { ...SEED };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return { ...SEED };
    }
    return JSON.parse(raw);
  } catch {
    return { ...SEED };
  }
}

function save(m: VoucherMap) {
  localStorage.setItem(KEY, JSON.stringify(m));
}

export function listVouchers(): Array<{ code: string } & VoucherRecord> {
  const m = load();
  return Object.entries(m).map(([code, v]) => ({ code, ...v })).sort((a, b) => b.createdAt - a.createdAt);
}

export function redeemVoucher(rawCode: string): { ok: boolean; plan?: PlanKey; error?: string } {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a voucher code." };
  const m = load();
  const rec = m[code];
  if (!rec) return { ok: false, error: "Invalid voucher code." };
  if (rec.used) return { ok: false, error: "This voucher has already been used." };
  rec.used = true;
  save(m);
  return { ok: true, plan: rec.plan };
}

export function generateVoucher(plan: PlanKey): string {
  const planLabel = PAID_PLANS.find((p) => p.key === plan)?.short.toUpperCase() ?? plan.toUpperCase();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const code = `${planLabel}-${rand}-${new Date().getFullYear()}`;
  const m = load();
  m[code] = { plan, used: false, createdAt: Date.now() };
  save(m);
  return code;
}

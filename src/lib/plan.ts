// User investment plan + claim tracking (mock, localStorage-backed).

export type PlanKey = "free" | "basic" | "growth" | "balanced" | "premium" | "elite" | "executive";

export type UserPlan = {
  key: PlanKey;
  label: string;
  short: string;
  deposit: number;
  dailyClaim: number;       // amount user can claim each day
  durationDays: number;     // total days the plan runs
  withdrawMin: number;      // minimum NGN to withdraw on this plan
  withdrawDays: number[];   // 0=Sun..6=Sat
  badge?: string;
};

export const FREE_PLAN: UserPlan = {
  key: "free",
  label: "Free",
  short: "Free",
  deposit: 0,
  dailyClaim: 0,
  durationDays: 0,
  withdrawMin: 10000, // free users can still withdraw bonus/referral once they hit 10k
  withdrawDays: [1, 2, 3, 4, 5, 6, 0], // any day
};

export const PAID_PLANS: UserPlan[] = [
  { key: "basic",     label: "Basic Plan",     short: "Basic",     deposit: 15000,  dailyClaim: 3000,  durationDays: 14, withdrawMin: 20000,  withdrawDays: [1, 4] },
  { key: "growth",    label: "Growth Plan",    short: "Growth",    deposit: 25000,  dailyClaim: 4500,  durationDays: 14, withdrawMin: 30000,  withdrawDays: [1, 3, 5] },
  { key: "balanced",  label: "Balanced Plan",  short: "Balanced",  deposit: 40000,  dailyClaim: 7000,  durationDays: 14, withdrawMin: 50000,  withdrawDays: [1, 3, 5], badge: "Popular" },
  { key: "premium",   label: "Premium Plan",   short: "Premium",   deposit: 60000,  dailyClaim: 10000, durationDays: 14, withdrawMin: 75000,  withdrawDays: [1, 2, 4, 5] },
  { key: "elite",     label: "Elite Plan",     short: "Elite",     deposit: 100000, dailyClaim: 16000, durationDays: 14, withdrawMin: 120000, withdrawDays: [1, 2, 3, 4, 5] },
  { key: "executive", label: "Executive Plan", short: "Executive", deposit: 200000, dailyClaim: 32000, durationDays: 14, withdrawMin: 250000, withdrawDays: [1, 2, 3, 4, 5], badge: "Highest ROI" },
];

export const ALL_PLANS = [FREE_PLAN, ...PAID_PLANS];

const PLAN_KEY = "user_plan_v2";
const INVITES_KEY = "invites_v1";
const CLAIM_KEY = "plan_claim_v1"; // { day: number(yyyymmdd), claimedToday: boolean, totalClaimed: number, startedAt: number }

export function getCurrentPlan(): UserPlan {
  if (typeof window === "undefined") return FREE_PLAN;
  try {
    const k = localStorage.getItem(PLAN_KEY);
    if (!k) return FREE_PLAN;
    return ALL_PLANS.find((p) => p.key === k) ?? FREE_PLAN;
  } catch { return FREE_PLAN; }
}

export function setCurrentPlan(key: PlanKey) {
  localStorage.setItem(PLAN_KEY, key);
  if (key !== "free") {
    // reset claim tracker for the new plan
    const state = { startedAt: Date.now(), claimsMade: 0, lastClaimDay: 0 };
    localStorage.setItem(CLAIM_KEY, JSON.stringify(state));
  }
}

export function clearCurrentPlan() {
  localStorage.removeItem(PLAN_KEY);
  localStorage.removeItem(CLAIM_KEY);
}

export function getInviteCount(): number {
  if (typeof window === "undefined") return 0;
  try { return parseInt(localStorage.getItem(INVITES_KEY) || "0", 10) || 0; } catch { return 0; }
}

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function isWithdrawDayAllowed(plan: UserPlan, date = new Date()): boolean {
  return plan.withdrawDays.includes(date.getDay());
}

function dayInt(d = new Date()) {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export type ClaimState = {
  startedAt: number;
  claimsMade: number;
  lastClaimDay: number; // dayInt
};

export function getClaimState(): ClaimState {
  try {
    const s = JSON.parse(localStorage.getItem(CLAIM_KEY) || "null");
    if (s) return s;
  } catch {}
  return { startedAt: Date.now(), claimsMade: 0, lastClaimDay: 0 };
}

export function canClaimToday(plan: UserPlan, state: ClaimState): boolean {
  if (plan.key === "free") return false;
  if (state.claimsMade >= plan.durationDays) return false;
  return state.lastClaimDay !== dayInt();
}

export function claimedTodayAlready(state: ClaimState): boolean {
  return state.lastClaimDay === dayInt();
}

export function recordClaim(): ClaimState {
  const cur = getClaimState();
  const next: ClaimState = {
    startedAt: cur.startedAt || Date.now(),
    claimsMade: cur.claimsMade + 1,
    lastClaimDay: dayInt(),
  };
  localStorage.setItem(CLAIM_KEY, JSON.stringify(next));
  return next;
}

export function planComplete(plan: UserPlan, state: ClaimState): boolean {
  return plan.key !== "free" && state.claimsMade >= plan.durationDays;
}

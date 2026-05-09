// User investment plan + referral count helpers (mock, localStorage-backed).

export type UserPlan = {
  key: "free" | "starter" | "growth" | "balanced" | "premium" | "elite" | "executive";
  label: string;
  deposit: number;
  withdrawMin: number; // minimum NGN per withdrawal
  withdrawDays: number[]; // 0 = Sun ... 6 = Sat
};

export const FREE_PLAN: UserPlan = {
  key: "free",
  label: "Free",
  deposit: 0,
  withdrawMin: 0,
  withdrawDays: [],
};

export const PAID_PLANS: UserPlan[] = [
  { key: "starter",   label: "Starter (Basic)",     deposit: 40000,  withdrawMin: 10000,  withdrawDays: [1, 4] },        // Mon, Thu
  { key: "growth",    label: "Growth (Standard)",   deposit: 60000,  withdrawMin: 15000,  withdrawDays: [1, 3, 5] },     // Mon, Wed, Fri
  { key: "balanced",  label: "Balanced (Premium)",  deposit: 80000,  withdrawMin: 20000,  withdrawDays: [1, 3, 5] },
  { key: "premium",   label: "Premium (Elite)",     deposit: 120000, withdrawMin: 30000,  withdrawDays: [1, 2, 4, 5] },
  { key: "elite",     label: "Elite (VIP)",         deposit: 200000, withdrawMin: 50000,  withdrawDays: [1, 2, 3, 4, 5] },
  { key: "executive", label: "Executive (Royal)",   deposit: 300000, withdrawMin: 75000,  withdrawDays: [1, 2, 3, 4, 5] },
];

export const ALL_PLANS = [FREE_PLAN, ...PAID_PLANS];

const PLAN_KEY = "user_plan_v1";
const INVITES_KEY = "invites_v1";

export function getCurrentPlan(): UserPlan {
  if (typeof window === "undefined") return FREE_PLAN;
  try {
    const k = localStorage.getItem(PLAN_KEY);
    if (!k) return FREE_PLAN;
    return ALL_PLANS.find((p) => p.key === k) ?? FREE_PLAN;
  } catch { return FREE_PLAN; }
}

export function setCurrentPlan(key: UserPlan["key"]) {
  localStorage.setItem(PLAN_KEY, key);
}

export function getInviteCount(): number {
  if (typeof window === "undefined") return 0;
  try { return parseInt(localStorage.getItem(INVITES_KEY) || "0", 10) || 0; } catch { return 0; }
}

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function isWithdrawDayAllowed(plan: UserPlan, date = new Date()): boolean {
  if (plan.key === "free") return false;
  return plan.withdrawDays.includes(date.getDay());
}

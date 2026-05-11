// Local "platform" stats. Real cross-user stats need a backend.
import { useEffect, useState } from "react";

const LAUNCH = new Date("2025-01-01").getTime();
const BASE_USERS = 12480;
const BASE_PAID = 58_000_000;
const USERS_PER_HOUR = 1.7;
const PAID_PER_HOUR = 22_000;

export function getActiveUsers(): number {
  let signups = 0;
  try {
    const db = JSON.parse(localStorage.getItem("users_db_v1") || "{}");
    signups = Object.keys(db).length;
  } catch {}
  const elapsedHours = (Date.now() - LAUNCH) / 3600_000;
  return BASE_USERS + signups + Math.floor(elapsedHours * USERS_PER_HOUR);
}

export function getTotalPaidOut(): number {
  let withdrawn = 0;
  try {
    const txns = JSON.parse(localStorage.getItem("txns_v1") || "[]");
    for (const t of txns) {
      if (t?.type === "debit" && /withdraw/i.test(t?.name || "")) withdrawn += t.amount;
    }
  } catch {}
  const elapsedHours = (Date.now() - LAUNCH) / 3600_000;
  return BASE_PAID + withdrawn + Math.floor(elapsedHours * PAID_PER_HOUR);
}

export function getEstablishedYear(): number {
  return new Date(LAUNCH).getFullYear();
}

export function getUptimePct(): string {
  return "99.97%";
}

export function useLiveStats(refreshMs = 5000) {
  const [stats, setStats] = useState(() => ({
    users: getActiveUsers(),
    paid: getTotalPaidOut(),
    established: getEstablishedYear(),
    uptime: getUptimePct(),
  }));
  useEffect(() => {
    const id = setInterval(() => {
      setStats({
        users: getActiveUsers(),
        paid: getTotalPaidOut(),
        established: getEstablishedYear(),
        uptime: getUptimePct(),
      });
    }, refreshMs);
    return () => clearInterval(id);
  }, [refreshMs]);
  return stats;
}

// Withdrawal request log (admin viewable)
export type WithdrawalRequest = {
  id: string;
  user: string;
  email: string;
  amount: number;
  bank: string;
  accountNumber: string;
  accountName: string;
  status: "Pending" | "Approved" | "Paid";
  createdAt: number;
};

const WD_KEY = "withdrawal_requests_v1";

export function logWithdrawalRequest(r: Omit<WithdrawalRequest, "id" | "createdAt" | "status">): WithdrawalRequest {
  const rec: WithdrawalRequest = { ...r, id: crypto.randomUUID(), createdAt: Date.now(), status: "Approved" };
  const list = listWithdrawalRequests();
  list.unshift(rec);
  localStorage.setItem(WD_KEY, JSON.stringify(list.slice(0, 200)));
  return rec;
}

export function listWithdrawalRequests(): WithdrawalRequest[] {
  try { return JSON.parse(localStorage.getItem(WD_KEY) || "[]"); } catch { return []; }
}

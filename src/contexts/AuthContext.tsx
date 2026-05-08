import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PLACEHOLDERS } from "@/lib/mock";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  joinedAt: number;
};

type AuthState = {
  user: User | null;
  balance: number;
  setBalance: (n: number | ((b: number) => number)) => void;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (data: { name: string; email: string; phone: string; password: string; referralCode?: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
};

const AuthCtx = createContext<AuthState>({
  user: null,
  balance: 0,
  setBalance: () => {},
  login: async () => ({ ok: false }),
  signup: async () => ({ ok: false }),
  logout: () => {},
  loading: true,
});

const USER_KEY = "auth_user_v1";
const BALANCE_KEY = "balance_v1";
const USERS_DB_KEY = "users_db_v1";

const genCode = (name: string) =>
  (name.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "USER") +
  Math.floor(1000 + Math.random() * 9000);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalanceState] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const u = localStorage.getItem(USER_KEY);
      if (u) setUser(JSON.parse(u));
      const b = localStorage.getItem(BALANCE_KEY);
      if (b) setBalanceState(parseFloat(b));
    } catch {}
    setLoading(false);
  }, []);

  const setBalance = (n: number | ((b: number) => number)) => {
    setBalanceState((prev) => {
      const next = typeof n === "function" ? (n as (b: number) => number)(prev) : n;
      localStorage.setItem(BALANCE_KEY, String(next));
      return next;
    });
  };

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
  };

  const getDb = (): Record<string, { password: string; user: User }> => {
    try { return JSON.parse(localStorage.getItem(USERS_DB_KEY) || "{}"); } catch { return {}; }
  };
  const saveDb = (db: Record<string, { password: string; user: User }>) =>
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));

  const signup: AuthState["signup"] = async ({ name, email, phone, password }) => {
    const db = getDb();
    const key = email.toLowerCase().trim();
    if (db[key]) return { ok: false, error: "Email already registered" };
    const u: User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: key,
      phone: phone.trim(),
      referralCode: genCode(name),
      joinedAt: Date.now(),
    };
    db[key] = { password, user: u };
    saveDb(db);
    persistUser(u);
    setBalance(PLACEHOLDERS.welcomeBonus);
    // welcome txn
    const txns = [{ id: crypto.randomUUID(), type: "credit", name: "Welcome bonus", amount: PLACEHOLDERS.welcomeBonus, ts: Date.now() }];
    localStorage.setItem("txns_v1", JSON.stringify(txns));
    return { ok: true };
  };

  const login: AuthState["login"] = async (email, password) => {
    const db = getDb();
    const rec = db[email.toLowerCase().trim()];
    if (!rec) return { ok: false, error: "No account found" };
    if (rec.password !== password) return { ok: false, error: "Wrong password" };
    persistUser(rec.user);
    return { ok: true };
  };

  const logout = () => {
    persistUser(null);
    localStorage.removeItem(BALANCE_KEY);
    setBalanceState(0);
  };

  return (
    <AuthCtx.Provider value={{ user, balance, setBalance, login, signup, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);

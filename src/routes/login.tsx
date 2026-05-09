import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/AppShell";
import { IconShield, IconArrowRight } from "@/components/icons";
import { PLATFORM_NAME } from "@/lib/mock";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Chixx9ja" }] }),
  component: Login,
});

function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!email || !password) return setErr("Enter email and password");
    setLoading(true);
    const r = await login(email, password);
    setLoading(false);
    if (!r.ok) return setErr(r.error || "Login failed");
    if (remember) localStorage.setItem("remember_email", email);
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="px-4 h-16 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center">
            <IconShield width={18} height={18} stroke="#08110F" strokeWidth={2.4} />
          </div>
          <span className="font-semibold">{PLATFORM_NAME}</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue earning.</p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="mt-1 w-full px-4 py-3 rounded-xl bg-input border border-border outline-none focus:border-primary text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password"
                className="mt-1 w-full px-4 py-3 rounded-xl bg-input border border-border outline-none focus:border-primary text-sm" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-[#00C9A7]" />
                Remember me
              </label>
              <button type="button" className="text-primary text-xs">Forgot password?</button>
            </div>

            {err && <div className="text-sm text-destructive">{err}</div>}

            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full gradient-accent text-[#08110F] px-5 py-3.5 text-sm font-semibold disabled:opacity-50">
              {loading ? "Logging in..." : <>Login <IconArrowRight /></>}
            </button>
          </form>

          <p className="mt-5 text-sm text-muted-foreground text-center">
            Don't have an account? <Link to="/signup" className="text-primary font-medium">Sign up</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

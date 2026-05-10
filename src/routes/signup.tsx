import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/AppShell";
import { IconShield, IconArrowRight } from "@/components/icons";
import { PLATFORM_NAME } from "@/lib/mock";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — Chixx9ja" },
      { name: "description", content: "Sign up and instantly receive a N5,000 welcome bonus." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "", referralCode: "" });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!form.name.trim() || form.name.trim().length < 2) return setErr("Enter your full name");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErr("Enter a valid email");
    if (!/^[0-9+\s-]{7,}$/.test(form.phone)) return setErr("Enter a valid phone number");
    if (form.password.length < 6) return setErr("Password must be at least 6 characters");
    if (form.password !== form.confirm) return setErr("Passwords do not match");
    setLoading(true);
    const r = await signup(form);
    setLoading(false);
    if (!r.ok) return setErr(r.error || "Sign up failed");
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

      <main className="flex-1 flex items-start sm:items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Get N5,000 welcome bonus instantly.</p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            {[
              { k: "name", l: "Full name", t: "text", p: "John Doe" },
              { k: "email", l: "Email", t: "email", p: "you@example.com" },
              { k: "phone", l: "Phone number", t: "tel", p: "0801 234 5678" },
              { k: "password", l: "Password", t: "password", p: "At least 6 characters" },
              { k: "confirm", l: "Confirm password", t: "password", p: "Re-enter password" },
              { k: "referralCode", l: "Referral code (optional)", t: "text", p: "Enter code" },
            ].map((f) => (
              <div key={f.k}>
                <label className="text-xs text-muted-foreground">{f.l}</label>
                <input type={f.t} value={(form as any)[f.k]} onChange={update(f.k as any)} placeholder={f.p}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-input border border-border outline-none focus:border-primary text-sm" />
              </div>
            ))}

            {err && <div className="text-sm text-destructive">{err}</div>}

            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full gradient-accent text-[#08110F] px-5 py-3.5 text-sm font-semibold disabled:opacity-50">
              {loading ? "Creating account..." : <>Create Account <IconArrowRight /></>}
            </button>
          </form>

          <p className="mt-5 text-sm text-muted-foreground text-center">
            Already have an account? <Link to="/login" className="text-primary font-medium">Login</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

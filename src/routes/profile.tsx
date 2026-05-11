import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { NIGERIAN_BANKS } from "@/lib/mock";
import { getBankDetails, saveBankDetails } from "@/lib/bank";
import { showToast } from "@/components/Toast";
import { IconCamera, IconUser, IconBell, IconUsers, IconCalendar, IconLogout, IconSun, IconMoon, IconWallet } from "@/components/icons";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Chixx9ja" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const [sounds, setSounds] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);
  useEffect(() => {
    setSounds(localStorage.getItem("sounds") === "1");
    const b = getBankDetails();
    if (b) { setAccountName(b.accountName); setAccountNumber(b.accountNumber); setBank(b.bank); }
  }, []);
  if (!user) return null;

  const saveBank = () => {
    if (!accountName.trim() || !accountNumber.trim() || !bank) { showToast("Fill all bank fields"); return; }
    saveBankDetails({ accountName: accountName.trim(), accountNumber: accountNumber.trim(), bank });
    showToast("Bank details saved");
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 py-5">
        <div className="flex flex-col items-center pt-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl gradient-accent flex items-center justify-center text-3xl font-bold text-[#08110F]">
              {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <button className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center">
              <IconCamera width={16} height={16} />
            </button>
          </div>
          <h1 className="mt-4 text-xl font-bold">{user.name}</h1>
          <p className="text-xs text-muted-foreground">Tap photo to change</p>
        </div>

        <div className="mt-6 bg-card border border-border rounded-2xl divide-y divide-border">
          {[
            { Icon: IconUser, l: "Email", v: user.email },
            { Icon: IconBell, l: "Phone", v: user.phone },
            { Icon: IconUsers, l: "Referral Code", v: user.referralCode },
            { Icon: IconCalendar, l: "Member Since", v: new Date(user.joinedAt).toLocaleDateString() },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><row.Icon /></div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">{row.l}</div>
                <div className="text-sm font-medium truncate">{row.v}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bank details */}
        <div className="mt-5 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><IconWallet /></div>
            <div>
              <div className="font-semibold text-sm">Bank Details</div>
              <div className="text-xs text-muted-foreground">Used for all withdrawals — saved securely on this device.</div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-muted-foreground">Account Name</label>
              <input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="As shown on your bank statement"
                className="mt-1 w-full px-4 py-3 rounded-xl bg-input border border-border text-sm" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">Account Number</label>
              <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                inputMode="numeric" placeholder="10-digit account number"
                className="mt-1 w-full px-4 py-3 rounded-xl bg-input border border-border text-sm" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">Bank</label>
              <select value={bank} onChange={(e) => setBank(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl bg-input border border-border text-sm">
                <option value="" disabled>Select Bank</option>
                {NIGERIAN_BANKS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <button onClick={saveBank} className="w-full rounded-full gradient-accent text-[#08110F] py-3 text-sm font-semibold">Save Bank Details</button>
          </div>
        </div>

        <div className="mt-5 bg-card border border-border rounded-2xl divide-y divide-border">
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">{theme === "dark" ? <IconMoon /> : <IconSun />}</div>
            <div className="flex-1 text-sm font-medium">Theme</div>
            <button onClick={toggle} className="text-xs px-3 py-1.5 rounded-full bg-secondary capitalize">{theme}</button>
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><IconBell /></div>
            <div className="flex-1 text-sm font-medium">Sounds</div>
            <button onClick={() => { const v = !sounds; setSounds(v); localStorage.setItem("sounds", v ? "1" : "0"); }}
              className={`w-11 h-6 rounded-full p-0.5 transition ${sounds ? "gradient-accent" : "bg-secondary"}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition ${sounds ? "translate-x-5" : ""}`} />
            </button>
          </div>
        </div>

        <button onClick={() => { logout(); nav({ to: "/login" }); }}
          className="mt-6 w-full rounded-full bg-destructive text-destructive-foreground py-3.5 text-sm font-semibold flex items-center justify-center gap-2">
          <IconLogout /> Logout
        </button>
      </div>
    </AppShell>
  );
}

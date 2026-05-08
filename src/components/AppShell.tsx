import { Link, useRouterState } from "@tanstack/react-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  IconHome, IconInfo, IconChart, IconMore, IconSun, IconMoon, IconShield,
  IconWallet, IconUsers, IconHistory, IconUser, IconChat, IconLogout, IconBell,
} from "@/components/icons";
import { PLATFORM_NAME } from "@/lib/mock";
import { useState, type ReactNode } from "react";
import { QuickMenuSheet } from "./QuickMenuSheet";

const navItems = [
  { to: "/dashboard", label: "Home", icon: IconHome },
  { to: "/trust", label: "About", icon: IconInfo },
  { to: "/invest", label: "Invest", icon: IconChart },
];

const sidebarItems = [
  { to: "/dashboard", label: "Dashboard", icon: IconHome },
  { to: "/tasks", label: "Daily Tasks", icon: IconBell },
  { to: "/referrals", label: "Refer & Earn", icon: IconUsers },
  { to: "/withdraw", label: "Withdraw", icon: IconWallet },
  { to: "/history", label: "History", icon: IconHistory },
  { to: "/invest", label: "Invest", icon: IconChart },
  { to: "/community", label: "Community", icon: IconUsers },
  { to: "/support", label: "Support", icon: IconChat },
  { to: "/trust", label: "Trust", icon: IconShield },
  { to: "/profile", label: "Profile", icon: IconUser },
];

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center hover:border-primary/50 transition"
    >
      {theme === "dark" ? <IconSun /> : <IconMoon />}
    </button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);
  const isActive = (to: string) => path === to || path.startsWith(to + "/");

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border bg-surface z-30">
        <div className="px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center">
            <IconShield width={18} height={18} stroke="#080E0E" strokeWidth={2.4} />
          </div>
          <div className="font-semibold tracking-wide">{PLATFORM_NAME}</div>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {sidebarItems.map((it) => {
            const Icon = it.icon;
            const a = isActive(it.to);
            return (
              <Link key={it.to} to={it.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${a ? "gradient-accent text-[#08110F] font-semibold" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
                <Icon />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>
        {user && (
          <div className="p-3 border-t border-border">
            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition">
              <IconLogout /> <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 lg:pl-64 pb-24 lg:pb-0 min-w-0">
        <div className="animate-fade-in">{children}</div>
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur border-t border-border">
        <div className="grid grid-cols-4">
          {navItems.map((it) => {
            const Icon = it.icon;
            const a = isActive(it.to);
            return (
              <Link key={it.to} to={it.to} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] ${a ? "text-primary" : "text-muted-foreground"}`}>
                <Icon />
                <span>{it.label}</span>
              </Link>
            );
          })}
          <button onClick={() => setMoreOpen(true)} className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground">
            <IconMore /> <span>More</span>
          </button>
        </div>
      </nav>

      <QuickMenuSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </div>
  );
}

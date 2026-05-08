import { Link } from "@tanstack/react-router";
import { IconClose, IconBell, IconHistory, IconUsers, IconWallet, IconUser, IconChat, IconShield, IconChart } from "@/components/icons";

const items = [
  { to: "/tasks", title: "Tasks", subtitle: "Earn rewards", icon: IconBell, tint: "from-teal-500/20 to-teal-500/5" },
  { to: "/history", title: "History", subtitle: "Transactions", icon: IconHistory, tint: "from-blue-500/20 to-blue-500/5" },
  { to: "/referrals", title: "Referrals", subtitle: "Invite friends", icon: IconUsers, tint: "from-purple-500/20 to-purple-500/5" },
  { to: "/withdraw", title: "Withdraw", subtitle: "Cash out", icon: IconWallet, tint: "from-amber-500/20 to-amber-500/5" },
  { to: "/profile", title: "Profile", subtitle: "Your account", icon: IconUser, tint: "from-indigo-500/20 to-indigo-500/5" },
  { to: "/community", title: "Community", subtitle: "Join chat", icon: IconChat, tint: "from-emerald-500/20 to-emerald-500/5" },
  { to: "/support", title: "Support", subtitle: "Get help", icon: IconChat, tint: "from-pink-500/20 to-pink-500/5" },
  { to: "/trust", title: "Trust", subtitle: "Verified", icon: IconShield, tint: "from-cyan-500/20 to-cyan-500/5" },
] as const;

export function QuickMenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 bg-surface border-t border-border rounded-t-3xl p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Quick Menu</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full border border-border flex items-center justify-center"><IconClose /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <Link key={it.to} to={it.to} onClick={onClose}
                className={`p-4 rounded-2xl border border-border bg-gradient-to-br ${it.tint} card-glow`}>
                <Icon />
                <div className="mt-3 font-semibold text-sm">{it.title}</div>
                <div className="text-[11px] text-muted-foreground">{it.subtitle}</div>
              </Link>
            );
          })}
        </div>
        <div className="h-3" />
      </div>
    </div>
  );
}

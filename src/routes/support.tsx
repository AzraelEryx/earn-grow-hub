import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { IconArrowLeft, IconChat, IconTelegram } from "@/components/icons";
import { PLACEHOLDERS } from "@/lib/mock";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support — Chixx9ja" }] }),
  component: () => (
    <AppShell>
      <div className="max-w-md mx-auto px-4 py-10 text-center">
        <div className="flex items-center gap-3 mb-8 text-left">
          <Link to="/dashboard" className="w-10 h-10 rounded-full border border-border flex items-center justify-center"><IconArrowLeft /></Link>
          <h1 className="text-xl font-bold">Support</h1>
        </div>
        <div className="mx-auto w-16 h-16 rounded-full gradient-accent flex items-center justify-center"><IconChat stroke="#08110F" /></div>
        <h2 className="mt-5 text-2xl font-bold">Need Help?</h2>
        <p className="mt-2 text-sm text-muted-foreground">Our support team responds in minutes on Telegram.</p>
        <a href={PLACEHOLDERS.telegram1} target="_blank" rel="noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #2563EB, #00B4D8)" }}>
          <IconTelegram /> Contact on Telegram
        </a>
        <p className="mt-3 text-xs text-muted-foreground">Handle: {PLACEHOLDERS.supportHandle}</p>
      </div>
    </AppShell>
  ),
});

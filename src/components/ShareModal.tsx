import { IconClose, IconTelegram, IconWhatsapp, IconFacebook, IconX, IconCopy, IconShare } from "./icons";
import { showToast } from "./Toast";

export function ShareModal({
  open,
  onClose,
  link,
  message,
}: {
  open: boolean;
  onClose: () => void;
  link: string;
  message: string;
}) {
  if (!open) return null;
  const enc = encodeURIComponent;
  const text = `${message} ${link}`;

  const channels = [
    { name: "WhatsApp",  url: `https://wa.me/?text=${enc(text)}`,                                    Icon: IconWhatsapp, tint: "bg-emerald-500/20 text-emerald-400" },
    { name: "Telegram",  url: `https://t.me/share/url?url=${enc(link)}&text=${enc(message)}`,        Icon: IconTelegram, tint: "bg-sky-500/20 text-sky-400" },
    { name: "X",         url: `https://twitter.com/intent/tweet?text=${enc(text)}`,                   Icon: IconX,        tint: "bg-secondary text-foreground" },
    { name: "Facebook",  url: `https://www.facebook.com/sharer/sharer.php?u=${enc(link)}&quote=${enc(message)}`, Icon: IconFacebook, tint: "bg-blue-500/20 text-blue-400" },
    { name: "SMS",       url: `sms:?body=${enc(text)}`,                                              Icon: IconShare,    tint: "bg-amber-500/20 text-amber-400" },
    { name: "Email",     url: `mailto:?subject=${enc("Join Chixx9ja")}&body=${enc(text)}`,           Icon: IconShare,    tint: "bg-purple-500/20 text-purple-400" },
  ];

  const tryNative = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Chixx9ja", text: message, url: link }); onClose(); } catch {}
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); showToast("Link copied"); } catch {}
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface rounded-3xl border border-border p-6 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border flex items-center justify-center"><IconClose /></button>
        <h3 className="font-semibold text-lg">Share your invite</h3>
        <p className="mt-1 text-xs text-muted-foreground">Pick where to share. Each signup earns you N3,500.</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {channels.map((c) => (
            <a key={c.name} href={c.url} target="_blank" rel="noreferrer" onClick={() => setTimeout(onClose, 300)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-border bg-card hover:border-primary/40 transition">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.tint}`}><c.Icon /></div>
              <span className="text-[11px] font-medium">{c.name}</span>
            </a>
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={copy} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border py-3 text-sm font-medium">
            <IconCopy width={16} height={16} /> Copy link
          </button>
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button onClick={tryNative} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full gradient-accent text-[#08110F] py-3 text-sm font-semibold">
              <IconShare width={16} height={16} /> More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function buildReferralLink(code: string): string {
  if (typeof window === "undefined") return `/?ref=${code}`;
  // Strip preview-- prefix so the shared URL looks clean.
  const host = window.location.host.replace(/^preview--/, "").replace(/^id-preview--/, "");
  return `${window.location.protocol}//${host}/signup?ref=${code}`;
}

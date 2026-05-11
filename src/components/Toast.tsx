import { useEffect, useState, useCallback } from "react";
import { IconCheck } from "./icons";

let externalShow: ((msg: string) => void) | null = null;
export function showToast(msg: string) { externalShow?.(msg); }

export function ToastHost() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = useCallback((m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 2200);
  }, []);
  useEffect(() => { externalShow = show; return () => { externalShow = null; }; }, [show]);
  if (!msg) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] animate-slide-up">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/30 text-sm font-semibold">
        <IconCheck width={16} height={16} strokeWidth={3} />
        {msg}
      </div>
    </div>
  );
}

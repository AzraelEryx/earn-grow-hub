import { useEffect, useState } from "react";
import { PLATFORM_NAME } from "@/lib/mock";

export function Splash({ onDone }: { onDone: () => void }) {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setHide(true), 2200);
    const t2 = setTimeout(() => onDone(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-opacity duration-500 ${hide ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{ backgroundColor: "#080E0E" }}
    >
      <div className="relative">
        <span className="absolute inset-0 rounded-full gradient-accent animate-pulse-ring" />
        <span className="absolute inset-0 rounded-full gradient-accent animate-pulse-ring" style={{ animationDelay: ".6s" }} />
        <div className="relative w-20 h-20 rounded-full gradient-accent flex items-center justify-center shadow-2xl">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#080E0E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l8 4v6c0 5-4 9-8 10-4-1-8-5-8-10V6l8-4z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
      </div>
      <h1 className="mt-8 text-2xl font-semibold tracking-wide text-white animate-fade-in" style={{ animationDelay: ".3s" }}>
        {PLATFORM_NAME}
      </h1>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50 animate-fade-in" style={{ animationDelay: ".6s" }}>
        Refer · Earn · Invest
      </p>
      <div className="absolute bottom-12 w-56 h-[3px] bg-white/10 rounded-full overflow-hidden">
        <div className="h-full gradient-accent animate-progress" />
      </div>
    </div>
  );
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { RateProvider } from "@/contexts/RateContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Splash } from "@/components/Splash";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-accent">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full gradient-accent px-5 py-2.5 text-sm font-semibold text-[#08110F]"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-full gradient-accent px-5 py-2.5 text-sm font-semibold text-[#08110F]">
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Chixx9ja — Refer, Earn & Invest" },
      { name: "description", content: "Nigeria's trusted refer & earn and investment platform. Earn per referral with instant payouts." },
      { name: "author", content: "Chixx9ja" },
      { property: "og:title", content: "Chixx9ja — Refer, Earn & Invest" },
      { property: "og:description", content: "Nigeria's trusted refer & earn and investment platform. Earn per referral with instant payouts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Chixx9ja — Refer, Earn & Invest" },
      { name: "twitter:description", content: "Nigeria's trusted refer & earn and investment platform. Earn per referral with instant payouts." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/0533065e-3613-4dd8-adbe-39467d03e985" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/0533065e-3613-4dd8-adbe-39467d03e985" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("splash_seen_v1");
    if (seen) setShowSplash(false);
    else sessionStorage.setItem("splash_seen_v1", "1");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RateProvider>
          <AuthProvider>
            {showSplash && <Splash onDone={() => setShowSplash(false)} />}
            <Outlet />
          </AuthProvider>
        </RateProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

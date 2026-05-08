export const fmtNGN = (n: number) =>
  "N" + Math.round(n).toLocaleString("en-NG");
export const fmtUSD = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

export const ngnToUsd = (ngn: number, rate: number) => (rate > 0 ? ngn / rate : 0);
export const usdToNgn = (usd: number, rate: number) => usd * rate;

export const maskName = (name: string) => {
  const parts = name.split(" ");
  return parts
    .map((p) => (p.length <= 2 ? p[0] + "*" : p[0] + "*".repeat(Math.max(1, p.length - 2)) + p[p.length - 1]))
    .join(" ");
};

export const timeAgo = (ts: number) => {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return s + "s ago";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
};

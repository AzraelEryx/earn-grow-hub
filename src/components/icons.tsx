import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
const base = (props: IconProps) => ({
  width: 20, height: 20, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  ...props,
});

export const IconHome = (p: IconProps) => (<svg {...base(p)}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>);
export const IconInfo = (p: IconProps) => (<svg {...base(p)}><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>);
export const IconChart = (p: IconProps) => (<svg {...base(p)}><path d="M4 19h16"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-7"/></svg>);
export const IconMore = (p: IconProps) => (<svg {...base(p)}><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>);
export const IconSun = (p: IconProps) => (<svg {...base(p)}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>);
export const IconMoon = (p: IconProps) => (<svg {...base(p)}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>);
export const IconBell = (p: IconProps) => (<svg {...base(p)}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>);
export const IconWallet = (p: IconProps) => (<svg {...base(p)}><path d="M3 7h15a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H5a2 2 0 0 1-2-2V7z"/><path d="M3 7V5a2 2 0 0 1 2-2h11"/><circle cx="17" cy="14" r="1.5"/></svg>);
export const IconFlame = (p: IconProps) => (<svg {...base(p)}><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-3 2-3 6a6 6 0 0 0 12 0c0-6-6-11-6-11z"/></svg>);
export const IconLock = (p: IconProps) => (<svg {...base(p)}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>);
export const IconCheck = (p: IconProps) => (<svg {...base(p)}><path d="M5 12l4 4L19 6"/></svg>);
export const IconGift = (p: IconProps) => (<svg {...base(p)}><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 13h18M12 8v13"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>);
export const IconCopy = (p: IconProps) => (<svg {...base(p)}><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M15 9V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4"/></svg>);
export const IconUsers = (p: IconProps) => (<svg {...base(p)}><circle cx="9" cy="8" r="3.5"/><path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6"/><circle cx="17" cy="9" r="2.5"/><path d="M22 19c0-2.5-2-4-5-4"/></svg>);
export const IconBolt = (p: IconProps) => (<svg {...base(p)}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>);
export const IconArrowRight = (p: IconProps) => (<svg {...base(p)}><path d="M5 12h14M13 5l7 7-7 7"/></svg>);
export const IconArrowLeft = (p: IconProps) => (<svg {...base(p)}><path d="M19 12H5M11 5l-7 7 7 7"/></svg>);
export const IconArrowUpRight = (p: IconProps) => (<svg {...base(p)}><path d="M7 17L17 7M9 7h8v8"/></svg>);
export const IconArrowDownLeft = (p: IconProps) => (<svg {...base(p)}><path d="M17 7L7 17M15 17H7V9"/></svg>);
export const IconShield = (p: IconProps) => (<svg {...base(p)}><path d="M12 2l8 4v6c0 5-4 9-8 10-4-1-8-5-8-10V6l8-4z"/></svg>);
export const IconUser = (p: IconProps) => (<svg {...base(p)}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>);
export const IconDoc = (p: IconProps) => (<svg {...base(p)}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/></svg>);
export const IconChat = (p: IconProps) => (<svg {...base(p)}><path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>);
export const IconTrophy = (p: IconProps) => (<svg {...base(p)}><path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M4 5h4v3a4 4 0 0 1-4-4M20 5h-4v3a4 4 0 0 0 4-4"/><path d="M9 14v3h6v-3M7 21h10"/></svg>);
export const IconCalendar = (p: IconProps) => (<svg {...base(p)}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>);
export const IconLogout = (p: IconProps) => (<svg {...base(p)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>);
export const IconCamera = (p: IconProps) => (<svg {...base(p)}><path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13" r="4"/></svg>);
export const IconDollar = (p: IconProps) => (<svg {...base(p)}><path d="M12 2v20M17 6H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7"/></svg>);
export const IconRefresh = (p: IconProps) => (<svg {...base(p)}><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>);
export const IconClose = (p: IconProps) => (<svg {...base(p)}><path d="M6 6l12 12M18 6L6 18"/></svg>);
export const IconChevron = (p: IconProps) => (<svg {...base(p)}><path d="M9 6l6 6-6 6"/></svg>);
export const IconChevronDown = (p: IconProps) => (<svg {...base(p)}><path d="M6 9l6 6 6-6"/></svg>);
export const IconLightbulb = (p: IconProps) => (<svg {...base(p)}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c1 1 1.5 2 1.5 3h5c0-1 .5-2 1.5-3a7 7 0 0 0-4-12z"/></svg>);
export const IconStar = (p: IconProps) => (<svg {...base(p)}><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>);
export const IconSpin = (p: IconProps) => (<svg {...base(p)}><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg>);
export const IconHistory = (p: IconProps) => (<svg {...base(p)}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>);
export const IconSettings = (p: IconProps) => (<svg {...base(p)}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>);
export const IconShare = (p: IconProps) => (<svg {...base(p)}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>);
export const IconTelegram = (p: IconProps) => (<svg {...base(p)} viewBox="0 0 24 24"><path d="M22 3L2 11l6 2 2 7 4-4 6 5z" fill="currentColor" stroke="none"/></svg>);
export const IconWhatsapp = (p: IconProps) => (<svg {...base(p)}><path d="M3 21l1.7-5A8 8 0 1 1 8 19.3L3 21z"/><path d="M8.5 9.5c.4 1 1 2 2 3s2 1.6 3 2c.5.2 1 .1 1.4-.3l.6-.6c.3-.3.8-.4 1.2-.2l1.5.8c.3.2.5.6.4 1l-.4 1.2c-.2.5-.7.8-1.2.8-3 0-7-4-7-7 0-.5.3-1 .8-1.2l1.2-.4c.4-.1.8.1 1 .4l.8 1.5c.2.4.1.9-.2 1.2l-.6.6c-.4.4-.5.9-.3 1.4"/></svg>);
export const IconInstagram = (p: IconProps) => (<svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>);
export const IconLinkedin = (p: IconProps) => (<svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 13v4"/></svg>);
export const IconTiktok = (p: IconProps) => (<svg {...base(p)}><path d="M14 3v10a4 4 0 1 1-4-4"/><path d="M14 3c0 3 2 5 5 5"/></svg>);
export const IconFacebook = (p: IconProps) => (<svg {...base(p)}><path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v8h3v-8h2.5l.5-3H14V9c0-.6.4-1 1-1z"/></svg>);
export const IconX = (p: IconProps) => (<svg {...base(p)}><path d="M4 4l16 16M20 4L4 20"/></svg>);
export const IconYoutube = (p: IconProps) => (<svg {...base(p)}><rect x="2" y="6" width="20" height="12" rx="3"/><path d="M10 9l5 3-5 3z" fill="currentColor"/></svg>);
export const IconSeal = (p: IconProps) => (<svg {...base(p)}><path d="M12 2l2.5 2 3.5-.5.5 3.5 2 2.5-2 2.5-.5 3.5-3.5-.5L12 18l-2.5-2-3.5.5-.5-3.5-2-2.5 2-2.5.5-3.5 3.5.5z"/><path d="M9 12l2 2 4-4"/></svg>);

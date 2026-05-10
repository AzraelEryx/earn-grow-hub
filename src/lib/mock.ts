export const NIGERIAN_NAMES = [
  "Benjamin Obinna","Chinwe Adeleke","Tunde Bakare","Ngozi Eze","Emeka Okonkwo",
  "Aisha Bello","Olumide Sanusi","Funke Aromire","Ibrahim Yusuf","Blessing Okafor",
  "Kelechi Nwosu","Folake Adebayo","Yemi Alabi","Chuka Ifeanyi","Hauwa Musa",
  "Tobi Ogunleye","Sade Williams","Uche Nnamdi","Maryam Ahmed","David Ibrahim",
  "Grace Owusu","Samuel Akpan","Halima Sani","Peter Olatunji","Ruth Effiong",
];

export const randAmount = (min = 50000, max = 2500000) =>
  Math.round((Math.random() * (max - min) + min) / 1000) * 1000;

export const randName = () => NIGERIAN_NAMES[Math.floor(Math.random() * NIGERIAN_NAMES.length)];

export const NIGERIAN_BANKS = [
  "Access Bank","Citibank Nigeria","Ecobank Nigeria","Fidelity Bank","First Bank of Nigeria",
  "First City Monument Bank","Globus Bank","Guaranty Trust Bank","Heritage Bank","Keystone Bank",
  "Kuda Bank","Opay","Palmpay","Polaris Bank","Providus Bank","Stanbic IBTC","Standard Chartered",
  "Sterling Bank","SunTrust Bank","Union Bank","United Bank for Africa","Unity Bank","Wema Bank","Zenith Bank",
];

export const PLATFORM_NAME = "Chixx9ja";

export const PLACEHOLDERS = {
  telegram1: "https://t.me/chinex0i",
  telegram2: "https://t.me/chinex0i",
  whatsapp: "[PLACEHOLDER_WHATSAPP_URL]",
  twitter: "https://x.com/",
  facebook: "https://facebook.com/",
  supportHandle: "@OfficialChinex",
  adminPassword: "admin2026",
  welcomeBonus: 5000,
  perReferral: 3500,
};

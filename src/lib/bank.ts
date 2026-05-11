const KEY = "bank_details_v1";

export type BankDetails = {
  accountName: string;
  accountNumber: string;
  bank: string;
};

export function getBankDetails(): BankDetails | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export function saveBankDetails(d: BankDetails) {
  localStorage.setItem(KEY, JSON.stringify(d));
}

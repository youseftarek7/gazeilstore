export function formatCurrency(amount: number, currency: string = "EGP"): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `${safeAmount.toFixed(2)} ${currency}`;
}

export function formatPrice(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `${safeAmount.toFixed(0)} EGP`;
}

export function formatCountdown(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(safeSec / 3600);
  const mins = Math.floor((safeSec % 3600) / 60);
  const secs = safeSec % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function cleanPhoneForWhatsapp(phone: string): string {
  return phone.replace(/[^\d]/g, "").replace(/^0/, "20");
}

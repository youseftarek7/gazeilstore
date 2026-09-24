import { CartItem, CustomerInfo } from "../types";
import { cleanPhoneForWhatsapp } from "./format";

interface BuildOrderMessageParams {
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
  orderId?: string;
  origin?: string;
}

export function buildWhatsAppOrderMessage({
  customer,
  items,
  total,
  orderId,
  origin = typeof window !== "undefined" ? window.location.origin : "https://ghazaldental.com",
}: BuildOrderMessageParams): string {
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const MAX_ITEMS_IN_MSG = 25;
  const isOverLimit = items.length > MAX_ITEMS_IN_MSG;
  const displayedItems = isOverLimit ? items.slice(0, MAX_ITEMS_IN_MSG) : items;

  const itemsMessage = displayedItems
    .map((item, index) => {
      const lineTotal = item.product.price * item.quantity;
      return `${index + 1}. ${item.product.name} (${item.product.code}) × ${item.quantity} = ${lineTotal.toFixed(0)} EGP`;
    })
    .join("\n");

  const extraNote = isOverLimit
    ? `\n... plus (${items.length - MAX_ITEMS_IN_MSG}) more items in the order.`
    : "";

  const orderLink = orderId ? `${origin}/?order=${orderId}` : "";
  const linkText = orderLink
    ? `\n\n📄 *View full invoice & order items:*\n${orderLink}`
    : "";

  return `🦷 *New Order from Ghazal Store*\n\n👤 *Customer Details:*\n• Name: ${customer.name}\n• Phone/WhatsApp: ${customer.phone}\n• Org: ${customer.university || "-"}\n• Address: ${customer.address}\n\n📦 *Items (${totalQty} pcs):*\n${itemsMessage}${extraNote}\n\n💰 *Total:* ${total.toFixed(2)} EGP${linkText}\n\nPlease confirm availability.`;
}

export function generateWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = cleanPhoneForWhatsapp(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function openWhatsAppDirect(phone: string, text: string): void {
  const url = generateWhatsAppUrl(phone, text);
  if (typeof window !== "undefined") {
    const opened = window.open(url, "_blank");
    if (!opened) {
      window.location.href = url;
    }
  }
}

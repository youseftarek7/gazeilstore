import React, { useState } from "react";
import { CartItem } from "../types";
import { CheckCircle2, ClipboardCheck, Loader2, Send, X } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "en" | "ar";
  cartItems: CartItem[];
  onClearCart: () => void;
  whatsappNumber?: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onClearCart,
  whatsappNumber = "201551905201",
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    org: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cleanWhatsapp = whatsappNumber.replace(/[^\d]/g, "").replace(/^0/, "20");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    let orderId = "";
    // Save order in Firestore so admin can track it even if it has 100s of products
    try {
      if (db) {
        const docRef = await addDoc(collection(db, "orders"), {
          customerName: form.name,
          phone: form.phone,
          whatsapp: form.phone,
          university: form.org || "-",
          address: form.address,
          total: total,
          products: cartItems.map((item) => ({
            id: String(item.product.id),
            name: item.product.name,
            code: item.product.code,
            price: item.product.price,
            quantity: item.quantity,
          })),
          itemsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          status: "Pending",
          createdAt: serverTimestamp(),
        });
        orderId = docRef.id;
      }
    } catch (e) {
      console.warn("Could not save order to Firestore:", e);
    }

    const orderLink = orderId ? `${window.location.origin}/?order=${orderId}` : "";

    // Build smart WhatsApp message with character limit protection
    const MAX_ITEMS_IN_MSG = 25;
    const isOverLimit = cartItems.length > MAX_ITEMS_IN_MSG;
    const displayedItems = isOverLimit ? cartItems.slice(0, MAX_ITEMS_IN_MSG) : cartItems;

    const itemsMessage = displayedItems
      .map((item, index) => {
        const lineTotal = item.product.price * item.quantity;
        return `${index + 1}. ${item.product.name} (${item.product.code}) × ${item.quantity} = ${lineTotal.toFixed(0)} EGP`;
      })
      .join("\n");

    const extraNote = isOverLimit
      ? `\n... plus (${cartItems.length - MAX_ITEMS_IN_MSG}) more items in the order.`
      : "";

    const linkText = orderLink
      ? `\n\n📄 *View full invoice & order items:*\n${orderLink}`
      : "";

    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const message = `🦷 *New Order from Ghazal Store*\n\n👤 *Customer Details:*\n• Name: ${form.name}\n• Phone/WhatsApp: ${form.phone}\n• Org: ${form.org || "-"}\n• Address: ${form.address}\n\n📦 *Items (${totalQty} pcs):*\n${itemsMessage}${extraNote}\n\n💰 *Total:* ${total.toFixed(2)} EGP${linkText}\n\nPlease confirm availability.`;

    const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(message)}`;
    
    // Safely open WhatsApp
    const opened = window.open(whatsappUrl, "_blank");
    if (!opened) {
      window.location.href = whatsappUrl;
    }
    
    setIsSuccess(true);
    setSubmitting(false);

    window.setTimeout(() => {
      onClearCart();
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark-blue/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl animate-fade-in">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-display flex items-center gap-2 text-lg font-black text-dark-blue">
            <ClipboardCheck className="h-5 w-5 text-champagne-gold" />
            Delivery Details
          </h3>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="space-y-4 py-8 text-center animate-fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h4 className="font-display text-xl font-extrabold text-dark-blue">Order sent to WhatsApp</h4>
            <p className="mx-auto max-w-xs text-xs leading-relaxed text-slate-500">
              The sales team will receive the order details in WhatsApp. Your cart is being cleared.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Full name *</label>
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition-all focus:border-medical-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-teal/20"
                placeholder=""
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Phone / WhatsApp *</label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition-all focus:border-medical-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-teal/20"
                placeholder=""
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Clinic / University</label>
              <input
                value={form.org}
                onChange={(event) => setForm({ ...form, org: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition-all focus:border-medical-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-teal/20"
                placeholder=""
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Delivery address *</label>
              <textarea
                required
                rows={2}
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition-all focus:border-medical-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-teal/20"
                placeholder="Street, building, city, and any delivery notes"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50 p-3 text-xs text-slate-500">
              <span>Order total</span>
              <span className="text-sm font-extrabold text-medical-teal" dir="ltr">{total.toFixed(2)} EGP</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] font-bold text-white shadow-md transition-all hover:brightness-105 active:scale-95 disabled:opacity-75"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {submitting ? "Preparing order..." : "Send order to WhatsApp"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

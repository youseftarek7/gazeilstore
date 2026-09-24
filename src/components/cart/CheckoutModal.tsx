import React, { useState } from "react";
import { CheckCircle2, ClipboardCheck, Loader2, Send, X } from "lucide-react";
import { useCart, useStorefront } from "../../context";
import { createOrder } from "../../services/orderService";
import { buildWhatsAppOrderMessage, openWhatsAppDirect } from "../../utils/whatsapp";

export default function CheckoutModal() {
  const { cart, totalAmount, clearCart } = useCart();
  const { isCheckoutOpen, setIsCheckoutOpen, settings } = useStorefront();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    org: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isCheckoutOpen) return null;

  const whatsappNumber = settings?.whatsapp || "201551905201";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    let orderId = "";
    try {
      orderId = await createOrder(
        {
          name: form.name,
          phone: form.phone,
          university: form.org,
          address: form.address,
        },
        cart,
        totalAmount
      );
    } catch (e) {
      console.warn("Could not save order to Firestore:", e);
    }

    const message = buildWhatsAppOrderMessage({
      customer: {
        name: form.name,
        phone: form.phone,
        university: form.org,
        address: form.address,
      },
      items: cart,
      total: totalAmount,
      orderId,
    });

    openWhatsAppDirect(whatsappNumber, message);

    setIsSuccess(true);
    setSubmitting(false);

    window.setTimeout(() => {
      clearCart();
      setIsSuccess(false);
      setIsCheckoutOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" dir="ltr">
      <div className="absolute inset-0 bg-dark-blue/60 backdrop-blur-sm" onClick={() => setIsCheckoutOpen(false)}></div>
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-display flex items-center gap-2 text-lg font-black text-dark-blue">
            <ClipboardCheck className="h-5 w-5 text-champagne-gold" />
            Delivery Details
          </h3>
          <button onClick={() => setIsCheckoutOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
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
                placeholder="Doctor / Student Name"
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
                placeholder="01xxxxxxxxx"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Clinic / University</label>
              <input
                value={form.org}
                onChange={(event) => setForm({ ...form, org: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition-all focus:border-medical-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-medical-teal/20"
                placeholder="Sinai University / Private Clinic"
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
              <span className="text-sm font-extrabold text-medical-teal" dir="ltr">{totalAmount.toFixed(2)} EGP</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] font-bold text-white shadow-md transition-all hover:brightness-105 active:scale-95 disabled:opacity-75 cursor-pointer"
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

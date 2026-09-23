import React, { useEffect, useState } from "react";
import { CheckCircle2, Clipboard, Clock, Download, PackageCheck, Printer, User, MapPin, Phone, Building2, X, AlertCircle } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

interface OrderItem {
  id: string;
  name: string;
  code: string;
  price: number;
  quantity: number;
}

interface OrderData {
  customerName: string;
  phone: string;
  whatsapp: string;
  university?: string;
  address: string;
  total: number;
  products: OrderItem[];
  itemsCount: number;
  status: string;
  createdAt?: any;
}

export default function OrderViewModal({
  orderId,
  onClose,
}: {
  orderId: string | null;
  onClose: () => void;
  lang?: "en" | "ar";
}) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId || !db) return;

    setLoading(true);
    getDoc(doc(db, "orders", orderId))
      .then((snap) => {
        if (snap.exists()) {
          setOrder(snap.data() as OrderData);
        } else {
          setOrder(null);
        }
      })
      .catch((err) => {
        console.error("Failed to load order:", err);
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (!orderId) return null;

  const handleCopy = () => {
    if (!order) return;
    const text = `Ghazal Dental Order #${orderId.slice(0, 6).toUpperCase()}\nCustomer: ${order.customerName}\nPhone: ${order.phone}\nAddress: ${order.address}\n\nItems (${order.products?.length || 0}):\n${order.products?.map((p, i) => `${i + 1}. ${p.name} (${p.code}) × ${p.quantity} = ${(p.price * p.quantity).toFixed(0)} EGP`).join("\n")}\n\nTotal: ${Number(order.total || 0).toFixed(2)} EGP`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-fade-in" dir="ltr">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-medical-teal/10 text-medical-teal font-black">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-black text-slate-900">
                Order Details & Invoice
              </h3>
              <p className="text-xs font-bold text-slate-400">
                ID: #{orderId.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="h-8 w-8 mx-auto border-2 border-medical-teal border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-slate-500">
                Loading order details...
              </p>
            </div>
          ) : !order ? (
            <div className="py-12 text-center space-y-3">
              <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
              <h4 className="font-bold text-slate-800">
                Order not found or was removed
              </h4>
            </div>
          ) : (
            <>
              {/* Customer Info Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <User className="h-4 w-4 text-medical-teal shrink-0" />
                  <span className="font-bold text-slate-500">Name:</span>
                  <span className="font-black text-slate-900">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Phone className="h-4 w-4 text-medical-teal shrink-0" />
                  <span className="font-bold text-slate-500">Phone:</span>
                  <a href={`tel:${order.phone}`} className="font-black text-medical-teal underline" dir="ltr">{order.phone}</a>
                </div>
                {order.university && (
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Building2 className="h-4 w-4 text-medical-teal shrink-0" />
                    <span className="font-bold text-slate-500">Org:</span>
                    <span className="font-bold text-slate-800">{order.university}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-slate-700 md:col-span-2">
                  <MapPin className="h-4 w-4 text-medical-teal shrink-0" />
                  <span className="font-bold text-slate-500">Address:</span>
                  <span className="font-bold text-slate-800">{order.address}</span>
                </div>
              </div>

              {/* Products List Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-black text-sm text-slate-900">
                    Ordered Products ({order.products?.length || 0} items)
                  </h4>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {order.status || "Pending"}
                  </span>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-xs font-black text-slate-500 uppercase border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3 text-center w-12">#</th>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-center">Price</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(order.products || []).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition">
                          <td className="px-4 py-2.5 text-center text-xs font-bold text-slate-400">{idx + 1}</td>
                          <td className="px-4 py-2.5">
                            <p className="font-bold text-slate-900">{item.name}</p>
                            {item.code && <span className="text-[11px] font-mono text-slate-400">{item.code}</span>}
                          </td>
                          <td className="px-4 py-2.5 text-center font-black text-slate-800">{item.quantity}</td>
                          <td className="px-4 py-2.5 text-center text-slate-600 font-bold" dir="ltr">{Number(item.price || 0).toFixed(0)} LE</td>
                          <td className="px-4 py-2.5 text-right font-black text-slate-900" dir="ltr">{(Number(item.price || 0) * item.quantity).toFixed(0)} LE</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 font-black text-slate-800 text-base">
                          Total Order Amount:
                        </td>
                        <td className="px-4 py-3 font-black text-lg text-medical-teal text-right" dir="ltr">
                          {Number(order.total || 0).toFixed(2)} EGP
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {order && (
          <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/80 flex items-center justify-between gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm"
            >
              <Clipboard className="h-4 w-4" />
              {copied ? "Copied!" : "Copy as text"}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-xs font-black text-white hover:bg-slate-800 transition shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

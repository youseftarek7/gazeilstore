import React, { useEffect, useState } from "react";
import { X, CheckCircle2, Clock, Truck, PackageCheck, AlertCircle, FileText, Phone, MapPin, Building2, User } from "lucide-react";
import { useStorefront } from "../../context";
import { getOrderById } from "../../services/orderService";
import { Order, OrderStatus } from "../../types";

export default function OrderViewModal() {
  const { activeOrderId, closeOrderModal } = useStorefront();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!activeOrderId) {
      setOrder(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setNotFound(false);

    getOrderById(activeOrderId)
      .then((data) => {
        if (data) {
          setOrder(data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [activeOrderId]);

  if (!activeOrderId) return null;

  const getStatusBadge = (status?: OrderStatus) => {
    switch (status) {
      case "Delivered":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <PackageCheck className="w-4 h-4 text-emerald-600" />,
          label: "Delivered",
        };
      case "Shipping":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Truck className="w-4 h-4 text-blue-600" />,
          label: "Out for Delivery",
        };
      case "Confirmed":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <CheckCircle2 className="w-4 h-4 text-purple-600" />,
          label: "Confirmed",
        };
      case "Cancelled":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock className="w-4 h-4 text-amber-600" />,
          label: "Pending Review",
        };
    }
  };

  const statusInfo = getStatusBadge(order?.status);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" dir="ltr">
      <div className="absolute inset-0 bg-dark-blue/60 backdrop-blur-sm" onClick={closeOrderModal}></div>

      <div className="relative z-10 w-full max-w-xl max-h-[90dvh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-medical-teal/10 flex items-center justify-center text-medical-teal">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-dark-blue">
                Official Order Invoice
              </h3>
              <p className="text-[10.5px] font-mono text-slate-400">ID: {activeOrderId}</p>
            </div>
          </div>
          <button
            onClick={closeOrderModal}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-medical-teal border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Retrieving invoice details...</p>
            </div>
          ) : notFound || !order ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-dark-blue">Order Not Found</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No active order matches this reference ID. Please check with customer care.
              </p>
            </div>
          ) : (
            <>
              {/* Order Status Ribbon */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${statusInfo.bg}`}>
                <div className="flex items-center gap-2.5">
                  {statusInfo.icon}
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 block">Status</span>
                    <span className="text-sm font-black">{statusInfo.label}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold">
                  {order.createdAt ? new Date((order.createdAt as any)?.toMillis?.() || Date.now()).toLocaleDateString() : "Recent"}
                </span>
              </div>

              {/* Customer Details Block */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 text-xs text-slate-600">
                <h4 className="text-[10.5px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  Customer & Delivery Info
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-800">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.university || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{order.address}</span>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="space-y-3">
                <h4 className="text-[10.5px] font-black uppercase tracking-wider text-slate-400">
                  Ordered Items ({order.products?.reduce((s, p) => s + p.quantity, 0) || 0} pcs)
                </h4>

                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
                      <tr>
                        <th className="p-3">Item</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Price</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {order.products?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3">
                            <p className="font-bold text-slate-800">{item.name}</p>
                            <p className="text-[10px] font-mono text-slate-400 uppercase">{item.code}</p>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-700">{item.quantity}</td>
                          <td className="p-3 text-right text-slate-600">{item.price} EGP</td>
                          <td className="p-3 text-right font-black text-dark-blue">
                            {(item.price * item.quantity).toFixed(2)} EGP
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Order Grand Total</span>
                <span className="text-xl font-black text-medical-teal font-sans">
                  {order.total?.toFixed(2)} EGP
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={closeOrderModal}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Close Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { inputClass, Pagination, usePagination, useToast } from "../components/AdminUi";
import { updateDocument } from "../services/firestoreService";
import { AdminOrder, OrderStatus } from "../types/admin";

const statuses: OrderStatus[] = ["Pending", "Confirmed", "Shipping", "Delivered", "Cancelled"];

export default function OrdersPage({ orders }: { orders: AdminOrder[] }) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () => orders.filter((order) => [order.customerName, order.phone, order.whatsapp, order.university, order.status].join(" ").toLowerCase().includes(search.toLowerCase())),
    [orders, search],
  );
  const pagination = usePagination(filtered);

  const changeStatus = async (orderId: string, status: OrderStatus) => {
    await updateDocument("orders", orderId, { status });
    toast("Order status updated");
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4">
        <input className={inputClass} placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">University</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {pagination.currentRows.map((order) => (
              <tr key={order.id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3 font-black text-slate-900">{order.customerName}</td>
                <td className="px-4 py-3 text-slate-600">{order.phone}</td>
                <td className="px-4 py-3 text-slate-600">{order.whatsapp}</td>
                <td className="px-4 py-3 text-slate-600">{order.university}</td>
                <td className="min-w-64 px-4 py-3">
                  <div className="space-y-1">
                    {(order.products || []).map((item, index) => (
                      <p key={`${order.id}-${index}`} className="text-xs text-slate-600">
                        <span className="font-bold text-slate-900">{item.quantity}x</span> {item.name} ({item.code})
                      </p>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 font-black">{Number(order.total || 0).toFixed(2)} EGP</td>
                <td className="px-4 py-3">
                  <select className={inputClass} value={order.status} onChange={(e) => changeStatus(order.id, e.target.value as OrderStatus)}>
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination {...pagination} />
    </div>
  );
}

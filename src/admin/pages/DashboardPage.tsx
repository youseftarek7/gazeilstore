import { AlertTriangle, ClipboardList, DollarSign, Download, Package, ShoppingCart } from "lucide-react";
import { AdminOrder, AdminProduct } from "../types/admin";

export default function DashboardPage({ products, orders }: { products: AdminProduct[]; orders: AdminOrder[] }) {
  const totalSales = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
  const lowStock = products.filter((product) => Number(product.stock || 0) <= 5);
  const latestOrders = orders.slice(0, 5);

  const handleDownloadJson = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      storeName: "Ghazal Dental Store (ستور غزال)",
      totalProducts: products.length,
      totalOrders: orders.length,
      products,
      orders,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ghazal_store_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cards = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-sky-700 bg-sky-50" },
    { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "text-indigo-700 bg-indigo-50" },
    { label: "Total Sales", value: `${totalSales.toFixed(2)} EGP`, icon: DollarSign, color: "text-emerald-700 bg-emerald-50" },
    { label: "Low Stock", value: lowStock.length, icon: AlertTriangle, color: "text-amber-700 bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-black text-slate-900">نظرة عامة على المتجر</h1>
          <p className="text-xs text-slate-500">إحصائيات المنتجات، الأوردرات، والنسخ الاحتياطي</p>
        </div>
        <button
          onClick={handleDownloadJson}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>تحميل كل البيانات (ملف JSON)</span>
        </button>
      </div>
      {/* Beginner Guide */}
      <div className="rounded-lg border border-medical-teal/20 bg-medical-teal/5 p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 mb-2">مرحباً بك في لوحة تحكم المتجر 👋</h2>
        <p className="text-sm text-slate-600 mb-6 font-bold">لو دي أول مرة ليك، دي الخطوات البسيطة علشان تبني متجرك:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right" dir="rtl">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-slate-900 text-white w-8 h-8 flex items-center justify-center font-black rounded-bl-lg">1</div>
            <h3 className="font-black text-slate-900 mt-2">الأقسام (Departments)</h3>
            <p className="text-xs text-slate-500 mt-1">علشان تضيف أي منتج، لازم يكون ليه "قسم" يتبعه (مثلاً: أجهزة، أدوات). ادخل على صفحة الأقسام وضيف أقسام متجرك الأول.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-slate-900 text-white w-8 h-8 flex items-center justify-center font-black rounded-bl-lg">2</div>
            <h3 className="font-black text-slate-900 mt-2">المنتجات (Products)</h3>
            <p className="text-xs text-slate-500 mt-1">بعد ما ضفت الأقسام، ادخل صفحة المنتجات وضيف منتجاتك واربط كل منتج بالقسم بتاعه، وحط السعر والصورة.</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-slate-900 text-white w-8 h-8 flex items-center justify-center font-black rounded-bl-lg">3</div>
            <h3 className="font-black text-slate-900 mt-2">تواصل المتجر (Store Contact)</h3>
            <p className="text-xs text-slate-500 mt-1">ادخل صفحة Store Contact وضيف رقم الواتساب بتاعك علشان العملاء يقدروا يبعتولك الأوردرات عليه مباشرة.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`mb-4 inline-flex rounded-lg p-3 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-black text-slate-950">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
            <ClipboardList className="h-5 w-5 text-medical-teal" />
            <h2 className="font-black text-slate-900">Latest Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {latestOrders.map((order) => (
                  <tr key={order.id} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-bold text-slate-900">{order.customerName}</td>
                    <td className="px-5 py-3 text-slate-500">{order.phone}</td>
                    <td className="px-5 py-3 font-bold">{Number(order.total || 0).toFixed(2)} EGP</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">{order.status}</span>
                    </td>
                  </tr>
                ))}
                {latestOrders.length === 0 && (
                  <tr>
                    <td className="px-5 py-8 text-center text-slate-400" colSpan={4}>
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-black text-slate-900">Low Stock Products</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {lowStock.slice(0, 8).map((product) => (
              <div key={product.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.code}</p>
                </div>
                <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-black text-amber-700">{product.stock}</span>
              </div>
            ))}
            {lowStock.length === 0 && <p className="px-5 py-8 text-sm text-slate-400">Stock levels look healthy.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

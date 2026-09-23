import { Edit, Gift, Plus, Trash2, Upload } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ConfirmModal, Field, inputClass, Modal, Pagination, usePagination, useToast } from "../components/AdminUi";
import { createDocument, removeDocument, updateDocument, uploadAdminImage } from "../services/firestoreService";
import { AdminPackage, AdminProduct } from "../types/admin";

const emptyPackage: Omit<AdminPackage, "id"> = {
  code: "",
  name: "",
  arabicName: "",
  description: "",
  arabicDescription: "",
  originalPrice: 0,
  dealPrice: 0,
  discountPercent: 0,
  image: "",
  tag: "SPECIAL PACKAGE",
  arabicTag: "عرض خاص",
  bullets: [],
  arabicBullets: [],
  productIds: [],
  productCodes: [],
  categoryKey: "special-bundle",
  subCategoryKey: "offers",
  timeLeftSeconds: 7200,
  hidden: false,
  featured: false,
};

export default function PackagesPage({ packages, products }: { packages: AdminPackage[]; products: AdminProduct[] }) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminPackage | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<AdminPackage | null>(null);

  const filtered = useMemo(
    () => packages.filter((item) => [item.name, item.arabicName, item.code].join(" ").toLowerCase().includes(search.toLowerCase())),
    [packages, search],
  );
  const pagination = usePagination(filtered);

  const deletePackage = async () => {
    if (!deleting) return;
    await removeDocument("packages", deleting.id);
    setDeleting(null);
    toast("تم حذف الباكدج");
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="bg-blue-50 p-4 border-b border-blue-100 rounded-t-lg" dir="rtl">
        <h3 className="font-black text-blue-900">الخطوة الثالثة: العروض (اختياري)</h3>
        <p className="text-sm text-blue-800 mt-1">
          لو حابب تعمل عرض مكون من أكثر من منتج مع بعض بسعر مخفض، تقدر تضيفه هنا وتختار المنتجات اللي جوه العرض.
        </p>
      </div>
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
        <input className={inputClass} placeholder="Search packages or codes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => setCreating(true)} className="inline-flex items-center justify-center gap-2 rounded-md bg-medical-teal px-4 py-2 text-sm font-black text-white">
          <Plus className="h-4 w-4" />
          Add Package / Offer
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Visibility</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagination.currentRows.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img src={item.image} className="h-12 w-12 rounded-md object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-400">IMG</div>
                    )}
                    <div>
                      <p className="font-black text-slate-900">{item.arabicName || item.name}</p>
                      <p className="text-xs text-slate-500" dir="ltr">{item.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-black text-medical-teal">{item.dealPrice} EGP</p>
                  <p className="text-xs text-slate-400 line-through">{item.originalPrice} EGP</p>
                </td>
                <td className="px-4 py-3 font-bold text-rose-600">{item.discountPercent}%</td>
                <td className="px-4 py-3 text-slate-600">{item.productCodes?.length || 0}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-black ${item.hidden ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"}`}>
                    {item.hidden ? "Hidden" : "Visible"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(item)} className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleting(item)} className="rounded-md border border-red-100 p-2 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination {...pagination} />

      {(creating || editing) && (
        <PackageForm
          item={editing || undefined}
          products={products}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
      {deleting && <ConfirmModal title="Delete Package" message={`Are you sure you want to delete ${deleting.name}?`} onCancel={() => setDeleting(null)} onConfirm={deletePackage} />}
    </div>
  );
}

function PackageForm({ item, products, onClose }: { item?: AdminPackage; products: AdminProduct[]; onClose: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState<Omit<AdminPackage, "id">>(item || emptyPackage);
  const [bullets, setBullets] = useState<string[]>(item?.bullets || []);
  const [arabicBullets, setArabicBullets] = useState<string[]>(item?.arabicBullets || []);
  const [selectedCodes, setSelectedCodes] = useState<string[]>(item?.productCodes || []);
  const [productSearch, setProductSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const visibleProducts = products
    .filter((product) => [product.name, product.arabicName, product.code].join(" ").toLowerCase().includes(productSearch.toLowerCase()))
    .slice(0, 40);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const chosenProducts = products.filter((product) => selectedCodes.includes(product.code));
    const finalCode = form.code || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const payload = {
      ...form,
      code: finalCode,
      originalPrice: Number(form.originalPrice),
      dealPrice: Number(form.dealPrice),
      discountPercent: Number(form.discountPercent),
      timeLeftSeconds: Number(form.timeLeftSeconds),
      bullets: bullets.filter(Boolean),
      arabicBullets: arabicBullets.filter(Boolean),
      productCodes: selectedCodes,
      productIds: chosenProducts.map((product) => product.id),
    };
    try {
      if (item) await updateDocument("packages", item.id, payload);
      else await createDocument("packages", payload);
      toast(item ? "تم تحديث الباكدج" : "تم إنشاء الباكدج");
      onClose();
    } catch (e: any) {
      toast("فشل حفظ الباكدج: " + (e?.message || "خطأ غير معروف"), "error");
    }
  };

  const uploadImage = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    const url = await uploadAdminImage("packages", file);
    setForm((current) => ({ ...current, image: url }));
    setUploading(false);
    toast("تم رفع الصورة على فايربيس");
  };

  const toggleProduct = (code: string) => {
    setSelectedCodes((codes) => (codes.includes(code) ? codes.filter((item) => item !== code) : [...codes, code]));
  };

  return (
    <Modal title={item ? "Edit Package / Offer" : "Add Package / Offer"} onClose={onClose}>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2 bg-slate-50 p-3 rounded text-sm text-slate-600 mb-2" dir="rtl">
          <strong>نصيحة:</strong> اكتب اسم العرض، وحط السعر القديم والجديد (بعد الخصم)، واختار المنتجات اللي جوه العرض.
        </div>
        <Field label="Offer Name (English)"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Original Price (EGP) - Before Discount"><input className={inputClass} type="number" min="0" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} /></Field>
        <Field label="Deal Price (EGP) - After Discount"><input className={inputClass} type="number" min="0" value={form.dealPrice} onChange={(e) => setForm({ ...form, dealPrice: Number(e.target.value) })} /></Field>
        <div className="md:col-span-2">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm font-black text-slate-600">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Offer Image"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0] || null)} />
          </label>
        </div>
        {form.image && <img src={form.image} className="h-20 w-20 object-cover rounded md:col-span-2" />}

        <details className="md:col-span-2 rounded-lg border border-slate-200 p-4 mt-2">
          <summary className="font-black text-slate-900 cursor-pointer">Advanced Options (Optional)</summary>
          <div className="mt-4 space-y-4">
            <Field label="Discount Percentage (Optional visual)"><input className={inputClass} type="number" min="0" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })} /></Field>
            <Field label="Offer Duration (Hours)"><input className={inputClass} type="number" min="0" value={form.timeLeftSeconds / 3600} onChange={(e) => setForm({ ...form, timeLeftSeconds: Number(e.target.value) * 3600 })} /></Field>
            <Field label="English Description"><textarea className={inputClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <Repeater title="Offer Features (English)" addLabel="Add Feature" items={bullets} onAdd={() => setBullets((items) => [...items, ""])} onRemove={(index) => setBullets((items) => items.filter((_, itemIndex) => itemIndex !== index))} render={(value, index) => (
              <input className={inputClass} value={value} onChange={(e) => setBullets((items) => items.map((item, itemIndex) => itemIndex === index ? e.target.value : item))} />
            )} />
          </div>
        </details>

        <div className="md:col-span-2 rounded-lg border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-black text-slate-900">Included Products</h4>
              <p className="text-xs text-slate-500">Select the products that are part of this package.</p>
            </div>
            <span className="rounded-full bg-medical-teal/10 px-3 py-1 text-xs font-black text-medical-teal">{selectedCodes.length} selected</span>
          </div>
          <input className={inputClass} placeholder="Search products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
          <div className="mt-3 grid max-h-72 grid-cols-1 gap-2 overflow-auto md:grid-cols-2">
            {visibleProducts.map((product) => (
              <label key={product.id} className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-100 bg-slate-50 p-2 text-sm">
                <input type="checkbox" checked={selectedCodes.includes(product.code)} onChange={() => toggleProduct(product.code)} />
                {product.image ? (
                  <img src={product.image} className="h-10 w-10 rounded object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-slate-200 text-[10px] font-bold text-slate-500">IMG</div>
                )}
                <span>
                  <span className="block font-bold text-slate-800">{product.name}</span>
                  <span className="block text-xs text-slate-500">{product.code}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={form.hidden} onChange={(e) => setForm({ ...form, hidden: e.target.checked })} /> Hide Package from Storefront</label>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured Package</label>
        <div className="flex justify-end gap-3 md:col-span-2">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 font-bold text-slate-600">Cancel</button>
          <button className="inline-flex items-center gap-2 rounded-md bg-medical-teal px-4 py-2 font-black text-white">
            <Gift className="h-4 w-4" />
            Save Package
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Repeater<T>({ title, addLabel, items, onAdd, onRemove, render }: {
  title: string;
  addLabel: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  render: (item: T, index: number) => ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-black text-slate-900">{title}</h4>
        <button type="button" onClick={onAdd} className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-black text-white">{addLabel}</button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">{render(item, index)}</div>
            <button type="button" onClick={() => onRemove(index)} className="rounded-md border border-red-100 px-3 py-2 text-xs font-black text-red-600">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

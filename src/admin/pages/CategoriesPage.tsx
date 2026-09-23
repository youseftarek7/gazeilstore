import { Edit, Plus, Trash2, Upload } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { ConfirmModal, Field, inputClass, Modal, Pagination, usePagination, useToast } from "../components/AdminUi";
import { createDocument, removeDocument, saveDocument, uploadAdminImage } from "../services/firestoreService";
import { AdminCategory, AdminSubCategory } from "../types/admin";

const emptyCategory: Omit<AdminCategory, "id"> = {
  key: "",
  name: "",
  arabicName: "",
  description: "",
  image: "",
  sortOrder: 0,
  hidden: false,
  subCategories: [],
};

export default function CategoriesPage({ categories }: { categories: AdminCategory[] }) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<AdminCategory | null>(null);

  const filtered = useMemo(
    () => categories.filter((category) => [category.name, category.arabicName, category.key].join(" ").toLowerCase().includes(search.toLowerCase())),
    [categories, search],
  );
  const pagination = usePagination(filtered);

  const deleteCategory = async () => {
    if (!deleting) return;
    if (deleting.isLocalFallback) {
      const { isLocalFallback, ...payload } = deleting;
      await saveDocument("categories", deleting.id, { ...payload, hidden: true, createdAt: new Date() });
    } else {
      await removeDocument("categories", deleting.id);
    }
    setDeleting(null);
    toast("تم حذف القسم");
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="bg-blue-50 p-4 border-b border-blue-100 rounded-t-lg" dir="rtl">
        <h3 className="font-black text-blue-900">الخطوة الأولى: أقسام المتجر</h3>
        <p className="text-sm text-blue-800 mt-1">
          هنا بتضيف تصنيفات المنتجات (زي: أجهزة، أدوات، مستلزمات). لازم تضيف القسم الأول علشان تقدر تحط المنتجات جواه بعدين.
        </p>
      </div>
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
        <input className={inputClass} placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => setCreating(true)} className="inline-flex items-center justify-center gap-2 rounded-md bg-medical-teal px-4 py-2 text-sm font-black text-white">
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Sub-categories</th>
              <th className="px-4 py-3">Visibility</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagination.currentRows.map((category) => (
              <tr key={category.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-black">{category.sortOrder}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {category.image ? (
                      <img src={category.image} className="h-10 w-10 rounded-md object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-400">IMG</div>
                    )}
                    <div>
                      <p className="font-black text-slate-900">{category.arabicName || category.name}</p>
                      <p className="text-xs text-slate-500">{category.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500" dir="ltr">{category.key}</td>
                <td className="px-4 py-3 text-slate-600">{category.subCategories?.length || 0}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-black ${category.hidden ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"}`}>
                    {category.hidden ? "Hidden" : "Visible"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(category)} className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleting(category)} className="rounded-md border border-red-100 p-2 text-red-600 hover:bg-red-50">
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
      {(creating || editing) && <CategoryForm category={editing || undefined} onClose={() => { setCreating(false); setEditing(null); }} />}
      {deleting && <ConfirmModal title="Delete Category" message={`Are you sure you want to delete ${deleting.name}?`} onCancel={() => setDeleting(null)} onConfirm={deleteCategory} />}
    </div>
  );
}

function CategoryForm({ category, onClose }: { category?: AdminCategory; onClose: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState<Omit<AdminCategory, "id">>(category || emptyCategory);
  const [subCategories, setSubCategories] = useState<AdminSubCategory[]>(category?.subCategories || []);
  const [uploading, setUploading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const finalKey = form.key || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const payload = {
      ...form,
      key: finalKey,
      sortOrder: Number(form.sortOrder),
      subCategories: subCategories
        .filter((item) => item.key || item.name || item.arabicName)
        .map((item) => ({
          ...item,
          key: item.key || item.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `sub-${Math.random().toString(36).substring(2, 8)}`,
        })),
      createdAt: category?.createdAt || new Date(),
    };
    try {
      if (category) await saveDocument("categories", category.id, payload);
      else await createDocument("categories", payload);
      toast(category ? "تم تحديث القسم" : "تم إنشاء القسم");
      onClose();
    } catch (e: any) {
      toast("فشل حفظ القسم: " + (e?.message || "خطأ غير معروف"), "error");
    }
  };

  const uploadImage = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    const url = await uploadAdminImage("categories", file);
    setForm((current) => ({ ...current, image: url }));
    setUploading(false);
    toast("تم رفع صورة القسم على فايربيس");
  };

  const updateSub = (index: number, patch: Partial<AdminSubCategory>) => {
    setSubCategories((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  };

  return (
    <Modal title={category ? "Edit Department" : "Add Department"} onClose={onClose}>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2 bg-slate-50 p-3 rounded text-sm text-slate-600 mb-2" dir="rtl">
          <strong>معلومة:</strong> اكتب اسم القسم بالإنجليزي علشان المتجر أغلبه دكاترة بتتعامل بالإنجليزي، ولو عايز تحط وصف ده اختياري.
        </div>
        <Field label="Department Name (English)"><input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Display Order (e.g. 1, 2, 3)"><input className={inputClass} type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></Field>
        <label className="md:col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-black text-slate-600">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Department Image"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0] || null)} />
        </label>
        {form.image && <img src={form.image} className="h-16 w-16 object-cover rounded md:col-span-2" />}
        <div className="md:col-span-2"><Field label="Department Description (Optional)"><textarea className={inputClass} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field></div>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 md:col-span-2"><input type="checkbox" checked={form.hidden} onChange={(e) => setForm({ ...form, hidden: e.target.checked })} /> Hide Department from Storefront</label>

        <details className="md:col-span-2 rounded-lg border border-slate-200 p-4">
          <summary className="font-black text-slate-900 cursor-pointer">Advanced: Sub-Departments (Optional)</summary>
          <div className="mt-3">
            <div className="mb-3 flex items-center justify-end">
              <button type="button" onClick={() => setSubCategories((items) => [...items, { key: "", name: "", arabicName: "", description: "", arabicDescription: "" }])} className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-black text-white">Add Sub-Category</button>
            </div>
            <div className="space-y-3">
              {subCategories.map((sub, index) => (
                <div key={index} className="rounded-lg bg-slate-50 p-3">
                  <div className="mb-2 flex justify-end">
                    <button type="button" onClick={() => setSubCategories((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-black text-red-600">Remove</button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input className={inputClass} placeholder="Sub-Department Name (English)" value={sub.name} onChange={(e) => updateSub(index, { name: e.target.value })} />
                    <input className={inputClass} placeholder="Sub-Department Name (Arabic)" value={sub.arabicName} onChange={(e) => updateSub(index, { arabicName: e.target.value })} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </details>

        <div className="flex justify-end gap-3 md:col-span-2">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 font-bold text-slate-600">Cancel</button>
          <button className="rounded-md bg-medical-teal px-4 py-2 font-black text-white">Save Category</button>
        </div>
      </form>
    </Modal>
  );
}

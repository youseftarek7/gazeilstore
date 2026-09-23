import { Edit, Eye, EyeOff, Plus, Star, Trash2, Upload } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ConfirmModal, Field, inputClass, Modal, Pagination, usePagination, useToast } from "../components/AdminUi";
import { createDocument, removeDocument, saveDocument, uploadAdminImage } from "../services/firestoreService";
import { AdminCategory, AdminProduct } from "../types/admin";

interface ProductDetailBlock {
  title: string;
  body: string;
  image: string;
  bullets: string[];
}

const emptyProduct: Omit<AdminProduct, "id"> = {
  code: "",
  name: "",
  arabicName: "",
  price: 0,
  stock: 0,
  image: "",
  images: [],
  categoryKey: "",
  subCategoryKey: "",
  description: "",
  arabicDescription: "",
  specifications: [],
  arabicSpecifications: [],
  detailSections: [],
  showInHomeSplit: false,
  splitTitle: "",
  splitDescription: "",
  splitImage: "",
  splitBadge: "",
  splitLabel: "",
  splitButtonText: "",
  splitFeatures: [],
  hidden: false,
  featured: false,
};

export default function ProductsPage({ products, categories }: { products: AdminProduct[]; categories: AdminCategory[] }) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleting, setDeleting] = useState<AdminProduct | null>(null);

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesText = [product.name, product.arabicName, product.code].join(" ").toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "all" || product.categoryKey === categoryFilter;
        return matchesText && matchesCategory;
      }),
    [products, search, categoryFilter],
  );
  const pagination = usePagination(filtered);

  const handleDelete = async () => {
    if (!deleting) return;
    if (deleting.isLocalFallback) {
      const { isLocalFallback, ...payload } = deleting;
      await saveDocument("products", deleting.id, { ...payload, hidden: true, createdAt: new Date() });
    } else {
      await removeDocument("products", deleting.id);
    }
    setDeleting(null);
    toast("تم حذف المنتج");
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="bg-blue-50 p-4 border-b border-blue-100 rounded-t-lg" dir="rtl">
        <h3 className="font-black text-blue-900">الخطوة الثانية: المنتجات</h3>
        <p className="text-sm text-blue-800 mt-1">
          هنا بتضيف كل المنتجات اللي بتبيعها. مهم جداً تختار "القسم" الصح لكل منتج علشان يظهر للعملاء بشكل مترتب. اكتب الاسم والسعر وحط صورة.
        </p>
      </div>
      <div className="border-b border-slate-100 p-4">
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className={inputClass} placeholder="Search product name or code..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className={inputClass} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.key}>{category.name}</option>)}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 [&>input]:hidden md:flex-row md:items-center md:justify-end">
        <input className={inputClass} placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => setIsCreating(true)} className="inline-flex items-center justify-center gap-2 rounded-md bg-medical-teal px-4 py-2 text-sm font-black text-white">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagination.currentRows.map((product) => (
              <tr key={product.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.image ? (
                      <img src={product.image} className="h-12 w-12 rounded-md object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-400">IMG</div>
                    )}
                    <div>
                      <p className="font-black text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{product.categoryKey}</td>
                <td className="px-4 py-3 font-bold">{product.price} EGP</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs font-black ${product.stock <= 5 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {product.hidden ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-emerald-600" />}
                    {product.featured && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(product)} className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleting(product)} className="rounded-md border border-red-100 p-2 text-red-600 hover:bg-red-50">
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

      {(isCreating || editing) && (
        <ProductForm
          categories={categories}
          product={editing || undefined}
          onClose={() => {
            setIsCreating(false);
            setEditing(null);
          }}
        />
      )}
      {deleting && (
        <ConfirmModal
          title="Delete Product"
          message={`Are you sure you want to delete ${deleting.name}? This cannot be undone.`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function ProductForm({
  product,
  categories,
  onClose,
}: {
  product?: AdminProduct;
  categories: AdminCategory[];
  onClose: () => void;
}) {
  const toast = useToast();
  const [form, setForm] = useState<Omit<AdminProduct, "id">>(product || emptyProduct);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images?.length ? product.images : product?.image ? [product.image] : []);
  const [specifications, setSpecifications] = useState<string[]>(product?.specifications || []);
  const [arabicSpecifications, setArabicSpecifications] = useState<string[]>(product?.arabicSpecifications || []);
  const [splitFeatures, setSplitFeatures] = useState<string[]>(product?.splitFeatures || []);
  const [detailSections, setDetailSections] = useState<ProductDetailBlock[]>(
    (product?.detailSections as ProductDetailBlock[] | undefined) || [],
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const cleanImages = images.filter(Boolean);
    const finalCode = form.code || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { isLocalFallback, ...cleanForm } = form as any;
    const payload = {
      ...cleanForm,
      code: finalCode,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image || cleanImages[0] || "",
      images: cleanImages,
      specifications: specifications.filter(Boolean),
      arabicSpecifications: arabicSpecifications.filter(Boolean),
      splitFeatures: splitFeatures.filter(Boolean),
      splitImage: form.splitImage || form.image || cleanImages[0] || "",
      detailSections: detailSections
        .map((section) => ({
          ...section,
          bullets: section.bullets.filter(Boolean),
        }))
        .filter((section) => section.title || section.body || section.image || section.bullets.length),
      createdAt: product?.createdAt || new Date(),
    };
    try {
      if (product) await saveDocument("products", product.id, payload);
      else await createDocument("products", payload);
      toast(product ? "تم حفظ المنتج" : "تم إنشاء المنتج");
      onClose();
    } catch (e: any) {
      toast("فشل الحفظ: " + (e?.message || "خطأ غير معروف"), "error");
    }
  };

  const uploadImage = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    const url = await uploadAdminImage("products", file);
    setForm((current) => ({ ...current, image: url, images: [...(current.images || []), url] }));
    setImages((current) => [...current, url]);
    setUploading(false);
  };

  return (
    <Modal title={product ? "Edit Product" : "Add Product"} onClose={onClose}>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2 bg-slate-50 p-3 rounded text-sm text-slate-600 mb-2" dir="rtl">
          <strong>نصيحة:</strong> أضف اسم المنتج بالإنجليزي، واختار القسم الخاص به، واكتب السعر. لو مش عايز تحط كمية سيبها 0 (هيبان إنه متوفر عادي).
        </div>
        <Field label="Product Name (English)"><input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Department">
          <select className={inputClass} value={form.categoryKey} onChange={(e) => {
            const category = categories.find((item) => item.key === e.target.value);
            const firstSub = category?.subCategories?.[0];
            setForm({ ...form, categoryKey: e.target.value, subCategoryKey: firstSub ? (firstSub.key || firstSub.name || firstSub.arabicName) : "" });
          }}>
            <option value="">Select Department</option>
            {categories.map((category) => <option key={category.id} value={category.key}>{category.name}</option>)}
          </select>
        </Field>
        <Field label="Sub-Department">
          <select className={inputClass} value={form.subCategoryKey} onChange={(e) => setForm({ ...form, subCategoryKey: e.target.value })}>
            <option value="">Select Sub-Department</option>
            {categories.find((category) => category.key === form.categoryKey)?.subCategories?.map((sub, idx) => {
              const val = sub.key || sub.name || sub.arabicName;
              return <option key={idx} value={val}>{sub.name || sub.arabicName}</option>;
            })}
          </select>
        </Field>
        <Field label="Price (EGP)"><input className={inputClass} type="number" min="0" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></Field>
        <Field label="Stock Quantity (Optional)"><input className={inputClass} type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></Field>
        <div className="md:col-span-2">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm font-black text-slate-600">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Main Product Image"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0] || null)} />
          </label>
          <p className="text-xs text-slate-500 mt-2 text-center">المقاس الموصى به: 800x800 بكسل (مربع 1:1) بخلفية بيضاء أو مفرغة.</p>
        </div>
        {form.image && <img src={form.image} className="h-20 w-20 object-cover rounded md:col-span-2" />}
        <div className="md:col-span-2"><Field label="Product Description (Optional)"><textarea className={inputClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field></div>
        
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Mark as Best Seller (Star Icon)</label>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={form.hidden} onChange={(e) => setForm({ ...form, hidden: e.target.checked })} /> Hide Product Temporarily</label>

        <details className="md:col-span-2 rounded-lg border border-slate-200 p-4 mt-4">
          <summary className="font-black text-slate-900 cursor-pointer">Advanced Options (Optional)</summary>
          <div className="mt-4 space-y-4">
          <Repeater
            title="Product Images"
            addLabel="Add image"
            items={images}
            onAdd={() => setImages((items) => [...items, ""])}
            onRemove={(index) => setImages((items) => items.filter((_, itemIndex) => itemIndex !== index))}
            render={(image, index) => (
              <div className="flex gap-3">
                <input className={inputClass} value={image} placeholder="Image URL" onChange={(e) => setImages((items) => items.map((item, itemIndex) => itemIndex === index ? e.target.value : item))} />
                {image && <img src={image} className="h-10 w-10 rounded-md object-cover" />}
              </div>
            )}
          />
        </div>
        <div className="md:col-span-2">
          <Repeater
            title="Specifications"
            addLabel="Add specification"
            items={specifications}
            onAdd={() => setSpecifications((items) => [...items, ""])}
            onRemove={(index) => setSpecifications((items) => items.filter((_, itemIndex) => itemIndex !== index))}
            render={(spec, index) => (
              <input className={inputClass} value={spec} placeholder="Specification text" onChange={(e) => setSpecifications((items) => items.map((item, itemIndex) => itemIndex === index ? e.target.value : item))} />
            )}
          />
        </div>
        <div className="md:col-span-2">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-black text-slate-900">Details Sections</h4>
              <button type="button" onClick={() => setDetailSections((items) => [...items, { title: "", body: "", image: "", bullets: [] }])} className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-black text-white">Add section</button>
            </div>
            <div className="space-y-4">
              {detailSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="rounded-lg bg-slate-50 p-3">
                  <div className="mb-3 flex justify-end">
                    <button type="button" onClick={() => setDetailSections((items) => items.filter((_, index) => index !== sectionIndex))} className="text-xs font-black text-red-600">Remove section</button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input className={inputClass} placeholder="Section title" value={section.title} onChange={(e) => setDetailSections((items) => items.map((item, index) => index === sectionIndex ? { ...item, title: e.target.value } : item))} />
                    <input className={inputClass} placeholder="Section image URL" value={section.image} onChange={(e) => setDetailSections((items) => items.map((item, index) => index === sectionIndex ? { ...item, image: e.target.value } : item))} />
                    <textarea className={`${inputClass} md:col-span-2`} rows={3} placeholder="Section body" value={section.body} onChange={(e) => setDetailSections((items) => items.map((item, index) => index === sectionIndex ? { ...item, body: e.target.value } : item))} />
                  </div>
                  <Repeater
                    title="Section bullets"
                    addLabel="Add bullet"
                    items={section.bullets}
                    onAdd={() => setDetailSections((items) => items.map((item, index) => index === sectionIndex ? { ...item, bullets: [...item.bullets, ""] } : item))}
                    onRemove={(bulletIndex) => setDetailSections((items) => items.map((item, index) => index === sectionIndex ? { ...item, bullets: item.bullets.filter((_, currentIndex) => currentIndex !== bulletIndex) } : item))}
                    render={(bullet, bulletIndex) => (
                      <input className={inputClass} value={bullet} placeholder="Bullet text" onChange={(e) => setDetailSections((items) => items.map((item, index) => index === sectionIndex ? { ...item, bullets: item.bullets.map((current, currentIndex) => currentIndex === bulletIndex ? e.target.value : current) } : item))} />
                    )}
                  />
                </div>
              ))}
            </div>
            </div>
          </div>
        </details>
        <div className="flex justify-end gap-3 md:col-span-2 mt-4">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 font-bold text-slate-600">Cancel</button>
          <button className="rounded-md bg-medical-teal px-4 py-2 font-black text-white">Save Product</button>
        </div>
      </form>
    </Modal>
  );
}

function Repeater<T>({
  title,
  addLabel,
  items,
  onAdd,
  onRemove,
  render,
}: {
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

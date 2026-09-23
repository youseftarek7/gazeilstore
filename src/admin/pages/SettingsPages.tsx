import { FormEvent, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { ReactNode } from "react";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { Field, inputClass, useToast } from "../components/AdminUi";
import { getDocument, saveDocument, uploadAdminImage } from "../services/firestoreService";
import { AdminCategory, AdminPackage, AdminProduct, DeveloperSettings, HomepageSettings, StoreSettings } from "../types/admin";

type CardAction = "category" | "product" | "offer";

interface DestinationCardForm {
  id: string;
  actionType: CardAction;
  categoryKey: string;
  subCategoryKey: string;
  offerId: string;
  productCode: string;
  productId: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  label: string;
  features: string[];
  buttonText: string;
}

const emptyDestinationCard: DestinationCardForm = {
  id: "",
  actionType: "category",
  categoryKey: "best",
  subCategoryKey: "",
  offerId: "",
  productCode: "",
  productId: "",
  title: "",
  description: "",
  image: "",
  badge: "",
  label: "",
  features: [],
  buttonText: "",
};

const defaultHomepage: HomepageSettings = {
  id: "main",
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",
  offersBanner: "",
  academicYearsSection: "",
  clinicsSection: "",
  splitEyebrow: "",
  splitTitle: "",
  splitSubtitle: "",
  academicTitle: "",
  academicDescription: "",
  academicImage: "",
  academicBadge: "",
  academicLabel: "",
  academicFeatures: ["Autoclavable Dental Models", "Medical Wax & Carver Sets"],
  clinicsTitle: "",
  clinicsDescription: "",
  clinicsImage: "",
  clinicsBadge: "",
  clinicsLabel: "",
  clinicsFeatures: ["Microbrush & Curing Lights", "Super Stainless Steel Forceps"],
  offersEyebrow: "",
  offersTitle: "",
  offersSubtitle: "",
  offers: [],
  categoryBrowserTitle: "",
  categoryBrowserSubtitle: "",
  destinationCards: [],
  trendingTags: ["Composite", "Model", "Etch"],
  trendingLinks: [],
  heroCardImage: "",
  heroCardTitle: "",
  heroCardSubtitle: "",
  heroCardTag: "",
  heroCardCategoryKey: "",
  sidebarLinks: [],
  customSliders: [],
  customBanners: [],
};

const defaultStore: StoreSettings = {
  id: "main",
  phone: "",
  whatsapp: "",
  address: "",
  facebook: "",
  instagram: "",
  tiktok: "",
  youtube: "",
};

const defaultDeveloper: DeveloperSettings = {
  id: "main",
  name: "",
  image: "",
  jobTitle: "",
  phone: "",
  whatsapp: "",
};

export function HomeSettingsPage({
  categories = [],
  products = [],
  packages = [],
}: {
  categories?: AdminCategory[];
  products?: AdminProduct[];
  packages?: AdminPackage[];
}) {
  const [form, setForm] = useState(defaultHomepage);
  const [academicFeatures, setAcademicFeatures] = useState<string[]>(defaultHomepage.academicFeatures || []);
  const [clinicsFeatures, setClinicsFeatures] = useState<string[]>(defaultHomepage.clinicsFeatures || []);
  const [trendingTags, setTrendingTags] = useState<string[]>(defaultHomepage.trendingTags || []);
  const [trendingLinks, setTrendingLinks] = useState<{label: string; productId: string}[]>(defaultHomepage.trendingLinks || []);
  const [sidebarLinks, setSidebarLinks] = useState<{label: string; arLabel: string; categoryKey: string; subCategoryKey?: string}[]>(defaultHomepage.sidebarLinks || []);
  const [customSliders, setCustomSliders] = useState<{title: string; image: string; productId: string}[]>(defaultHomepage.customSliders || []);
  const [customBanners, setCustomBanners] = useState<{image: string; productId: string}[]>(defaultHomepage.customBanners || []);
  const [destinationCards, setDestinationCards] = useState<DestinationCardForm[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [tab, setTab] = useState<"hero" | "cards" | "offers" | "categories" | "sidebar" | "showcase">("hero");
  const [uploading, setUploading] = useState("");
  const toast = useToast();

  useEffect(() => {
    getDocument<HomepageSettings>("homepage", "main").then((settings) => {
      const next = settings || defaultHomepage;
      setForm(next);
      setAcademicFeatures(next.academicFeatures || []);
      setClinicsFeatures(next.clinicsFeatures || []);
      setTrendingTags(next.trendingTags && next.trendingTags.length > 0 ? next.trendingTags : ["Composite", "Model", "Etch"]);
      setTrendingLinks(next.trendingLinks || []);
      setSidebarLinks(next.sidebarLinks || []);
      setCustomSliders(next.customSliders || []);
      setCustomBanners(next.customBanners || []);
      setDestinationCards(((next.destinationCards || []) as Partial<DestinationCardForm>[]).map((card) => ({ ...emptyDestinationCard, ...card, actionType: normalizeAction(card.actionType) })));
    });
  }, []);

  const uploadImage = async (field: keyof HomepageSettings, file: File | null) => {
    if (!file) return;
    setUploading(String(field));
    try {
      const url = await uploadAdminImage("homepage", file);
      setForm((current) => ({ ...current, [field]: url }));
      toast("Image uploaded to Firebase");
    } catch {
      toast("Firebase upload failed. Check Storage configuration.", "error");
    } finally {
      setUploading("");
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await saveDocument("homepage", "main", {
        ...form,
        academicFeatures: academicFeatures.filter(Boolean),
        clinicsFeatures: clinicsFeatures.filter(Boolean),
        trendingTags: trendingTags.filter(Boolean),
        trendingLinks: trendingLinks.filter(l => l.label && l.productId),
        sidebarLinks: sidebarLinks.filter(l => l.label && l.arLabel && l.categoryKey),
        customSliders: customSliders.filter(s => s.image),
        customBanners: customBanners.filter(b => b.image),
        offers: [],
        destinationCards: destinationCards
          .map((card) => ({ ...card, features: card.features.filter(Boolean) }))
          .filter((card) => card.title || card.image || card.description),
      });
      toast("Home page saved");
    } catch (e: any) {
      toast("Firebase save failed: " + (e.message || "Unknown error"), "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">تصميم الصفحة الرئيسية للمتجر</h2>
          </div>
          <button disabled={isSaving} className="rounded-md bg-medical-teal px-5 py-2.5 text-sm font-black text-white disabled:opacity-50">
            {isSaving ? "Saving..." : "Save home page"}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {[
            ["hero", "1. واجهة الموقع الرئيسية (البانر)"],
            ["cards", "2. كروت الوصول السريع (تحت البانر)"],
            ["offers", "3. نصوص قسم العروض"],
            ["categories", "4. نصوص أقسام المتجر"],
            ["sidebar", "5. روابط القائمة الجانبية (للموبايل)"],
            ["showcase", "6. المنتجات والبانرات المتحركة"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id as typeof tab)}
              className={`rounded-md px-4 py-2 text-xs font-black ${tab === id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "hero" && (
        <EditorPanel title="1. إعدادات واجهة المتجر الرئيسية (Top Banner)">
          <Field label="العنوان العريض الرئيسي (الذي يظهر فوق الصورة)"><input className={inputClass} value={form.heroTitle} placeholder="مثال: جهز عيادتك بأفضل الأدوات" onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} /></Field>
          <Field label="الوصف التفصيلي (الذي يظهر تحت العنوان العريض)"><textarea className={inputClass} rows={3} value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} /></Field>
          <ImageField label="الصورة الأساسية في أعلى الصفحة" hint="المقاس الموصى به: صورة بخلفية مفرغة (PNG) أو 800x800 بكسل." value={form.heroImage} uploading={uploading === "heroImage"} onChange={(value) => setForm({ ...form, heroImage: value })} onUpload={(file) => uploadImage("heroImage", file)} />
          <div className="md:col-span-2">
            <TrendingLinksEditor links={trendingLinks} setLinks={setTrendingLinks} products={products} />
          </div>
          
          <div className="md:col-span-2 mt-6 pt-6 border-t border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">إعدادات بطاقة المنتج البارزة (البطاقة العائمة بجوار النص)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="الاسم الرئيسي داخل البطاقة (مثال: مجسم أسنان 3D)"><input className={inputClass} value={form.heroCardTitle || ""} onChange={(e) => setForm({ ...form, heroCardTitle: e.target.value })} /></Field>
              <Field label="الاسم الفرعي / الماركة (مثال: غزال الطبية)"><input className={inputClass} value={form.heroCardSubtitle || ""} onChange={(e) => setForm({ ...form, heroCardSubtitle: e.target.value })} /></Field>
              <Field label="شريط التميز الصغير (مثال: منتج معتمد)"><input className={inputClass} value={form.heroCardTag || ""} onChange={(e) => setForm({ ...form, heroCardTag: e.target.value })} /></Field>
              <Field label="القسم المستهدف (عندما يضغط العميل على البطاقة، أين يذهب؟)">
                <select className={inputClass} value={form.heroCardCategoryKey || ""} onChange={(e) => setForm({ ...form, heroCardCategoryKey: e.target.value })}>
                  <option value="">بدون رابط</option>
                  <option value="best">الكل / الأكثر مبيعاً</option>
                  {categories.map((c) => <option key={c.key || c.id} value={c.key || c.id}>{c.name}</option>)}
                </select>
              </Field>
              <div className="md:col-span-2">
                <ImageField label="صورة الكارت المربع" hint="المقاس الموصى به: 800x800 بكسل (مربع 1:1)." value={form.heroCardImage} uploading={uploading === "heroCardImage"} onChange={(value) => setForm({ ...form, heroCardImage: value })} onUpload={(file) => uploadImage("heroCardImage", file)} />
              </div>
            </div>
          </div>
        </EditorPanel>
      )}

      {tab === "cards" && (
        <EditorPanel title="2. كروت الوصول السريع (Shortcut Cards)">
          <Field label="العنوان الصغير فوق الكروت (مثال: تصفح السريع)"><input className={inputClass} value={form.splitEyebrow || ""} onChange={(e) => setForm({ ...form, splitEyebrow: e.target.value })} /></Field>
          <Field label="عنوان قسم الكروت الرئيسي"><input className={inputClass} value={form.splitTitle || ""} onChange={(e) => setForm({ ...form, splitTitle: e.target.value })} /></Field>
          <div className="md:col-span-2"><Field label="وصف فرعي لقسم الكروت"><textarea className={inputClass} rows={2} value={form.splitSubtitle || ""} onChange={(e) => setForm({ ...form, splitSubtitle: e.target.value })} /></Field></div>
          <div className="md:col-span-2">
            <DestinationCardsEditor cards={destinationCards} setCards={setDestinationCards} categories={categories} products={products} packages={packages} />
          </div>
        </EditorPanel>
      )}

      {tab === "offers" && (
        <EditorPanel title="3. نصوص قسم العروض (Offers Section)">
          <Field label="العنوان الصغير فوق العروض (مثال: خصومات حصرية)"><input className={inputClass} value={form.offersEyebrow || ""} onChange={(e) => setForm({ ...form, offersEyebrow: e.target.value })} /></Field>
          <Field label="عنوان قسم العروض العريض"><input className={inputClass} value={form.offersTitle || ""} onChange={(e) => setForm({ ...form, offersTitle: e.target.value })} /></Field>
          <div className="md:col-span-2"><Field label="وصف قسم العروض"><textarea className={inputClass} rows={2} value={form.offersSubtitle || ""} onChange={(e) => setForm({ ...form, offersSubtitle: e.target.value })} /></Field></div>
        </EditorPanel>
      )}

      {tab === "categories" && (
        <EditorPanel title="4. نصوص شبكة الأقسام (Departments Grid)">
          <Field label="عنوان قسم شبكة الأقسام"><input className={inputClass} value={form.categoryBrowserTitle || ""} onChange={(e) => setForm({ ...form, categoryBrowserTitle: e.target.value })} /></Field>
          <div className="md:col-span-2"><Field label="وصف قسم شبكة الأقسام"><textarea className={inputClass} rows={2} value={form.categoryBrowserSubtitle || ""} onChange={(e) => setForm({ ...form, categoryBrowserSubtitle: e.target.value })} /></Field></div>
          <div className="md:col-span-2">
            <StringListEditor title="نقاط مميزات قسم الأكاديمي والطلبة" items={academicFeatures} setItems={setAcademicFeatures} placeholder="مثال: ضمان لمدة عام" />
          </div>
          <div className="md:col-span-2">
            <StringListEditor title="نقاط مميزات قسم العيادات" items={clinicsFeatures} setItems={setClinicsFeatures} placeholder="مثال: شحن سريع للعيادات" />
          </div>
        </EditorPanel>
      )}

      {tab === "sidebar" && (
        <EditorPanel title="5. القائمة الجانبية (Sidebar Custom Links)">
          <SidebarLinksEditor links={sidebarLinks} setLinks={setSidebarLinks} categories={categories} />
        </EditorPanel>
      )}

      {tab === "showcase" && (
        <EditorPanel title="6. المنتجات والبانرات المتحركة (Dynamic Showcase)">
          <div className="md:col-span-2 mb-6">
             <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-4" dir="rtl">
                <strong>أضف هنا:</strong> المنتجات والبانرات المتحركة التي تظهر أسفل الهيدر (بدل قسم Why Ghazal). عند النقر عليها، يمكن للعميل إضافتها للسلة فوراً.
             </div>
             <ShowcaseSlidersEditor sliders={customSliders} setSliders={setCustomSliders} products={products} />
          </div>
          <div className="md:col-span-2 pt-6 border-t border-slate-200">
             <ShowcaseBannersEditor banners={customBanners} setBanners={setCustomBanners} products={products} />
          </div>
        </EditorPanel>
      )}
    </form>
  );
}

export function StoreSettingsPage() {
  const [form, setForm] = useState(defaultStore);
  const [adminPassword, setAdminPassword] = useState("");
  const toast = useToast();

  useEffect(() => {
    getDocument<StoreSettings>("settings", "main").then((settings) => setForm(settings || defaultStore));
    getDocument<{ password?: string }>("settings", "adminAuth").then((authDoc) => {
      setAdminPassword(authDoc?.password || "admin123");
    });
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await saveDocument("settings", "main", form);
      await saveDocument("settings", "adminAuth", { password: adminPassword });
      toast("تم حفظ الإعدادات وكلمة المرور");
    } catch {
      toast("Firebase save failed", "error");
    }
  };

  return (
    <SettingsShell title="معلومات التواصل (Contact Info)" onSubmit={submit}>
      <div className="md:col-span-2 bg-blue-50 p-3 rounded text-sm text-blue-800 mb-2" dir="rtl">
        <strong>هام جداً:</strong> اكتب رقم الواتساب بتاعك هنا لأن ده الرقم اللي هيتبعت عليه كل طلبات العملاء من الموقع.
      </div>
      <Field label="Phone Number"><input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
      <Field label="WhatsApp number for orders"><input className={inputClass} value={form.whatsapp} placeholder="201551905201" onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} /></Field>
      
      <div className="md:col-span-2 border-t border-slate-100 mt-4 pt-6 pb-2">
        <h3 className="font-black text-slate-900 mb-1">كلمة مرور لوحة التحكم</h3>
        <p className="text-xs text-slate-500 mb-4">تقدر تغير كلمة المرور اللي بتدخل بيها على الإدارة من هنا.</p>
        <Field label="Admin Password"><input className={inputClass} type="text" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} dir="ltr" /></Field>
      </div>

      <div className="md:col-span-2 border-t border-slate-100 mt-4 pt-6 pb-2">
        <h3 className="font-black text-slate-900 mb-1">حسابات التواصل الاجتماعي</h3>
      </div>
      <Field label="Address"><textarea className={inputClass} rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
      <Field label="Facebook"><input className={inputClass} value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} /></Field>
      <Field label="Instagram"><input className={inputClass} value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} /></Field>
      <Field label="TikTok"><input className={inputClass} value={form.tiktok} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} /></Field>
      <Field label="YouTube"><input className={inputClass} value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} /></Field>
    </SettingsShell>
  );
}

export function DeveloperSettingsPage() {
  const [form, setForm] = useState(defaultDeveloper);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getDocument<DeveloperSettings>("developer", "main").then((settings) => setForm(settings || defaultDeveloper));
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await saveDocument("developer", "main", form);
      toast("Developer settings saved");
    } catch {
      toast("Firebase save failed", "error");
    }
  };

  const uploadImage = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAdminImage("developer", file);
      setForm({ ...form, image: url });
      toast("Image uploaded");
    } catch {
      toast("Firebase upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SettingsShell title="Developer settings" onSubmit={submit}>
      <Field label="Developer name"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
      <ImageField label="Developer image" value={form.image} uploading={uploading} onChange={(value) => setForm({ ...form, image: value })} onUpload={uploadImage} />
      <Field label="Job title"><input className={inputClass} value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} /></Field>
      <Field label="Phone"><input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
      <Field label="WhatsApp"><input className={inputClass} value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} /></Field>
    </SettingsShell>
  );
}

function SettingsShell({ title, children, onSubmit }: { title: string; children: ReactNode; onSubmit: (event: FormEvent) => void }) {
  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-xl font-black text-slate-950">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
      <div className="mt-6 flex justify-end">
        <button className="rounded-md bg-medical-teal px-5 py-2.5 text-sm font-black text-white">Save</button>
      </div>
    </form>
  );
}

function EditorPanel({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-black text-slate-950">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function ImageField({ label, hint, value, uploading, onChange, onUpload }: { label: string; hint?: string; value: string; uploading: boolean; onChange: (value: string) => void; onUpload: (file: File | null) => void }) {
  return (
    <div className="space-y-2">
      <Field label={label}>
        <input className={inputClass} value={value} placeholder="رابط الصورة أو ارفع ملف أدناه" onChange={(e) => onChange(e.target.value)} />
        {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      </Field>
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-100 transition-colors">
        <ImagePlus className="h-4 w-4" />
        {uploading ? "جاري الرفع..." : "ارفع صورة (Base64 — بدون Firebase Storage)"}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files?.[0] || null)} />
      </label>
      {value && <img src={value} className="h-24 w-full rounded-md object-cover" />}
    </div>
  );
}


function DestinationCardsEditor({ cards, setCards, categories, products, packages }: {
  cards: DestinationCardForm[];
  setCards: Dispatch<SetStateAction<DestinationCardForm[]>>;
  categories: AdminCategory[];
  products: AdminProduct[];
  packages: AdminPackage[];
}) {
  const [uploadingCardIndex, setUploadingCardIndex] = useState<number | null>(null);

  const updateCard = (index: number, patch: Partial<DestinationCardForm>) => {
    setCards((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  };

  const handleCardImageUpload = async (index: number, file: File | null) => {
    if (!file) return;
    setUploadingCardIndex(index);
    try {
      const { uploadAdminImage } = await import("../services/firestoreService");
      const base64 = await uploadAdminImage("cards", file);
      updateCard(index, { image: base64 });
    } catch {
      alert("فشل رفع الصورة.");
    } finally {
      setUploadingCardIndex(null);
    }
  };


  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-slate-900">Cards</h3>
          <p className="mt-1 text-xs text-slate-500">Choose what each card opens. No manual codes needed.</p>
        </div>
        <button type="button" onClick={() => setCards((items) => [...items, { ...emptyDestinationCard, id: `card-${Date.now()}` }])} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-black text-white">
          <Plus className="h-4 w-4" />
          Add card
        </button>
      </div>

      <div className="space-y-4">
        {cards.map((card, index) => (
          <div key={card.id || index} className="rounded-lg bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-black text-slate-800">Card {index + 1}</h4>
              <button type="button" onClick={() => setCards((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="inline-flex items-center gap-1 text-xs font-black text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="Card title"><input className={inputClass} value={card.title} onChange={(e) => updateCard(index, { title: e.target.value })} /></Field>
              <Field label="Button text"><input className={inputClass} value={card.buttonText} onChange={(e) => updateCard(index, { buttonText: e.target.value })} /></Field>
              <Field label="Badge"><input className={inputClass} value={card.badge} onChange={(e) => updateCard(index, { badge: e.target.value })} /></Field>
              <Field label="Small label"><input className={inputClass} value={card.label} onChange={(e) => updateCard(index, { label: e.target.value })} /></Field>
              <div className="md:col-span-2"><Field label="Description"><textarea className={inputClass} rows={3} value={card.description} onChange={(e) => updateCard(index, { description: e.target.value })} /></Field></div>
              <div className="md:col-span-2">
                <ImageField
                  label="صورة الكارت (IMAGE URL أو ارفع صورة)"
                  hint="يمكنك لصق رابط URL مباشرة، أو الضغط على زر الرفع لتحميل صورة بـ Base64"
                  value={card.image}
                  uploading={uploadingCardIndex === index}
                  onChange={(v) => updateCard(index, { image: v })}
                  onUpload={(f) => handleCardImageUpload(index, f)}
                />
              </div>
              <Field label="What should happen when the customer clicks this card?">
                <select className={inputClass} value={card.actionType} onChange={(e) => updateCard(index, { actionType: e.target.value as CardAction })}>
                  <option value="category">Open a Department</option>
                  <option value="product">Open a Specific Product</option>
                  <option value="offer">Open a Special Offer</option>
                </select>
              </Field>

              {card.actionType === "category" && (
                <>
                  <Field label="Choose Department">
                    <select className={inputClass} value={card.categoryKey} onChange={(e) => {
                      const category = categories.find((item) => item.key === e.target.value);
                      updateCard(index, { categoryKey: e.target.value, subCategoryKey: category?.subCategories?.[0]?.key || "" });
                    }}>
                      <option value="best">Best sellers</option>
                      {categories.map((category) => <option key={category.id} value={category.key}>{category.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Choose Sub-Department">
                    <select className={inputClass} value={card.subCategoryKey} onChange={(e) => updateCard(index, { subCategoryKey: e.target.value })}>
                      <option value="">All products in department</option>
                      {categories.find((category) => category.key === card.categoryKey)?.subCategories?.map((sub) => (
                        <option key={sub.key} value={sub.key}>{sub.name}</option>
                      ))}
                    </select>
                  </Field>
                </>
              )}

              {card.actionType === "product" && (
                <Field label="Choose product">
                  <select className={inputClass} value={card.productCode} onChange={(e) => {
                    const product = products.find((item) => item.code === e.target.value);
                    updateCard(index, { productCode: e.target.value, productId: product?.id || "" });
                  }}>
                    <option value="">Select product</option>
                    {products.map((product) => <option key={product.id} value={product.code}>{product.name}</option>)}
                  </select>
                </Field>
              )}

              {card.actionType === "offer" && (
                <Field label="Choose offer">
                  <select className={inputClass} value={card.offerId} onChange={(e) => updateCard(index, { offerId: e.target.value })}>
                    <option value="">Select offer</option>
                    {packages.map((item) => <option key={item.id} value={item.code}>{item.name}</option>)}
                  </select>
                </Field>
              )}
            </div>

            <div className="mt-4">
              <StringListEditor title="Card feature bullets" items={card.features} setItems={(next) => updateCard(index, { features: typeof next === "function" ? next(card.features) : next })} placeholder="Short feature text" />
            </div>
          </div>
        ))}

        {cards.length === 0 && <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No custom cards yet.</p>}
      </div>
    </div>
  );
}

function StringListEditor({ title, items, setItems, placeholder }: {
  title: string;
  items: string[];
  setItems: Dispatch<SetStateAction<string[]>>;
  placeholder: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-black text-slate-900">{title}</h4>
        <button type="button" onClick={() => setItems((current) => [...current, ""])} className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-black text-white">Add</button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input className={inputClass} value={item} placeholder={placeholder} onChange={(e) => setItems((current) => current.map((value, itemIndex) => itemIndex === index ? e.target.value : value))} />
            <button type="button" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="rounded-md border border-red-100 px-3 py-2 text-xs font-black text-red-600">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function normalizeAction(action: unknown): CardAction {
  return action === "product" || action === "offer" ? action : "category";
}

export function TrendingLinksEditor({
  links,
  setLinks,
  products,
}: {
  links: { label: string; productId: string }[];
  setLinks: (links: { label: string; productId: string }[]) => void;
  products: AdminProduct[];
}) {
  const [label, setLabel] = useState("");
  const [productId, setProductId] = useState("");

  const add = () => {
    if (!productId) return;
    
    let finalLabel = label.trim();
    if (!finalLabel) {
      const selectedProduct = products.find((p) => p.id === productId);
      if (selectedProduct) {
        finalLabel = selectedProduct.arabicName || selectedProduct.name;
      }
    }
    
    if (!finalLabel) return;
    
    setLinks([...links, { label: finalLabel, productId }]);
    setLabel("");
    setProductId("");
  };

  const remove = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-lg border border-slate-200 p-4 space-y-3">
      <label className="block text-xs font-black text-slate-700">روابط المنتجات السريعة (تظهر كأزرار تحت وصف الواجهة)</label>
      <div className="flex gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="مثال: كومبوزت"
          className={inputClass + " w-1/2"}
        />
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className={inputClass + " w-1/2"}
        >
          <option value="">اختر المنتج...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={add} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-medical-teal text-white hover:bg-teal-700">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map((link, i) => {
            const prodName = products.find((p) => p.id === link.productId)?.name || "Unknown Product";
            return (
              <div key={i} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-3 pr-1 text-xs">
                <span className="font-bold text-slate-700">{link.label}</span>
                <span className="text-[10px] text-slate-400">({prodName})</span>
                <button type="button" onClick={() => remove(i)} className="rounded-full p-1 text-slate-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SidebarLinksEditor({
  links,
  setLinks,
  categories,
}: {
  links: { label: string; arLabel: string; categoryKey: string; subCategoryKey?: string }[];
  setLinks: (links: { label: string; arLabel: string; categoryKey: string; subCategoryKey?: string }[]) => void;
  categories: AdminCategory[];
}) {
  const [label, setLabel] = useState("");
  const [arLabel, setArLabel] = useState("");
  const [categoryKey, setCategoryKey] = useState("");
  const [subCategoryKey, setSubCategoryKey] = useState("");

  const selectedCategory = categories.find((c) => (c.key || c.id) === categoryKey);

  const add = () => {
    if (!label.trim() || !arLabel.trim() || !categoryKey) return;
    setLinks([...links, { label: label.trim(), arLabel: arLabel.trim(), categoryKey, subCategoryKey }]);
    setLabel("");
    setArLabel("");
    setCategoryKey("");
    setSubCategoryKey("");
  };

  const remove = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-lg border border-slate-200 p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="English Label (e.g. Year 1)" className={inputClass} />
        <input value={arLabel} onChange={(e) => setArLabel(e.target.value)} placeholder="Arabic Label (e.g. السنة الأولى)" className={inputClass} />
        
        <select value={categoryKey} onChange={(e) => { setCategoryKey(e.target.value); setSubCategoryKey(""); }} className={inputClass}>
          <option value="">Select Category...</option>
          {categories.map((c) => <option key={c.key || c.id} value={c.key || c.id}>{c.name}</option>)}
        </select>
        
        <select value={subCategoryKey} onChange={(e) => setSubCategoryKey(e.target.value)} className={inputClass} disabled={!selectedCategory || !selectedCategory.subCategories?.length}>
          <option value="">Select Subcategory (Optional)...</option>
          {selectedCategory?.subCategories?.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}
        </select>
      </div>
      <button type="button" onClick={add} className="w-full flex items-center justify-center gap-2 rounded-md bg-medical-teal text-white py-2 hover:bg-teal-700">
        <Plus className="h-4 w-4" /> Add Sidebar Link
      </button>

      {links.length > 0 && (
        <div className="mt-4 space-y-2">
          {links.map((link, i) => {
            const catName = categories.find((c) => (c.key || c.id) === link.categoryKey)?.name || link.categoryKey;
            return (
              <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <div>
                  <div className="font-bold text-sm text-slate-800">{link.label} / {link.arLabel}</div>
                  <div className="text-xs text-slate-500">Target: {catName} {link.subCategoryKey ? `> ${link.subCategoryKey}` : ""}</div>
                </div>
                <button type="button" onClick={() => remove(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ShowcaseSlidersEditor({
  sliders,
  setSliders,
  products,
}: {
  sliders: { title: string; image: string; productId: string }[];
  setSliders: (sliders: { title: string; image: string; productId: string }[]) => void;
  products: AdminProduct[];
}) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const add = () => setSliders([...sliders, { title: "", image: "", productId: "" }]);
  const update = (i: number, patch: any) => setSliders(sliders.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  const remove = (i: number) => setSliders(sliders.filter((_, idx) => idx !== i));

  const handleUpload = async (index: number, file: File | null) => {
    if (!file) return;
    setUploadingIndex(index);
    try {
      const { uploadAdminImage } = await import("../services/firestoreService");
      const url = await uploadAdminImage("showcase", file);
      update(index, { image: url });
    } catch {
      alert("Upload failed. Check configuration.");
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h4 className="font-black text-slate-800">المنتجات المتحركة (المربعات الصغيرة)</h4><button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-black text-white"><Plus className="h-4 w-4" /> إضافة منتج</button></div>
      <div className="space-y-4">
        {sliders.map((slide, i) => (
          <div key={i} className="rounded-lg bg-slate-50 p-4 border border-slate-200 relative">
            <button type="button" onClick={() => remove(i)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded-md"><Trash2 className="h-4 w-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
               <ImageField label="صورة المربع" hint="المقاس الموصى به: 800x600 بكسل (نسبة 4:3) أو مربع 1:1." value={slide.image} uploading={uploadingIndex === i} onChange={(v) => update(i, { image: v })} onUpload={(f) => handleUpload(i, f)} />
               <div className="space-y-4">
                 <Field label="عنوان قصير (اختياري)"><input className={inputClass} value={slide.title} onChange={(e) => update(i, { title: e.target.value })} /></Field>
                 <Field label="المنتج المرتبط"><select className={inputClass} value={slide.productId} onChange={(e) => update(i, { productId: e.target.value })}><option value="">بدون منتج</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
               </div>
            </div>
          </div>
        ))}
        {sliders.length === 0 && <p className="text-sm text-slate-500">لا يوجد عناصر حالياً.</p>}
      </div>
    </div>
  );
}

export function ShowcaseBannersEditor({
  banners,
  setBanners,
  products,
}: {
  banners: { image: string; productId: string }[];
  setBanners: (banners: { image: string; productId: string }[]) => void;
  products: AdminProduct[];
}) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const add = () => setBanners([...banners, { image: "", productId: "" }]);
  const update = (i: number, patch: any) => setBanners(banners.map((b, idx) => idx === i ? { ...b, ...patch } : b));
  const remove = (i: number) => setBanners(banners.filter((_, idx) => idx !== i));

  const handleUpload = async (index: number, file: File | null) => {
    if (!file) return;
    setUploadingIndex(index);
    try {
      const { uploadAdminImage } = await import("../services/firestoreService");
      const url = await uploadAdminImage("showcase_banner", file);
      update(index, { image: url });
    } catch {
      alert("Upload failed. Check configuration.");
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h4 className="font-black text-slate-800">البانرات العريضة</h4><button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-black text-white"><Plus className="h-4 w-4" /> إضافة بانر</button></div>
      <div className="space-y-4">
        {banners.map((banner, i) => (
          <div key={i} className="rounded-lg bg-slate-50 p-4 border border-slate-200 relative">
            <button type="button" onClick={() => remove(i)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded-md"><Trash2 className="h-4 w-4" /></button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
               <ImageField label="صورة البانر" hint="المقاس الموصى به: 1200x400 بكسل أو أي مقاس عرضي." value={banner.image} uploading={uploadingIndex === i} onChange={(v) => update(i, { image: v })} onUpload={(f) => handleUpload(i, f)} />
               <div className="space-y-4">
                 <Field label="المنتج المرتبط"><select className={inputClass} value={banner.productId} onChange={(e) => update(i, { productId: e.target.value })}><option value="">بدون منتج</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
               </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && <p className="text-sm text-slate-500">لا يوجد بانرات حالياً.</p>}
      </div>
    </div>
  );
}

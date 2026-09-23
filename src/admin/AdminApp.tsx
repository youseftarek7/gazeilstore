import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Boxes,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  ShoppingCart,
  Store,
  Tags,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS } from "../data";
import { hasFirebaseConfig } from "../firebase";
import { ToastProvider, useToast } from "./components/AdminUi";
import { canAccess, useAdminAuth } from "./hooks/useAuth";
import { useCollection } from "./hooks/useCollection";
import CategoriesPage from "./pages/CategoriesPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import PackagesPage from "./pages/PackagesPage";
import ProductsPage from "./pages/ProductsPage";
import GuidePage from "./pages/GuidePage";
import { DeveloperSettingsPage, HomeSettingsPage, StoreSettingsPage } from "./pages/SettingsPages";
import { importLocalCatalogToFirebase, wipeCatalogFromFirebase, saveDocument } from "./services/firestoreService";
import { AdminCategory, AdminOrder, AdminPackage, AdminProduct, AdminRole, AdminUser } from "./types/admin";

type AdminPage = "dashboard" | "products" | "packages" | "categories" | "orders" | "home" | "store" | "guide";

const navigation: Array<{ id: AdminPage; label: string; icon: typeof LayoutDashboard; role: AdminRole }> = [
  { id: "dashboard", label: "الرئيسية (Overview)", icon: LayoutDashboard, role: "Employee" },
  { id: "categories", label: "1. أقسام المتجر (Departments)", icon: BarChart3, role: "Manager" },
  { id: "products", label: "2. المنتجات (Products)", icon: Boxes, role: "Manager" },
  { id: "packages", label: "3. العروض (Offers)", icon: Tags, role: "Manager" },
  { id: "orders", label: "طلبات العملاء (Orders)", icon: ShoppingCart, role: "Employee" },
  { id: "home", label: "تصميم الرئيسية (Home Design)", icon: Home, role: "Manager" },
  { id: "store", label: "التواصل وإعدادات الحساب", icon: Store, role: "Manager" },
  { id: "guide", label: "دليل الاستخدام (Guide)", icon: BookOpen, role: "Employee" },
];

const skipAdminLogin = false;

function safeDocId(value: string) {
  return value
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function localProductsForAdmin(): AdminProduct[] {
  return PRODUCTS.map((product) => ({
    id: safeDocId(product.code || String(product.id)),
    code: product.code,
    name: product.name,
    arabicName: product.arabicName,
    price: product.price,
    stock: product.inStock ? 10 : 0,
    image: product.image,
    images: product.images || [product.image].filter(Boolean),
    categoryKey: product.categoryKey,
    subCategoryKey: product.subCategoryKey,
    description: product.description,
    arabicDescription: product.arabicDescription,
    specifications: product.specifications || [],
    arabicSpecifications: product.arabicSpecifications || [],
    detailSections: product.detailSections || [],
    showInHomeSplit: Boolean(product.showInHomeSplit),
    splitTitle: product.splitTitle || "",
    splitDescription: product.splitDescription || "",
    splitImage: product.splitImage || "",
    splitBadge: product.splitBadge || "",
    splitLabel: product.splitLabel || "",
    splitButtonText: product.splitButtonText || "",
    splitFeatures: product.splitFeatures || [],
    hidden: false,
    featured: product.tag === "BEST SELLER" || product.tag === "POPULAR" || product.tag === "ESSENTIAL",
    isLocalFallback: true,
  }));
}

function localCategoriesForAdmin(): AdminCategory[] {
  return CATEGORIES.map((category, index) => ({
    id: safeDocId(category.key || category.id),
    key: category.key,
    name: category.name,
    arabicName: category.arabicName,
    description: category.description,
    image: category.premiumImage,
    sortOrder: index + 1,
    hidden: false,
    isLocalFallback: true,
    subCategories: category.subCategories || [],
  }));
}

export default function AdminApp() {
  return (
    <ToastProvider>
      <AdminShell />
    </ToastProvider>
  );
}

function AdminShell() {
  const auth = useAdminAuth();
  const toast = useToast();
  const [page, setPage] = useState<AdminPage>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const effectiveProfile: AdminUser = auth.profile || {
    id: "local-owner",
    name: "Store Manager",
    email: "admin@local",
    role: "Owner",
    active: true,
  };

  const isAdminEnabled = skipAdminLogin || auth.isAdmin;
  // Loading every collection (including product images and orders) on every
  // admin page made the control panel appear frozen on slower connections.
  // Subscribe only to the data the current screen actually needs.
  const productsQuery = useCollection<AdminProduct>("products", "createdAt", "desc", isAdminEnabled && ["dashboard", "products", "packages", "home"].includes(page));
  const packagesQuery = useCollection<AdminPackage>("packages", "createdAt", "desc", isAdminEnabled && ["packages", "home"].includes(page));
  const categoriesQuery = useCollection<AdminCategory>("categories", "sortOrder", "asc", isAdminEnabled && ["products", "categories", "home"].includes(page));
  const ordersQuery = useCollection<AdminOrder>("orders", "createdAt", "desc", isAdminEnabled && page === "dashboard");

  const adminProducts = productsQuery.loading
    ? []  // جاري التحميل - لا تظهر بيانات محلية قديمة
    : productsQuery.rows.length > 0
      ? productsQuery.rows
      : localProductsForAdmin(); // fallback للبيانات المحلية بعد انتهاء التحميل فقط
  const adminCategories = categoriesQuery.loading
    ? []
    : categoriesQuery.rows.length > 0 ? categoriesQuery.rows : localCategoriesForAdmin();
  const isDataLoading = productsQuery.loading || packagesQuery.loading || categoriesQuery.loading || ordersQuery.loading;
  const connectionError = productsQuery.error || packagesQuery.error || categoriesQuery.error || ordersQuery.error;

  const allowedNavigation = useMemo(
    () => navigation.filter((item) => canAccess(effectiveProfile.role, item.role)),
    [effectiveProfile.role],
  );

  if (auth.loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-black text-slate-500">Loading admin...</div>;
  }

  if (!hasFirebaseConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="max-w-xl rounded-lg border border-amber-200 bg-white p-6 shadow-xl">
          <div className="mb-4 inline-flex rounded-lg bg-amber-50 p-3 text-amber-700">
            <Settings className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-black text-slate-950">Firebase configuration required</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Firebase keys are missing from `.env`. Add the `VITE_FIREBASE_*` values and restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdminEnabled) {
    return <LoginPage login={auth.login} />;
  }

  const activeItem = navigation.find((item) => item.id === page);
  const isAllowed = activeItem ? canAccess(effectiveProfile.role, activeItem.role) : false;

  const wipeCatalog = async () => {
    // Disabled for production to prevent accidental data loss
    toast("Wipe functionality is disabled for safety.", "error");
  };

  const renderPage = () => {
    if (!isAllowed) {
      return (
        <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-red-700">
          <Shield className="mb-3 h-6 w-6" />
          <h2 className="font-black">Access denied</h2>
          <p className="mt-1 text-sm">Your role cannot open this page.</p>
        </div>
      );
    }

    if (page === "dashboard") return <DashboardPage products={adminProducts} orders={ordersQuery.rows} />;
    if (page === "products") return <ProductsPage products={adminProducts} categories={adminCategories} />;
    if (page === "packages") return <PackagesPage packages={packagesQuery.rows} products={adminProducts} />;
    if (page === "categories") return <CategoriesPage categories={adminCategories} />;
    if (page === "orders") return <OrdersPage orders={ordersQuery.rows} />;
    if (page === "home") return <HomeSettingsPage categories={adminCategories} products={adminProducts} packages={packagesQuery.rows} />;
    if (page === "store") return <StoreSettingsPage />;
    if (page === "guide") return <GuidePage />;
    return <DashboardPage products={adminProducts} orders={ordersQuery.rows} />;
  };

  const Sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <div>
          <p className="text-lg font-black text-slate-950">Ghazal Store Admin</p>
          <p className="text-xs font-bold text-slate-500">{effectiveProfile.role}</p>
        </div>
        <button className="rounded-md p-2 text-slate-500 lg:hidden" onClick={() => setMobileOpen(false)}>
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {allowedNavigation.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setPage(item.id);
              setMobileOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-black ${page === item.id ? "bg-medical-teal text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-3">
        <button onClick={auth.logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-black text-red-600 hover:bg-red-50">
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{Sidebar}</div>
      {mobileOpen && <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden"><div className="h-full">{Sidebar}</div></div>}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-md border border-slate-200 p-2 lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-950">{activeItem?.label || "Dashboard"}</h1>
              <p className="text-xs text-slate-500">Simple store controls. Changes save to Firebase when connected.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-sm md:block">
              <p className="font-black text-slate-900">مدير المتجر</p>
              <p className="text-xs text-slate-500">حساب الإدارة</p>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">
          {connectionError && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-black">Firebase is not responding correctly</p>
                <p className="mt-1 text-xs">{connectionError.message}</p>
              </div>
            </div>
          )}
          {isDataLoading && !connectionError && (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 animate-pulse">
              <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
              <p className="font-black">جاري تحميل البيانات من Firebase... انتظر لحظة</p>
            </div>
          )}
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

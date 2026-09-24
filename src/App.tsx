import React, { lazy, Suspense } from "react";
import { useStorefront } from "./context";
import { Header, Footer, Hero, HomeSplit, NavigationDrawer } from "./components/layout";
import { ProductGrid, ProductDetailsModal } from "./components/product";
import { CategoryBrowser, CategoryPage } from "./components/category";
import { SpecialOffers, DynamicShowcase } from "./components/deals";
import { CartDrawer, CheckoutModal } from "./components/cart";
import { OrderViewModal } from "./components/orders";
import { SEO, SplashLoader, InstallPWA } from "./components/common";

const AdminApp = lazy(() => import("./admin/AdminApp"));

export default function App() {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-bold text-slate-500">Loading admin...</div>}>
        <AdminApp />
      </Suspense>
    );
  }

  const { currentView, isSplashing, finishSplash, settings, isLoading } = useStorefront();

  const scrollToProducts = () => {
    const el = document.getElementById("inventory-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <SEO />
      {isSplashing && <SplashLoader settings={settings} isLoadingData={isLoading} onComplete={finishSplash} />}
      
      <div className={`min-h-screen bg-bg-light text-dark-blue font-sans selection:bg-champagne-light selection:text-gold-hover pb-10 ltr ${isSplashing ? "h-screen overflow-hidden" : ""}`} dir="ltr">
        <Header />

        <main className="pt-20">
          {currentView === "home" ? (
            <>
              <Hero onScrollToProducts={scrollToProducts} />
              <HomeSplit />
              <SpecialOffers />
              <CategoryBrowser />
              <ProductGrid />
            </>
          ) : (
            <CategoryPage />
          )}

          <DynamicShowcase />
        </main>

        <Footer />

        {/* Global Modals & Drawers */}
        <NavigationDrawer />
        <CartDrawer />
        <ProductDetailsModal />
        <CheckoutModal />
        <OrderViewModal />
        <InstallPWA />
      </div>
    </>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CategoryBrowser from "./components/CategoryBrowser";
import ProductCard from "./components/ProductCard";
import ProductDetailsModal from "./components/ProductDetailsModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import NavigationDrawer from "./components/NavigationDrawer";
import CategoryPage from "./components/CategoryPage";
import SpecialOffers from "./components/SpecialOffers";
import HomeSplit from "./components/HomeSplit";
import SplashLoader from "./components/SplashLoader";
import DynamicShowcase from "./components/DynamicShowcase";
import OrderViewModal from "./components/OrderViewModal";
import { Product, CartItem } from "./types";
import { Sparkles, ShoppingBag, Landmark, Filter, Star, Info, PhoneCall, Check, Compass, GraduationCap, MapPin, MessageSquare } from "lucide-react";
import { useStorefrontData } from "./hooks/useStorefrontData";
import { SEO } from "./components/SEO";

// The admin application is only needed under /admin. Keeping it out of the
// customer bundle shortens the first load for every store visitor.
const AdminApp = lazy(() => import("./admin/AdminApp"));

export default function App() {
  if (window.location.pathname.startsWith("/admin")) {
    return (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-bold text-slate-500">Loading admin...</div>}>
        <AdminApp />
      </Suspense>
    );
  }

  const lang = "en";

  useEffect(() => {
    try {
      localStorage.setItem("ghazal_dental_lang", "en");
    } catch {}
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const { products: STORE_PRODUCTS, categories: STORE_CATEGORIES, packages: STORE_PACKAGES, homepage, settings, developer, isLoading } = useStorefrontData();
  const storePhone = settings?.phone || "01007070766";
  const storeWhatsapp = settings?.whatsapp || "201551905201";
  const storeWhatsappDisplay = settings?.whatsapp ? settings.whatsapp.replace(/^20/, "0") : "01551905201";
  const storeAddress = settings?.address || "Areesh • El-Masaeed (Alongside Mostafa Library)";

  // --- STATE ENGINES ---
  const [currentView, setCurrentView] = useState<"home" | "category">("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("all"); // defaults to all products (313 items)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSplashing, setIsSplashing] = useState<boolean>(true);
  const finishSplash = useCallback(() => setIsSplashing(false), []);
  
  // Cart management with LocalStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("ghazal_dental_cart");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load cart from localStorage:", e);
    }
    return [];
  });

  // Dialog/drawer states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("order");
  });

  // --- DYNAMIC SEO & ROUTING ---
  const handleOpenProduct = (product: Product | null) => {
    setSelectedProduct(product);
    setIsDetailsOpen(!!product);
    
    const url = new URL(window.location.href);
    if (product) {
      const productId = (product as any).firestoreId || product.id;
      url.searchParams.set('product', String(productId));
    } else {
      url.searchParams.delete('product');
    }
    window.history.pushState({}, '', url);
  };

  const handleCloseOrder = () => {
    setActiveOrderId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('order');
    window.history.pushState({}, '', url);
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get('product');
      const orderParam = params.get('order');

      if (orderParam) {
        setActiveOrderId(orderParam);
      } else {
        setActiveOrderId(null);
      }

      if (productId && STORE_PRODUCTS.length > 0) {
        const product = STORE_PRODUCTS.find(p => String(p.id) === productId || (p as any).firestoreId === productId);
        if (product) {
          setSelectedProduct(product);
          setIsDetailsOpen(true);
        }
      } else {
        setSelectedProduct(null);
        setIsDetailsOpen(false);
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [STORE_PRODUCTS]);

  // Filter modifiers
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "rating">("default");
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Reference to catalog for smooth scrolling
  const catalogRef = useRef<HTMLDivElement>(null);

  // --- PERSISTENCE & ACTIONS ---
  useEffect(() => {
    try {
      // Store compact cart to prevent QuotaExceededError
      const compactCart = cart.map((item) => ({
        product: {
          id: item.product.id,
          firestoreId: (item.product as any).firestoreId,
          code: item.product.code,
          name: item.product.name,
          arabicName: item.product.arabicName,
          price: item.product.price,
          image: item.product.image,
          categoryKey: item.product.categoryKey,
          subCategoryKey: item.product.subCategoryKey,
          inStock: item.product.inStock,
        },
        quantity: item.quantity,
      }));
      localStorage.setItem("ghazal_dental_cart", JSON.stringify(compactCart));
    } catch (e) {
      console.warn("Could not persist cart to localStorage:", e);
    }
  }, [cart]);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setCurrentView("home");
    }
  }, [searchQuery]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === id) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSelectSideCategory = (catKey: string, subCatKey?: string) => {
    if (catKey === "all" || catKey === "best") {
      setSelectedCategory(catKey);
      setSelectedSubCategory("");
      setCurrentView("home");
      scrollToProducts();
    } else {
      setSelectedCategory(catKey);
      setCurrentView("category");
      setSelectedSubCategory(subCatKey || "");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCategorySelectFromHome = (catKey: string) => {
    if (catKey === "all" || catKey === "best") {
      setSelectedCategory(catKey);
      setSelectedSubCategory("");
      setCurrentView("home");
      scrollToProducts();
    } else {
      setSelectedCategory(catKey);
      setSelectedSubCategory("");
      setCurrentView("category");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToProducts = () => {
    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  // --- FILTERING LOGIC ---
  const filteredProducts = STORE_PRODUCTS.filter((product) => {
    // 1. Text Search Filter (Matches code, name, description in both english and arabic)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const codeMatch = product.code?.toLowerCase().includes(query);
      const nameMatch = product.name?.toLowerCase().includes(query);
      const arNameMatch = product.arabicName?.includes(query);
      const descMatch = product.description?.toLowerCase().includes(query);
      const arDescMatch = product.arabicDescription?.includes(query);
      const tagMatch = product.tag?.toLowerCase().includes(query) || product.arabicTag?.includes(query);
      
      if (!codeMatch && !nameMatch && !arNameMatch && !descMatch && !arDescMatch && !tagMatch) {
        return false;
      }
    }

    // 2. Category/Subcategory Filter
    if (searchQuery.trim() === "") {
      if (selectedCategory === "all") {
        // Show all products configured in the store
      } else if (selectedCategory === "best") {
        if (!Boolean((product as any).featured)) return false;
      } else {
        const pCat = (product.categoryKey || "").trim();
        const targetCat = (selectedCategory || "").trim();
        const catMatch = pCat === targetCat || (product as any).categoryId === targetCat;
        if (!catMatch) return false;

        if (selectedSubCategory) {
          const pSub = (product.subCategoryKey || "").trim();
          const targetSub = selectedSubCategory.trim();
          const subMatch = pSub === targetSub ||
                           pSub.replace(/-+$/, "") === targetSub.replace(/-+$/, "") ||
                           pSub.toLowerCase() === targetSub.toLowerCase();
          if (!subMatch) return false;
        }
      }
    }

    // 3. Stock Filter
    if (onlyInStock && !product.inStock) {
      return false;
    }

    return true;
  });

  // --- DEDUPLICATION & SORTING LOGIC ---
  const seenIds = new Set<string>();
  const uniqueFilteredProducts = filteredProducts.filter((p) => {
    const key = p.firestoreId || p.code || String(p.id);
    if (seenIds.has(key)) return false;
    seenIds.add(key);
    return true;
  });

  const sortedProducts = [...uniqueFilteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // default order
  });

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeCategoryObject = STORE_CATEGORIES.find((c) => c.key === selectedCategory);

  return (
    <>
      <SEO />
      {isSplashing && <SplashLoader settings={settings} isLoadingData={isLoading} onComplete={finishSplash} />}
      <div className={`min-h-screen bg-bg-light text-dark-blue font-sans selection:bg-champagne-light selection:text-gold-hover pb-10 ltr ${isSplashing ? "h-screen overflow-hidden" : ""}`} dir="ltr">
        
        {/* Header component */}
        <Header
          lang={lang}
          cartCount={totalCartCount}
          onCartToggle={() => setIsCartOpen(!isCartOpen)}
          onDrawerToggle={() => setIsDrawerOpen(!isDrawerOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          settings={settings}
          onLogoClick={() => {
            setCurrentView("home");
            setSelectedCategory("all");
            setSelectedSubCategory("");
            setSearchQuery("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        {/* Main viewport */}
        <main className="pt-20">
          
          {currentView === "home" ? (
            <>
              {/* Apple Luxury Style Hero Presentation */}
              <Hero
                lang={lang}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onScrollToProducts={scrollToProducts}
                content={homepage}
                onSelectCategory={handleCategorySelectFromHome}
                onOpenProduct={(productId) => {
                  const product = STORE_PRODUCTS.find(p => String(p.id) === String(productId) || (p as any).firestoreId === String(productId));
                  if (product) {
                    setSelectedProduct(product);
                    setIsDetailsOpen(true);
                  }
                }}
              />

              {/* Interactive Home Splitting Decision Banners */}
              <HomeSplit
                lang={lang}
                products={STORE_PRODUCTS}
                onOpenProduct={(product) => {
                  setSelectedProduct(product);
                  setIsDetailsOpen(true);
                }}
                onSelectCategory={(catKey, subCatKey) => {
                  if (subCatKey) handleSelectSideCategory(catKey, subCatKey);
                  else handleCategorySelectFromHome(catKey);
                }}
                content={homepage}
              />

              {/* Exclusive Promo Deals & Bundles Section */}
              <SpecialOffers
                lang={lang}
                onAddToCart={handleAddToCart}
                onOpenCart={() => setIsCartOpen(true)}
                content={homepage}
                packages={STORE_PACKAGES}
                products={STORE_PRODUCTS}
              />

              {/* Categories Explorer Box */}
              <CategoryBrowser
                lang={lang}
                categories={STORE_CATEGORIES}
                content={homepage}
                selectedCategory={selectedCategory}
                setSelectedCategory={handleCategorySelectFromHome}
                selectedSubCategory={selectedSubCategory}
                setSelectedSubCategory={setSelectedSubCategory}
              />

              {/* Dynamic Products Grid Section */}
              <section ref={catalogRef} className="max-w-7xl mx-auto px-4 md:px-8 mt-14 scroll-mt-24" id="inventory-grid">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7 p-6 bg-white border border-slate-100/80 rounded-2xl shadow-xs">
                  <div>
                    {searchQuery.trim() !== "" ? (
                      <>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-champagne-gold bg-champagne-light/25 px-2.5 py-1 rounded">
                          SEARCH RESULTS
                        </span>
                        <h3 className="font-display font-black text-xl text-dark-blue mt-1.5">
                          Results for "{searchQuery}"
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5 font-sans">
                          Revealed {sortedProducts.length} matching items
                        </p>
                      </>
                    ) : selectedCategory === "all" ? (
                      <>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-medical-teal bg-medical-teal/5 px-2.5 py-1 rounded">
                          ALL STORE PRODUCTS
                        </span>
                        <h3 className="font-display font-black text-xl text-dark-blue mt-1.5">
                          All Dental Products ({sortedProducts.length})
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5 font-sans">
                          Browse our full catalog of dental instruments, materials, university kits, and medical apparel.
                        </p>
                      </>
                    ) : selectedCategory === "best" ? (
                      <>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                          HIGHLY RECOMMENDED
                        </span>
                        <h3 className="font-display font-black text-xl text-dark-blue mt-1.5">
                          Best Sellers & Most Trusted ({sortedProducts.length})
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5 font-sans">
                          Core clinical files and kits highly praised by both doctors and senior university students.
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-medical-teal bg-medical-teal/5 px-2.5 py-1 rounded">
                          STOCK HUB
                        </span>
                        <h3 className="font-display font-black text-xl text-dark-blue mt-1.5">
                          {`${activeCategoryObject?.name || "Department"} - ${
                            activeCategoryObject?.subCategories.find((s) => s.key === selectedSubCategory)?.name || "All Items"
                          }`}
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5 font-sans">
                          Click details to inspect medical registration codes and technical specifications.
                        </p>
                      </>
                    )}
                  </div>

                  {/* In-Grid interactive sorting controls */}
                  <div className="flex flex-wrap items-center gap-3.5">
                    
                    {/* Checkbox to hide Out of stock */}
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/65 hover:bg-slate-100 select-none">
                      <input
                        type="checkbox"
                        checked={onlyInStock}
                        onChange={(e) => setOnlyInStock(e.target.checked)}
                        className="rounded text-medical-teal border-slate-300 focus:ring-medical-teal/20 w-4 h-4"
                      />
                      <span>In Stock Only</span>
                    </label>

                    {/* Sorting Selection Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-bold uppercase hidden sm:inline">
                        Sort By:
                      </span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal cursor-pointer"
                      >
                        <option value="default">Default</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">High Rated First</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Actual items listing grid */}
                {sortedProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <span className="text-5xl block mb-3">🔍</span>
                    <h4 className="font-display font-extrabold text-lg text-dark-blue">
                      No products found!
                    </h4>
                    <p className="text-slate-400 text-xs mt-2 max-w-sm mx-auto font-sans leading-relaxed">
                      Try typing simple syllables (e.g. 'Scrub' or 'Kit'), or disable 'In Stock Only' flag to show more items.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("best");
                        setSelectedSubCategory("");
                        setOnlyInStock(false);
                      }}
                      className="mt-5 px-5 py-2.5 bg-medical-teal text-white font-bold text-xs rounded-xl hover:bg-medical-light transition-all cursor-pointer shadow active:scale-95"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortedProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        lang={lang}
                        onAddToCart={(prod) => {
                          handleAddToCart(prod);
                          setIsCartOpen(true);
                        }}
                        onViewDetails={(prod) => {
                          handleOpenProduct(prod);
                        }}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <CategoryPage
              categoryKey={selectedCategory}
              subCategoryKey={selectedSubCategory}
              setSubCategoryKey={setSelectedSubCategory}
              lang={lang}
              products={STORE_PRODUCTS}
              categories={STORE_CATEGORIES}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onlyInStock={onlyInStock}
              setOnlyInStock={setOnlyInStock}
              onAddToCart={(prod) => {
                handleAddToCart(prod);
                setIsCartOpen(true);
              }}
              onViewDetails={(prod) => {
                handleOpenProduct(prod);
              }}
              onBackToHome={() => {
                setCurrentView("home");
                setSelectedCategory("best");
                setSelectedSubCategory("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}

          {/* Dynamic Showcase for Products and Banners */}
          <DynamicShowcase 
            content={homepage} 
            lang={lang} 
            products={STORE_PRODUCTS} 
            onViewProduct={(id) => {
              const prod = STORE_PRODUCTS.find((p) => p.id === id);
              if (prod) {
                handleOpenProduct(prod);
              }
            }} 
            onAddToCart={(prod) => {
              handleAddToCart(prod, 1);
              setIsCartOpen(true);
            }}
          />
        </main>

        {/* Footer Presentation */}
        <footer className="relative bg-[#fafafc] border-t border-slate-205 mt-24 pt-16 pb-16 overflow-hidden">
          {/* Soft designer touch geometric overlay */}
          <div className="absolute top-0 right-10 w-80 h-80 rounded-full bg-slate-200/30 opacity-40 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#0ea5e9]/5 opacity-30 blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Column 1: Clinic / Store Details with Premium Badge - Span 6 */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-md">
                    <svg className="w-4 h-4 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 2C10 2 8 3 8 5c0 2 1 3 1 5 0 2-3 3-3 6 0 3 2 4 4 4 1 0 2-1 2-2 0 1 1 2 2 2 2 0 4-1 4-4 0-3-3-4-3-6 0-2 1-3 1-5 0-2-2-3-4-3z" />
                    </svg>
                  </span>
                  <span className="font-display font-black text-xl text-slate-900 tracking-tight">
                    Ghazal Dental
                  </span>
                  <span className="inline-flex items-center text-[8.5px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-250/50">
                    OFFICIAL
                  </span>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
                  Certified university dental kits, state-of-the-art restorative materials, and precision surgical instrumentation.
                </p>

                {/* Verified Location Badge Row */}
                <a 
                  href="https://www.google.com/maps?q=31.118656,33.715492" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-start gap-2 text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 shadow-xs max-w-sm transition-all group"
                >
                  <MapPin className="w-5 h-5 text-slate-500 mt-0.5 shrink-0 group-hover:text-medical-teal transition-colors" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      STORE LOCATION (VIEW MAP)
                    </span>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-medical-teal transition-colors">
                      {storeAddress || "Areesh • North Sinai (Alongside Sinai University)"}
                    </p>
                  </div>
                </a>

              </div>

              {/* Column 2: Fast Store Contact Channels - Span 6 */}
              <div className="lg:col-span-6 space-y-4">
                <h5 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  DIRECT CUSTOMER CARE
                </h5>

                <div className="space-y-3">
                  {/* Technical support click phone */}
                  <a 
                    href={`tel:${storePhone}`} 
                    className="flex items-center justify-between p-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs transition-all duration-250 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all duration-250">
                        <PhoneCall className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block">
                          TECHNICAL & ORDER SUPPORT
                        </span>
                        <span className="text-xs font-bold text-slate-800">{storePhone}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      CALL
                    </span>
                  </a>

                  {/* Sales team instant whatsapp direct */}
                  <a 
                    href={`https://wa.me/${storeWhatsapp}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-between p-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs transition-all duration-250 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-250">
                        <MessageSquare className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block">
                          SALES WHATSAPP CHAT
                        </span>
                        <span className="text-xs font-bold text-slate-800">{storeWhatsappDisplay}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      CHAT
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-200/50 flex items-center justify-center">
              <span className="text-[10px] text-slate-400/80 font-medium tracking-wide">
                Developer: 01006635631
              </span>
            </div>
          </div>
        </footer>

        {/* --- DRAWERS AND FLOATING COMPONENT LAYERS --- */}

        {/* Hamburger Options Menu Left Drawer */}
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          lang={lang}
          onSelectCategory={handleSelectSideCategory}
          categories={STORE_CATEGORIES}
          content={homepage}
        />

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          lang={lang}
          cartItems={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        {/* Details Dialog Modal */}
        <ProductDetailsModal
          product={selectedProduct}
          lang={lang}
          isOpen={isDetailsOpen}
          onClose={() => {
            handleOpenProduct(null);
          }}
          onAddToCart={(prod, qty) => {
            handleAddToCart(prod, qty);
            setIsCartOpen(true);
          }}
        />

        {/* Checkout details collector modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          lang={lang}
          cartItems={cart}
          onClearCart={handleClearCart}
          whatsappNumber={storeWhatsapp}
        />

        {/* Full Order & Invoice Details Modal */}
        <OrderViewModal
          orderId={activeOrderId}
          onClose={handleCloseOrder}
          lang={lang}
        />
      </div>
    </>
  );
}

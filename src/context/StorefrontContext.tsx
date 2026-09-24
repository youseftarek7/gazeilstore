import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { Product, Category, StorePackage, HomepageSettings, StoreSettings, DeveloperSettings, ProductSortOption } from "../types";
import { PRODUCTS, CATEGORIES, DEFAULT_STORE_SETTINGS } from "../data";
import { getStorageItem, setStorageItem } from "../utils/storage";
import {
  subscribeToProducts,
  fetchProductsViaRest,
  subscribeToCategories,
  fetchCategoriesViaRest,
  subscribeToPackages,
  subscribeToHomepageSettings,
  subscribeToStoreSettings,
  subscribeToDeveloperSettings,
} from "../services";

interface StorefrontContextValue {
  products: Product[];
  categories: Category[];
  packages: StorePackage[];
  homepage: HomepageSettings | null;
  settings: StoreSettings;
  developer: DeveloperSettings | null;
  isLoading: boolean;
  
  // Navigation & View State
  currentView: "home" | "category";
  setCurrentView: (view: "home" | "category") => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (sub: string) => void;
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: ProductSortOption;
  setSortBy: (sort: ProductSortOption) => void;
  onlyInStock: boolean;
  setOnlyInStock: (only: boolean) => void;
  
  // Modals & Drawers
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  isDetailsOpen: boolean;
  openProductDetails: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  activeOrderId: string | null;
  closeOrderModal: () => void;
  
  // Splash screen state
  isSplashing: boolean;
  finishSplash: () => void;
  
  // Helpers
  selectDepartment: (catKey: string, subCatKey?: string) => void;
  resetFilters: () => void;
}

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => getStorageItem("ghazal_cache_products_v8", PRODUCTS));
  const [categories, setCategories] = useState<Category[]>(() => getStorageItem("ghazal_cache_categories_v8", CATEGORIES));
  const [packages, setPackages] = useState<StorePackage[]>(() => getStorageItem("ghazal_cache_packages_v8", []));
  const [homepage, setHomepage] = useState<HomepageSettings | null>(() => getStorageItem("ghazal_cache_homepage_v8", null));
  const [settings, setSettings] = useState<StoreSettings>(() => getStorageItem("ghazal_cache_settings_v8", DEFAULT_STORE_SETTINGS));
  const [developer, setDeveloper] = useState<DeveloperSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // View state
  const [currentView, setCurrentView] = useState<"home" | "category">("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<ProductSortOption>("default");
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("order");
    }
    return null;
  });

  const [isSplashing, setIsSplashing] = useState(true);
  const finishSplash = useCallback(() => setIsSplashing(false), []);

  const openProductDetails = (product: Product | null) => {
    setSelectedProduct(product);
    setIsDetailsOpen(!!product);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (product) {
        url.searchParams.set("product", String((product as any).firestoreId || product.id));
      } else {
        url.searchParams.delete("product");
      }
      window.history.pushState({}, "", url);
    }
  };

  const closeOrderModal = () => {
    setActiveOrderId(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("order");
      window.history.pushState({}, "", url);
    }
  };

  const selectDepartment = (catKey: string, subCatKey?: string) => {
    if (catKey === "all" || catKey === "best") {
      setSelectedCategory(catKey);
      setSelectedSubCategory("");
      setCurrentView("home");
    } else {
      setSelectedCategory(catKey);
      setSelectedSubCategory(subCatKey || "");
      setCurrentView("category");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("best");
    setSelectedSubCategory("");
    setOnlyInStock(false);
    setSortBy("default");
  };

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setCurrentView("home");
    }
  }, [searchQuery]);

  // URL PopState Listener for dynamic ?product= and ?order= links
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get("product");
      const orderParam = params.get("order");

      setActiveOrderId(orderParam || null);

      if (productId && products.length > 0) {
        const prod = products.find((p) => String(p.id) === productId || (p as any).firestoreId === productId);
        if (prod) {
          setSelectedProduct(prod);
          setIsDetailsOpen(true);
        }
      } else {
        setSelectedProduct(null);
        setIsDetailsOpen(false);
      }
    };

    handlePopState();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [products]);

  // Realtime Subscriptions & REST Fallback
  useEffect(() => {
    // 1. Instant REST fetch for mobile WebViews
    fetchProductsViaRest().then((res) => {
      if (res.length > 0) {
        setProducts(res);
        setStorageItem("ghazal_cache_products_v8", res);
      }
    });

    fetchCategoriesViaRest().then((res) => {
      if (res.length > 0) {
        setCategories(res);
        setStorageItem("ghazal_cache_categories_v8", res);
      }
    });

    // 2. Realtime listeners
    const unsubProducts = subscribeToProducts((rows) => {
      setProducts(rows);
      setStorageItem("ghazal_cache_products_v8", rows);
    });

    const unsubCategories = subscribeToCategories((cats) => {
      setCategories(cats);
      setStorageItem("ghazal_cache_categories_v8", cats);
    });

    const unsubPackages = subscribeToPackages((pkgs) => {
      setPackages(pkgs);
      setStorageItem("ghazal_cache_packages_v8", pkgs);
    });

    const unsubHomepage = subscribeToHomepageSettings((home) => {
      setHomepage(home);
      setStorageItem("ghazal_cache_homepage_v8", home);
    });

    const unsubSettings = subscribeToStoreSettings((sett) => {
      if (sett) {
        setSettings(sett);
        setStorageItem("ghazal_cache_settings_v8", sett);
      }
    });

    const unsubDeveloper = subscribeToDeveloperSettings((dev) => {
      setDeveloper(dev);
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubPackages();
      unsubHomepage();
      unsubSettings();
      unsubDeveloper();
    };
  }, []);

  const value = useMemo(
    () => ({
      products,
      categories,
      packages,
      homepage,
      settings,
      developer,
      isLoading,
      currentView,
      setCurrentView,
      selectedCategory,
      setSelectedCategory,
      selectedSubCategory,
      setSelectedSubCategory,
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      onlyInStock,
      setOnlyInStock,
      isDrawerOpen,
      setIsDrawerOpen,
      selectedProduct,
      isDetailsOpen,
      openProductDetails,
      isCheckoutOpen,
      setIsCheckoutOpen,
      activeOrderId,
      closeOrderModal,
      isSplashing,
      finishSplash,
      selectDepartment,
      resetFilters,
    }),
    [
      products,
      categories,
      packages,
      homepage,
      settings,
      developer,
      isLoading,
      currentView,
      selectedCategory,
      selectedSubCategory,
      searchQuery,
      sortBy,
      onlyInStock,
      isDrawerOpen,
      selectedProduct,
      isDetailsOpen,
      isCheckoutOpen,
      activeOrderId,
      isSplashing,
    ]
  );

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
}

export function useStorefront(): StorefrontContextValue {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error("useStorefront must be used within a StorefrontProvider");
  }
  return context;
}

import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { CATEGORIES, PRODUCTS } from "../data";
import { Category, Product, StorePackage } from "../types";

function toNumberId(id: string, index: number) {
  const parsed = Number(id);
  if (Number.isFinite(parsed)) return parsed;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function normalizeProduct(row: any, index: number, fallback?: Product): Product {
  const isFeatured = row.featured !== undefined ? Boolean(row.featured) : Boolean(fallback?.featured);
  const tag = row.tag || (isFeatured ? "BEST SELLER" : (fallback?.tag || "POPULAR"));
  const arabicTag = row.arabicTag || (isFeatured ? "الأكثر مبيعاً" : (fallback?.arabicTag || "شائع"));
  
  // Use client's stored names directly
  const name = (row.name && String(row.name).trim()) || fallback?.name || "Dental Product";
  const arabicName = (row.arabicName && String(row.arabicName).trim()) || fallback?.arabicName || row.name || "منتج طب أسنان";

  // Use client's stored descriptions directly
  const description = (row.description && String(row.description).trim()) || fallback?.description || "";
  const arabicDescription = (row.arabicDescription && String(row.arabicDescription).trim()) || fallback?.arabicDescription || row.description || "";

  const categoryKey = (row.categoryKey !== undefined && row.categoryKey !== null && String(row.categoryKey).trim() !== "" ? String(row.categoryKey).trim() : (fallback?.categoryKey || "")).trim();
  const subCategoryKey = (row.subCategoryKey !== undefined && row.subCategoryKey !== null && String(row.subCategoryKey).trim() !== "" ? String(row.subCategoryKey).trim() : (fallback?.subCategoryKey || "")).trim();

  // The client's stored image in Firestore takes absolute priority (exactly as seen in /admin)!
  const clientImage = row.image || row.images?.[0] || "";
  const resolvedImage = clientImage || fallback?.image || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80";

  const resolvedImages = (row.images && Array.isArray(row.images) && row.images.length > 0)
    ? row.images
    : (clientImage ? [clientImage] : (fallback?.images && fallback.images.length > 0 ? fallback.images : [resolvedImage]));

  return {
    id: fallback?.id || toNumberId(row.id, index),
    firestoreId: row.id || fallback?.firestoreId,
    code: row.code || fallback?.code || `GH-${index + 1}`,
    name,
    arabicName,
    price: Number(row.price ?? fallback?.price ?? 0),
    image: resolvedImage,
    images: resolvedImages,
    tag,
    arabicTag,
    categoryKey,
    subCategoryKey,
    description,
    arabicDescription,
    specifications: row.specifications || fallback?.specifications || [],
    arabicSpecifications: row.arabicSpecifications || fallback?.arabicSpecifications || [],
    detailSections: row.detailSections || fallback?.detailSections || [],
    showInHomeSplit: Boolean(row.showInHomeSplit ?? fallback?.showInHomeSplit),
    splitTitle: row.splitTitle || fallback?.splitTitle || "",
    splitDescription: row.splitDescription || fallback?.splitDescription || "",
    splitImage: row.splitImage || fallback?.splitImage || "",
    splitBadge: row.splitBadge || fallback?.splitBadge || "",
    splitLabel: row.splitLabel || fallback?.splitLabel || "",
    splitButtonText: row.splitButtonText || fallback?.splitButtonText || "",
    splitFeatures: row.splitFeatures || fallback?.splitFeatures || [],
    inStock: row.stock === undefined ? fallback?.inStock ?? true : Number(row.stock) > 0,
    rating: Number(row.rating ?? fallback?.rating ?? 5),
    reviewsCount: Number(row.reviewsCount ?? fallback?.reviewsCount ?? (30 + (index % 25))),
    featured: isFeatured,
  } as Product;
}

function normalizeCategory(row: any, fallback?: Category): Category {
  const arabicName = row.arabicName && String(row.arabicName).trim() ? row.arabicName : fallback?.arabicName || "قسم طبي";
  const arabicDescription = row.arabicDescription && String(row.arabicDescription).trim() ? row.arabicDescription : fallback?.arabicDescription || "مستلزمات وأدوات طبية معتمدة.";
  return {
    id: fallback?.id || row.id,
    key: row.key || fallback?.key || row.id,
    name: (row.name && String(row.name).trim()) || fallback?.name || "Dental Supplies",
    arabicName,
    premiumImage: row.premiumImage || row.image || fallback?.premiumImage || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80",
    description: (row.description && String(row.description).trim()) || fallback?.description || "High quality clinical dental materials and equipment.",
    arabicDescription,
    subCategories: Array.isArray(row.subCategories) && row.subCategories.length > 0 ? row.subCategories : fallback?.subCategories || [],
  };
}

function normalizePackage(row: any, index: number): StorePackage {
  return {
    id: toNumberId(row.id, index + 900),
    firestoreId: row.id,
    code: row.code || `PACKAGE-${index + 1}`,
    name: (row.name && String(row.name).trim()) || "Clinical Dental Package",
    arabicName: (row.arabicName && String(row.arabicName).trim()) || "باقة مستلزمات طبية",
    description: (row.description && String(row.description).trim()) || "Special value package curated for dental students and clinical practitioners.",
    arabicDescription: (row.arabicDescription && String(row.arabicDescription).trim()) || "باقة مستلزمات مميزة بخصم خاص لطلبة الأسنان والعيادات.",
    originalPrice: Number(row.originalPrice ?? row.dealPrice ?? 0),
    dealPrice: Number(row.dealPrice ?? row.originalPrice ?? 0),
    discountPercent: Number(row.discountPercent ?? 0),
    image: row.image || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80",
    tag: row.tag || "SPECIAL PACKAGE",
    arabicTag: row.arabicTag || "عرض خاص",
    bullets: Array.isArray(row.bullets) ? row.bullets : [],
    arabicBullets: Array.isArray(row.arabicBullets) ? row.arabicBullets : [],
    productIds: Array.isArray(row.productIds) ? row.productIds : [],
    productCodes: Array.isArray(row.productCodes) ? row.productCodes : [],
    categoryKey: row.categoryKey || "",
    subCategoryKey: row.subCategoryKey || "",
    timeLeftSeconds: Number(row.timeLeftSeconds ?? 7200),
    hidden: Boolean(row.hidden),
  };
}

// Purge legacy caches on boot (v1 through v7) so in-app WebViews (Facebook / Instagram) never stay locked to old caches
try {
  const legacyKeys = [
    "ghazal_cache_products", "ghazal_cache_categories", "ghazal_cache_packages", "ghazal_cache_homepage", "ghazal_cache_settings",
    "ghazal_cache_products_v1", "ghazal_cache_products_v2", "ghazal_cache_products_v3", "ghazal_cache_products_v4", "ghazal_cache_products_v5", "ghazal_cache_products_v6", "ghazal_cache_products_v7",
    "ghazal_cache_categories_v1", "ghazal_cache_categories_v2", "ghazal_cache_categories_v3", "ghazal_cache_categories_v4", "ghazal_cache_categories_v5", "ghazal_cache_categories_v6", "ghazal_cache_categories_v7",
    "ghazal_cache_packages_v1", "ghazal_cache_packages_v2", "ghazal_cache_packages_v3", "ghazal_cache_packages_v4", "ghazal_cache_packages_v5", "ghazal_cache_packages_v6", "ghazal_cache_packages_v7",
    "ghazal_cache_homepage_v1", "ghazal_cache_homepage_v2", "ghazal_cache_homepage_v3", "ghazal_cache_homepage_v4", "ghazal_cache_homepage_v5", "ghazal_cache_homepage_v6", "ghazal_cache_homepage_v7",
    "ghazal_cache_settings_v1", "ghazal_cache_settings_v2", "ghazal_cache_settings_v3", "ghazal_cache_settings_v4", "ghazal_cache_settings_v5", "ghazal_cache_settings_v6", "ghazal_cache_settings_v7",
  ];
  for (const k of legacyKeys) {
    localStorage.removeItem(k);
  }
} catch {}

export function useStorefrontData() {
  const readCache = <T,>(key: string, fallback: T): T => {
    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached) : fallback;
    } catch {
      return fallback;
    }
  };

  const writeCache = (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Could not cache ${key}`, error);
    }
  };

  const [products, setProducts] = useState<Product[]>(() => {
    return readCache("ghazal_cache_products_v8", PRODUCTS);
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    return readCache("ghazal_cache_categories_v8", CATEGORIES);
  });
  const [packages, setPackages] = useState<StorePackage[]>(() => {
    return readCache("ghazal_cache_packages_v8", []);
  });
  const [homepage, setHomepage] = useState<any>(() => {
    return readCache("ghazal_cache_homepage_v8", null);
  });
  const [settings, setSettings] = useState<any>(() => {
    return readCache("ghazal_cache_settings_v8", null);
  });
  const [developer, setDeveloper] = useState<any>(null);

  // Render the usable local catalog immediately. Firebase then refreshes it in
  // the background, so an offline connection or a permission error cannot trap
  // customers behind the loading screen.
  const [productsLoaded, setProductsLoaded] = useState(true);
  const [categoriesLoaded, setCategoriesLoaded] = useState(true);
  const [homepageLoaded, setHomepageLoaded] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(true);

  const isLoaded = productsLoaded && categoriesLoaded && homepageLoaded && settingsLoaded;

  useEffect(() => {
    // Fast HTTPS REST API fetch for instant loading in restricted mobile WebViews (Facebook/Instagram)
    // where WebChannel streaming handshakes often stall or take up to 60 seconds
    const fetchRestProducts = async () => {
      try {
        const fields = ['code', 'name', 'arabicName', 'price', 'categoryKey', 'subCategoryKey', 'description', 'arabicDescription', 'tag', 'arabicTag', 'stock', 'rating', 'reviewsCount', 'hidden', 'featured', 'image', 'images'];
        const mask = fields.map(f => 'mask.fieldPaths=' + encodeURIComponent(f)).join('&');
        
        let allDocs: any[] = [];
        let pageToken = '';
        let loopCount = 0;

        do {
          loopCount++;
          const url = `https://firestore.googleapis.com/v1/projects/store-ce8ef/databases/(default)/documents/products?pageSize=100&${mask}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
          const res = await fetch(url);
          if (!res.ok) break;
          const data = await res.json();
          const docs = data.documents || [];
          allDocs.push(...docs);
          pageToken = data.nextPageToken || '';
        } while (pageToken && loopCount < 10);

        if (allDocs.length > 0) {
          const restRows = allDocs.map((doc: any) => {
            const f = doc.fields || {};
            const id = doc.name.split("/").pop();
            return {
              id,
              code: f.code?.stringValue || "",
              name: f.name?.stringValue || "",
              arabicName: f.arabicName?.stringValue || "",
              price: Number(f.price?.doubleValue ?? f.price?.integerValue ?? 0),
              categoryKey: f.categoryKey?.stringValue || "",
              subCategoryKey: f.subCategoryKey?.stringValue || "",
              description: f.description?.stringValue || "",
              arabicDescription: f.arabicDescription?.stringValue || "",
              tag: f.tag?.stringValue || "",
              arabicTag: f.arabicTag?.stringValue || "",
              image: f.image?.stringValue || "",
              images: (f.images?.arrayValue?.values || []).map((v: any) => v.stringValue),
              stock: f.stock?.integerValue !== undefined ? Number(f.stock.integerValue) : 10,
              rating: Number(f.rating?.doubleValue ?? f.rating?.integerValue ?? 5),
              reviewsCount: Number(f.reviewsCount?.integerValue ?? 35),
              specifications: (f.specifications?.arrayValue?.values || []).map((v: any) => v.stringValue),
              arabicSpecifications: (f.arabicSpecifications?.arrayValue?.values || []).map((v: any) => v.stringValue),
              hidden: Boolean(f.hidden?.booleanValue),
            };
          }).filter((p: any) => !p.hidden);

          // Only update if we received a comprehensive catalog (prevent partial overwriting)
          if (restRows.length >= 50) {
            const processed = restRows.map((row: any, index: number) => {
              const fallback = PRODUCTS.find((p) => p.firestoreId === row.id || p.code === row.code || String(p.id) === String(row.id) || p.name.trim().toLowerCase() === String(row.name || "").trim().toLowerCase());
              return normalizeProduct(row, index, fallback);
            });
            setProducts(processed);
            writeCache("ghazal_cache_products_v8", processed);
            setProductsLoaded(true);
          }
        }
      } catch (err) {
        console.warn("REST products fetch fallback:", err);
      }
    };

    const fetchRestCategories = async () => {
      try {
        const res = await fetch("https://firestore.googleapis.com/v1/projects/store-ce8ef/databases/(default)/documents/categories?pageSize=100");
        if (!res.ok) return;
        const data = await res.json();
        if (data.documents && Array.isArray(data.documents)) {
          const restCats = data.documents.map((doc: any) => {
            const f = doc.fields || {};
            const id = doc.name.split("/").pop();
            const rawSubs = f.subCategories?.arrayValue?.values || [];
            const subCategories = rawSubs.map((s: any) => {
              const m = s.mapValue?.fields || {};
              return {
                key: m.key?.stringValue || "",
                name: m.name?.stringValue || "",
                arabicName: m.arabicName?.stringValue || "",
                description: m.description?.stringValue || "",
                arabicDescription: m.arabicDescription?.stringValue || "",
              };
            });
            return {
              id,
              key: f.key?.stringValue || id,
              name: f.name?.stringValue || "",
              arabicName: f.arabicName?.stringValue || "",
              description: f.description?.stringValue || "",
              arabicDescription: f.arabicDescription?.stringValue || "",
              sortOrder: Number(f.sortOrder?.integerValue ?? 0),
              subCategories,
              hidden: Boolean(f.hidden?.booleanValue),
            };
          }).filter((c: any) => !c.hidden);

          restCats.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
          if (restCats.length > 0) {
            const processed = restCats.map((row: any) => {
              const fallback = CATEGORIES.find((c) => c.key === row.key || c.id === row.id || c.name.trim().toLowerCase() === String(row.name || "").trim().toLowerCase());
              return normalizeCategory(row, fallback);
            });
            setCategories(processed);
            writeCache("ghazal_cache_categories_v8", processed);
            setCategoriesLoaded(true);
          }
        }
      } catch (err) {
        console.warn("REST categories fetch fallback:", err);
      }
    };

    fetchRestProducts();
    fetchRestCategories();

    if (!db) return;

    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as any));
      // Sort newest first by createdAt
      rows.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || (a.createdAt instanceof Date ? a.createdAt.getTime() : (typeof a.createdAt === "number" ? a.createdAt : 0));
        const timeB = b.createdAt?.toMillis?.() || (b.createdAt instanceof Date ? b.createdAt.getTime() : (typeof b.createdAt === "number" ? b.createdAt : 0));
        return timeB - timeA;
      });
      const visibleRows = rows.filter((product) => !product.hidden);
      if (visibleRows.length >= 20 || snapshot.metadata.fromCache) {
        const processed = visibleRows.map((row, index) => {
          const fallback = PRODUCTS.find((p) => p.firestoreId === row.id || p.code === row.code || String(p.id) === String(row.id) || p.name.trim().toLowerCase() === String(row.name || "").trim().toLowerCase());
          return normalizeProduct(row, index, fallback);
        });
        if (processed.length > 0) {
          setProducts(processed);
          writeCache("ghazal_cache_products_v8", processed);
        }
      }
      setProductsLoaded(true);
    }, (err) => {
      console.warn("Products listener fallback to cache:", err);
      setProductsLoaded(true);
    });

    const unsubCategories = onSnapshot(collection(db, "categories"), (snapshot) => {
      const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as any));
      rows.sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0));
      const visibleRows = rows.filter((category) => !category.hidden);
      if (visibleRows.length > 0 || snapshot.metadata.fromCache) {
        const processed = visibleRows.map((row) => {
          const fallback = CATEGORIES.find((c) => c.key === row.key || c.id === row.id || c.name.trim().toLowerCase() === String(row.name || "").trim().toLowerCase());
          return normalizeCategory(row, fallback);
        });
        if (processed.length > 0) {
          setCategories(processed);
          writeCache("ghazal_cache_categories_v8", processed);
        }
      }
      setCategoriesLoaded(true);
    }, (err) => {
      console.warn("Categories listener fallback to cache:", err);
      setCategoriesLoaded(true);
    });

    const unsubPackages = onSnapshot(collection(db, "packages"), (snapshot) => {
      const rows = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() } as any))
        .filter((item) => !item.hidden)
        .map((row, index) => normalizePackage(row, index));
      if (rows.length > 0) {
        setPackages(rows);
        writeCache("ghazal_cache_packages_v8", rows);
      }
    }, () => undefined);

    const unsubHomepage = onSnapshot(doc(db, "homepage", "main"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setHomepage(data);
        writeCache("ghazal_cache_homepage_v8", data);
      }
      setHomepageLoaded(true);
    }, (err) => {
      console.warn("Homepage listener fallback to cache:", err);
      setHomepageLoaded(true);
    });

    const unsubSettings = onSnapshot(doc(db, "settings", "main"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setSettings(data);
        writeCache("ghazal_cache_settings_v8", data);
      }
      setSettingsLoaded(true);
    }, () => setSettingsLoaded(true));

    const unsubDeveloper = onSnapshot(doc(db, "developer", "main"), (snapshot) => {
      if (snapshot.exists()) {
        setDeveloper(snapshot.data());
      }
    }, () => undefined);

    return () => {
      unsubProducts();
      unsubCategories();
      unsubPackages();
      unsubHomepage();
      unsubSettings();
      unsubDeveloper();
    };
  }, []);

  return { products, categories, packages, homepage, settings, developer, isLoading: !isLoaded };
}

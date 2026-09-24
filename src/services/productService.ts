import { collection, onSnapshot, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { PRODUCTS } from "../data/initialProducts";
import { Product, AdminProduct } from "../types";
import { uploadAllBase64InObject } from "./storageService";

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

export function normalizeProduct(row: any, index: number, fallback?: Product): Product {
  const isFeatured = row.featured !== undefined ? Boolean(row.featured) : Boolean(fallback?.featured);
  const tag = row.tag || (isFeatured ? "BEST SELLER" : (fallback?.tag || "POPULAR"));
  const arabicTag = row.arabicTag || (isFeatured ? "الأكثر مبيعاً" : (fallback?.arabicTag || "شائع"));
  
  const name = (row.name && String(row.name).trim()) || fallback?.name || "Dental Product";
  const arabicName = (row.arabicName && String(row.arabicName).trim()) || fallback?.arabicName || row.name || "منتج طب أسنان";

  const description = (row.description && String(row.description).trim()) || fallback?.description || "";
  const arabicDescription = (row.arabicDescription && String(row.arabicDescription).trim()) || fallback?.arabicDescription || row.description || "";

  const categoryKey = (row.categoryKey !== undefined && row.categoryKey !== null && String(row.categoryKey).trim() !== "" ? String(row.categoryKey).trim() : (fallback?.categoryKey || "")).trim();
  const subCategoryKey = (row.subCategoryKey !== undefined && row.subCategoryKey !== null && String(row.subCategoryKey).trim() !== "" ? String(row.subCategoryKey).trim() : (fallback?.subCategoryKey || "")).trim();

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

export async function fetchProductsViaRest(): Promise<Product[]> {
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

    if (allDocs.length >= 50) {
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

      return restRows.map((row: any, index: number) => {
        const fallback = PRODUCTS.find((p) => p.firestoreId === row.id || p.code === row.code || String(p.id) === String(row.id) || p.name.trim().toLowerCase() === String(row.name || "").trim().toLowerCase());
        return normalizeProduct(row, index, fallback);
      });
    }
  } catch (err) {
    console.warn("Product REST fetch error:", err);
  }
  return [];
}

export function subscribeToProducts(
  onProducts: (products: Product[]) => void,
  onError?: (error: Error) => void
) {
  if (!db) {
    onProducts(PRODUCTS);
    return () => {};
  }

  return onSnapshot(
    collection(db, "products"),
    (snapshot) => {
      const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as any));
      rows.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || (a.createdAt instanceof Date ? a.createdAt.getTime() : (typeof a.createdAt === "number" ? a.createdAt : 0));
        const timeB = b.createdAt?.toMillis?.() || (b.createdAt instanceof Date ? b.createdAt.getTime() : (typeof b.createdAt === "number" ? b.createdAt : 0));
        return timeB - timeA;
      });
      const visibleRows = rows.filter((product) => !product.hidden);
      if (visibleRows.length > 0 || snapshot.metadata.fromCache) {
        const processed = visibleRows.map((row, index) => {
          const fallback = PRODUCTS.find((p) => p.firestoreId === row.id || p.code === row.code || String(p.id) === String(row.id) || p.name.trim().toLowerCase() === String(row.name || "").trim().toLowerCase());
          return normalizeProduct(row, index, fallback);
        });
        if (processed.length > 0) {
          onProducts(processed);
        }
      }
    },
    (err) => {
      console.warn("Products snapshot error:", err);
      onError?.(err);
    }
  );
}

export async function createProduct(payload: Omit<AdminProduct, "id">) {
  if (!db) throw new Error("Firebase is not configured.");
  const processed = await uploadAllBase64InObject(payload, "products");
  return addDoc(collection(db, "products"), {
    ...processed,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(id: string, payload: Partial<AdminProduct>) {
  if (!db) throw new Error("Firebase is not configured.");
  const processed = await uploadAllBase64InObject(payload, "products");
  return setDoc(doc(db, "products", id), { ...processed, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteProduct(id: string) {
  if (!db) throw new Error("Firebase is not configured.");
  return deleteDoc(doc(db, "products", id));
}

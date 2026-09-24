import { collection, onSnapshot, doc, addDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { CATEGORIES } from "../data/categoriesData";
import { Category, AdminCategory } from "../types";

export function normalizeCategory(row: any, fallback?: Category): Category {
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
    sortOrder: Number(row.sortOrder ?? fallback?.sortOrder ?? 0),
  };
}

export async function fetchCategoriesViaRest(): Promise<Category[]> {
  try {
    const res = await fetch("https://firestore.googleapis.com/v1/projects/store-ce8ef/databases/(default)/documents/categories?pageSize=100");
    if (!res.ok) return [];
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
        return restCats.map((row: any) => {
          const fallback = CATEGORIES.find((c) => c.key === row.key || c.id === row.id || c.name.trim().toLowerCase() === String(row.name || "").trim().toLowerCase());
          return normalizeCategory(row, fallback);
        });
      }
    }
  } catch (err) {
    console.warn("Category REST fetch error:", err);
  }
  return [];
}

export function subscribeToCategories(
  onCategories: (categories: Category[]) => void,
  onError?: (error: Error) => void
) {
  if (!db) {
    onCategories(CATEGORIES);
    return () => {};
  }

  return onSnapshot(
    collection(db, "categories"),
    (snapshot) => {
      const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as any));
      rows.sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0));
      const visibleRows = rows.filter((category) => !category.hidden);
      if (visibleRows.length > 0 || snapshot.metadata.fromCache) {
        const processed = visibleRows.map((row) => {
          const fallback = CATEGORIES.find((c) => c.key === row.key || c.id === row.id || c.name.trim().toLowerCase() === String(row.name || "").trim().toLowerCase());
          return normalizeCategory(row, fallback);
        });
        if (processed.length > 0) {
          onCategories(processed);
        }
      }
    },
    (err) => {
      console.warn("Categories snapshot error:", err);
      onError?.(err);
    }
  );
}

export async function createCategory(payload: Omit<AdminCategory, "id">) {
  if (!db) throw new Error("Firebase is not configured.");
  return addDoc(collection(db, "categories"), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCategory(id: string, payload: Partial<AdminCategory>) {
  if (!db) throw new Error("Firebase is not configured.");
  return setDoc(doc(db, "categories", id), { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteCategory(id: string) {
  if (!db) throw new Error("Firebase is not configured.");
  return deleteDoc(doc(db, "categories", id));
}

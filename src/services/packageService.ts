import { collection, onSnapshot, doc, addDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { StorePackage, AdminPackage } from "../types";

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

export function normalizePackage(row: any, index: number): StorePackage {
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
    featured: Boolean(row.featured),
  };
}

export function subscribeToPackages(
  onPackages: (packages: StorePackage[]) => void,
  onError?: (error: Error) => void
) {
  if (!db) {
    onPackages([]);
    return () => {};
  }

  return onSnapshot(
    collection(db, "packages"),
    (snapshot) => {
      const rows = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() } as any))
        .filter((item) => !item.hidden)
        .map((row, index) => normalizePackage(row, index));
      onPackages(rows);
    },
    (err) => {
      console.warn("Packages snapshot error:", err);
      onError?.(err);
    }
  );
}

export async function createPackage(payload: Omit<AdminPackage, "id">) {
  if (!db) throw new Error("Firebase is not configured.");
  return addDoc(collection(db, "packages"), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updatePackage(id: string, payload: Partial<AdminPackage>) {
  if (!db) throw new Error("Firebase is not configured.");
  return setDoc(doc(db, "packages", id), { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deletePackage(id: string) {
  if (!db) throw new Error("Firebase is not configured.");
  return deleteDoc(doc(db, "packages", id));
}

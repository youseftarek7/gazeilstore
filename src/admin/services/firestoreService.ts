import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  getDocs,
  type OrderByDirection,
} from "firebase/firestore";
import { db } from "../../firebase";
import { CATEGORIES, PRODUCTS } from "../../data";

export const collections = {
  products: "products",
  packages: "packages",
  categories: "categories",
  orders: "orders",
  homepage: "homepage",
  settings: "settings",
  developer: "developer",
  users: "users",
} as const;

export function subscribeCollection<T>(
  collectionName: keyof typeof collections,
  callback: (rows: T[]) => void,
  onError: (error: Error) => void,
  sortField = "createdAt",
  direction: OrderByDirection = "desc",
) {
  if (!db) {
    callback([]);
    return () => {};
  }

  // NOTE: In Firestore, query(..., orderBy(sortField)) completely drops any document
  // that lacks sortField! For products, 21 documents lacked createdAt, so Firestore
  // excluded them from the snapshot! Subscribing to the collection directly and sorting
  // in-memory guarantees that all documents (including those 21 products) appear in admin.
  return onSnapshot(
    collection(db, collections[collectionName]),
    (snapshot) => {
      const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as any);
      items.sort((a, b) => {
        const valA = a[sortField]?.toMillis?.() || (a[sortField] instanceof Date ? a[sortField].getTime() : (typeof a[sortField] === "number" ? a[sortField] : 0));
        const valB = b[sortField]?.toMillis?.() || (b[sortField] instanceof Date ? b[sortField].getTime() : (typeof b[sortField] === "number" ? b[sortField] : 0));
        return direction === "desc" ? valB - valA : valA - valB;
      });
      callback(items as T[]);
    },
    onError,
  );
}

export async function getDocument<T>(collectionName: keyof typeof collections, id: string) {
  if (!db) throw new Error("Firebase is not configured.");
  const snapshot = await getDoc(doc(db, collections[collectionName], id));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
}

export async function createDocument<T extends Record<string, unknown>>(
  collectionName: keyof typeof collections,
  payload: T,
) {
  if (!db) throw new Error("Firebase is not configured.");
  const processed = await uploadAllBase64InObject(payload, collectionName);
  return addDoc(collection(db, collections[collectionName]), {
    ...processed,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function saveDocument<T extends Record<string, unknown>>(
  collectionName: keyof typeof collections,
  id: string,
  payload: T,
) {
  if (!db) throw new Error("Firebase is not configured.");
  const processed = await uploadAllBase64InObject(payload, collectionName);
  return setDoc(
    doc(db, collections[collectionName], id),
    { ...processed, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function updateDocument<T extends Record<string, unknown>>(
  collectionName: keyof typeof collections,
  id: string,
  payload: T,
) {
  if (!db) throw new Error("Firebase is not configured.");
  const processed = await uploadAllBase64InObject(payload, collectionName);
  return updateDoc(doc(db, collections[collectionName], id), {
    ...processed,
    updatedAt: serverTimestamp(),
  });
}

export async function removeDocument(collectionName: keyof typeof collections, id: string) {
  if (!db) throw new Error("Firebase is not configured.");
  return deleteDoc(doc(db, collections[collectionName], id));
}

export async function compressBase64(
  base64Data: string,
  maxWidth = 500,
  maxHeight = 500,
  quality = 0.5
): Promise<string> {
  if (!base64Data || typeof base64Data !== "string" || !base64Data.startsWith("data:image/")) {
    return base64Data;
  }
  
  if (base64Data.length < 40000) {
    return base64Data;
  }
  
  return new Promise((resolve) => {
    let resolved = false;
    const finish = (result: string) => {
      if (!resolved) {
        resolved = true;
        resolve(result);
      }
    };

    const timer = setTimeout(() => finish(base64Data), 1500);

    try {
      const img = new Image();
      img.onload = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            finish(canvas.toDataURL("image/webp", quality));
          } else {
            finish(base64Data);
          }
        } catch {
          finish(base64Data);
        }
      };
      img.onerror = () => {
        clearTimeout(timer);
        finish(base64Data);
      };
      img.src = base64Data;
    } catch {
      clearTimeout(timer);
      finish(base64Data);
    }
  });
}

// These values are public identifiers, not account secrets. They can also be
// supplied through environment variables for another Cloudinary account.
const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "rvbujouj";
const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ghazal_products";

async function uploadBase64ToCloudinary(base64Data: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", base64Data);
  formData.append("upload_preset", cloudinaryUploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Cloudinary image upload failed.");

  const result = await response.json();
  if (!result.secure_url) throw new Error("Cloudinary did not return an image URL.");
  return result.secure_url as string;
}

export async function uploadBase64ToStorage(base64Data: string, folder: string): Promise<string> {
  if (!base64Data.startsWith("data:")) {
    return base64Data;
  }

  if (base64Data.startsWith("data:image/")) {
    try {
      return await uploadBase64ToCloudinary(base64Data);
    } catch (cloudinaryError) {
      console.warn("Cloudinary upload failed. Compressing base64 image as fallback...", cloudinaryError);
    }
  }

  try {
    return await compressBase64(base64Data, 500, 500, 0.5);
  } catch (compressError) {
    console.error("Compression failed:", compressError);
    return base64Data;
  }
}

function isPlainObject(val: any): boolean {
  if (typeof val !== "object" || val === null) return false;
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto === Object.prototype;
}

export async function uploadAllBase64InObject<T>(obj: T, folder: string): Promise<T> {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    if (obj.startsWith("data:image/")) {
      try {
        return (await uploadBase64ToStorage(obj, folder)) as unknown as T;
      } catch (error) {
        console.error("Failed to upload base64 image to storage:", error);
        return obj;
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArray = await Promise.all(
      obj.map((item) => uploadAllBase64InObject(item, folder))
    );
    return newArray as unknown as T;
  }

  if (isPlainObject(obj)) {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = await uploadAllBase64InObject((obj as any)[key], folder);
    }
    return newObj as T;
  }

  return obj;
}

export async function compressAllBase64InObject<T>(obj: T): Promise<T> {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    if (obj.startsWith("data:image/")) {
      try {
        return (await compressBase64(obj, 500, 500, 0.5)) as unknown as T;
      } catch (error) {
        return obj;
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArray = await Promise.all(
      obj.map((item) => compressAllBase64InObject(item))
    );
    return newArray as unknown as T;
  }

  if (isPlainObject(obj)) {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = await compressAllBase64InObject((obj as any)[key]);
    }
    return newObj as T;
  }

  return obj;
}

export async function uploadAdminImage(folder: string, file: File): Promise<string> {
  let maxWidth = 450;
  let maxHeight = 450;
  let quality = 0.4;

  if (folder === "homepage" || folder === "hero") {
    maxWidth = 800;
    maxHeight = 800;
    quality = 0.5;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/webp", quality);
          uploadBase64ToStorage(dataUrl, folder)
            .then(resolve)
            .catch((err) => {
              console.error("Storage upload failed, using fallback base64:", err);
              resolve(dataUrl);
            });
        } else {
          const rawData = event.target?.result as string;
          uploadBase64ToStorage(rawData, folder)
            .then(resolve)
            .catch((err) => {
              console.error("Storage upload failed, using fallback base64:", err);
              resolve(rawData);
            });
        }
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function safeDocId(value: string) {
  return value
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export async function importLocalCatalogToFirebase() {
  if (!db) throw new Error("Firebase is not configured.");

  await Promise.all(
    CATEGORIES.map((category, index) =>
      saveDocument("categories", safeDocId(category.key || category.id), {
        key: category.key,
        name: category.name,
        arabicName: category.arabicName,
        description: category.description,
        image: category.premiumImage,
        sortOrder: index + 1,
        hidden: false,
        subCategories: category.subCategories || [],
        createdAt: new Date(),
      }),
    ),
  );

  await Promise.all(
    PRODUCTS.map((product) =>
      saveDocument("products", safeDocId(product.code || String(product.id)), {
        code: product.code,
        name: product.name,
        arabicName: product.arabicName,
        price: product.price,
        stock: product.inStock ? 10 : 0,
        image: product.image,
        images: product.images || [product.image].filter(Boolean),
        tag: product.tag || "",
        arabicTag: product.arabicTag || "",
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
        createdAt: new Date(),
      }),
    ),
  );
}

export async function wipeCatalogFromFirebase() {
  if (!db) throw new Error("Firebase is not configured.");
  
  const productsSnapshot = await getDocs(collection(db, "products"));
  await Promise.all(productsSnapshot.docs.map(docSnap => deleteDoc(doc(db, "products", docSnap.id))));
  
  const categoriesSnapshot = await getDocs(collection(db, "categories"));
  await Promise.all(categoriesSnapshot.docs.map(docSnap => deleteDoc(doc(db, "categories", docSnap.id))));
}

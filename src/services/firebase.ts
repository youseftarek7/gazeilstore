import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, memoryLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);
export const firebaseApp = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;

function isRestrictedWebView(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || "";
    if (/FBAN|FBAV|Instagram|FB_IAB|Line|Twitter/i.test(ua)) {
      return true;
    }
    if (!window.indexedDB) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}

function createFirestoreInstance() {
  if (!firebaseApp) return null;

  if (isRestrictedWebView()) {
    try {
      return initializeFirestore(firebaseApp, {
        localCache: memoryLocalCache(),
      });
    } catch (err) {
      console.warn("Error initializing memory Firestore:", err);
      return null;
    }
  }

  try {
    return initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache(),
    });
  } catch (err) {
    console.warn("Falling back to memory local cache due to environment restrictions (e.g. WebView):", err);
    try {
      return initializeFirestore(firebaseApp, {
        localCache: memoryLocalCache(),
      });
    } catch {
      return null;
    }
  }
}

export const db = createFirestoreInstance();
export const storage = firebaseApp ? getStorage(firebaseApp) : null;

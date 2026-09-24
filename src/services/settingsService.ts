import { doc, getDoc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { HomepageSettings, StoreSettings, DeveloperSettings } from "../types";

export function subscribeToHomepageSettings(
  onSettings: (settings: HomepageSettings | null) => void,
  onError?: (error: Error) => void
) {
  if (!db) {
    onSettings(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, "homepage", "main"),
    (snapshot) => {
      if (snapshot.exists()) {
        onSettings(snapshot.data() as HomepageSettings);
      } else {
        onSettings(null);
      }
    },
    onError
  );
}

export function subscribeToStoreSettings(
  onSettings: (settings: StoreSettings | null) => void,
  onError?: (error: Error) => void
) {
  if (!db) {
    onSettings(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, "settings", "main"),
    (snapshot) => {
      if (snapshot.exists()) {
        onSettings(snapshot.data() as StoreSettings);
      } else {
        onSettings(null);
      }
    },
    onError
  );
}

export function subscribeToDeveloperSettings(
  onSettings: (settings: DeveloperSettings | null) => void
) {
  if (!db) {
    onSettings(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, "developer", "main"),
    (snapshot) => {
      if (snapshot.exists()) {
        onSettings(snapshot.data() as DeveloperSettings);
      }
    },
    () => undefined
  );
}

export async function saveHomepageSettings(settings: Partial<HomepageSettings>) {
  if (!db) throw new Error("Firebase is not configured.");
  return setDoc(doc(db, "homepage", "main"), { ...settings, updatedAt: serverTimestamp() }, { merge: true });
}

export async function saveStoreSettings(settings: Partial<StoreSettings>) {
  if (!db) throw new Error("Firebase is not configured.");
  return setDoc(doc(db, "settings", "main"), { ...settings, updatedAt: serverTimestamp() }, { merge: true });
}

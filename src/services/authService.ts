import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { AdminRole, AdminUser } from "../types";
import { getStorageItem, setStorageItem, removeStorageItem } from "../utils/storage";

const AUTH_STORAGE_KEY = "ghazal_admin_auth";

const roleRank: Record<AdminRole, number> = {
  Owner: 3,
  Manager: 2,
  Employee: 1,
};

export function canAccess(userRole: AdminRole | undefined, minimumRole: AdminRole): boolean {
  if (!userRole) return false;
  return roleRank[userRole] >= roleRank[minimumRole];
}

export function checkStoredAdminSession(): boolean {
  return getStorageItem<string>(AUTH_STORAGE_KEY, "false") === "true";
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    let correctPassword = "admin123";
    if (db) {
      const docSnap = await getDoc(doc(db, "settings", "adminAuth"));
      if (docSnap.exists()) {
        correctPassword = docSnap.data()?.password || correctPassword;
      }
    }
    if (password === correctPassword) {
      setStorageItem(AUTH_STORAGE_KEY, "true");
      return true;
    }
    throw new Error("كلمة المرور غير صحيحة");
  } catch (err: any) {
    throw new Error(err?.message || "كلمة المرور غير صحيحة");
  }
}

export function logoutAdmin(): void {
  removeStorageItem(AUTH_STORAGE_KEY);
}

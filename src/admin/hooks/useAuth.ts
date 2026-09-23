import { useEffect, useMemo, useState } from "react";
import { AdminRole, AdminUser } from "../types/admin";
import { getDocument } from "../services/firestoreService";

const roleRank: Record<AdminRole, number> = {
  Owner: 3,
  Manager: 2,
  Employee: 1,
};

export function canAccess(userRole: AdminRole | undefined, minimumRole: AdminRole) {
  if (!userRole) return false;
  return roleRank[userRole] >= roleRank[minimumRole];
}

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("ghazal_admin_auth");
    if (saved === "true") {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  return useMemo(
    () => ({
      profile: {
        id: "local-owner",
        name: "Store Manager",
        email: "admin@store",
        role: "Owner" as AdminRole,
        active: true,
      },
      loading,
      isAdmin,
      login: async (password: string) => {
        try {
          const doc = await getDocument<{ password?: string }>("settings", "adminAuth");
          const correctPassword = doc?.password || "admin123";
          if (password === correctPassword) {
            localStorage.setItem("ghazal_admin_auth", "true");
            setIsAdmin(true);
            return true;
          }
          throw new Error("كلمة المرور غير صحيحة");
        } catch (e: any) {
          throw new Error("كلمة المرور غير صحيحة");
        }
      },
      logout: () => {
        localStorage.removeItem("ghazal_admin_auth");
        setIsAdmin(false);
      },
    }),
    [loading, isAdmin],
  );
}

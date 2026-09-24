import { useEffect, useMemo, useState } from "react";
import { AdminRole, AdminUser } from "../../types/admin";
import { canAccess, checkStoredAdminSession, verifyAdminPassword, logoutAdmin } from "../../services/authService";

export { canAccess };

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (checkStoredAdminSession()) {
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
        const ok = await verifyAdminPassword(password);
        if (ok) {
          setIsAdmin(true);
          return true;
        }
        return false;
      },
      logout: () => {
        logoutAdmin();
        setIsAdmin(false);
      },
    }),
    [loading, isAdmin],
  );
}

import { useEffect, useState } from "react";
import { subscribeCollection } from "../services/firestoreService";
import type { OrderByDirection } from "firebase/firestore";

export function useCollection<T>(
  name: "products" | "packages" | "categories" | "orders" | "homepage" | "settings" | "developer" | "users",
  sortField = "createdAt",
  direction: OrderByDirection = "desc",
  enabled: boolean = true
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeCollection<T>(
      name,
      (nextRows) => {
        setRows(nextRows);
        setLoading(false);
      },
      (nextError) => {
        setError(nextError);
        setLoading(false);
      },
      sortField,
      direction
    );

    return unsubscribe;
  }, [name, sortField, direction, enabled]);

  return { rows, loading, error };
}

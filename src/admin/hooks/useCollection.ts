import { useEffect, useState } from "react";
import type { OrderByDirection } from "firebase/firestore";
import { collections, subscribeCollection } from "../services/firestoreService";

export function useCollection<T>(
  collectionName: keyof typeof collections,
  sortField = "createdAt",
  direction: OrderByDirection = "desc",
  enabled = true,
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      setRows([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeCollection<T>(
      collectionName,
      (items) => {
        setRows(items);
        setLoading(false);
        setError(null);
      },
      (snapshotError) => {
        setError(snapshotError);
        setRows([]);
        setLoading(false);
      },
      sortField,
      direction,
    );

    return unsubscribe;
  }, [collectionName, direction, enabled, sortField]);

  return { rows, loading, error };
}

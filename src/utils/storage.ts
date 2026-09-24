export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") return fallback;
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    if (typeof window === "undefined") return false;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`Error setting localStorage key "${key}":`, err);
    return false;
  }
}

export function removeStorageItem(key: string): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  } catch (err) {
    console.warn(`Error removing localStorage key "${key}":`, err);
  }
}

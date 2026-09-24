export function normalizeArabicText(text: string): string {
  if (!text) return "";
  return text
    .trim()
    .toLowerCase()
    .replace(/[إأآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ي/g, "ى")
    .replace(/[\u064B-\u065F]/g, ""); // Remove Arabic diacritics / Harakat
}

export function searchMatches(query: string, ...targets: (string | undefined | null)[]): boolean {
  if (!query || query.trim() === "") return true;
  const normalizedQuery = normalizeArabicText(query);
  return targets.some((target) => {
    if (!target) return false;
    const normalizedTarget = normalizeArabicText(target);
    return normalizedTarget.includes(normalizedQuery) || target.toLowerCase().includes(query.toLowerCase());
  });
}

import { useMemo } from "react";
import { Product, ProductSortOption } from "../types";
import { searchMatches } from "../utils/arabic";

interface UseFilteredProductsOptions {
  products: Product[];
  selectedCategory: string;
  selectedSubCategory: string;
  searchQuery: string;
  sortBy: ProductSortOption;
  onlyInStock: boolean;
}

export function useFilteredProducts({
  products,
  selectedCategory,
  selectedSubCategory,
  searchQuery,
  sortBy,
  onlyInStock,
}: UseFilteredProductsOptions): Product[] {
  return useMemo(() => {
    const filtered = products.filter((product) => {
      // 1. Live text search
      if (searchQuery.trim() !== "") {
        const query = searchQuery.trim();
        const matches = searchMatches(
          query,
          product.code,
          product.name,
          product.arabicName,
          product.description,
          product.arabicDescription,
          product.tag,
          product.arabicTag
        );
        if (!matches) return false;
      }

      // 2. Category / Subcategory filter
      if (searchQuery.trim() === "") {
        if (selectedCategory === "all") {
          // Show all items
        } else if (selectedCategory === "best") {
          if (!Boolean((product as any).featured)) return false;
        } else {
          const pCat = (product.categoryKey || "").trim();
          const targetCat = (selectedCategory || "").trim();
          const catMatch = pCat === targetCat || (product as any).categoryId === targetCat;
          if (!catMatch) return false;

          if (selectedSubCategory) {
            const pSub = (product.subCategoryKey || "").trim();
            const targetSub = selectedSubCategory.trim();
            const subMatch =
              pSub === targetSub ||
              pSub.replace(/-+$/, "") === targetSub.replace(/-+$/, "") ||
              pSub.toLowerCase() === targetSub.toLowerCase();
            if (!subMatch) return false;
          }
        }
      }

      // 3. Stock filter
      if (onlyInStock && !product.inStock) {
        return false;
      }

      return true;
    });

    // Deduplicate items
    const seen = new Set<string>();
    const unique = filtered.filter((p) => {
      const key = p.firestoreId || p.code || String(p.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sorting
    return [...unique].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [products, selectedCategory, selectedSubCategory, searchQuery, sortBy, onlyInStock]);
}

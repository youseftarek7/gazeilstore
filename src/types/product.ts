export interface ProductDetailSection {
  title: string;
  body?: string;
  image?: string;
  bullets?: string[];
}

export interface Product {
  id: number;
  firestoreId?: string;
  code: string; // SKU code
  name: string;
  arabicName: string;
  price: number;
  image: string;
  images?: string[];
  tag?: string;
  arabicTag?: string;
  categoryKey: string;
  subCategoryKey: string;
  description: string;
  arabicDescription: string;
  specifications?: string[];
  arabicSpecifications?: string[];
  detailSections?: ProductDetailSection[];
  showInHomeSplit?: boolean;
  splitTitle?: string;
  splitDescription?: string;
  splitImage?: string;
  splitBadge?: string;
  splitLabel?: string;
  splitButtonText?: string;
  splitFeatures?: string[];
  inStock: boolean;
  stock?: number;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  hidden?: boolean;
}

export type ProductSortOption = "default" | "price-low" | "price-high" | "rating";

export interface ProductFilterState {
  categoryKey: string;
  subCategoryKey: string;
  searchQuery: string;
  sortBy: ProductSortOption;
  onlyInStock: boolean;
}

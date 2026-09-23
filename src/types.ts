/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SubCategory {
  key: string;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
}

export interface Category {
  id: string;
  key: string;
  name: string;
  arabicName: string;
  premiumImage: string;
  subCategories: SubCategory[];
  description: string;
  arabicDescription: string;
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
  subCategoryKey: string; // which subcategory it belongs to
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
  rating: number;
  reviewsCount: number;
}

export interface StorePackage {
  id: number;
  firestoreId?: string;
  code: string;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
  originalPrice: number;
  dealPrice: number;
  discountPercent: number;
  image: string;
  tag: string;
  arabicTag: string;
  bullets: string[];
  arabicBullets: string[];
  productIds: string[];
  productCodes: string[];
  categoryKey?: string;
  subCategoryKey?: string;
  timeLeftSeconds: number;
  hidden?: boolean;
}

export interface ProductDetailSection {
  title: string;
  body?: string;
  image?: string;
  bullets?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

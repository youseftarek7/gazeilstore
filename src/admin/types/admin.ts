export type AdminRole = "Owner" | "Manager" | "Employee";
export type OrderStatus = "Pending" | "Confirmed" | "Shipping" | "Delivered" | "Cancelled";

export interface AdminSubCategory {
  key: string;
  name: string;
  arabicName: string;
  description: string;
  arabicDescription: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  active: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminProduct {
  id: string;
  code: string;
  name: string;
  arabicName: string;
  price: number;
  stock: number;
  image: string;
  images: string[];
  categoryKey: string;
  subCategoryKey: string;
  description: string;
  arabicDescription: string;
  specifications?: string[];
  arabicSpecifications?: string[];
  detailSections?: unknown[];
  showInHomeSplit?: boolean;
  splitTitle?: string;
  splitDescription?: string;
  splitImage?: string;
  splitBadge?: string;
  splitLabel?: string;
  splitButtonText?: string;
  splitFeatures?: string[];
  hidden: boolean;
  featured: boolean;
  isLocalFallback?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminPackage {
  id: string;
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
  hidden: boolean;
  isLocalFallback?: boolean;
  featured: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminCategory {
  id: string;
  key: string;
  name: string;
  arabicName: string;
  description: string;
  image: string;
  sortOrder: number;
  hidden: boolean;
  isLocalFallback?: boolean;
  subCategories?: AdminSubCategory[];
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminOrderItem {
  productId: string;
  name: string;
  code: string;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  university: string;
  products: AdminOrderItem[];
  total: number;
  status: OrderStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface HomepageSettings {
  id: "main";
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  offersBanner: string;
  academicYearsSection: string;
  clinicsSection: string;
  splitEyebrow?: string;
  splitTitle?: string;
  splitSubtitle?: string;
  academicTitle?: string;
  academicDescription?: string;
  academicImage?: string;
  academicBadge?: string;
  academicLabel?: string;
  academicFeatures?: string[];
  clinicsTitle?: string;
  clinicsDescription?: string;
  clinicsImage?: string;
  clinicsBadge?: string;
  clinicsLabel?: string;
  clinicsFeatures?: string[];
  offersEyebrow?: string;
  offersTitle?: string;
  offersSubtitle?: string;
  offers?: unknown[];
  categoryBrowserTitle?: string;
  categoryBrowserSubtitle?: string;
  destinationCards?: unknown[];
  trendingTags?: string[];
  trendingLinks?: { label: string; productId: string }[];
  heroCardImage?: string;
  heroCardTitle?: string;
  heroCardSubtitle?: string;
  heroCardTag?: string;
  heroCardCategoryKey?: string;
  sidebarLinks?: { label: string; arLabel: string; categoryKey: string; subCategoryKey?: string }[];
  customSliders?: { title: string; image: string; productId: string }[];
  customBanners?: { image: string; productId: string }[];
}

export interface StoreSettings {
  id: "main";
  phone: string;
  whatsapp: string;
  address: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
}

export interface DeveloperSettings {
  id: "main";
  name: string;
  image: string;
  jobTitle: string;
  phone: string;
  whatsapp: string;
}

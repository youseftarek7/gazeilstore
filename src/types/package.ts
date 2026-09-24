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
  featured?: boolean;
}

export interface PromoOffer {
  id: number;
  code: string;
  name: string;
  arabicName?: string;
  description: string;
  arabicDescription?: string;
  originalPrice: number;
  dealPrice: number;
  discountPercent: number;
  image: string;
  tag: string;
  arabicTag?: string;
  bullets: string[];
  arabicBullets?: string[];
  timeLeftSeconds: number;
  productIds?: string[];
}

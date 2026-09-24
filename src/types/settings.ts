export interface HomepageSettings {
  id: "main";
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  offersBanner?: string;
  academicYearsSection?: string;
  clinicsSection?: string;
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
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  icon?: string;
}

export interface DeveloperSettings {
  id: "main";
  name: string;
  image: string;
  jobTitle: string;
  phone: string;
  whatsapp: string;
}

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
  sortOrder?: number;
  hidden?: boolean;
}

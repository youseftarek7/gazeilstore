import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CompactCartItem {
  product: {
    id: number;
    firestoreId?: string;
    code: string;
    name: string;
    arabicName: string;
    price: number;
    image: string;
    categoryKey: string;
    subCategoryKey: string;
    inStock: boolean;
  };
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  isOpen: boolean;
}

import { Category, SubCategory } from "./category";
import { Order, OrderStatus, OrderProductItem } from "./order";
import { Product } from "./product";
import { StorePackage } from "./package";
import { HomepageSettings, StoreSettings, DeveloperSettings } from "./settings";

export type AdminRole = "Owner" | "Manager" | "Employee";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  active: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminProduct extends Omit<Product, "id"> {
  id: string;
  stock: number;
  hidden: boolean;
  featured: boolean;
  isLocalFallback?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminPackage extends Omit<StorePackage, "id"> {
  id: string;
  hidden: boolean;
  featured: boolean;
  isLocalFallback?: boolean;
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
  subCategories?: SubCategory[];
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type AdminOrder = Order;
export type AdminOrderItem = OrderProductItem;

export type OrderStatus = "Pending" | "Confirmed" | "Shipping" | "Delivered" | "Cancelled";

export interface OrderProductItem {
  id: string;
  name: string;
  code: string;
  quantity: number;
  price: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  whatsapp?: string;
  university?: string;
  address: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  university: string;
  address: string;
  total: number;
  products: OrderProductItem[];
  itemsCount?: number;
  status: OrderStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

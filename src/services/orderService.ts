import { addDoc, collection, doc, getDoc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { Order, OrderStatus, CartItem, CustomerInfo } from "../types";

export async function createOrder(
  customer: CustomerInfo,
  cartItems: CartItem[],
  total: number
): Promise<string> {
  if (!db) throw new Error("Firebase database is not connected.");

  const docRef = await addDoc(collection(db, "orders"), {
    customerName: customer.name,
    phone: customer.phone,
    whatsapp: customer.phone,
    university: customer.university || "-",
    address: customer.address,
    total: total,
    products: cartItems.map((item) => ({
      id: String(item.product.id),
      name: item.product.name,
      code: item.product.code,
      price: item.product.price,
      quantity: item.quantity,
    })),
    itemsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    status: "Pending" as OrderStatus,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  if (!db || !orderId) return null;
  try {
    const docSnap = await getDoc(doc(db, "orders", orderId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
  } catch (err) {
    console.warn(`Error fetching order ${orderId}:`, err);
  }
  return null;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  if (!db) throw new Error("Firebase is not configured.");
  await updateDoc(doc(db, "orders", orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToOrders(
  onOrders: (orders: Order[]) => void,
  onError?: (error: Error) => void
) {
  if (!db) {
    onOrders([]);
    return () => {};
  }

  return onSnapshot(
    collection(db, "orders"),
    (snapshot) => {
      const orders = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Order[];
      orders.sort((a, b) => {
        const timeA = (a.createdAt as any)?.toMillis?.() || 0;
        const timeB = (b.createdAt as any)?.toMillis?.() || 0;
        return timeB - timeA;
      });
      onOrders(orders);
    },
    onError
  );
}

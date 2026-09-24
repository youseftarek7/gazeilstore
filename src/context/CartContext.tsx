import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { Product, CartItem, CompactCartItem } from "../types";
import { getStorageItem, setStorageItem } from "../utils/storage";

const CART_STORAGE_KEY = "ghazal_dental_cart";

interface CartContextValue {
  cart: CartItem[];
  totalCount: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    return getStorageItem<CartItem[]>(CART_STORAGE_KEY, []);
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const compact: CompactCartItem[] = cart.map((item) => ({
      product: {
        id: item.product.id,
        firestoreId: item.product.firestoreId,
        code: item.product.code,
        name: item.product.name,
        arabicName: item.product.arabicName,
        price: item.product.price,
        image: item.product.image,
        categoryKey: item.product.categoryKey,
        subCategoryKey: item.product.subCategoryKey,
        inStock: item.product.inStock,
      },
      quantity: item.quantity,
    }));
    setStorageItem(CART_STORAGE_KEY, compact);
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const totalAmount = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);

  const value = useMemo(
    () => ({
      cart,
      totalCount,
      totalAmount,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [cart, totalCount, totalAmount, isCartOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

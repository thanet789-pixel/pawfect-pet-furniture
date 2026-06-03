"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "../types";
import { getProductById } from "../lib/db";
import { useToast } from "./ToastContext";

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  isMounted: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { showToast } = useToast();

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("pawfect_cart");
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("pawfect_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    const product = await getProductById(productId);
    if (!product) return;

    if (product.stock === 0) {
      showToast("ขออภัย สินค้านี้หมดคลังแล้ว", "danger");
      return;
    }

    setCart((prev) => {
      const idx = prev.findIndex((item) => item.id === productId);
      if (idx !== -1) {
        const newQty = prev[idx].quantity + quantity;
        if (newQty > product.stock) {
          showToast(`ขออภัย สามารถซื้อได้สูงสุด ${product.stock} ชิ้น`, "warning");
          const updated = [...prev];
          updated[idx].quantity = product.stock;
          return updated;
        } else {
          showToast(`เพิ่ม ${product.nameTh} ลงตะกร้าแล้ว`, "success");
          const updated = [...prev];
          updated[idx].quantity = newQty;
          return updated;
        }
      } else {
        const finalQty = quantity > product.stock ? product.stock : quantity;
        if (quantity > product.stock) {
          showToast(`ขออภัย เพิ่มสินค้าได้สูงสุด ${product.stock} ชิ้นตามคลังสินค้า`, "warning");
        } else {
          showToast(`เพิ่ม ${product.nameTh} ลงตะกร้าแล้ว`, "success");
        }
        return [
          ...prev,
          {
            id: productId,
            nameTh: product.nameTh,
            price: product.price,
            image: product.image,
            quantity: finalQty,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.id === productId);
    setCart((prev) => prev.filter((i) => i.id !== productId));
    if (item) {
      showToast(`นำ ${item.nameTh} ออกจากตะกร้าสินค้าแล้ว`, "info");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const product = await getProductById(productId);
    if (!product) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    let finalQty = quantity;
    if (quantity > product.stock) {
      showToast(`มีสินค้าในคลังเพียง ${product.stock} ชิ้นเท่านั้น`, "warning");
      finalQty = product.stock;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: finalQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= 1000 || subtotal === 0 ? 0 : 100;
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        shippingFee,
        total,
        isMounted,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

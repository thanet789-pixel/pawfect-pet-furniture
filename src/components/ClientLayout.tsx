"use client";

import React, { useState } from "react";
import { ToastProvider } from "../context/ToastContext";
import { CartProvider } from "../context/CartContext";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { CheckoutModal } from "./CheckoutModal";
import { usePathname } from "next/navigation";

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const pathname = usePathname();

  // If path is under /admin, we can omit Navbar and Footer for a clean dashboard space,
  // but keep the providers!
  const isAdminPath = pathname.startsWith("/admin");

  return (
    <ToastProvider>
      <CartProvider>
        {!isAdminPath && <Navbar />}
        
        <main className="flex-grow">
          {children}
        </main>
        
        {!isAdminPath && <Footer />}
        
        {/* Global Cart Drawer */}
        {!isAdminPath && (
          <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />
        )}
        
        {/* Global Checkout Modal */}
        {!isAdminPath && (
          <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        )}
      </CartProvider>
    </ToastProvider>
  );
};
export default ClientLayout;

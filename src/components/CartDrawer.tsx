"use client";

import React from "react";
import { X, Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    shippingFee, 
    total,
    isMounted 
  } = useCart();

  if (!isMounted) return null;

  return (
    <>
      {/* Overlay Background */}
      <div
        className={`fixed inset-0 z-[1000] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide Drawer */}
      <div
        className={`fixed top-0 right-0 z-[1001] w-full max-w-[420px] h-screen bg-[#FAF8F5] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 bg-white border-b border-[#E3D9CE]/40 flex justify-between items-center">
          <h3 className="font-display font-bold text-lg text-text-main flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" /> ตะกร้าสินค้า
          </h3>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-9 h-9 rounded-full bg-[#F0EBE3] flex items-center justify-center text-text-main hover:bg-[#E3D9CE]/60 hover:text-rose-500 transition-all duration-200"
            title="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Items */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-text-muted gap-4">
              <ShoppingBag className="w-12 h-12 opacity-30 stroke-[1.5]" />
              <p className="text-sm font-medium">ตะกร้าสินค้าของคุณยังว่างเปล่า</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 bg-[#F0EBE3] text-text-main font-display font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-[#E3D9CE]/60 transition-all"
              >
                เลือกซื้อสินค้าเลย
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-5 border-b border-[#E3D9CE]/30 items-start"
              >
                <img
                  src={item.image}
                  alt={item.nameTh}
                  className="w-20 h-20 object-cover rounded-lg bg-[#F0EBE3] border border-[#E3D9CE]/20 flex-shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <h4 className="font-display font-semibold text-sm text-text-main truncate mb-1">
                    {item.nameTh}
                  </h4>
                  <div className="text-sm font-bold text-primary mb-3">
                    {(item.price * item.quantity).toLocaleString()} ฿
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-[#E3D9CE] rounded-full bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-primary transition-all font-semibold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-semibold px-2 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-primary transition-all font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-text-muted hover:text-rose-500 transition-all flex items-center gap-1 text-xs font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E3D9CE]/40">
            <div className="flex justify-between text-sm text-text-muted mb-3">
              <span>ยอดรวมสินค้า</span>
              <span>{subtotal.toLocaleString()} ฿</span>
            </div>
            <div className="flex justify-between text-sm text-text-muted mb-4">
              <span>ค่าจัดส่ง</span>
              <span>{shippingFee === 0 ? "ส่งฟรี" : `${shippingFee} ฿`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-text-main border-t border-[#E3D9CE]/30 pt-4 mb-6">
              <span>ยอดชำระสุทธิ</span>
              <span className="text-primary-hover text-lg">{total.toLocaleString()} ฿</span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                onCheckout();
              }}
              className="w-full bg-primary text-white py-3.5 px-6 rounded-full font-display font-semibold text-sm shadow-md hover:bg-primary-hover active:scale-98 transition-all duration-200"
            >
              ดำเนินการสั่งซื้อ
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default CartDrawer;

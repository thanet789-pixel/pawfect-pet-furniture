"use client";

import React, { useState } from "react";
import { X, CreditCard, Landmark, CheckCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { saveOrder } from "../lib/db";
import { useToast } from "../context/ToastContext";
import { useRouter } from "next/navigation";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, subtotal, shippingFee, total, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cod">("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("ตะกร้าสินค้าว่างเปล่า ไม่สามารถสั่งซื้อได้", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        customerName: name,
        email,
        phone,
        address,
        items: cart,
        subtotal,
        shippingFee: paymentMethod === "cod" ? shippingFee + 50 : shippingFee,
        total: paymentMethod === "cod" ? total + 50 : total,
      };

      // Call database adapter (Hybrid Mode)
      await saveOrder(orderData);
      
      // Reset forms and state
      clearCart();
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setPaymentMethod("bank");
      
      showToast("สร้างคำสั่งซื้อสำเร็จ! เราจะส่งข้อมูลอัปเดตไปที่อีเมลของคุณโดยเร็วที่สุด", "success");
      onClose();
      router.push("/");
    } catch (error) {
      console.error(error);
      showToast("เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E3D9CE]/40 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#E3D9CE]/40 flex justify-between items-center">
          <h3 className="font-display font-bold text-lg text-text-main">
            รายละเอียดการจัดส่งสินค้า
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F0EBE3] flex items-center justify-center text-text-main hover:bg-[#E3D9CE]/60 hover:text-rose-500 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow">
          <div className="p-6 flex flex-col gap-5">
            {/* Customer Name */}
            <div>
              <label htmlFor="chk-name" className="block text-xs font-bold text-text-main uppercase mb-2">
                ชื่อ-นามสกุลผู้รับ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="chk-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-[#E3D9CE] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-text-main"
                placeholder="เช่น สมเกียรติ รักสัตว์"
                required
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chk-email" className="block text-xs font-bold text-text-main uppercase mb-2">
                  อีเมลติดต่อ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="chk-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#E3D9CE] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-text-main"
                  placeholder="name@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="chk-phone" className="block text-xs font-bold text-text-main uppercase mb-2">
                  เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  id="chk-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#E3D9CE] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-text-main"
                  placeholder="08XXXXXXXX"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="chk-address" className="block text-xs font-bold text-text-main uppercase mb-2">
                ที่อยู่จัดส่งอย่างละเอียด <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="chk-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white border border-[#E3D9CE] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-text-main min-h-[80px]"
                placeholder="ระบุบ้านเลขที่ ถนน แขวง เขต จังหวัด รหัสไปรษณีย์"
                required
              />
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="chk-payment" className="block text-xs font-bold text-text-main uppercase mb-2">
                ช่องทางชำระเงิน <span className="text-rose-500">*</span>
              </label>
              <select
                id="chk-payment"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-white border border-[#E3D9CE] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-text-main"
                required
              >
                <option value="bank">โอนเงินผ่านธนาคาร (ส่งสลิป)</option>
                <option value="cod">ชำระเงินปลายทาง COD (บวกเพิ่ม 50 ฿)</option>
              </select>
            </div>

            {/* Bank details conditional render */}
            {paymentMethod === "bank" && (
              <div className="bg-[#F0EBE3] border border-[#E3D9CE]/50 rounded-xl p-5 text-xs text-text-muted flex flex-col gap-2">
                <p className="font-bold text-text-main flex items-center gap-1.5 mb-1">
                  <Landmark className="w-4 h-4 text-primary" /> บัญชีธนาคารสำหรับโอนเงิน:
                </p>
                <p className="font-medium text-text-main">ธนาคารกสิกรไทย (KBANK) • บัญชีออมทรัพย์</p>
                <p className="text-base font-bold text-primary-hover my-0.5">123-4-56789-0</p>
                <p className="font-medium text-text-main">ชื่อบัญชี: บจก. พอว์เฟค เพ็ท เฟอร์นิเจอร์</p>
                <p className="text-[10px] text-text-muted/80 mt-1 border-t border-[#E3D9CE] pt-1.5">
                  * กรุณาโอนเงินตามยอดสุทธิ และทางเจ้าหน้าที่จะอนุมัติออเดอร์ในหน้าควบคุมอย่างรวดเร็ว
                </p>
              </div>
            )}
          </div>

          {/* Footer Totals & Submission */}
          <div className="p-6 bg-white border-t border-[#E3D9CE]/40 flex flex-col gap-4">
            <div className="flex justify-between items-center text-sm font-semibold text-text-main">
              <span>ยอดชำระสุทธิ:</span>
              <span className="text-primary-hover text-xl font-bold font-display">
                {paymentMethod === "cod" ? (total + 50).toLocaleString() : total.toLocaleString()} ฿
              </span>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-[#E3D9CE] text-text-main py-3 rounded-full font-display font-semibold text-xs hover:bg-[#F0EBE3] transition-all"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary text-white py-3 rounded-full font-display font-semibold text-xs shadow-md hover:bg-primary-hover active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  "กำลังส่งข้อมูล..."
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> ยืนยันการสั่งซื้อ
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CheckoutModal;

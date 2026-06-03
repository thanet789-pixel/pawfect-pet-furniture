"use client";

import React, { useState, useEffect } from "react";
import { X, ShoppingCart, Truck, ShieldCheck, Star, Plus, Minus, MapPin, Heart, Store, MessageCircle, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart, setIsCartOpen } = useCart();
  
  // Safe 5-image array fallback computed at the top level (satisfying React Hook rules)
  const productImages = product
    ? (product.images && product.images.length >= 5
      ? product.images
      : [
          product.image,
          ...["assets/cat_furniture.png", "assets/hero_cat.png", "assets/about_pets.png", "assets/pet_accessories.png", "assets/storage_cabinet.png", "assets/dog_furniture.png"]
            .filter(img => img !== product.image)
            .slice(0, 4)
        ])
    : [];

  // State variables
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>("ลายไม้ธรรมชาติ");
  const [selectedSize, setSelectedSize] = useState<"M" | "L">("M");
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // Lightbox Modal States
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Sync state when product changes or modal opens
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setQuantity(1);
      setSelectedColor("ลายไม้ธรรมชาติ");
      setSelectedSize("M");
      setActiveTab("description");
      setIsLightboxOpen(false);
      setLightboxIndex(0);
    }
  }, [product, isOpen]);

  // Handle keyboard events for Lightbox
  useEffect(() => {
    if (!isLightboxOpen || productImages.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev + 1) % productImages.length);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, productImages]);

  if (!isOpen || !product) return null;

  // Mock Lazada/Shopee prices
  const baseOriginalPrice = Math.round((product.price * 1.25) / 50) * 50;
  const originalPrice = baseOriginalPrice + (selectedSize === "L" ? 500 : 0);
  const currentPrice = product.price + (selectedSize === "L" ? 400 : 0);
  const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  // Mock Sales Stats
  const mockRating = 4.9;
  const mockReviewCount = 18;
  const mockSoldCount = product.id === "prod-1" ? 142 : product.id === "prod-2" ? 86 : 48;

  // Quantity Adjustments
  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity);
    onClose();
  };

  const handleBuyNow = async () => {
    await addToCart(product.id, quantity);
    onClose();
    setIsCartOpen(true);
  };

  // Open Lightbox
  const handleOpenLightbox = () => {
    const index = productImages.indexOf(activeImage);
    setLightboxIndex(index !== -1 ? index : 0);
    setIsLightboxOpen(true);
  };

  // Mock Reviews Database
  const mockReviews = [
    {
      user: "s***y",
      avatar: "👤",
      rating: 5,
      comment: "งานประกอบเนี๊ยบเรียบร้อยแข็งแรงมากครับ คุ้มค่าสมราคา ลายไม้โอ๊คสวยงามเข้ากับบ้านได้พอดี จัดส่งรวดเร็วด้วยประทับใจมากครับ 🐾",
      variant: `สี: ${selectedColor} / ขนาด: ${selectedSize === "M" ? "M (ขนาดมาตรฐาน)" : "L (ขนาดใหญ่พิเศษ)"}`,
      date: "2026-05-30"
    },
    {
      user: "cat_mommy99",
      avatar: "👤",
      rating: 5,
      comment: "น้องแมวที่บ้านชอบมาก แย่งกันเข้าไปนอนสุดๆ ดีไซน์น่ารักมาก โค้งมนปลอดภัยไม่มีเสี้ยนไม้ ร้านค้าบริการและให้ข้อมูลดีมากค่ะ แนะนำเลย",
      variant: `สี: ${selectedColor} / ขนาด: M (ขนาดมาตรฐาน)`,
      date: "2026-06-01"
    },
    {
      user: "w***p",
      avatar: "👤",
      rating: 4,
      comment: "สวยงามตรงปก หีบห่อแน่นหนา งานดีมากสมเกรดพรีเมียม หักคะแนนเรื่องขนส่งช้านิดหน่อย แต่ภาพรวมคือพอใจมากๆ คราวหลังอุดหนุนอีกแน่นอนครับ",
      variant: `สี: ลายไม้ธรรมชาติ / ขนาด: ${selectedSize === "M" ? "M (ขนาดมาตรฐาน)" : "L (ขนาดใหญ่พิเศษ)"}`,
      date: "2026-06-02"
    }
  ];

  return (
    <>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
        {/* Background click close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Container */}
        <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto transform transition-all duration-300 scale-100 flex flex-col font-sans">
          
          {/* Modal Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-text-main transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* E-Commerce Mall Header Ticker */}
          <div className="bg-[#B58E6D] text-white py-2 px-6 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="bg-white text-[#B58E6D] font-bold text-[9px] px-1 py-0.2 rounded font-display tracking-wider">MALL</span>
              <span className="font-semibold">Pawfect Pet Furniture - ร้านค้าทางการจากแบรนด์</span>
            </div>
            <span className="hidden md:inline text-[10px] opacity-90">รับประกันคุณภาพ 100% | คืนสินค้าได้ภายใน 15 วัน</span>
          </div>

          {/* Main Product Frame */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-[#E3D9CE]/30">
            
            {/* Left Block: Image View & Gallery (5 Columns) */}
            <div className="md:col-span-5 flex flex-col gap-4">
              
              {/* Big Main Image Preview with Click-to-Zoom */}
              <div 
                onClick={handleOpenLightbox}
                className="rounded-2xl overflow-hidden bg-[#F0EBE3]/40 border border-[#E3D9CE]/25 h-72 sm:h-96 md:h-[380px] flex items-center justify-center relative group cursor-zoom-in"
              >
                <img
                  src={activeImage}
                  alt={product.nameTh}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Zoom hover overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center select-none">
                  <div className="bg-white/95 text-text-main px-3.5 py-2 rounded-full shadow-md flex items-center gap-1.5 text-xs font-semibold scale-90 group-hover:scale-100 transition-all duration-300">
                    <Maximize2 className="w-4 h-4 text-primary" />
                    <span>คลิกเพื่อขยายภาพใหญ่</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Navigation Row (Upgraded to exactly 5 images) */}
              {productImages.length > 0 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-[#E3D9CE] select-none">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all duration-200 cursor-pointer ${
                        activeImage === img ? "border-[#B58E6D] scale-95 shadow-sm" : "border-[#E3D9CE]/30 hover:border-[#B58E6D]/50"
                      }`}
                    >
                      <img src={img} alt={`${product.nameTh} view ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Block: E-Commerce Style Product Details (7 Columns) */}
            <div className="md:col-span-7 flex flex-col">
              
              {/* Title & Brand Badges */}
              <div className="flex flex-col gap-1 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="bg-[#B58E6D] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Choice</span>
                  <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">{product.category === "cat-furniture" ? "เฟอร์นิเจอร์แมว" : "เฟอร์นิเจอร์สุนัข"}</span>
                </div>
                <h2 className="font-display font-bold text-xl md:text-2xl text-text-main leading-tight">
                  {product.nameTh}
                </h2>
              </div>

              {/* Ratings & Sold Stats */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#E3D9CE]/20 text-xs text-text-muted">
                <div className="flex items-center gap-1">
                  <span className="text-[#F5A623] font-bold font-display">{mockRating}</span>
                  <div className="flex text-[#F5A623]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <span className="text-[#E3D9CE]">|</span>
                <button onClick={() => setActiveTab("reviews")} className="hover:text-[#B58E6D] underline">
                  {mockReviewCount} คะแนนและรีวิว
                </button>
                <span className="text-[#E3D9CE]">|</span>
                <span>{mockSoldCount} ชิ้นขายแล้ว</span>
              </div>

              {/* Lazada/Shopee Premium Price Section */}
              <div className="my-4 bg-[#FAF8F5] border border-[#E3D9CE]/30 rounded-2xl p-4 flex flex-col gap-1.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#F5A623] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                  ⚡ ราคาพิเศษวันนี้
                </div>
                
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span>ราคาเดิม:</span>
                  <span className="line-through">{originalPrice.toLocaleString()} ฿</span>
                  <span className="bg-[#F84C2F]/10 text-[#F84C2F] font-bold text-[10px] px-1.5 py-0.2 rounded-md">
                    ลด {discountPercent}%
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-bold text-[#F84C2F]">{currentPrice.toLocaleString()} ฿</span>
                </div>
              </div>

              {/* Shipping details */}
              <div className="grid grid-cols-12 gap-2 text-xs py-2 mb-4 border-b border-[#E3D9CE]/10 text-text-muted">
                <div className="col-span-3 font-semibold text-text-main">จัดส่งสินค้า:</div>
                <div className="col-span-9 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1 text-text-main font-medium">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>จัดส่งจาก เขตปทุมวัน, กรุงเทพมหานคร</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">ส่งฟรีทั่วไทยเมื่อช้อปครบ 1,000.-</span>
                  </div>
                </div>
              </div>

              {/* Variant Choice: Colors */}
              <div className="grid grid-cols-12 gap-2 text-xs py-2.5 items-center">
                <div className="col-span-3 font-semibold text-text-main">ตัวเลือกสี:</div>
                <div className="col-span-9 flex flex-wrap gap-2">
                  {["ลายไม้ธรรมชาติ", "สีวอลนัทเข้ม", "สีขาวมินิมอล"].map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`px-3.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                        selectedColor === col
                          ? "border-[#B58E6D] bg-[#B58E6D]/5 text-[#B58E6D] shadow-xs"
                          : "border-[#E3D9CE]/60 text-text-muted bg-white hover:border-[#B58E6D]/40"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variant Choice: Size Options (Dynamic Price Increase) */}
              <div className="grid grid-cols-12 gap-2 text-xs py-2.5 items-center mb-4">
                <div className="col-span-3 font-semibold text-text-main">ขนาดสินค้า:</div>
                <div className="col-span-9 flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSize("M")}
                    className={`px-3.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                      selectedSize === "M"
                        ? "border-[#B58E6D] bg-[#B58E6D]/5 text-[#B58E6D] shadow-xs"
                        : "border-[#E3D9CE]/60 text-text-muted bg-white hover:border-[#B58E6D]/40"
                    }`}
                  >
                    M (ขนาดมาตรฐาน)
                  </button>
                  <button
                    onClick={() => setSelectedSize("L")}
                    className={`px-3.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                      selectedSize === "L"
                        ? "border-[#B58E6D] bg-[#B58E6D]/5 text-[#B58E6D] shadow-xs"
                        : "border-[#E3D9CE]/60 text-text-muted bg-white hover:border-[#B58E6D]/40"
                    }`}
                  >
                    L (ขนาดใหญ่พิเศษ) <span className="text-[10px] text-primary font-bold ml-1">+400 ฿</span>
                  </button>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="grid grid-cols-12 gap-2 text-xs py-2.5 items-center mb-6">
                <div className="col-span-3 font-semibold text-text-main">จำนวนสินค้า:</div>
                <div className="col-span-9 flex items-center gap-3.5">
                  <div className="flex items-center border border-[#E3D9CE]/60 rounded-lg overflow-hidden bg-white shadow-xs">
                    <button
                      onClick={handleDecrease}
                      className="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary text-text-main transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 h-8 flex items-center justify-center font-display font-bold text-xs border-x border-[#E3D9CE]/60 text-text-main">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      className="w-8 h-8 flex items-center justify-center hover:bg-bg-secondary text-text-main transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className={product.stock > 0 ? "text-[11px] text-text-muted" : "text-[11px] text-rose-500 font-semibold"}>
                    {product.stock > 0 ? `เหลือในคลังเพียง ${product.stock} ชิ้น` : "สินค้าหมดคลังชั่วคราว"}
                  </span>
                </div>
              </div>

              {/* Shopee/Lazada Split Call To Actions */}
              <div className="flex gap-4 items-center">
                {product.stock > 0 ? (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 border-2 border-[#B58E6D] hover:bg-[#B58E6D]/5 text-[#B58E6D] py-3.5 px-6 rounded-full font-display font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <ShoppingCart className="w-4 h-4" /> เพิ่มลงรถเข็น
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-[#F84C2F] hover:bg-[#D8361C] text-white py-3.5 px-6 rounded-full font-display font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#F84C2F]/15"
                    >
                      ซื้อเลยทันที
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full bg-[#E3D9CE] text-text-muted py-3 px-6 rounded-full font-display font-semibold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    สินค้าหมดคลังชั่วคราว
                  </button>
                )}
                
                {/* Like / Wishlist Trigger */}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-11 h-11 border border-[#E3D9CE]/60 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                    isLiked ? "bg-rose-50 border-rose-200 text-rose-500" : "bg-white text-text-muted hover:bg-bg-secondary"
                  }`}
                  title="ถูกใจสินค้า"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Tabbed Product Description & Mock User Reviews */}
          <div className="p-6 md:p-8 bg-[#FAF8F5]">
            
            {/* Tab Header Row */}
            <div className="flex border-b border-[#E3D9CE]/30 gap-6 text-sm mb-6 select-none bg-white p-2 rounded-xl border border-[#E3D9CE]/20 shadow-xs">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-2 px-3 font-display font-bold relative transition-all cursor-pointer ${
                  activeTab === "description" ? "text-[#B58E6D] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#B58E6D]" : "text-text-muted hover:text-[#B58E6D]"
                }`}
              >
                รายละเอียดสินค้า
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-2 px-3 font-display font-bold relative transition-all cursor-pointer ${
                  activeTab === "reviews" ? "text-[#B58E6D] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#B58E6D]" : "text-text-muted hover:text-[#B58E6D]"
                }`}
              >
                คะแนนและรีวิว ({mockReviewCount})
              </button>
            </div>

            {/* Tab 1: Detailed Specifications & Description */}
            {activeTab === "description" && (
              <div className="flex flex-col gap-6 animate-[fadeIn_0.2s_ease-out]">
                {/* General Product Description */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-display font-bold text-xs text-text-main uppercase tracking-wider flex items-center gap-1.5">
                    🐾 รายละเอียดสินค้า
                  </h4>
                  <div className="bg-[#FAF8F5] border border-[#E3D9CE]/25 rounded-2xl p-5 text-xs sm:text-sm text-text-muted leading-relaxed whitespace-pre-wrap font-sans">
                    {product.description}
                  </div>
                </div>

                {/* Product Specifications Sheet */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-display font-bold text-xs text-text-main uppercase tracking-wider flex items-center gap-1.5"><Store className="w-4 h-4 text-primary" /> ข้อมูลเฉพาะของสินค้า</h4>
                  <div className="border border-[#E3D9CE]/30 rounded-2xl overflow-hidden bg-white text-xs shadow-xs">
                    <div className="grid grid-cols-12 border-b border-[#E3D9CE]/20 p-3.5">
                      <div className="col-span-4 sm:col-span-3 text-text-muted font-semibold">แบรนด์</div>
                      <div className="col-span-8 sm:col-span-9 text-text-main font-medium">Pawfect Pet Furniture (ของแท้ 100%)</div>
                    </div>
                    {product.dimensions && (
                      <div className="grid grid-cols-12 border-b border-[#E3D9CE]/20 p-3.5">
                        <div className="col-span-4 sm:col-span-3 text-text-muted font-semibold">ขนาดสินค้า</div>
                        <div className="col-span-8 sm:col-span-9 text-text-main font-medium">{product.dimensions}</div>
                      </div>
                    )}
                    {product.materials && (
                      <div className="grid grid-cols-12 border-b border-[#E3D9CE]/20 p-3.5">
                        <div className="col-span-4 sm:col-span-3 text-text-muted font-semibold">วัสดุที่ใช้ผลิต</div>
                        <div className="col-span-8 sm:col-span-9 text-text-main font-medium">{product.materials}</div>
                      </div>
                    )}
                    {product.weightLimit && (
                      <div className="grid grid-cols-12 border-b border-[#E3D9CE]/20 p-3.5">
                        <div className="col-span-4 sm:col-span-3 text-text-muted font-semibold">การรับน้ำหนัก</div>
                        <div className="col-span-8 sm:col-span-9 text-text-main font-medium">{product.weightLimit}</div>
                      </div>
                    )}
                    <div className="grid grid-cols-12 border-b border-[#E3D9CE]/20 p-3.5">
                      <div className="col-span-4 sm:col-span-3 text-text-muted font-semibold">สถานที่จัดส่ง</div>
                      <div className="col-span-8 sm:col-span-9 text-text-main font-medium">ส่งออกตรงจากศูนย์กระจายสินค้า กรุงเทพมหานคร</div>
                    </div>
                    {product.careInstructions && (
                      <div className="grid grid-cols-12 border-b border-[#E3D9CE]/20 p-3.5">
                        <div className="col-span-4 sm:col-span-3 text-text-muted font-semibold">คำแนะนำการดูแล</div>
                        <div className="col-span-8 sm:col-span-9 text-text-main font-medium">{product.careInstructions}</div>
                      </div>
                    )}
                    {product.warrantyInfo && (
                      <div className="grid grid-cols-12 border-b border-[#E3D9CE]/20 p-3.5">
                        <div className="col-span-4 sm:col-span-3 text-text-muted font-semibold">การรับประกัน</div>
                        <div className="col-span-8 sm:col-span-9 text-text-main font-medium">{product.warrantyInfo}</div>
                      </div>
                    )}
                    {product.packageIncludes && (
                      <div className="grid grid-cols-12 p-3.5">
                        <div className="col-span-4 sm:col-span-3 text-text-muted font-semibold">อุปกรณ์ในกล่อง</div>
                        <div className="col-span-8 sm:col-span-9 text-text-main font-medium">{product.packageIncludes}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bullet highlights list */}
                {product.features && product.features.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h4 className="font-display font-bold text-xs text-text-main uppercase tracking-wider">คุณสมบัติการใช้งานเด่น</h4>
                    <ul className="flex flex-col gap-2 bg-white border border-[#E3D9CE]/20 rounded-2xl p-5 shadow-xs">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="text-xs text-text-muted flex gap-2.5 items-start leading-relaxed">
                          <span className="text-primary mt-0.5 font-sans">🐾</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Lazada/Shopee Style User Reviews Panel */}
            {activeTab === "reviews" && (
              <div className="flex flex-col gap-5 animate-[fadeIn_0.2s_ease-out]">
                
                {/* Ratings Summary Banner */}
                <div className="bg-white border border-[#E3D9CE]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 sm:gap-10 shadow-xs mb-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-display font-bold text-text-main">{mockRating}</span>
                      <span className="text-xs text-text-muted">/5</span>
                    </div>
                    <div className="flex text-[#F5A623]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-text-muted font-semibold">{mockReviewCount} รีวิวจากลูกค้าจริง</span>
                  </div>
                  
                  <div className="flex-grow flex flex-wrap gap-2 text-xs">
                    <span className="bg-[#B58E6D] text-white px-3 py-1 rounded-full font-semibold">ทั้งหมด ({mockReviewCount})</span>
                    <span className="bg-bg-secondary text-text-main px-3 py-1 rounded-full font-medium hover:bg-[#E3D9CE]/45 transition-colors cursor-pointer">5 ดาว ({mockReviewCount - 2})</span>
                    <span className="bg-bg-secondary text-text-main px-3 py-1 rounded-full font-medium hover:bg-[#E3D9CE]/45 transition-colors cursor-pointer">4 ดาว (2)</span>
                    <span className="bg-bg-secondary text-text-main px-3 py-1 rounded-full font-medium hover:bg-[#E3D9CE]/45 transition-colors cursor-pointer">มีรูปภาพ (12)</span>
                  </div>
                </div>

                {/* Review Comments Loop */}
                <div className="flex flex-col gap-4">
                  {mockReviews.map((rev, idx) => (
                    <div key={idx} className="bg-white border border-[#E3D9CE]/20 rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
                      
                      {/* User profile row */}
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#E3D9CE]/40 flex items-center justify-center text-sm shadow-xs select-none">
                            {rev.avatar}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-text-main">{rev.user}</span>
                            <span className="text-[10px] text-text-muted mt-0.2">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex text-[#F5A623]">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      {/* Meta info variant */}
                      <span className="text-[10px] text-text-muted bg-[#FAF8F5] px-2.5 py-1 rounded-md self-start border border-[#E3D9CE]/20">
                        {rev.variant}
                      </span>

                      {/* Review text */}
                      <p className="text-xs sm:text-sm text-text-main leading-relaxed">
                        {rev.comment}
                      </p>

                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted mt-1 select-none">
                        <button className="flex items-center gap-1 hover:text-[#B58E6D] transition-colors cursor-pointer">
                          👍 มีประโยชน์ (4)
                        </button>
                        <span>•</span>
                        <button className="flex items-center gap-1 hover:text-[#B58E6D] transition-colors cursor-pointer">
                          <MessageCircle className="w-3 h-3" /> ตอบกลับ
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* FULL-SCREEN IMAGE LIGHTBOX MODAL (Click to Expand image) */}
      {isLightboxOpen && productImages.length > 0 && (
        <div className="fixed inset-0 z-[3000] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xs select-none animate-[fadeIn_0.15s_ease-out]">
          
          {/* Lightbox Close Trigger Area */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setIsLightboxOpen(false)} />

          {/* Top Control Bar */}
          <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-10 text-white bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex flex-col text-left">
              <span className="font-display font-semibold text-sm tracking-wide text-primary">Pawfect Gallery</span>
              <span className="text-[11px] opacity-80 mt-0.5">{product.nameTh}</span>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
            }}
            className="absolute left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10 cursor-pointer"
            title="ภาพก่อนหน้า"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Main Lightbox Image */}
          <div className="relative max-w-[85vw] max-h-[75vh] z-0 flex items-center justify-center">
            <img
              src={productImages[lightboxIndex]}
              alt={`${product.nameTh} Expanded view ${lightboxIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/5"
            />
          </div>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev + 1) % productImages.length);
            }}
            className="absolute right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10 cursor-pointer"
            title="ภาพถัดไป"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Bottom Indicators & Thumbnails in Lightbox */}
          <div className="absolute bottom-6 flex flex-col items-center gap-3 z-10">
            <span className="text-white text-xs opacity-75 font-medium bg-black/40 px-3 py-1 rounded-full border border-white/10">
              {lightboxIndex + 1} / {productImages.length}
            </span>
            
            <div className="flex gap-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(idx);
                  }}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    lightboxIndex === idx ? "border-[#B58E6D] scale-103 shadow-md" : "border-white/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail view" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </>
  );
};
export default QuickViewModal;

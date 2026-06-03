"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, ShoppingBag, RotateCcw, Search, Box } from "lucide-react";
import { Category, Product } from "../../types";
import { getCategories, getProducts } from "../../lib/db";
import { useCart } from "../../context/CartContext";
import QuickViewModal from "../../components/QuickViewModal";
import { useToast } from "../../context/ToastContext";

function ShopContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // States for filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("default");

  // Quickview Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);

  // Sync category parameter from URL hash/query
  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams]);

  // Load products and categories from hybrid DB
  useEffect(() => {
    const loadData = async () => {
      const cats = await getCategories();
      const prods = await getProducts();
      setCategories(cats);
      setProducts(prods);
    };
    loadData();
  }, []);

  const getCategoryNameTh = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.nameTh : catId;
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setPriceRange("all");
    setInStockOnly(false);
    setSearchQuery("");
    setSortOption("default");
    showToast("รีเซ็ตตัวกรองเรียบร้อยแล้ว", "info");
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((p) => {
      // Category
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;

      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.nameTh.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Price Range
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        if (max) {
          if (p.price < min || p.price > max) return false;
        } else {
          // 3000-plus
          if (p.price < min) return false;
        }
      }

      // In Stock
      if (inStockOnly && p.stock === 0) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "name-asc") return a.nameTh.localeCompare(b.nameTh);
      return 0; // default
    });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-xs font-bold text-primary tracking-wider uppercase">ร้านค้าออนไลน์</span>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-text-main">Shop Our Collections</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 bg-white p-6 rounded-2xl border border-[#E3D9CE]/30 shadow-sm self-start flex flex-col gap-8">
          {/* Category Filter */}
          <div>
            <h3 className="font-display font-bold text-sm text-text-main border-b border-[#E3D9CE]/30 pb-3 mb-4">
              หมวดหมู่สินค้า
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-text-muted">
              <li>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full flex justify-between items-center py-1 transition-all ${
                    selectedCategory === "all" ? "text-primary font-bold" : "hover:text-primary"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {selectedCategory === "all" && "🐾"} แสดงทั้งหมด
                  </span>
                  <span className="text-[10px] bg-bg-secondary px-2 py-0.5 rounded-full font-semibold">
                    {products.length}
                  </span>
                </button>
              </li>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex justify-between items-center py-1 transition-all ${
                        selectedCategory === cat.id ? "text-primary font-bold" : "hover:text-primary"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {selectedCategory === cat.id && "🐾"} {cat.nameTh}
                      </span>
                      <span className="text-[10px] bg-bg-secondary px-2 py-0.5 rounded-full font-semibold">
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-display font-bold text-sm text-text-main border-b border-[#E3D9CE]/30 pb-3 mb-4">
              ช่วงราคา
            </h3>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E3D9CE] rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main"
            >
              <option value="all">แสดงทั้งหมด</option>
              <option value="0-1500">ต่ำกว่า 1,500 ฿</option>
              <option value="1500-3000">1,500 ฿ - 3,000 ฿</option>
              <option value="3000-plus">มากกว่า 3,000 ฿</option>
            </select>
          </div>

          {/* Stock Availability */}
          <div>
            <h3 className="font-display font-bold text-sm text-text-main border-b border-[#E3D9CE]/30 pb-3 mb-4">
              สถานะสินค้า
            </h3>
            <label className="flex items-center gap-2.5 text-xs text-text-main cursor-pointer font-medium select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-[#E3D9CE] focus:ring-primary accent-primary"
              />
              เฉพาะสินค้าที่มีในคลัง (พร้อมส่ง)
            </label>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            className="w-full border border-[#E3D9CE] text-text-main py-2.5 rounded-full font-display font-semibold text-xs hover:bg-[#F0EBE3] transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> ล้างตัวกรอง
          </button>
        </aside>

        {/* Products Display Area */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* Controls Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาสินค้าที่ต้องการ..."
                className="w-full bg-white border border-[#E3D9CE]/60 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all text-text-main shadow-sm"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-xs text-text-muted font-medium">
                พบสินค้า {filteredProducts.length} รายการ
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white border border-[#E3D9CE]/60 rounded-full px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main shadow-sm"
              >
                <option value="default">จัดเรียง: แนะนำ</option>
                <option value="price-asc">ราคา: ต่ำ - สูง</option>
                <option value="price-desc">ราคา: สูง - ต่ำ</option>
                <option value="name-asc">ชื่อสินค้า: ก-ฮ</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-16 text-text-muted border border-dashed border-[#E3D9CE]/60 rounded-2xl bg-white">
              <Box className="w-12 h-12 opacity-30 stroke-[1.5] mb-3" />
              <p className="text-sm font-medium">ไม่พบสินค้าในระบบที่ตรงกับตัวเลือกการกรองของคุณ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-[#E3D9CE]/30 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col group relative"
                >
                  {/* Badges */}
                  {p.stock === 0 ? (
                    <span className="absolute top-3 left-3 bg-[#735F50]/80 backdrop-blur-sm text-white text-[10px] font-bold py-1 px-2.5 rounded-full z-10">
                      สินค้าหมด
                    </span>
                  ) : p.featured ? (
                    <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold py-1 px-2.5 rounded-full z-10">
                      สินค้าแนะนำ
                    </span>
                  ) : null}

                  {/* Image container & overlay */}
                  <div className="h-56 bg-[#F0EBE3]/40 overflow-hidden relative">
                    <img
                      src={p.image}
                      alt={p.nameTh}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setIsQuickViewOpen(true);
                        }}
                        className="w-10 h-10 rounded-full bg-white text-text-main hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-md active:scale-90"
                        title="ดูรายละเอียดสินค้า"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                      {p.stock > 0 && (
                        <button
                          onClick={() => addToCart(p.id)}
                          className="w-10 h-10 rounded-full bg-white text-text-main hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-md active:scale-90"
                          title="เพิ่มลงตะกร้า"
                        >
                          <ShoppingBag className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                        {getCategoryNameTh(p.category)}
                      </span>
                      <h3
                        onClick={() => {
                          setSelectedProduct(p);
                          setIsQuickViewOpen(true);
                        }}
                        className="font-display font-semibold text-sm text-text-main hover:text-primary transition-all cursor-pointer leading-snug line-clamp-2"
                      >
                        {p.nameTh}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#E3D9CE]/20 pt-3">
                      <span className="font-display font-bold text-[#A57248] text-base">
                        {p.price.toLocaleString()} ฿
                      </span>
                      {p.stock > 0 ? (
                        <button
                          onClick={() => addToCart(p.id)}
                          className="bg-primary-light text-primary border border-primary-light hover:bg-primary hover:text-white hover:border-primary px-3.5 py-1.5 rounded-full font-display font-semibold text-[11px] transition-all flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> ใส่ตะกร้า
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-text-muted">สินค้าหมด</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-6 py-20 text-center text-text-muted">กำลังโหลดร้านค้า...</div>}>
      <ShopContent />
    </Suspense>
  );
}

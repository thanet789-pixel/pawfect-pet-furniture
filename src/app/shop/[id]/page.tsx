"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingBag, 
  ChevronRight, 
  Award, 
  ShieldCheck, 
  Heart, 
  RotateCcw, 
  Check, 
  ChevronDown, 
  Plus, 
  Minus,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { Product, Category } from "../../../types";
import { getProductById, getProducts, getCategories } from "../../../lib/db";
import { useCart } from "../../../context/CartContext";
import { useToast } from "../../../context/ToastContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"features" | "specs" | "care" | "warranty">("features");

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        const prod = await getProductById(id);
        if (!prod) {
          showToast("ไม่พบสินค้าที่ต้องการ", "danger");
          router.push("/shop");
          return;
        }
        setProduct(prod);
        setSelectedImage(prod.image);

        // Load Categories
        const cats = await getCategories();
        setCategories(cats);

        // Load Related Products
        const allProds = await getProducts();
        const related = allProds
          .filter((p) => p.category === prod.category && p.id !== prod.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error(err);
        showToast("เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า", "danger");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProductData();
    }
  }, [id, router]);

  const getCategoryNameTh = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.nameTh : catId;
  };

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "dec") {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    } else {
      if (product && quantity >= product.stock) {
        showToast(`มีสินค้าในคลังสูงสุด ${product.stock} ชิ้น`, "warning");
        return;
      }
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock === 0) {
      showToast("สินค้าหมดชั่วคราว ไม่สามารถหยิบใส่ตะกร้าได้", "warning");
      return;
    }

    // Add to cart with specific quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id);
    }
    showToast(`เพิ่ม ${product.nameTh} จำนวน ${quantity} ชิ้นลงตะกร้าแล้ว`, "success");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-text-muted gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-display font-semibold text-sm">กำลังโหลดข้อมูลสินค้าอย่างละเอียด...</p>
      </div>
    );
  }

  if (!product) return null;

  const productImages = product.images && product.images.length > 0 
    ? product.images.filter(img => img.trim() !== "") 
    : [product.image];

  return (
    <div className="w-full bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-6 py-6 md:py-12">
        
        {/* Breadcrumbs & Back link */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <nav className="flex items-center gap-1.5 text-xs text-text-muted/80 font-medium">
            <Link href="/" className="hover:text-primary transition-all">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/shop" className="hover:text-primary transition-all">Shop</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/shop?category=${product.category}`} className="hover:text-primary transition-all">
              {getCategoryNameTh(product.category)}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text-main font-bold line-clamp-1">{product.nameTh}</span>
          </nav>
          
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary font-display font-semibold transition-all group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> ย้อนกลับไปหน้าร้านค้า
          </Link>
        </div>

        {/* Product Details Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start bg-white p-6 md:p-10 rounded-3xl border border-[#E3D9CE]/30 shadow-sm mb-16">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4 w-full">
            {/* Main Image View */}
            <div className="h-[350px] sm:h-[450px] bg-[#F0EBE3]/20 rounded-2xl overflow-hidden border border-[#E3D9CE]/30 relative group">
              <img
                src={selectedImage}
                alt={product.nameTh}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {product.stock === 0 && (
                <span className="absolute top-4 left-4 bg-[#735F50]/90 backdrop-blur-sm text-white text-xs font-bold py-1.5 px-3.5 rounded-full shadow-sm">
                  สินค้าหมดชั่วคราว
                </span>
              )}
              {product.featured && product.stock > 0 && (
                <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold py-1.5 px-3.5 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> สินค้าแนะนำ
                </span>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2.5">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square bg-[#F0EBE3]/20 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                      selectedImage === img
                        ? "border-primary ring-2 ring-primary/20 shadow-sm"
                        : "border-[#E3D9CE]/50 hover:border-primary/50"
                    }`}
                  >
                    <img src={img} alt={`${product.nameTh} View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div className="lg:col-span-6 flex flex-col gap-6 w-full text-left">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-primary tracking-widest uppercase">
                {getCategoryNameTh(product.category)}
              </span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-main leading-tight">
                {product.nameTh}
              </h1>
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold font-display">
                {product.name}
              </p>
            </div>

            {/* Pricing / Stock */}
            <div className="flex justify-between items-center py-4 border-y border-[#E3D9CE]/30">
              <span className="font-display font-bold text-2xl text-[#A57248]">
                {product.price.toLocaleString()} ฿
              </span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                product.stock === 0
                  ? "bg-rose-50 text-rose-500 border border-rose-100"
                  : product.stock < 5
                    ? "bg-orange-50 text-orange-500 border border-orange-100"
                    : "bg-emerald-50 text-emerald-600 border border-emerald-100"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  product.stock === 0 ? "bg-rose-500" : product.stock < 5 ? "bg-orange-500" : "bg-emerald-500"
                }`}></span>
                {product.stock === 0 
                  ? "สินค้าหมดชั่วคราว" 
                  : product.stock < 5 
                    ? `เหลือเพียง ${product.stock} ชิ้นเท่านั้น!` 
                    : "พร้อมส่ง (มีสินค้าในคลัง)"}
              </span>
            </div>

            {/* Short Description */}
            <div className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>

            {/* Selection & Add to Cart */}
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mt-2 border-t border-[#E3D9CE]/20 pt-6">
                {/* Quantity input */}
                <div className="flex items-center justify-between border border-[#E3D9CE] rounded-full px-4 py-2.5 bg-[#FAF8F5] sm:w-32">
                  <button
                    onClick={() => handleQuantityChange("dec")}
                    className="text-text-muted hover:text-primary transition-all p-1"
                    title="ลดจำนวน"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-display font-bold text-sm text-text-main select-none">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("inc")}
                    className="text-text-muted hover:text-primary transition-all p-1"
                    title="เพิ่มจำนวน"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-grow bg-primary text-white hover:bg-primary-hover px-8 py-3.5 rounded-full font-display font-semibold text-sm transition-all duration-300 shadow-md shadow-primary/10 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> เพิ่มลงตะกร้าสินค้า
                </button>
              </div>
            )}

            {/* Fast Features Ribbon */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E3D9CE]/20 text-[10px] text-text-muted font-bold">
              <div className="flex flex-col gap-1 items-center text-center p-3 bg-[#FAF8F5] rounded-xl border border-[#E3D9CE]/10">
                <ShieldCheck className="w-5 h-5 text-primary stroke-[1.5]" />
                <span>รับประกัน 1 ปี</span>
              </div>
              <div className="flex flex-col gap-1 items-center text-center p-3 bg-[#FAF8F5] rounded-xl border border-[#E3D9CE]/10">
                <Award className="w-5 h-5 text-primary stroke-[1.5]" />
                <span>เกรดส่งออก</span>
              </div>
              <div className="flex flex-col gap-1 items-center text-center p-3 bg-[#FAF8F5] rounded-xl border border-[#E3D9CE]/10">
                <Heart className="w-5 h-5 text-primary stroke-[1.5]" />
                <span>ปลอดภัยต่อสัตว์เลี้ยง</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specifications / Tabs Area */}
        <div className="bg-white rounded-3xl border border-[#E3D9CE]/30 shadow-sm overflow-hidden mb-20">
          {/* Tab Header Navigation */}
          <div className="flex border-b border-[#E3D9CE]/30 bg-[#F0EBE3]/20 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={() => setActiveTab("features")}
              className={`flex-1 min-w-[120px] py-4 px-6 font-display font-bold text-xs transition-all border-b-2 cursor-pointer ${
                activeTab === "features"
                  ? "border-primary text-primary bg-white"
                  : "border-transparent text-text-muted hover:text-primary bg-transparent"
              }`}
            >
              คุณสมบัติเด่น (Features)
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`flex-1 min-w-[120px] py-4 px-6 font-display font-bold text-xs transition-all border-b-2 cursor-pointer ${
                activeTab === "specs"
                  ? "border-primary text-primary bg-white"
                  : "border-transparent text-text-muted hover:text-primary bg-transparent"
              }`}
            >
              สเปกและวัสดุ (Specifications)
            </button>
            <button
              onClick={() => setActiveTab("care")}
              className={`flex-1 min-w-[120px] py-4 px-6 font-display font-bold text-xs transition-all border-b-2 cursor-pointer ${
                activeTab === "care"
                  ? "border-primary text-primary bg-white"
                  : "border-transparent text-text-muted hover:text-primary bg-transparent"
              }`}
            >
              การดูแลรักษา (Care)
            </button>
            <button
              onClick={() => setActiveTab("warranty")}
              className={`flex-1 min-w-[120px] py-4 px-6 font-display font-bold text-xs transition-all border-b-2 cursor-pointer ${
                activeTab === "warranty"
                  ? "border-primary text-primary bg-white"
                  : "border-transparent text-text-muted hover:text-primary bg-transparent"
              }`}
            >
              การรับประกันสินค้า (Warranty)
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-6 md:p-10 text-left text-xs sm:text-sm text-text-muted leading-relaxed font-sans">
            
            {/* Features Tab */}
            {activeTab === "features" && (
              <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
                <h3 className="font-display font-bold text-sm text-text-main mb-2">ทำไมต้องเลือก Pawfect เฟอร์นิเจอร์ตัวนี้?</h3>
                {product.features && product.features.length > 0 ? (
                  <ul className="flex flex-col gap-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <div className="w-5 h-5 rounded-full bg-primary-light text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <span className="font-medium text-text-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>ดีไซน์ออกแบบมาเพื่อตอบรับพฤติกรรมตามสัญชาตญาณธรรมชาติของสัตว์เลี้ยง และกลมกลืนเป็นส่วนหนึ่งของเฟอร์นิเจอร์แต่งบ้านสไตล์ Japandi หรือมินิมอลได้อย่างมีระดับ</p>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specs" && (
              <div className="flex flex-col gap-5 animate-[fadeIn_0.2s_ease-out]">
                <h3 className="font-display font-bold text-sm text-text-main mb-2">รายละเอียดข้อมูลวัสดุและขนาด</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4">
                    {product.materials && (
                      <div className="flex flex-col gap-1.5 p-4 bg-[#FAF8F5] rounded-xl border border-[#E3D9CE]/10">
                        <span className="text-[10px] font-bold text-primary uppercase">วัสดุที่ใช้ผลิต</span>
                        <span className="font-semibold text-text-main">{product.materials}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex flex-col gap-1.5 p-4 bg-[#FAF8F5] rounded-xl border border-[#E3D9CE]/10">
                        <span className="text-[10px] font-bold text-primary uppercase">ขนาดสินค้า</span>
                        <span className="font-semibold text-text-main">{product.dimensions}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4">
                    {product.weightLimit && (
                      <div className="flex flex-col gap-1.5 p-4 bg-[#FAF8F5] rounded-xl border border-[#E3D9CE]/10">
                        <span className="text-[10px] font-bold text-primary uppercase">การรับน้ำหนัก</span>
                        <span className="font-semibold text-text-main">{product.weightLimit}</span>
                      </div>
                    )}
                    {product.packageIncludes && (
                      <div className="flex flex-col gap-1.5 p-4 bg-[#FAF8F5] rounded-xl border border-[#E3D9CE]/10">
                        <span className="text-[10px] font-bold text-primary uppercase">อุปกรณ์ที่มาในกล่อง</span>
                        <span className="font-semibold text-text-main">{product.packageIncludes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Care Instructions Tab */}
            {activeTab === "care" && (
              <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
                <h3 className="font-display font-bold text-sm text-text-main mb-2">ข้อแนะนำและการทำความสะอาดเพื่อยืดอายุการใช้งาน</h3>
                {product.careInstructions ? (
                  <p className="whitespace-pre-line bg-[#FAF8F5] border border-[#E3D9CE]/25 rounded-xl p-5 font-medium">{product.careInstructions}</p>
                ) : (
                  <p>หลีกเลี่ยงการจัดวางในที่ชื้นหรือโดนแสงแดดจัดโดยตรง สามารถเช็ดฝุ่นทำความสะอาดได้เป็นประจำด้วยผ้าแห้งไมโครไฟเบอร์</p>
                )}
              </div>
            )}

            {/* Warranty Info Tab */}
            {activeTab === "warranty" && (
              <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
                <h3 className="font-display font-bold text-sm text-text-main mb-2">นโยบายการประกันและการรับประกันคุณภาพชิ้นงาน</h3>
                {product.warrantyInfo ? (
                  <p className="whitespace-pre-line bg-[#FAF8F5] border border-[#E3D9CE]/25 rounded-xl p-5 font-medium">{product.warrantyInfo}</p>
                ) : (
                  <p>รับประกันโครงสร้างหลักจากการแตกหักชำรุดเสียหายที่เกิดจากการใช้งานปกติและประกอบสำเร็จเป็นระยะเวลา 1 ปีเต็ม</p>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="flex flex-col gap-8">
            <div className="text-left flex flex-col gap-1.5">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">สินค้าอื่นในหมวดหมู่เดียวกัน</span>
              <h2 className="font-display font-bold text-2xl text-text-main">Related Products</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-[#E3D9CE]/30 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col group relative"
                >
                  {/* Badges */}
                  {p.stock === 0 ? (
                    <span className="absolute top-3 left-3 bg-[#735F50]/80 backdrop-blur-sm text-white text-[9px] font-bold py-1 px-2 rounded-full z-10">
                      สินค้าหมด
                    </span>
                  ) : p.featured ? (
                    <span className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold py-1 px-2 rounded-full z-10">
                      สินค้าแนะนำ
                    </span>
                  ) : null}

                  {/* Image wrapper */}
                  <div className="h-48 bg-[#F0EBE3]/40 overflow-hidden relative">
                    <img
                      src={p.image}
                      alt={p.nameTh}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* Info details */}
                  <div className="p-4 flex flex-col flex-grow justify-between gap-3 text-left">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider">
                        {getCategoryNameTh(p.category)}
                      </span>
                      <Link
                        href={`/shop/${p.id}`}
                        className="font-display font-semibold text-xs sm:text-sm text-text-main hover:text-primary transition-all cursor-pointer leading-snug line-clamp-2"
                      >
                        {p.nameTh}
                      </Link>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#E3D9CE]/20 pt-3">
                      <span className="font-display font-bold text-[#A57248] text-sm">
                        {p.price.toLocaleString()} ฿
                      </span>
                      <Link
                        href={`/shop/${p.id}`}
                        className="text-[10px] text-primary hover:text-primary-hover font-display font-semibold flex items-center gap-1 transition-all"
                      >
                        ดูสินค้าชิ้นนี้
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Boxes, 
  Receipt, 
  Mail, 
  Phone,
  Home, 
  TrendingUp, 
  Calendar, 
  Plus, 
  PenSquare, 
  Trash2, 
  Lock, 
  LogOut,
  UserCheck,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Product, Order, Category, Inquiry } from "../../types";
import { 
  getProducts, 
  getOrders, 
  getInquiries, 
  getCategories, 
  saveProduct, 
  deleteProduct, 
  updateOrderStatus,
  uploadFileToStorage
} from "../../lib/db";
import { auth, isFirebaseConfigured } from "../../lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useToast } from "../../context/ToastContext";

export default function AdminPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>("admin@pawfect.com");
  const [loginPassword, setLoginPassword] = useState<string>("admin123");
  const [authError, setAuthError] = useState<string>("");

  // Navigation State
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders" | "inquiries">("dashboard");

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Product Form State (for Add / Edit Modal)
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [formProdId, setFormProdId] = useState<string>("");
  const [formProdNameEn, setFormProdNameEn] = useState<string>("");
  const [formProdNameTh, setFormProdNameTh] = useState<string>("");
  const [formProdCat, setFormProdCat] = useState<string>("cat-furniture");
  const [formProdPrice, setFormProdPrice] = useState<number>(0);
  const [formProdStock, setFormProdStock] = useState<number>(0);
  const [formProdImage, setFormProdImage] = useState<string>("assets/cat_furniture.png");
  const [formProdDesc, setFormProdDesc] = useState<string>("");
  const [formProdFeatured, setFormProdFeatured] = useState<boolean>(false);
  
  // Specification states
  const [formProdImages, setFormProdImages] = useState<string[]>(["", "", "", "", ""]);
  const [formProdMaterials, setFormProdMaterials] = useState<string>("");
  const [formProdDimensions, setFormProdDimensions] = useState<string>("");
  const [formProdWeightLimit, setFormProdWeightLimit] = useState<string>("");
  const [formProdFeatures, setFormProdFeatures] = useState<string>(""); // text area (newline-separated)
  const [formProdCare, setFormProdCare] = useState<string>("");
  const [formProdWarranty, setFormProdWarranty] = useState<string>("");
  const [formProdPackage, setFormProdPackage] = useState<string>("");

  // Slip Lightbox State
  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string>("");

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Load Admin Data on login
  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    const prods = await getProducts();
    const ords = await getOrders();
    const inqs = await getInquiries();
    const cats = await getCategories();
    setProducts(prods);
    setOrders(ords);
    setInquiries(inqs);
    setCategories(cats);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        setIsLoggedIn(true);
        showToast("เข้าสู่ระบบหลังบ้านด้วย Firebase สำเร็จแล้ว", "success");
        return;
      } catch (err: any) {
        console.warn("Firebase Auth login failed, checking fallback credentials...", err);
      }
    }

    if (loginEmail === "admin@pawfect.com" && loginPassword === "admin123") {
      setIsLoggedIn(true);
      setAuthError("");
      showToast("เข้าสู่ระบบหลังบ้านด้วยบัญชีสำรองสำเร็จแล้ว", "success");
    } else {
      setAuthError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      showToast("เข้าสู่ระบบไม่สำเร็จ", "danger");
    }
  };

  const handleLogout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("Firebase SignOut failed", err);
      }
    }
    setIsLoggedIn(false);
    showToast("ออกจากระบบหลังบ้านแล้ว", "info");
  };

  // Product Form Actions
  const handleOpenProductModal = (product: Product | null = null) => {
    if (product) {
      // Edit
      setFormProdId(product.id);
      setFormProdNameEn(product.name);
      setFormProdNameTh(product.nameTh);
      setFormProdCat(product.category);
      setFormProdPrice(product.price);
      setFormProdStock(product.stock);
      setFormProdImage(product.image);
      setFormProdDesc(product.description);
      setFormProdFeatured(product.featured);
      
      // Load specs
      const currentImages = product.images || [];
      const newImages = [...currentImages];
      while (newImages.length < 5) {
        newImages.push(newImages.length === 0 ? product.image : "");
      }
      setFormProdImages(newImages.slice(0, 5));
      setFormProdMaterials(product.materials || "");
      setFormProdDimensions(product.dimensions || "");
      setFormProdWeightLimit(product.weightLimit || "");
      setFormProdFeatures(product.features ? product.features.join("\n") : "");
      setFormProdCare(product.careInstructions || "");
      setFormProdWarranty(product.warrantyInfo || "");
      setFormProdPackage(product.packageIncludes || "");
    } else {
      // Add
      setFormProdId("");
      setFormProdNameEn("");
      setFormProdNameTh("");
      setFormProdCat("cat-furniture");
      setFormProdPrice(0);
      setFormProdStock(0);
      setFormProdImage("assets/cat_furniture.png");
      setFormProdDesc("");
      setFormProdFeatured(false);
      
      // Reset specs
      setFormProdImages(["assets/cat_furniture.png", "", "", "", ""]);
      setFormProdMaterials("");
      setFormProdDimensions("");
      setFormProdWeightLimit("");
      setFormProdFeatures("");
      setFormProdCare("");
      setFormProdWarranty("");
      setFormProdPackage("");
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Clean up sub-images
      let cleanImages = formProdImages.map(img => img.trim()).filter(img => img !== "");
      if (cleanImages.length === 0) {
        cleanImages = [formProdImage];
      }

      const payload: Omit<Product, 'id'> & { id?: string } = {
        name: formProdNameEn,
        nameTh: formProdNameTh,
        category: formProdCat,
        price: formProdPrice,
        stock: formProdStock,
        image: formProdImage,
        description: formProdDesc,
        featured: formProdFeatured,
        images: cleanImages,
        materials: formProdMaterials.trim(),
        dimensions: formProdDimensions.trim(),
        weightLimit: formProdWeightLimit.trim(),
        features: formProdFeatures.split('\n').map(f => f.trim()).filter(f => f !== ""),
        careInstructions: formProdCare.trim(),
        warrantyInfo: formProdWarranty.trim(),
        packageIncludes: formProdPackage.trim()
      };

      if (formProdId) {
        payload.id = formProdId;
      }

      await saveProduct(payload);
      setIsProductModalOpen(false);
      showToast(formProdId ? "แก้ไขข้อมูลสินค้าสำเร็จ" : "เพิ่มสินค้าใหม่ลงคลังสำเร็จ", "success");
      loadData();
    } catch (err) {
      console.error(err);
      showToast("เกิดข้อผิดพลาดในการบันทึกสินค้า", "danger");
    }
  };

  const handleDeleteProduct = async (id: string, nameTh: string) => {
    if (confirm(`คุณแน่ใจว่าต้องการลบสินค้า "${nameTh}" หรือไม่?`)) {
      try {
        await deleteProduct(id);
        showToast("ลบสินค้าสำเร็จ", "danger");
        loadData();
      } catch (err) {
        console.error(err);
        showToast("เกิดข้อผิดพลาดในการลบสินค้า", "danger");
      }
    }
  };

  // Order Actions
  const handleStatusChange = async (orderId: string, status: Order["status"]) => {
    try {
      await updateOrderStatus(orderId, status);
      showToast(`อัปเดตสถานะออเดอร์ ${orderId} เรียบร้อยแล้ว`, "success");
      loadData();
    } catch (err) {
      console.error(err);
      showToast("ไม่สามารถอัปเดตออเดอร์ได้", "danger");
    }
  };

  const getStatusBadgeClass = (status: Order["status"]) => {
    switch (status) {
      case "Pending": return "bg-orange-50 text-orange-600 border border-orange-200/55";
      case "Shipped": return "bg-sky-50 text-sky-600 border border-sky-200/55";
      case "Completed": return "bg-emerald-50 text-emerald-600 border border-emerald-200/55";
      case "Cancelled": return "bg-rose-50 text-rose-600 border border-rose-200/55";
    }
  };

  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "Pending": return "รอดำเนินการ";
      case "Shipped": return "จัดส่งแล้ว";
      case "Completed": return "เสร็จสิ้น";
      case "Cancelled": return "ยกเลิก";
    }
  };

  // --- STATS CALCULATIONS ---
  const totalSales = orders
    .filter(o => o.status === "Completed" || o.status === "Shipped")
    .reduce((sum, o) => sum + o.total, 0);

  // --- RENDER LOGIN IF NOT AUTHENTICATED ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md bg-white border border-[#E3D9CE]/40 rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col gap-6">
          <div className="text-center flex flex-col gap-2 items-center">
            <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-xl text-text-main">
              แผงควบคุมผู้ดูแลระบบ
            </h2>
            <p className="text-xs text-text-muted">
              กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งานพื้นที่หลังบ้าน
            </p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-lg flex items-center gap-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label htmlFor="login-email" className="block text-[10px] font-bold text-text-main uppercase mb-1.5">
                อีเมลผู้ใช้งาน
              </label>
              <input
                type="email"
                id="login-email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E3D9CE] rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main"
                placeholder="admin@pawfect.com"
                required
              />
            </div>

            <div>
              <label htmlFor="login-pwd" className="block text-[10px] font-bold text-text-main uppercase mb-1.5">
                รหัสผ่านเข้าระบบ
              </label>
              <input
                type="password"
                id="login-pwd"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E3D9CE] rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-full font-display font-semibold text-xs shadow-md hover:bg-primary-hover active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <UserCheck className="w-4 h-4" /> เข้าสู่ระบบ
            </button>
          </form>

          <div className="border-t border-[#E3D9CE]/30 pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-display font-semibold text-xs text-text-muted hover:text-primary transition-all"
            >
              <Home className="w-3.5 h-3.5" /> กลับไปร้านค้าหน้าบ้าน
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER ADMIN WORKSPACE ---
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row">
      
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E3D9CE]/30 p-6 flex flex-col justify-between gap-8">
        <div className="flex flex-col gap-8">
          {/* Brand Logo inside Admin */}
          <div className="flex items-center gap-3">
            <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm text-text-main">
                Pawfect Console
              </span>
              <span className="text-[9px] tracking-wide text-text-muted font-bold uppercase">
                ผู้ดูแลระบบหลังบ้าน
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <ul className="flex flex-col gap-1.5">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "dashboard"
                    ? "bg-primary-light text-primary"
                    : "text-text-muted hover:bg-primary-light/50 hover:text-primary"
                }`}
              >
                <LayoutDashboard className="w-4.5 h-4.5" /> Dashboard
              </button>
            </li>

            <li>
              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "products"
                    ? "bg-primary-light text-primary"
                    : "text-text-muted hover:bg-primary-light/50 hover:text-primary"
                }`}
              >
                <Boxes className="w-4.5 h-4.5" /> คลังสินค้า (Inventory)
              </button>
            </li>

            <li>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "orders"
                    ? "bg-primary-light text-primary"
                    : "text-text-muted hover:bg-primary-light/50 hover:text-primary"
                }`}
              >
                <Receipt className="w-4.5 h-4.5" /> รายการคำสั่งซื้อ (Orders)
              </button>
            </li>

            <li>
              <button
                onClick={() => setActiveTab("inquiries")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "inquiries"
                    ? "bg-primary-light text-primary"
                    : "text-text-muted hover:bg-primary-light/50 hover:text-primary"
                }`}
              >
                <Mail className="w-4.5 h-4.5" /> ข้อความติดต่อ (Messages)
              </button>
            </li>
          </ul>
        </div>

        {/* Back and Logout triggers */}
        <div className="flex flex-col gap-2 border-t border-[#E3D9CE]/30 pt-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-xs font-semibold text-text-muted hover:bg-primary-light/50 hover:text-primary rounded-lg transition-all"
          >
            <Home className="w-4.5 h-4.5" /> ไปร้านค้าหน้าบ้าน
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
          >
            <LogOut className="w-4.5 h-4.5" /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-grow p-6 sm:p-10 max-h-screen overflow-y-auto w-full">

        {/* 1. DASHBOARD VIEW */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-8 animate-[fadeIn_0.3s_ease-out]">
            <h2 className="font-display font-bold text-2xl text-text-main">
              แผงควบคุมระบบ (Admin Dashboard)
            </h2>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-[#E3D9CE]/30 p-6 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-text-muted uppercase">ยอดขายจริงทั้งหมด</span>
                  <span className="text-xl font-bold text-text-main font-display">{totalSales.toLocaleString()} ฿</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white border border-[#E3D9CE]/30 p-6 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-text-muted uppercase">จำนวนคำสั่งซื้อ</span>
                  <span className="text-xl font-bold text-text-main font-display">{orders.length}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white border border-[#E3D9CE]/30 p-6 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-text-muted uppercase">สินค้าในคลังคลัง</span>
                  <span className="text-xl font-bold text-text-main font-display">{products.length}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
                  <Boxes className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white border border-[#E3D9CE]/30 p-6 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-text-muted uppercase">ข้อความผู้ติดต่อ</span>
                  <span className="text-xl font-bold text-text-main font-display">{inquiries.length}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Recent Orders table inside Dashboard */}
            <div className="bg-white border border-[#E3D9CE]/30 rounded-xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[#E3D9CE]/30 flex justify-between items-center bg-white">
                <h3 className="font-display font-bold text-sm text-text-main">
                  รายการสั่งซื้อล่าสุด
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="bg-[#F0EBE3] hover:bg-[#E3D9CE]/50 text-text-main text-xs font-semibold px-4 py-1.5 rounded-md transition-all"
                >
                  ดูทั้งหมด
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F0EBE3]/50 text-[10px] font-bold text-text-muted uppercase border-b border-[#E3D9CE]/30">
                      <th className="px-6 py-3">เลขที่คำสั่งซื้อ</th>
                      <th className="px-6 py-3">ชื่อลูกค้า</th>
                      <th className="px-6 py-3">วันที่สั่งซื้อ</th>
                      <th className="px-6 py-3">ยอดรวม</th>
                      <th className="px-6 py-3">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3D9CE]/20 text-xs">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.orderId} className="hover:bg-[#FAF8F5]/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-text-main">{ord.orderId}</td>
                        <td className="px-6 py-4 font-medium text-text-main">{ord.customerName}</td>
                        <td className="px-6 py-4 text-text-muted">
                          {new Date(ord.date).toLocaleDateString("th-TH")}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#A57248]">{ord.total.toLocaleString()} ฿</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full ${getStatusBadgeClass(ord.status)}`}>
                            {getStatusLabel(ord.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-text-muted font-medium">
                          ไม่มีข้อมูลคำสั่งซื้อในระบบ
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS INVENTORY VIEW */}
        {activeTab === "products" && (
          <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-between items-center">
              <h2 className="font-display font-bold text-2xl text-text-main">
                คลังสินค้า (Inventory)
              </h2>
              <button
                onClick={() => handleOpenProductModal(null)}
                className="bg-primary text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-primary-hover flex items-center gap-1.5 shadow-md active:scale-98 transition-all"
              >
                <Plus className="w-4 h-4" /> เพิ่มสินค้าใหม่
              </button>
            </div>

            {/* Inventory table */}
            <div className="bg-white border border-[#E3D9CE]/30 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F0EBE3]/50 text-[10px] font-bold text-text-muted uppercase border-b border-[#E3D9CE]/30">
                      <th className="px-6 py-4">ภาพ</th>
                      <th className="px-6 py-4">สินค้า (ไทย/Eng)</th>
                      <th className="px-6 py-4">หมวดหมู่</th>
                      <th className="px-6 py-4">ราคา</th>
                      <th className="px-6 py-4">คลังคงเหลือ</th>
                      <th className="px-6 py-4">สถานะ</th>
                      <th className="px-6 py-4">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3D9CE]/20 text-xs">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF8F5]/40 transition-colors">
                        <td className="px-6 py-3">
                          <img
                            src={p.image}
                            alt={p.nameTh}
                            className="w-12 h-12 object-cover rounded-lg border border-[#E3D9CE]/30 bg-[#F0EBE3]/30"
                          />
                        </td>
                        <td className="px-6 py-3">
                          <div className="font-bold text-text-main">{p.nameTh}</div>
                          <span className="text-[10px] text-text-muted uppercase font-semibold font-display">
                            {p.name}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-medium text-text-muted">
                          {p.category === "cat-furniture" ? "เฟอร์นิเจอร์แมว"
                            : p.category === "dog-furniture" ? "เฟอร์นิเจอร์สุนัข"
                            : p.category === "storage-cabinet" ? "ตู้เก็บของ"
                            : "อุปกรณ์สัตว์เลี้ยง"}
                        </td>
                        <td className="px-6 py-3 font-bold text-text-main">{p.price.toLocaleString()} ฿</td>
                        <td className="px-6 py-3 font-bold">{p.stock}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex px-2.5 py-1 text-[9px] font-bold rounded-full ${
                            p.stock === 0 
                              ? "bg-rose-50 text-rose-500 border border-rose-100" 
                              : p.stock < 5 
                                ? "bg-orange-50 text-orange-500 border border-orange-100" 
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}>
                            {p.stock === 0 ? "หมดคลัง" : p.stock < 5 ? "ใกล้หมด" : "พร้อมส่ง"}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenProductModal(p)}
                              className="w-8 h-8 rounded-full bg-[#FAF8F5] text-text-muted hover:bg-primary-light hover:text-primary transition-all flex items-center justify-center border border-[#E3D9CE]/30"
                              title="แก้ไขสินค้า"
                            >
                              <PenSquare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.nameTh)}
                              className="w-8 h-8 rounded-full bg-[#FAF8F5] text-text-muted hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center border border-[#E3D9CE]/30"
                              title="ลบสินค้า"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDERS MANAGEMENT VIEW */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
            <h2 className="font-display font-bold text-2xl text-text-main">
              รายการสั่งซื้อ (Orders)
            </h2>

            {/* Orders table */}
            <div className="bg-white border border-[#E3D9CE]/30 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F0EBE3]/50 text-[10px] font-bold text-text-muted uppercase border-b border-[#E3D9CE]/30">
                      <th className="px-6 py-4">เลขออเดอร์/ลูกค้า</th>
                      <th className="px-6 py-4">การติดต่อ</th>
                      <th className="px-6 py-4">สินค้าในออเดอร์</th>
                      <th className="px-6 py-4">ยอดเงินสุทธิ</th>
                      <th className="px-6 py-4">สถานะสั่งซื้อ</th>
                      <th className="px-6 py-4">อัปเดตสถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3D9CE]/20 text-xs">
                    {orders.map((ord) => (
                      <tr key={ord.orderId} className="hover:bg-[#FAF8F5]/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-text-main text-sm">{ord.orderId}</div>
                          <div className="font-medium text-text-main mt-0.5">{ord.customerName}</div>
                          <span className="text-[10px] text-text-muted">
                            {new Date(ord.date).toLocaleString("th-TH")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-text-muted">
                          <div className="flex items-center gap-1.5 mb-1 text-[11px]"><Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {ord.email}</div>
                          <div className="flex items-center gap-1.5 text-[11px]"><Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {ord.phone}</div>
                          <div className="text-[10px] max-w-[200px] mt-1.5 line-clamp-2" title={ord.address}>ที่อยู่: {ord.address}</div>
                          {ord.slipImage && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[10px] font-bold text-emerald-600">แนบสลิปแล้ว:</span>
                              <button
                                onClick={() => setSelectedSlipUrl(ord.slipImage!)}
                                className="px-2 py-0.8 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded border border-emerald-200 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                🖼️ ดูรูปสลิป
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 leading-relaxed font-semibold text-text-main">
                          {ord.items.map((item, idx) => (
                            <div key={idx}>
                              • {item.nameTh} <span className="text-xs font-bold text-primary">x{item.quantity}</span>
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#A57248] text-sm">{ord.total.toLocaleString()} ฿</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full ${getStatusBadgeClass(ord.status)}`}>
                            {getStatusLabel(ord.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.orderId, e.target.value as any)}
                            className="bg-[#FAF8F5] border border-[#E3D9CE] rounded-lg px-2 py-1.5 text-[11px] font-bold focus:outline-none focus:border-primary text-text-main cursor-pointer"
                          >
                            <option value="Pending">รอดำเนินการ</option>
                            <option value="Shipped">จัดส่งแล้ว</option>
                            <option value="Completed">เสร็จสิ้น</option>
                            <option value="Cancelled">ยกเลิก</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. INQUIRIES VIEW */}
        {activeTab === "inquiries" && (
          <div className="flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
            <h2 className="font-display font-bold text-2xl text-text-main">
              ข้อความผู้ติดต่อ (Messages)
            </h2>

            {/* Inquiries table */}
            <div className="bg-white border border-[#E3D9CE]/30 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F0EBE3]/50 text-[10px] font-bold text-text-muted uppercase border-b border-[#E3D9CE]/30">
                      <th className="px-6 py-4">ผู้ส่ง/ติดต่อ</th>
                      <th className="px-6 py-4">วันที่รับ</th>
                      <th className="px-6 py-4" style={{ width: "60%" }}>เนื้อความข้อความ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3D9CE]/20 text-xs">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-[#FAF8F5]/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-text-main text-sm">{inq.name}</div>
                          <div className="text-text-muted mt-1 flex flex-col gap-0.5 text-[10px] font-semibold">
                            <span>Email: {inq.email}</span>
                            {inq.phone && <span>Phone: {inq.phone}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-text-muted">
                          {new Date(inq.date).toLocaleString("th-TH")}
                        </td>
                        <td className="px-6 py-4 leading-relaxed text-text-main italic pr-6 whitespace-pre-wrap">
                          {inq.message}
                        </td>
                      </tr>
                    ))}
                    {inquiries.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-text-muted font-medium">
                          ไม่มีข้อความติดต่อจากลูกค้า
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- ADMIN PRODUCT ADD/EDIT MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="absolute inset-0" onClick={() => setIsProductModalOpen(false)} />
          
          <div className="relative z-10 w-full max-w-2xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E3D9CE]/40 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-white border-b border-[#E3D9CE]/40 flex justify-between items-center">
              <h3 className="font-display font-bold text-base text-text-main">
                {formProdId ? "แก้ไขรายละเอียดสินค้า" : "เพิ่มสินค้าใหม่คงคลัง"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] text-text-main flex items-center justify-center border border-[#E3D9CE]/30 font-semibold cursor-pointer hover:bg-[#F0EBE3] transition-all"
              >
                X
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="overflow-y-auto flex-grow">
              <div className="p-6 flex flex-col gap-5">
                
                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">ชื่อสินค้าภาษาอังกฤษ <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={formProdNameEn}
                      onChange={(e) => setFormProdNameEn(e.target.value)}
                      className="w-full bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main"
                      placeholder="เช่น Classic Cat Tree"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">ชื่อสินค้าภาษาไทย <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={formProdNameTh}
                      onChange={(e) => setFormProdNameTh(e.target.value)}
                      className="w-full bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main"
                      placeholder="เช่น คอนโดแมวคลาสสิค"
                      required
                    />
                  </div>
                </div>

                {/* Cat & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">หมวดหมู่สินค้า <span className="text-rose-500">*</span></label>
                    <select
                      value={formProdCat}
                      onChange={(e) => setFormProdCat(e.target.value)}
                      className="w-full bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main"
                      required
                    >
                      <option value="cat-furniture">เฟอร์นิเจอร์แมว</option>
                      <option value="dog-furniture">เฟอร์นิเจอร์สุนัข</option>
                      <option value="pet-accessories">อุปกรณ์สัตว์เลี้ยง</option>
                      <option value="storage-cabinet">ตู้เก็บของและอื่นๆ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">ราคาสินค้า (บาท) <span className="text-rose-500">*</span></label>
                    <input
                      type="number"
                      value={formProdPrice}
                      onChange={(e) => setFormProdPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Stock & Main Image with Preset */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">จำนวนในสต็อก <span className="text-rose-500">*</span></label>
                    <input
                      type="number"
                      value={formProdStock}
                      onChange={(e) => setFormProdStock(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">รูปภาพหลัก (พาธ/URL หรือ อัปโหลด) <span className="text-rose-500">*</span></label>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formProdImage}
                          onChange={(e) => setFormProdImage(e.target.value)}
                          className="flex-grow bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main"
                          placeholder="assets/cat_furniture.png"
                          required
                        />
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              setFormProdImage(e.target.value);
                            }
                          }}
                          className="bg-[#FAF8F5] border border-[#E3D9CE] rounded-lg px-2 text-[10px] font-bold text-text-main cursor-pointer max-w-[110px]"
                        >
                          <option value="">เลือกพรีเซ็ต...</option>
                          <option value="assets/cat_furniture.png">คอนโดแมว</option>
                          <option value="assets/dog_furniture.png">โซฟาสุนัข</option>
                          <option value="assets/pet_accessories.png">บ้านสามเหลี่ยม</option>
                          <option value="assets/storage_cabinet.png">ตู้เก็บของ</option>
                          <option value="assets/hero_cat.png">เปลติดกระจก</option>
                          <option value="assets/about_pets.png">เตียงสุนัข</option>
                        </select>
                      </div>
                      
                      {/* Image Upload Trigger */}
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          id="main-img-upload"
                          accept="image/*"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              try {
                                showToast("กำลังอัปโหลดรูปหลัก...", "info");
                                const url = await uploadFileToStorage(file, "products");
                                setFormProdImage(url);
                                showToast("อัปโหลดรูปหลักสำเร็จ", "success");
                              } catch (err) {
                                showToast("อัปโหลดรูปหลักล้มเหลว", "danger");
                              }
                            }
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="main-img-upload"
                          className="px-3 py-1.5 bg-[#F0EBE3] hover:bg-[#E3D9CE] border border-[#E3D9CE] rounded-md text-[10px] font-bold text-text-main cursor-pointer transition-colors"
                        >
                          📤 อัปโหลดรูปภาพหลัก
                        </label>
                        {formProdImage && (
                          <img
                            src={formProdImage}
                            alt="Main product preview"
                            className="w-10 h-10 object-cover rounded border border-[#E3D9CE]/30"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub Images Gallery */}
                <div className="border border-[#E3D9CE]/30 rounded-xl p-4 bg-white flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-text-main uppercase tracking-wider block border-b border-[#E3D9CE]/20 pb-2">แกลเลอรีรูปภาพย่อย (สูงสุด 5 รูป)</span>
                  <div className="flex flex-col gap-3.5">
                    {formProdImages.map((img, idx) => (
                      <div key={idx} className="flex flex-col gap-2 p-3 bg-[#FAF8F5] rounded-lg border border-[#E3D9CE]/15">
                        <div className="flex gap-2 items-center">
                          <span className="text-[10px] font-bold text-text-muted w-14">รูปย่อย {idx + 1}:</span>
                          <input
                            type="text"
                            value={img}
                            onChange={(e) => {
                              const updated = [...formProdImages];
                              updated[idx] = e.target.value;
                              setFormProdImages(updated);
                            }}
                            className="flex-grow bg-white border border-[#E3D9CE]/70 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-primary text-text-main"
                            placeholder={`พาธรูปภาพย่อยที่ ${idx + 1}`}
                          />
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                const updated = [...formProdImages];
                                updated[idx] = e.target.value;
                                setFormProdImages(updated);
                              }
                            }}
                            className="bg-[#F0EBE3] border border-[#E3D9CE]/40 rounded-lg px-1.5 py-2 text-[9px] font-bold text-text-main cursor-pointer max-w-[85px]"
                          >
                            <option value="">พรีเซ็ต...</option>
                            <option value="assets/cat_furniture.png">คอนโดแมว</option>
                            <option value="assets/dog_furniture.png">โซฟาสุนัข</option>
                            <option value="assets/pet_accessories.png">บ้านสามเหลี่ยม</option>
                            <option value="assets/storage_cabinet.png">ตู้เก็บของ</option>
                            <option value="assets/hero_cat.png">เปลติดกระจก</option>
                            <option value="assets/about_pets.png">เตียงสุนัข</option>
                          </select>
                        </div>
                        
                        {/* Sub Image Upload Trigger */}
                        <div className="flex items-center gap-3 pl-14">
                          <input
                            type="file"
                            id={`sub-img-upload-${idx}`}
                            accept="image/*"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                try {
                                  showToast(`กำลังอัปโหลดรูปย่อย ${idx + 1}...`, "info");
                                  const url = await uploadFileToStorage(file, "products");
                                  const updated = [...formProdImages];
                                  updated[idx] = url;
                                  setFormProdImages(updated);
                                  showToast(`อัปโหลดรูปย่อย ${idx + 1} สำเร็จ`, "success");
                                } catch (err) {
                                  showToast(`อัปโหลดรูปย่อย ${idx + 1} ล้มเหลว`, "danger");
                                }
                              }
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor={`sub-img-upload-${idx}`}
                            className="px-2.5 py-1.5 bg-white hover:bg-[#F0EBE3] border border-[#E3D9CE]/70 rounded text-[9px] font-bold text-text-main cursor-pointer transition-colors"
                          >
                            📤 อัปโหลดรูปภาพย่อย
                          </label>
                          {img && (
                            <img
                              src={img}
                              alt={`Sub product ${idx + 1} preview`}
                              className="w-8 h-8 object-cover rounded border border-[#E3D9CE]/30"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">คำอธิบายรายละเอียดสินค้า <span className="text-rose-500">*</span></label>
                  <textarea
                    value={formProdDesc}
                    onChange={(e) => setFormProdDesc(e.target.value)}
                    className="w-full bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main min-h-[90px]"
                    required
                  />
                </div>

                {/* Highlights / Features List */}
                <div>
                  <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">จุดเด่น/คุณสมบัติสินค้าเด่น (แยกแต่ละข้อเด่นด้วยการกดขึ้นบรรทัดใหม่)</label>
                  <textarea
                    value={formProdFeatures}
                    onChange={(e) => setFormProdFeatures(e.target.value)}
                    className="w-full bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main min-h-[85px]"
                    placeholder="เช่น:&#10;โครงสร้างฐานกว้างพิเศษ แข็งแรง ทนทาน ไม่สั่นไหว&#10;เบาะรองนอนหนานุ่ม ถอดซักทำความสะอาดง่าย"
                  />
                </div>

                {/* Physical Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">วัสดุที่ใช้ผลิต</label>
                    <input
                      type="text"
                      value={formProdMaterials}
                      onChange={(e) => setFormProdMaterials(e.target.value)}
                      className="w-full bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main"
                      placeholder="เช่น ไม้โอ๊คแท้ 100%"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">ขนาดสินค้า (กว้างxลึกxสูง)</label>
                    <input
                      type="text"
                      value={formProdDimensions}
                      onChange={(e) => setFormProdDimensions(e.target.value)}
                      className="w-full bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main"
                      placeholder="เช่น 60 x 50 x 145 ซม."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">ขีดจำกัดการรับน้ำหนัก</label>
                    <input
                      type="text"
                      value={formProdWeightLimit}
                      onChange={(e) => setFormProdWeightLimit(e.target.value)}
                      className="w-full bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary text-text-main"
                      placeholder="เช่น เหมาะสำหรับสัตว์เลี้ยงไม่เกิน 25 กก."
                    />
                  </div>
                </div>

                {/* Care, Warranty & Package Inclusions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">คำแนะนำการดูแลรักษา</label>
                    <textarea
                      value={formProdCare}
                      onChange={(e) => setFormProdCare(e.target.value)}
                      className="w-full bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-primary text-text-main min-h-[80px]"
                      placeholder="ใช้ผ้าหมาดเช็ด หลีกเลี่ยงน้ำขัง..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">การรับประกันสินค้า</label>
                    <textarea
                      value={formProdWarranty}
                      onChange={(e) => setFormProdWarranty(e.target.value)}
                      className="w-full bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-primary text-text-main min-h-[80px]"
                      placeholder="รับประกันโครงสร้างไม้ 1 ปี..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-main uppercase mb-1.5">อุปกรณ์ภายในกล่อง</label>
                    <textarea
                      value={formProdPackage}
                      onChange={(e) => setFormProdPackage(e.target.value)}
                      className="w-full bg-white border border-[#E3D9CE] rounded-lg px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-primary text-text-main min-h-[80px]"
                      placeholder="มีน็อตสกรูและคู่มือประกอบแถมให้..."
                    />
                  </div>
                </div>

                {/* Featured checkbox */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-text-main cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formProdFeatured}
                      onChange={(e) => setFormProdFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-primary border-[#E3D9CE] focus:ring-primary accent-primary"
                    />
                    แสดงในหน้าแรกของเว็บสินค้าแนะนำ (Featured)
                  </label>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-5 bg-white border-t border-[#E3D9CE]/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="border border-[#E3D9CE] text-text-main px-5 py-2.5 rounded-full font-display font-semibold text-[11px] hover:bg-[#F0EBE3] transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2.5 rounded-full font-display font-semibold text-[11px] shadow-sm hover:bg-primary-hover transition-all cursor-pointer"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- BANK TRANSFER SLIP LIGHTBOX MODAL --- */}
      {selectedSlipUrl && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setSelectedSlipUrl("")} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden p-6 flex flex-col items-center gap-4 animate-[scaleUp_0.2s_ease-out]">
            <div className="flex justify-between items-center w-full border-b border-[#E3D9CE]/30 pb-3">
              <span className="font-display font-bold text-sm text-text-main">
                สลิปหลักฐานการโอนเงิน
              </span>
              <button
                onClick={() => setSelectedSlipUrl("")}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] text-text-main flex items-center justify-center border border-[#E3D9CE]/30 font-semibold cursor-pointer hover:bg-[#F0EBE3] transition-all"
              >
                X
              </button>
            </div>
            <div className="w-full flex justify-center bg-[#FAF8F5] rounded-xl p-4 border border-[#E3D9CE]/15 overflow-hidden">
              <img
                src={selectedSlipUrl}
                alt="Bank Transfer Slip"
                className="max-h-[60vh] object-contain rounded-lg shadow-sm"
              />
            </div>
            <button
              onClick={() => setSelectedSlipUrl("")}
              className="bg-primary text-white px-6 py-2 rounded-full font-display font-semibold text-xs hover:bg-primary-hover active:scale-98 transition-all w-full cursor-pointer"
            >
              ปิดหน้าต่างนี้
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

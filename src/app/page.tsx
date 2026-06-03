"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Heart, Home, Truck, Award, CreditCard, Headset } from "lucide-react";
import { Category } from "../types";
import { getCategories } from "../lib/db";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { image: "assets/hero_cat.png", alt: "Fluffy Cat on Wood House" },
    { image: "assets/about_pets.png", alt: "Dog and Cat Cozy Bed" },
    { image: "assets/cat_furniture.png", alt: "Scandinavian Cat Tree" }
  ];

  useEffect(() => {
    const fetchCats = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCats();
  }, []);

  // Automatic slide transitions every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full flex flex-col bg-[#FAF8F5]">
      
      {/* 1. HERO SECTION (FULL SCREEN IMAGE SLIDER BACKGROUND WITH OVERLAY CONTENT) */}
      <section className="w-full min-h-[calc(100vh-80px)] relative overflow-hidden border-b border-[#E3D9CE]/10 flex items-center bg-[#FAF8F5]">
        
        {/* Background Image Slider */}
        <div className="absolute inset-0 w-full h-full z-0">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Premium Gradient Overlay: dark beige on the left for text readability, fading to transparent on the right */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/90 via-[#FAF8F5]/60 to-transparent z-10 md:from-[#FAF8F5]/80 md:via-[#FAF8F5]/20 md:to-transparent" />
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-[70%_center] md:object-[right_center]"
              />
            </div>
          ))}
        </div>

        {/* Content Container (Aligned with max-w-6xl grid) */}
        <div className="w-full max-w-6xl mx-auto px-6 py-20 relative z-20 flex flex-col md:flex-row items-center justify-between pointer-events-none">
          {/* Left Column (Content Overlaid) */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left pointer-events-auto animate-[fadeInUp_0.8s_ease-out]">
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[56px] lg:leading-[1.1] text-text-main tracking-tight">
              Comfort<br />
              For They,<br />
              Style For You <span className="inline-block text-primary text-3xl align-top select-none mt-1">🐾</span>
            </h1>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed font-sans mt-5 max-w-md">
              เฟอร์นิเจอร์ที่ออกแบบอย่างใส่ใจ<br />
              เพื่อความสุขของสัตว์เลี้ยง และความสวยงามของบ้านคุณ
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#B58E6D] hover:bg-[#9B7757] text-white px-8 py-3.5 rounded-full font-display font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-[#B58E6D]/15 mt-8"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Column (Placeholder to preserve spacing on desktop) */}
          <div className="hidden md:block md:w-1/2 h-[350px] lg:h-[450px]" />
        </div>

        {/* Carousel indicators/dots (Positioned under the cat furniture on desktop, center on mobile) */}
        <div className="absolute bottom-10 left-1/2 md:left-[70%] -translate-x-1/2 flex gap-2.5 z-30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full shadow-sm transition-all duration-300 cursor-pointer ${
                currentSlide === idx ? "w-8 bg-[#B58E6D]" : "w-2.5 bg-[#B58E6D]/30 hover:bg-[#B58E6D]/50"
              }`}
              title={`เลื่อนไปที่รูปที่ ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. FEATURE RIBBON */}
      <section className="bg-white border-y border-[#E3D9CE]/30 py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex gap-4 items-center">
            <div className="text-primary w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
              <Leaf className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div className="flex flex-col text-left">
              <h3 className="font-display font-bold text-xs text-text-main">Natural Materials</h3>
              <p className="text-[11px] text-text-muted leading-tight mt-1">วัสดุคุณภาพ ปลอดภัยต่อสัตว์เลี้ยง</p>
            </div>
          </div>

          <div className="flex gap-4 items-center border-t sm:border-t-0 sm:pt-0 border-[#E3D9CE]/20 pt-4">
            <div className="text-primary w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div className="flex flex-col text-left">
              <h3 className="font-display font-bold text-xs text-text-main">Sturdy & Durable</h3>
              <p className="text-[11px] text-text-muted leading-tight mt-1">แข็งแรง ทนทาน ใช้งานได้นาน</p>
            </div>
          </div>

          <div className="flex gap-4 items-center border-t lg:border-t-0 lg:pt-0 border-[#E3D9CE]/20 pt-4">
            <div className="text-primary w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div className="flex flex-col text-left">
              <h3 className="font-display font-bold text-xs text-text-main">Pet Friendly Design</h3>
              <p className="text-[11px] text-text-muted leading-tight mt-1">ออกแบบเพื่อความสบายใจของสัตว์เลี้ยง</p>
            </div>
          </div>

          <div className="flex gap-4 items-center border-t lg:border-t-0 lg:pt-0 border-[#E3D9CE]/20 pt-4">
            <div className="text-primary w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
              <Home className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div className="flex flex-col text-left">
              <h3 className="font-display font-bold text-xs text-text-main">Blends with Home</h3>
              <p className="text-[11px] text-text-muted leading-tight mt-1">ดีไซน์สวย เข้ากับทุกสไตล์การแต่งบ้าน</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center gap-12">
        <div className="text-center flex flex-col items-center gap-2">
          <span className="text-primary text-xl select-none">🐾</span>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-text-main mt-1">Shop by Category</h2>
          <p className="text-xs text-text-muted">เลือกสินค้าที่ใช่สำหรับสัตว์เลี้ยงของคุณ</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E3D9CE]/20 shadow-sm flex flex-col p-4 group hover:shadow-md transition-shadow duration-300"
            >
              <div className="h-[260px] overflow-hidden rounded-2xl relative">
                <img
                  src={cat.image}
                  alt={cat.nameTh}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>
              <div className="pt-5 pb-2 flex flex-col items-center gap-4 flex-grow justify-between">
                <h3 className="font-display font-bold text-sm text-text-main">{cat.name}</h3>
                <Link
                  href={`/shop?category=${cat.id}`}
                  className="inline-flex items-center justify-center bg-white border border-[#E3D9CE] text-text-muted font-display font-semibold text-[11px] px-5 py-2 rounded-full hover:bg-[#FAF8F5] hover:text-primary transition-all duration-200"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ABOUT PAWFECT SECTION */}
      <section className="bg-white border-y border-[#E3D9CE]/30 py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col items-start gap-5 text-left">
            <span className="text-xs font-semibold text-text-muted leading-none flex items-center gap-2">
              <span className="w-4 h-[1px] bg-text-muted block" /> About Pawfect
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-main leading-tight mt-1">
              We design furniture<br />for better lives
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans mt-2">
              เราเชื่อว่า สัตว์เลี้ยงคือครอบครัว เราจึงตั้งใจออกแบบเฟอร์นิเจอร์ที่ผสานความสวยงาม ฟังก์ชันการใช้งาน และความปลอดภัย เพื่อให้เขาอยู่กับเราได้อย่างมีความสุขในทุกวัน
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-[#B58E6D] hover:bg-[#9B7757] text-white px-8 py-3 rounded-full font-display font-semibold text-xs transition-all duration-300 shadow-sm"
            >
              Learn More <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <div className="relative w-full h-[320px] sm:h-[400px]">
            <img
              src="assets/about_pets.png"
              alt="We design furniture for better lives"
              className="w-full h-full object-cover rounded-[32px] shadow-md border border-[#E3D9CE]/10"
            />
          </div>
        </div>
      </section>

      {/* 5. FOOTER FEATURES RIBBON */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex gap-4 items-center">
          <div className="text-primary flex-shrink-0">
            <Truck className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="flex flex-col text-left">
            <h3 className="font-display font-bold text-xs text-text-main">Free Shipping</h3>
            <p className="text-[10px] text-text-muted mt-0.5">ส่งฟรีทั่วประเทศ เมื่อช้อปครบ 1,000.-</p>
          </div>
        </div>

        <div className="flex gap-4 items-center border-t sm:border-t-0 sm:pt-0 border-[#E3D9CE]/20 pt-4">
          <div className="text-primary flex-shrink-0">
            <Award className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="flex flex-col text-left">
            <h3 className="font-display font-bold text-xs text-text-main">Premium Quality</h3>
            <p className="text-[10px] text-text-muted mt-0.5">สินค้าคุณภาพ มาตรฐานพรีเมียม</p>
          </div>
        </div>

        <div className="flex gap-4 items-center border-t lg:border-t-0 lg:pt-0 border-[#E3D9CE]/20 pt-4">
          <div className="text-primary flex-shrink-0">
            <CreditCard className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="flex flex-col text-left">
            <h3 className="font-display font-bold text-xs text-text-main">Secure Payment</h3>
            <p className="text-[10px] text-text-muted mt-0.5">ชำระเงินปลอดภัย มั่นใจทุกการสั่งซื้อ</p>
          </div>
        </div>

        <div className="flex gap-4 items-center border-t lg:border-t-0 lg:pt-0 border-[#E3D9CE]/20 pt-4">
          <div className="text-primary flex-shrink-0">
            <Headset className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="flex flex-col text-left">
            <h3 className="font-display font-bold text-xs text-text-main">Customer Support</h3>
            <p className="text-[10px] text-text-muted mt-0.5">บริการลูกค้า พร้อมดูแลคุณ</p>
          </div>
        </div>
      </section>

    </div>
  );
}

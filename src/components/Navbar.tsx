"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Search, PawPrint, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, isMounted } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const isLinkActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const linkClass = (path: string) => {
    return `font-display font-medium text-sm py-2 relative transition-all duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[2px] after:bg-primary after:transition-all after:duration-200 hover:text-primary ${
      isLinkActive(path) 
        ? "text-primary after:w-full" 
        : "text-text-main after:w-0 hover:after:w-full"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#E3D9CE]/40 shadow-sm relative">
      <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105">
            <PawPrint className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-tight tracking-tight text-text-main">
              Pawfect
            </span>
            <span className="font-display font-semibold text-[10px] tracking-[1.5px] uppercase text-text-muted">
              Pet Furniture
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            <li>
              <Link href="/" className={linkClass("/")}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" className={linkClass("/shop")}>
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className={linkClass("/about")}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/blog" className={linkClass("/blog")}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className={linkClass("/contact")}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Actions row */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/shop"
            className="w-10 h-10 rounded-full flex items-center justify-center text-text-main hover:bg-[#F0EBE3] hover:text-primary transition-all duration-200"
            title="ค้นหา"
          >
            <Search className="w-5 h-5" />
          </Link>
          <Link
            href="/admin"
            className="w-10 h-10 rounded-full flex items-center justify-center text-text-main hover:bg-[#F0EBE3] hover:text-primary transition-all duration-200"
            title="บัญชีผู้ใช้ / แอดมิน"
          >
            <User className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-text-main hover:bg-[#F0EBE3] hover:text-primary transition-all duration-200 relative mr-1 md:mr-0"
            title="ตะกร้าสินค้า"
          >
            <ShoppingBag className="w-5 h-5" />
            {isMounted && cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 border-2 border-[#FAF8F5] animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger Toggle (Visible only below md breakpoint) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-text-main hover:bg-[#F0EBE3] hover:text-primary md:hidden transition-all duration-200 cursor-pointer"
            title="เมนู"
          >
            {isMobileMenuOpen ? <X className="w-6.5 h-6.5" /> : <Menu className="w-6.5 h-6.5" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[#FAF8F5] border-t border-[#E3D9CE]/30 shadow-lg z-40 animate-[fadeIn_0.15s_ease-out] flex flex-col p-6 gap-4">
          <ul className="flex flex-col gap-3">
            <li>
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2.5 px-4 rounded-xl font-display font-semibold text-sm transition-all duration-200 ${
                  isLinkActive("/") 
                    ? "bg-primary-light text-primary font-bold" 
                    : "text-text-main hover:bg-primary-light/40 hover:text-primary"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/shop" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2.5 px-4 rounded-xl font-display font-semibold text-sm transition-all duration-200 ${
                  isLinkActive("/shop") 
                    ? "bg-primary-light text-primary font-bold" 
                    : "text-text-main hover:bg-primary-light/40 hover:text-primary"
                }`}
              >
                Shop
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2.5 px-4 rounded-xl font-display font-semibold text-sm transition-all duration-200 ${
                  isLinkActive("/about") 
                    ? "bg-primary-light text-primary font-bold" 
                    : "text-text-main hover:bg-primary-light/40 hover:text-primary"
                }`}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                href="/blog" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2.5 px-4 rounded-xl font-display font-semibold text-sm transition-all duration-200 ${
                  isLinkActive("/blog") 
                    ? "bg-primary-light text-primary font-bold" 
                    : "text-text-main hover:bg-primary-light/40 hover:text-primary"
                }`}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2.5 px-4 rounded-xl font-display font-semibold text-sm transition-all duration-200 ${
                  isLinkActive("/contact") 
                    ? "bg-primary-light text-primary font-bold" 
                    : "text-text-main hover:bg-primary-light/40 hover:text-primary"
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;

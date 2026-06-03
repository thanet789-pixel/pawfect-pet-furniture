import React from "react";
import Link from "next/link";
import { PawPrint, Phone, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#33251A] text-[#FAF8F5]/80 border-t border-[#735F50]/20">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & Desc */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center text-[#33251A]">
                <PawPrint className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight tracking-tight text-white">
                  Pawfect
                </span>
                <span className="font-display font-semibold text-[10px] tracking-[1.5px] uppercase text-[#FAF8F5]/60">
                  Pet Furniture
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#FAF8F5]/60 leading-relaxed">
              เราสร้างสรรค์เฟอร์นิเจอร์สัตว์เลี้ยงด้วยใจรัก เพื่อคุณภาพชีวิตที่ดีขึ้นของพวกมัน และยกระดับดีไซน์บ้านของคุณให้สวยงาม ลงตัวในทุกองค์ประกอบ
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#FAF8F5]/8 flex items-center justify-center text-white hover:bg-primary transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#FAF8F5]/8 flex items-center justify-center text-white hover:bg-primary transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="font-display font-semibold text-white mb-6 pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-9 after:height-[2px] after:bg-primary">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-all hover:pl-1">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-all hover:pl-1">
                  Shop Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-all hover:pl-1">
                  About Our Story
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-all hover:pl-1">
                  Lifestyle Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-all hover:pl-1">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections */}
          <div className="flex flex-col">
            <h3 className="font-display font-semibold text-white mb-6 pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-9 after:height-[2px] after:bg-primary">
              Collections
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/shop" className="hover:text-white transition-all hover:pl-1">
                  Cat Furniture
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-all hover:pl-1">
                  Dog Beds & Sofas
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-all hover:pl-1">
                  Premium Accessories
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-all hover:pl-1">
                  Elegant Storage
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display font-semibold text-white mb-2 pb-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-9 after:height-[2px] after:bg-primary">
              Contact Us
            </h3>
            <div className="flex gap-3 text-sm items-start">
              <Phone className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <span>02-123-4567<br />089-876-5432</span>
            </div>
            <div className="flex gap-3 text-sm items-center">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
              <span>support@pawfectfurniture.com</span>
            </div>
            <div className="flex gap-3 text-sm items-start">
              <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <span>456 ถ.ประดิษฐ์มนูธรรม ลาดพร้าว กรุงเทพฯ 10230</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#FAF8F5]/8 pt-8 text-center text-xs text-[#FAF8F5]/40 font-medium">
          <p>&copy; 2026 Pawfect Pet Furniture Co., Ltd. สงวนลิขสิทธิ์ทั้งหมด. พัฒนาขึ้นระดับพรีเมียมเพื่อเพื่อนรักสี่ขาของคุณ</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

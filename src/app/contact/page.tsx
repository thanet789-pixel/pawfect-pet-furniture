"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { saveInquiry } from "../../lib/db";
import { useToast } from "../../context/ToastContext";

export default function ContactPage() {
  const { showToast } = useToast();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveInquiry({
        name,
        email,
        phone: phone || undefined,
        message,
      });

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      showToast("ส่งข้อความสำเร็จแล้ว! เจ้าหน้าที่ของเราจะติดต่อกลับภายใน 24 ชม.", "success");
    } catch (error) {
      console.error(error);
      showToast("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหมี่หลัง", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
      {/* Header */}
      <div className="text-center flex flex-col gap-3 mb-16">
        <span className="text-xs font-bold text-primary tracking-wider uppercase">ติดต่อเรา</span>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-text-main">Get In Touch</h1>
        <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
          ต้องการสอบถามข้อมูล หรือสั่งทำเฟอร์นิเจอร์สัตว์เลี้ยงขนาดพิเศษ? ทิ้งข้อความหาพวกเราได้เลย
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form Card */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-[#E3D9CE]/30 shadow-sm">
          <h3 className="font-display font-bold text-base text-text-main mb-6">
            ส่งข้อความสอบถาม
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-bold text-text-main uppercase mb-2">
                  ชื่อของคุณ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E3D9CE] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-text-main"
                  placeholder="ชื่อ-นามสกุล"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-bold text-text-main uppercase mb-2">
                  อีเมลติดต่อ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E3D9CE] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-text-main"
                  placeholder="name@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-phone" className="block text-xs font-bold text-text-main uppercase mb-2">
                เบอร์โทรศัพท์ (ถ้ามี)
              </label>
              <input
                type="tel"
                id="contact-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E3D9CE] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-text-main"
                placeholder="08XXXXXXXX"
              />
            </div>
            <div>
              <label htmlFor="contact-msg" className="block text-xs font-bold text-text-main uppercase mb-2">
                รายละเอียดข้อความ <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="contact-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E3D9CE] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-text-main min-h-[120px] resize-y"
                placeholder="พิมพ์ข้อความของคุณที่นี่..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3.5 px-6 rounded-full font-display font-semibold text-sm shadow-md hover:bg-primary-hover active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "กำลังส่งข้อความ..."
              ) : (
                <>
                  <Send className="w-4 h-4" /> ส่งข้อความติดต่อ
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info Cards list */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-white p-6 rounded-xl border border-[#E3D9CE]/30 shadow-sm flex gap-4 items-start">
            <div className="bg-primary-light text-primary w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <h4 className="font-semibold text-sm text-text-main">ที่ตั้งโชว์รูม</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                456 ถนนประดิษฐ์มนูธรรม แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพมหานคร 10230
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E3D9CE]/30 shadow-sm flex gap-4 items-start">
            <div className="bg-primary-light text-primary w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <h4 className="font-semibold text-sm text-text-main">เบอร์โทรศัพท์</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                02-123-4567, 089-876-5432
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E3D9CE]/30 shadow-sm flex gap-4 items-start">
            <div className="bg-primary-light text-primary w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <h4 className="font-semibold text-sm text-text-main">อีเมล</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                support@pawfectfurniture.com
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E3D9CE]/30 shadow-sm flex gap-4 items-start">
            <div className="bg-primary-light text-primary w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <h4 className="font-semibold text-sm text-text-main">เวลาทำการ</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                เปิดให้บริการทุกวัน: 10:00 น. - 19:00 น. (หยุดวันนักขัตฤกษ์)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

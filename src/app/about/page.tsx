import React from "react";
import { Star, ShieldCheck, Heart, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 flex flex-col gap-16">
      {/* Header */}
      <div className="text-center flex flex-col gap-3">
        <span className="text-xs font-bold text-primary tracking-wider uppercase">เกี่ยวกับเรา</span>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-text-main">Our Story & Craftsmanship</h1>
      </div>

      {/* Main Story Layout */}
      <div className="max-w-3xl mx-auto flex flex-col gap-8 text-[#33251A]/80 leading-relaxed text-sm sm:text-base">
        <img
          src="assets/about_pets.png"
          alt="Pets on Bed"
          className="w-full h-[280px] sm:h-[380px] object-cover rounded-2xl shadow-md border border-[#E3D9CE]/30"
        />

        <p>
          เริ่มต้นจากความรักที่ต้องการมอบสิ่งที่ดีที่สุดให้แก่สัตว์เลี้ยงภายในบ้าน <strong>Pawfect</strong> ก่อตั้งขึ้นเพื่อแก้ปัญหารูปลักษณ์ของกรงและอุปกรณ์สัตว์เลี้ยงแบบเดิมๆ ที่มักจะไม่เข้ากับการแต่งบ้านอันแสนอบอุ่นของคุณ เราจึงรวมทีมระหว่างมัณฑนากรภายในและผู้เชี่ยวชาญด้านพฤติกรรมสัตว์เลี้ยง เพื่อร่วมกันออกแบบเฟอร์นิเจอร์ที่ดีต่อตัวของสัตว์เลี้ยง และกลมกลืนไปกับเฟอร์นิเจอร์หลักของบ้านคุณอย่างลงตัวที่สุด
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#F0EBE3] border border-[#E3D9CE]/30 p-8 rounded-2xl text-center my-6">
          <div className="flex flex-col gap-1">
            <h4 className="font-display font-bold text-3xl text-primary">100%</h4>
            <p className="text-[11px] text-text-main font-bold">ไม้แท้จากป่าปลูกยั่งยืน</p>
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="font-display font-bold text-3xl text-primary">Zero</h4>
            <p className="text-[11px] text-text-main font-bold">สารเคมีและสี VOCs</p>
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="font-display font-bold text-3xl text-primary">5,000+</h4>
            <p className="text-[11px] text-text-main font-bold">ส่งมอบสินค้าให้แก่ครอบครัว</p>
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="font-display font-bold text-3xl text-primary">100%</h4>
            <p className="text-[11px] text-text-main font-bold">ผ่านพฤติกรรมการทดสอบ</p>
          </div>
        </div>

        <h3 className="font-display font-bold text-lg text-text-main mt-4">
          การเลือกใช้วัสดุและแนวคิดความปลอดภัย
        </h3>
        <p>
          เฟอร์นิเจอร์ทุกชิ้นของเราผลิตจากไม้โอ๊ค ไม้บีช และไม้เบิร์ชแท้เกรดพรีเมียมที่ผ่านการคัดสรรและอบเพื่อป้องกันความชื้นและปลวก ปลอกหมอนและที่นอนหุ้มด้วยผ้าแคนวาสและฝ้ายธรรมชาติ 100% ที่ทนต่อรอยขีดข่วนของเล็บสัตว์เลี้ยง มีความหนานุ่ม ระบายอากาศได้ยอดเยี่ยม และที่สำคัญที่สุดคือกระบวนการทำสีของเราใช้น้ำมันเคลือบไม้ธรรมชาติปราศจากฟอร์มาลดีไฮด์และโลหะหนัก ทำให้ปลอดภัยแม้สัตว์เลี้ยงจะเผลอแทะเลีย
        </p>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 border border-[#E3D9CE]/30 rounded-xl flex gap-4">
            <div className="bg-primary-light text-primary w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-text-main mb-1">ความสวยงามเหนือกาลเวลา</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                ดีไซน์ที่เน้นความเป็นธรรมชาติ ความอบอุ่นในแบบมินิมอล ช่วยส่งเสริมภาพลักษณ์ความสวยงามให้แก่บ้านของคุณ
              </p>
            </div>
          </div>

          <div className="bg-white p-6 border border-[#E3D9CE]/30 rounded-xl flex gap-4">
            <div className="bg-primary-light text-primary w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-text-main mb-1">ความปลอดภัยขั้นสุด</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                การเก็บงานที่ละเอียด ลบเหลี่ยมมุมทุกส่วน ปราศจากเสี้ยนไม้ สลักน็อตที่ซ่อนมิดชิด มั่นใจในทุกการเล่นของสัตว์เลี้ยง
              </p>
            </div>
          </div>

          <div className="bg-white p-6 border border-[#E3D9CE]/30 rounded-xl flex gap-4">
            <div className="bg-primary-light text-primary w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-text-main mb-1">ออกแบบตามหลักการศาสตร์สัตว์เลี้ยง</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                การคำนวณสัดส่วน ความสูงความเอียงของอุโมงค์หรือชามข้าวเพื่อให้รองรับการขยับและสุขภาพสรีระในระยะยาว
              </p>
            </div>
          </div>

          <div className="bg-white p-6 border border-[#E3D9CE]/30 rounded-xl flex gap-4">
            <div className="bg-primary-light text-primary w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-text-main mb-1">บริการช่วยเหลือและแนะน้ำใกล้ชิด</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                ไม่แน่ใจเรื่องการเลือกใช้ขนาด? เจ้าหน้าที่ของเราพร้อมวิเคราะห์พฤติกรรมสัตว์เลี้ยงและสเปซบ้านเพื่อให้ได้ชิ้นงานที่ลงตัวที่สุด
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { db, isFirebaseConfigured } from "./firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  runTransaction
} from "firebase/firestore";
import { Product, Category, Order, Inquiry } from "../types";

// --- SEED DATA ---
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-furniture', name: 'Cat Furniture', nameTh: 'เฟอร์นิเจอร์แมว', image: 'assets/cat_furniture.png' },
  { id: 'dog-furniture', name: 'Dog Furniture', nameTh: 'เฟอร์นิเจอร์สุนัข', image: 'assets/dog_furniture.png' },
  { id: 'pet-accessories', name: 'Pet Accessories', nameTh: 'อุปกรณ์สัตว์เลี้ยง', image: 'assets/pet_accessories.png' },
  { id: 'storage-cabinet', name: 'Storage & More', nameTh: 'ตู้เก็บของและอื่นๆ', image: 'assets/storage_cabinet.png' }
];

const CURRENT_DB_VERSION = "3";

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Majestic Oak Cat Tree',
    nameTh: 'คอนโดแมวไม้โอ๊คพรีเมียม',
    category: 'cat-furniture',
    price: 3490,
    description: 'คอนโดแมวไม้โอ๊คแท้ แข็งแรงทนทาน ทนรอยขีดข่วน พร้อมเสาลับเล็บเชือกป่านธรรมชาติ และช่องนอนอุโมงค์สำหรับแมวทุกขนาดตัว เหมาะเป็นพื้นที่ส่วนตัวที่ให้น้องแมวได้ทั้งปีนป่าย ลับเล็บ และนอนพักผ่อนอย่างปลอดภัย ช่วยลดความเครียดและพฤติกรรมก้าวร้าวของสัตว์เลี้ยงได้อย่างดีเยี่ยม ดีไซน์หรูหราทันสมัยเข้ากับบ้านทุกสไตล์',
    image: 'assets/cat_furniture.png',
    stock: 5,
    featured: true,
    images: ['assets/cat_furniture.png', 'assets/hero_cat.png', 'assets/about_pets.png', 'assets/pet_accessories.png', 'assets/storage_cabinet.png'],
    materials: 'ไม้โอ๊คแท้ 100%, เสาลับเล็บพันด้วยเชือกป่านธรรมชาติเกรดหนาพิเศษ, เบาะบุผ้าคอตตอนลินินเกรดพรีเมียมถอดซักได้',
    dimensions: 'กว้าง 60 ซม. x ลึก 50 ซม. x สูง 145 ซม.',
    weightLimit: 'เหมาะสำหรับแมว 1-3 ตัว น้ำหนักรวมไม่เกิน 25 กิโลกรัม',
    features: [
      'โครงสร้างฐานกว้างและหนาพิเศษ มั่นคง แข็งแรง ป้องกันการสั่นไหวและล้มคว่ำได้อย่างปลอดภัยสูงสุด แม้น้องแมวกระโดดด้วยความเร็ว',
      'เสาลับเล็บยาวพิเศษ พันด้วยเชือกป่านธรรมชาติเกรดส่งออกหนาและแน่น ทนทานต่อแรงข่วนอย่างหนักหน่วง ไม่เปื่อยยุ่ยง่าย',
      'เบาะรองนอนหนานุ่มพิเศษ ระบายอากาศได้ดีเยี่ยม ไม่สะสมความร้อนหรือไรฝุ่น สามารถถอดกระดุมแป๊กออกเพื่อนำไปซักทำความสะอาดง่าย',
      'ช่องอุโมงค์รูปแมวดีไซน์มินิมอลน่ารัก ออกแบบให้มีความเป็นส่วนตัว อบอุ่น และปลอดภัยสูงสุดสำหรับช่วงเวลาพักผ่อนของน้องๆ'
    ],
    careInstructions: 'หลีกเลี่ยงการจัดวางในบริเวณที่มีแสงแดดจัดและพื้นที่ที่มีความชื้นสูง หรือบริเวณที่มีน้ำสาดถึง, ใช้ไม้ขนไก่ปัดฝุ่นออกได้สะดวก หรือใช้ผ้าไมโครไฟเบอร์บิดหมาดเช็ดทำความสะอาดเนื้อไม้ ส่วนเบาะผ้าสามารถถอดกระดุมแป๊กออกเพื่อนำไปซักเครื่องได้ด้วยโหมดถนอมผ้า',
    warrantyInfo: 'รับประกันโครงสร้างไม้แท้และชิ้นส่วนยึดติดนาน 1 ปีเต็ม (ไม่ครอบคลุมความเสียหายจากการใช้งานผิดประเภท เช่น การปีนป่ายของบุคคล หรือคราบเปื้อนจากการขับถ่ายของสัตว์เลี้ยง)',
    packageIncludes: 'ชิ้นส่วนไม้คอนโดแมว 1 ชุด, เสาลับเล็บเชือกป่าน, เบาะรองนอนผ้าลินินคอตตอน 3 ชิ้น, ชุดน็อตสกรูและเครื่องมือประกอบเหล็ก L-Key 1 ชุด, คู่มือขั้นตอนการประกอบติดตั้งอย่างละเอียดภาษาไทย'
  },
  {
    id: 'prod-2',
    name: 'Royal Cozy Dog Sofa',
    nameTh: 'โซฟาที่นอนสุนัขไม้พรีเมียม',
    category: 'dog-furniture',
    price: 2890,
    description: 'เตียงโซฟาสุนัขทำจากไม้เนื้อแข็งคุณภาพสูง แข็งแรงทนทาน ออกแบบตามหลักสรีรศาสตร์ของสัตว์เลี้ยง เบาะรองนอนทำจากใยฝ้ายธรรมชาติหนานุ่ม คืนตัวได้ง่าย ไม่ยุบตัวเมื่อใช้งานระยะยาว มอบสัมผัสอบอุ่นและนุ่มนวล ช่วยป้องกันปัญหาโรคข้อสะโพกเสื่อมในสุนัขพันธุ์เล็กและพันธุ์กลางได้อย่างมีประสิทธิภาพ ดีไซน์เรียบหรูสไตล์ Japandi ยกระดับความพรีเมียมให้ห้องนั่งเล่นของคุณ',
    image: 'assets/dog_furniture.png',
    stock: 8,
    featured: true,
    images: ['assets/dog_furniture.png', 'assets/about_pets.png', 'assets/storage_cabinet.png', 'assets/pet_accessories.png', 'assets/cat_furniture.png'],
    materials: 'โครงไม้เนื้อแข็งคัดเกรดทำสีโอ๊คธรรมชาติ, เบาะรองนอนผ้าโพลีเอสเตอร์ทอพิเศษกันน้ำกระเซ็นและกันไรฝุ่น บุด้านในด้วยใยสังเคราะห์ 3D คืนตัวง่าย',
    dimensions: 'กว้าง 85 ซม. x ลึก 60 ซม. x สูง 30 ซม. (ความสูงเบาะจากพื้น 12 ซม.)',
    weightLimit: 'เหมาะสำหรับสุนัขพันธุ์เล็กถึงพันธุ์กลาง น้ำหนักไม่เกิน 18 กิโลกรัม',
    features: [
      'โครงสร้างเตียงยกสูงจากพื้น ช่วยป้องกันความชื้นสะสมและฝุ่นละอองที่เป็นตัวก่อโรคผิวหนังในสัตว์เลี้ยง',
      'เบาะรองนอนหนานุ่มพิเศษพร้อมขอบกั้นรอบตัวสามด้าน ออกแบบเป็นหมอนรองคอและพิงหลังได้อย่างสะดวกสบายลดอาการเกร็งข้อต่อ',
      'ผ้าคลุมเบาะมีซิปถอดออกซักเครื่องได้ มีคุณสมบัติสะท้อนน้ำและทนทานต่อการขีดข่วนของเล็บน้องหมา',
      'ฐานเตียงด้านล่างมียางรองกันลื่นพรีเมียม ช่วยยึดเกาะพื้นเตียงไม่ให้เลื่อนขยับเมื่อสุนัขกระโดดขึ้นลงอย่างแรง'
    ],
    careInstructions: 'โครงไม้เนื้อแข็งให้เช็ดฝุ่นด้วยผ้าแห้งสะอาด หลีกเลี่ยงความชื้นสะสมและน้ำยาเช็ดทำความสะอาดที่มีฤทธิ์เป็นกรดเข้มข้น, ตัวเบาะผ้าถอดซิปซักเครื่องได้ตามปกติ แนะนำให้ตากในที่ร่มมีลมโกรกเพื่อยืดอายุการใช้งานของใยสังเคราะห์ 3D และป้องกันผ้าหดตัว',
    warrantyInfo: 'รับประกันโครงสร้างเตียงไม้และโครงสร้างประกอบทั่วไปเป็นเวลา 1 ปีเต็มจากปัญหาไม้แตกหรือกาวร่อนอันเนื่องมาจากการผลิตปกติ',
    packageIncludes: 'โครงไม้โซฟาหรูหราประกอบสำเร็จ 1 ชุด, เบาะรองนอนหนานุ่มกันไรฝุ่น 1 ชิ้น, ปลอกเบาะชนิดถอดซักได้ 1 ผืน, ยางรองกันลื่นใต้ฐานเตียง 4 ชิ้น, คู่มือการดูแลรักษาและทำความสะอาด'
  },
  {
    id: 'prod-3',
    name: 'Triangle Eco Pet Tipi',
    nameTh: 'บ้านสัตว์เลี้ยงทรงสามเหลี่ยมมินิมอล',
    category: 'pet-accessories',
    price: 1890,
    description: 'บ้านสัตว์เลี้ยงไม้สไตล์เต็นท์ทีปี (Tipi) สามเหลี่ยมมินิมอล ออกแบบมุมเปิดโล่งให้เข้าออกสบาย อากาศถ่ายเทได้ดี ไม่สะสมกลิ่นอับ มอบความเป็นส่วนตัวและสร้างพื้นที่ปลอดภัยทางจิตใจให้สุนัขและแมวของคุณ เหมาะสำหรับมุมผ่อนคลายส่วนตัวที่ทำให้สัตว์เลี้ยงรู้สึกอบอุ่น สวยงามกลมกลืนเป็นส่วนหนึ่งของเฟอร์นิเจอร์แต่งบ้านชิ้นโปรด',
    image: 'assets/pet_accessories.png',
    stock: 12,
    featured: true,
    images: ['assets/pet_accessories.png', 'assets/about_pets.png', 'assets/cat_furniture.png', 'assets/dog_furniture.png', 'assets/storage_cabinet.png'],
    materials: 'ไม้เบิร์ชพลายวูดนำเข้าขัดเรียบเคลือบแล็กเกอร์สูตรน้ำไร้สารพิษ, ผ้าครอบเต็นท์แคนวาสธรรมชาติ 100% เนื้อหนาทนทาน, เบาะนอนบุด้านในหนานุ่มพิเศษ',
    dimensions: 'กว้าง 55 ซม. x ลึก 55 ซม. x สูง 62 ซม.',
    weightLimit: 'เหมาะสำหรับสุนัขพันธุ์เล็ก แมว หรือกระต่าย น้ำหนักไม่เกิน 10 กิโลกรัม',
    features: [
      'ดีไซน์ทรงอินเดียนแดง (Tipi) เรียบง่ายหรูหราสไตล์สแกนดิเนเวียน เข้ากับเฟอร์นิเจอร์แต่งบ้านสไตล์ Japandi หรือมินิมอลได้อย่างลงตัว',
      'ประกอบและจัดเก็บง่ายอย่างเหลือเชื่อ สามารถถอดชิ้นส่วนไม้และผ้าพับเก็บได้แบนราบ ประหยัดพื้นที่จัดเก็บและพกพาสะดวก',
      'เบาะนอนด้านในบุกว้างขวางอัดใยสังเคราะห์หนาสองชั้น นุ่มสบาย นอนหลับได้ยาวนานตื่นขึ้นมาด้วยความสดชื่น',
      'ช่องหน้าต่างด้านข้างทรงกลม ช่วยให้อากาศระบายถ่ายเทสะดวก สัตว์เลี้ยงไม่อึดอัด และเจ้าของสามารถแอบมองน้องๆ พักผ่อนได้'
    ],
    careInstructions: 'ใช้ไม้ขนไก่หรือเครื่องดูดฝุ่นขนาดเล็กปัดทำความสะอาดฝุ่นเกาะชิ้นส่วนไม้เป็นประจำ, ผ้าครอบเต็นท์แคนวาสสามารถถอดซักมือหรือซักเครื่องได้ด้วยน้ำเย็นในโหมดถนอมผ้า ไม่ควรปั่นแห้งด้วยความร้อนสูงเพื่อรักษาทรงผ้าแคนวาสให้ตึงสวยงาม',
    warrantyInfo: 'รับประกันการเสียหายชิ้นส่วนแตกหักหรือชำรุดจากการขนส่งภายใน 15 วันแรก เปลี่ยนชิ้นส่วนใหม่ให้ฟรีทันทีโดยไม่มีค่าจัดส่งเพิ่มเติม',
    packageIncludes: 'แผ่นโครงไม้เบิร์ชพลายวูดขัดเรียบ 4 แผ่น, ผ้าแคนวาสครอบเต็นท์ 1 ผืน, เบาะนอนหนานุ่มสองด้าน 1 ชิ้น, เชือกถักสำหรับยึดโครงเต็นท์ 1 เส้น, คู่มือการประกอบด่วนใน 5 นาที'
  },
  {
    id: 'prod-4',
    name: 'Integrated Pet Buffet Cabinet',
    nameTh: 'ตู้ให้อาหารและเก็บของอเนกประสงค์',
    category: 'storage-cabinet',
    price: 4590,
    description: 'ตู้ไม้สไตล์โมเดิร์นที่ออกแบบฟังก์ชันอย่างชาญฉลาด ด้านล่างเป็นลิ้นชักซ่อนชามอาหารคู่สแตนเลสสตีลเกรดพรีเมียมที่สามารถเลื่อนเก็บได้เมื่อไม่ใช้งาน ป้องกันสิ่งสกปรกและลดความเสี่ยงที่น้องๆ จะเตะชามคว่ำ ด้านบนมีพื้นที่เก็บของกว้างขวางสำหรับถุงอาหารสัตว์เลี้ยง ขนม และของเล่น ปิดมิดชิดสะอาดสะอ้าน ช่วยจัดระเบียบบ้านให้เป็นระเบียบสวยงามไร้กลิ่นรบกวน',
    image: 'assets/storage_cabinet.png',
    stock: 3,
    featured: true,
    images: ['assets/storage_cabinet.png', 'assets/pet_accessories.png', 'assets/dog_furniture.png', 'assets/about_pets.png', 'assets/cat_furniture.png'],
    materials: 'ไม้ MDF เกรด E1 มาตรฐานสิ่งแวดล้อมสากล ปราศจากสารเคมีอันตรายและสารฟอร์มาลดีไฮด์, ชามอาหารสแตนเลสสตีล 304 ทนต่อกรดด่างและกันสนิม 100%',
    dimensions: 'กว้าง 65 ซม. x ลึก 40 ซม. x สูง 82 ซม.',
    weightLimit: 'ชั้นวางของด้านบนรองรับได้ 25 กก. ลิ้นชักชามอาหารรองรับน้ำหนักกดกดได้ 15 กิโลกรัม',
    features: [
      'ลิ้นชักระบบเปิดปิดแบบซ่อนชามอาหารคู่ ป้องกันฝุ่นละออง สิ่งสกปรก และช่วยประหยัดพื้นที่ใช้สอยในบ้านอย่างมากหลังมื้ออาหาร',
      'ตู้บานเปิดด้านบนมีชั้นวางของที่ปรับระดับความสูงได้ 3 ระดับ สะดวกสำหรับจัดเก็บกล่องอาหาร ขวดยา หรือแกลลอนน้ำดื่ม',
      'ราวแขวนโลหะด้านข้างตู้ พร้อมตะขอสำหรับแขวนปลอกคอ สายจูง หรือแปรงหวีขน สะดวกต่อการจัดเก็บและหยิบใช้งานรวดเร็ว',
      'ผิวตู้เคลือบเมลามีนกันน้ำและความร้อน เช็ดคราบน้ำลายหรือเศษอาหารที่เปรอะเปื้อนออกได้สะดวกรวดเร็วด้วยผ้าหมาด'
    ],
    careInstructions: 'บอดี้ตู้เคลือบผิวเมลามีนสามารถใช้ผ้าชุบน้ำบิดหมาดเช็ดทำความสะอาด แล้วเช็ดตามด้วยผ้าแห้งทันที ห้ามปล่อยให้น้ำขังตามรอยต่อไม้, ส่วนชามสแตนเลสถอดล้างด้วยน้ำยาล้างจานและฟองน้ำนุ่มๆ ห้ามใช้ฝอยขัดโลหะเพื่อป้องกันรอยขูดขีด',
    warrantyInfo: 'รับประกันอุปกรณ์รางเลื่อนลิ้นชัก บานพับตู้ และปุ่มล็อกแม่เหล็กเป็นเวลา 1 ปีเต็ม เปลี่ยนชิ้นส่วนอะไหล่ฟรีไม่มีค่าใช้จ่าย',
    packageIncludes: 'โครงตู้เก็บของ MDF ประกอบสำเร็จ 1 ตู้, ลิ้นชักรางสไลด์ 1 ชุด, ชามสแตนเลสสตีล 304 เกรดอาหาร 2 ใบ, ตะขอแขวนโลหะด้านข้าง 2 ชิ้น, อุปกรณ์ยึดป้องกันตู้ล้มยึดกำแพง 1 ชุด, คู่มือคำแนะนำการใช้งานและการดูแลรักษา'
  },
  {
    id: 'prod-5',
    name: 'Cloud Nine Hanging Cat Bed',
    nameTh: 'เปลแมวติดกระจกชมวิว',
    category: 'cat-furniture',
    price: 1290,
    description: 'เปลนอนน้องแมวยึดกระจกดีไซน์มินิมอลลอยฟ้า โครงสร้างเหล็กแข็งแรงหุ้มด้วยไม้เบิร์ชขัดเรียบมนสวยงาม ออกแบบมาเพื่อตอบสนองสัญชาตญาณตามธรรมชาติของน้องแมวที่ชอบที่สูงและการนอนอาบแดดชมวิวริมหน้าต่าง ติดตั้งแน่นหนาด้วยตัวดูดสูญญากาศเกรดอุตสาหกรรม มั่นใจในความแข็งแรงปลอดภัย ให้ชั่วโมงนอนของน้องแมวผ่อนคลายเหมือนลอยอยู่บนก้อนเมฆ',
    image: 'assets/hero_cat.png',
    stock: 15,
    featured: false,
    images: ['assets/hero_cat.png', 'assets/cat_furniture.png', 'assets/about_pets.png', 'assets/pet_accessories.png', 'assets/storage_cabinet.png'],
    materials: 'ไม้เบิร์ชธรรมชาติคัดเกรดขัดผิวละเอียด, จุกยึดสูญญากาศแรงดึงสูงพิเศษเกรดอุตสาหกรรม (Industrial Suction Cups), ผ้าตาข่ายไนลอนทอเหนียวพิเศษระบายอากาศดีและไม่สะสมไรฝุ่น',
    dimensions: 'กว้าง 52 ซม. x ลึก 35 ซม. x สูง 15 ซม.',
    weightLimit: 'รองรับน้ำหนักตัวน้องแมวได้สูงสุดถึง 15 กิโลกรัม ได้อย่างมั่นคงไร้กังวล',
    features: [
      'ระบบยึดกระจกด้วยจุกสูญญากาศอุตสาหกรรมขนาดใหญ่ 4 จุด มีแรงยึดเกาะแน่นหนาสูงมาก ป้องกันเปลร่วงหล่นได้อย่างสมบูรณ์แบบ',
      'ขอบโครงไม้ขัดโค้งมนอย่างประณีต ไร้เสี้ยนไม้ ปลอดภัยไม่ทำร้ายอวัยวะหรือผิวหนังของน้องแมวขณะกระโดดขึ้นลงเปลนอน',
      'ผ้านอนวัสดุตาข่ายไนลอนทอแน่นพิเศษช่วยระบายความร้อนได้ดี ไม่อับชื้น ป้องกันแบคทีเรีย ไม่ติดขน และถอดทำความสะอาดง่าย',
      'ติดตั้งง่ายดายภายในเวลาไม่เกิน 2 นาทีบนกระจกหน้าต่างเรียบใส โดยไม่ต้องใช้อุปกรณ์เจาะผนังหรือเครื่องมือช่างใดๆ'
    ],
    careInstructions: 'เช็ดทำความสะอาดกระจกหน้าต่างให้ปราศจากคราบมัน คราบสบู่ และฝุ่นละอองก่อนการติดตั้งจุกสูญญากาศ, ตัวจุกยางควรทำความสะอาดด้วยน้ำอุ่นบิดหมาดเพื่อรักษาความเหนียวยืดหยุ่น, ตัวผ้านอนสามารถถอดไปซักด้วยน้ำสบู่อ่อนๆ และตากแดดให้แห้งสนิท',
    warrantyInfo: 'รับประกันความชำรุดเสียหายของโครงสร้างและคุณภาพของจุกสูญญากาศสูญหายจากการขนส่งหรือชำรุดจากการใช้งานปกติเป็นเวลา 6 เดือนเต็ม',
    packageIncludes: 'โครงเปลไม้เบิร์ชพรีเมียมพร้อมโครงเหล็กยึด 1 ชุด, จุกดูดสูญญากาศแรงดึงสูงพิเศษ 4 ชิ้น, ผ้านอนตาข่ายไนลอนระบายอากาศ 1 ผืน, คู่มือข้อควรระวังการใช้งานและการติดตั้งกระจกหน้าต่าง'
  },
  {
    id: 'prod-6',
    name: 'Scandinavian Wooden Dog Bed',
    nameTh: 'เตียงสุนัขไม้สไตล์สแกนดิเนเวียน',
    category: 'dog-furniture',
    price: 3200,
    description: 'เตียงนอนสุนัขพรีเมียมสไตล์สแกนดิเนเวียน โครงเตียงทำจากไม้เบิร์ชแท้ขัดเรียบ ยกระดับความสูงจากพื้นเพื่อป้องกันความชื้นและฝุ่นละอองสะสมใต้เตียง มาพร้อมเบาะรองนอนโฟมเมมโมรี่โฟม Orthopedic บรรเทาแรงกดทับของกล้ามเนื้อและข้อต่อต่างๆ ช่วยให้สัตว์เลี้ยงนอนหลับลึกและผ่อนคลายเต็มอิ่ม เหมาะสำหรับน้องหมาน้องแมวพันธุ์เล็กถึงปานกลาง ดีไซน์มินิมอลสวยงามเรียบร้อยยกระดับให้ห้องนอนของคุณดูอบอุ่นเป็นธรรมชาติ',
    image: 'assets/about_pets.png',
    stock: 6,
    featured: false,
    images: ['assets/about_pets.png', 'assets/dog_furniture.png', 'assets/storage_cabinet.png', 'assets/pet_accessories.png', 'assets/cat_furniture.png'],
    materials: 'ไม้เบิร์ชพรีเมียมนำเข้าทำสีธรรมชาติ, เบาะรองนอนออร์โธพีดิกส์โฟม (Orthopedic Memory Foam) แท้หนา 5 ซม., ปลอกผ้าฝ้ายทอพิเศษระบายอากาศชนิดมีซิปรูดรอบด้าน',
    dimensions: 'กว้าง 75 ซม. x ลึก 55 ซม. x สูง 22 ซม. (ขอบเตียงสูง 10 ซม.)',
    weightLimit: 'เหมาะสำหรับสุนัขพันธุ์เล็กหรือแมวที่มีน้ำหนักรวมไม่เกิน 15 กิโลกรัม',
    features: [
      'เบาะเมมโมรี่โฟม Orthopedic เกรดพรีเมียม ช่วยกระจายน้ำหนักตัวของสุนัขอย่างสม่ำเสมอ บรรเทาอาการเจ็บข้อกระดูกสะโพกของสัตว์เลี้ยง',
      'ดีไซน์แบบขาเตียงเอียงสไตล์ Scandinavian เรียบง่าย สวยเนี๊ยบ ไร้ขอบแหลมคม ปลอดภัยจากการชนกระแทกขณะวิ่งเล่นของสัตว์เลี้ยง',
      'โครงสร้างเตียงยกระดับช่วยรักษาการหมุนเวียนอากาศใต้ที่นอน ทำให้อุณหภูมิการนอนอบอุ่นกำลังดีและไม่อับชื้นจากความเย็นของพื้นคอนกรีต',
      'ปลอกผ้าคลุมเตียงบุชั้นกันซึม มีซิปเปิดถอดออกซักเครื่องได้ง่าย แห้งเร็ว ป้องกันน้ำและคราบสิ่งสกปรกซึมลึกถึงตัวเมมโมรี่โฟม'
    ],
    careInstructions: 'หลีกเลี่ยงความชื้นและการสัมผัสกับน้ำโดยตรงบริเวณโครงไม้, ปลอกผ้าฝ้ายสามารถถอดซิปออกซักเครื่องได้ด้วยน้ำยาซักผ้าสูตรอ่อนโยนและปั่นแห้งปกติ, ตัวเบาะเมมโมรี่โฟมด้านในห้ามนำไปซักเครื่องหรือโดนน้ำเด็ดขาด ให้ใช้วิธีผึ่งลมในที่ร่มห่างจากแดดจัดเพื่อคงคุณภาพเนื้อโฟม',
    warrantyInfo: 'รับประกันการยุบตัวถาวรของวัสดุเมมโมรี่โฟมเกิน 2 ซม. จากการใช้งานนอนปกติเป็นเวลา 1 ปีเต็ม เปลี่ยนชิ้นส่วนโฟมชิ้นใหม่ให้ฟรีทันที',
    packageIncludes: 'โครงเตียงไม้เบิร์ชธรรมชาติประกอบสำเร็จ 1 ชุด, ขาเตียงเอียงไม้แท้ 4 ชิ้น, ที่นอนเมมโมรี่โฟม Orthopedic 1 ชิ้น, ปลอกเตียงผ้าฝ้ายระบายอากาศแบบมีซิป 1 ผืน, คู่มือแนะนำการประกอบและการใช้งาน'
  },
  {
    id: 'prod-7',
    name: 'Premium Ceramic Elevated Feeder',
    nameTh: 'ชามข้าวเซรามิกคู่ฐานไม้ปรับเอียง',
    category: 'pet-accessories',
    price: 790,
    description: 'ชุดชามอาหารคู่พรีเมียมเซรามิกพอร์ซเลน วางบนฐานรองไม้ไผ่ธรรมชาติขัดเนียนสวยงาม ตัวฐานออกแบบให้สามารถปรับระดับองศาเอียงได้ 15 องศา เพื่อให้อยู่ในมุมรับประทานอาหารที่เหมาะสมที่สุด ช่วยป้องกันกระดูกสันหลังส่วนคอของสุนัขและแมวขณะก้มทานอาหาร ป้องกันการสำลักและช่วยเพิ่มประสิทธิภาพในการย่อยอาหารของสัตว์เลี้ยงได้อย่างดีเยี่ยม ดีไซน์กะทัดรัด น่ารัก สะอาดตาเช็ดทำความสะอาดง่าย',
    image: 'assets/pet_accessories.png',
    stock: 20,
    featured: false,
    images: ['assets/pet_accessories.png', 'assets/storage_cabinet.png', 'assets/about_pets.png', 'assets/cat_furniture.png', 'assets/dog_furniture.png'],
    materials: 'ไม้ไผ่ธรรมชาติผ่านการอบแห้งและเคลือบสารกันเชื้อรากันชื้น, ตัวชามทำจากเซรามิกพอร์ซเลนเกรดอาหารหนาพิเศษ (Food-Grade Glossy Ceramic), ฐานมียางรองกันลื่นพรีเมียม',
    dimensions: 'กว้าง 36 ซม. x ลึก 18 ซม. x สูง 15 ซม. (ปรับระดับความสูงได้ 3 ระดับ)',
    weightLimit: 'ชามเซรามิกความจุ 400 มล. ต่อชาม เหมาะสำหรับเก็บอาหารและน้ำ',
    features: [
      'ออกแบบปรับระดับความสูงและเอียง 15 องศา ช่วยลดการก้มตัวและลดภาระสะสมที่แนวกระดูกสันหลังคอและหน้าท้องของน้องๆ ขณะทานอาหาร',
      'ฐานผลิตจากไม้ไผ่หนาธรรมชาติ ผ่านกระบวนการอบร้อนเคลือบผิวกันเชื้อราและความชื้น ไม่ขึ้นราง่าย แข็งแรงทนทานต่อการชนกระแทก',
      'ชามเซรามิกเกรดสัมผัสอาหารโดยตรง สามารถนำเข้าไมโครเวฟเพื่ออุ่นอาหาร หรือนำเข้าเครื่องล้างจานได้ ปราศจากสารตะกั่วและโลหะหนัก',
      'มีจุกยางกันลื่นติดตั้งไว้ใต้ฐานไม้ ช่วยยึดเกาะพื้นห้องแน่นหนา ป้องกันชามอาหารเลื่อนขยับหรือคว่ำหกกระจายขณะสัตว์เลี้ยงกินอาหาร'
    ],
    careInstructions: 'ฐานไม้ไผ่ธรรมชาติเคลือบสารกันชื้นให้เช็ดทำความสะอาดด้วยผ้าชุบน้ำหมาดๆ และผึ่งแห้งในที่ร่ม ห้ามแช่น้ำทิ้งไว้, ชามเซรามิกสามารถล้างด้วยน้ำยาล้างจานและฟองน้ำนุ่มๆ ได้ตามปกติ หรือนำเข้าเครื่องล้างจานได้',
    warrantyInfo: 'รับประกันชำรุดแตกร้าวชิ้นส่วนใดๆ ระหว่างการจัดส่ง เปลี่ยนใบใหม่ให้ฟรีทันที (จำเป็นต้องมีคลิปวิดีโอระหว่างการเปิดกล่องพัสดุชิ้นส่วนครั้งแรกเป็นหลักฐาน)',
    packageIncludes: 'ฐานรองไม้ไผ่ธรรมชาติปรับองศาได้ 1 ชิ้น, ชามเซรามิกพอร์ซเลนเกรดอาหาร 2 ใบ, จุกยางซิลิโคนกันลื่นใต้ฐานไม้ 4 ชิ้น, ใบรับประกันสินค้าและการดูแลรักษา'
  },
  {
    id: 'prod-8',
    name: 'Dual-Level Cat Scratching Condo',
    nameTh: 'คอนโดกล่องแมวลับเล็บสองชั้น',
    category: 'cat-furniture',
    price: 2490,
    description: 'คอนโดกล่องไม้ที่ผสานระหว่างกล่องบ้านแมวนอนพักผ่อนและแผ่นลับเล็บกระดาษลูกฟูกคุณภาพสูงสองระดับ โครงตู้ภายนอกผลิตจากไม้คอมโพสิตลายไม้ธรรมชาติ สวยงาม แข็งแรง ทนทาน มีพื้นที่ส่วนตัวในกล่องชั้นล่างและจุดชมวิวบนชั้นบน ด้านหน้าและด้านในติดตั้งแผ่นลับเล็บกระดาษลูกฟูกหนาแน่นพิเศษที่สามารถถอดสลับสับเปลี่ยนได้เมื่อหมดอายุการใช้งาน เป็นตัวช่วยปกป้องเฟอร์นิเจอร์หลักในบ้าน เช่น โซฟาหรือผ้าม่าน จากคมเล็บน้องแมวได้อย่างชาญฉลาด',
    image: 'assets/hero_cat.png',
    stock: 7,
    featured: false,
    images: ['assets/hero_cat.png', 'assets/cat_furniture.png', 'assets/pet_accessories.png', 'assets/about_pets.png', 'assets/storage_cabinet.png'],
    materials: 'ไม้คอมโพสิตเกรดเฟอร์นิเจอร์เคลือบลายไม้ธรรมชาติรอบด้าน ปลอดภัย ไร้กลิ่นสารเคมี, แผ่นฝนเล็บกระดาษลูกฟูกอัดหนาแน่นสูงเป็นมิตรต่อสิ่งแวดล้อมและน้องแมว 100%',
    dimensions: 'กว้าง 45 ซม. x ลึก 30 ซม. x สูง 70 ซม. (ช่องประตูผ่านกว้าง 20 ซม.)',
    weightLimit: 'รองรับการปีนป่ายและนอนพักผ่อนของแมวโตได้สูงสุด 2 ตัว น้ำหนักรวมไม่เกิน 16 กิโลกรัม',
    features: [
      'โครงสร้าง 2 ชั้นคุ้มค่า มีพื้นที่กล่องบ้านแมวส่วนตัวที่อบอุ่นและมืดสลัวในชั้นล่าง และแท่นนอนชมวิวรับลมด้านบนของตู้',
      'ติดตั้งแผ่นฝนเล็บลูกฟูกทนทานพิเศษทั้งชั้นล่างและชั้นบน สามารถถอดสลับทิศทางเพื่อลดการสึกหรอ หรือถอดเปลี่ยนเฉพาะอะไหล่แผ่นใหม่ได้ง่าย',
      'ผลิตจากไม้โครงบอร์ดที่มีความหนาแน่นพิเศษ มั่นคง แข็งแรง ไม่โคลงเคลง สั่นไหว ปลอดภัยเมื่อน้องแมวกระโดดปีนขึ้นลงเล่น',
      'ดีไซน์ทรงเหลี่ยมโค้งมนสวยงามลายไม้ธรรมชาติมินิมอลกลมกลืนกับสไตล์บ้านสแกนดิเนเวียน Japandi หรือลอฟท์ได้อย่างมีระดับ'
    ],
    careInstructions: 'หลีกเลี่ยงความชื้นสะสมและน้ำขังเพราะกระดาษลูกฟูกอาจเปื่อยยุ่ยและบวมเสียหายได้, ใช้เครื่องดูดฝุ่นปัดเศษกระดาษลูกฟูกที่หลุดร่วงจากการฝนเล็บออกเป็นประจำเพื่อสุขอนามัยในบ้าน, ตัวโครงตู้ภายนอกใช้ผ้าแห้งเช็ดฝุ่นปกติ',
    warrantyInfo: 'รับประกันชิ้นส่วนบอดี้โครงสร้างไม้ภายนอกเป็นเวลา 6 เดือนเต็ม (ไม่ครอบคลุมแผ่นกระดาษลูกฟูกฝนเล็บที่เป็นชิ้นส่วนเสื่อมสภาพตามธรรมชาติการฝนเล็บของแมว)',
    packageIncludes: 'แผงประกอบตู้ไม้คอมโพสิต 1 ชุด, แผ่นกระดาษลูกฟูกลับเล็บหนาพิเศษ 2 แผ่น, ชุดสกรูล็อกข้อต่อและอุปกรณ์ไขควงเหล็ก L-Key 1 ชุด, คู่มือการประกอบกล่องลับเล็บแมวสองชั้น'
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    orderId: 'ORD-1001',
    customerName: 'สมชาย รักสัตว์',
    email: 'somchai@email.com',
    phone: '0812345678',
    address: '123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    items: [
      { id: 'prod-1', nameTh: 'คอนโดแมวไม้โอ๊คพรีเมียม', price: 3490, quantity: 1, image: 'assets/cat_furniture.png' }
    ],
    subtotal: 3490,
    shippingFee: 0,
    total: 3490,
    status: 'Completed',
    date: '2026-06-02T14:30:00.000Z'
  },
  {
    orderId: 'ORD-1002',
    customerName: 'สมศรี มีความสุข',
    email: 'somsri@email.com',
    phone: '0898765432',
    address: '99/9 หมู่ 3 ตำบลบางแก้ว อำเภอบางพลี จังหวัดสมุทรปราการ 10540',
    items: [
      { id: 'prod-3', nameTh: 'บ้านสัตว์เลี้ยงทรงสามเหลี่ยมมินิมอล', price: 1890, quantity: 1, image: 'assets/pet_accessories.png' },
      { id: 'prod-7', nameTh: 'ชามข้าวเซรามิกคู่ฐานไม้ปรับเอียง', price: 790, quantity: 2, image: 'assets/pet_accessories.png' }
    ],
    subtotal: 3470,
    shippingFee: 0,
    total: 3470,
    status: 'Shipped',
    date: '2026-06-03T01:15:00.000Z'
  }
];

const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    name: 'กิตติศักดิ์ เจริญดี',
    email: 'kittisak@email.com',
    phone: '0854443322',
    message: 'สวัสดีครับ สนใจสั่งผลิตคอนโดแมวขนาดพิเศษสำหรับแมว 5 ตัว สามารถปรับแต่งขนาดได้ไหมครับ?',
    date: '2026-06-02T18:45:00.000Z'
  }
];

// --- LOCAL STORAGE HELPERS ---
function getLocal(key: string, fallback: any) {
  if (typeof window === 'undefined') return fallback;
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function setLocal(key: string, data: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// --- INITIALIZE & SEED FOR FIRESTORE ---
async function seedFirestoreIfNeeded() {
  if (!isFirebaseConfigured || !db) return;
  try {
    // Check if products exist and if they have the new fields
    const productsRef = collection(db, "products");
    const productsSnap = await getDocs(productsRef);
    
    let needsUpgrade = false;
    if (productsSnap.empty) {
      needsUpgrade = true;
    } else {
      // If the first product is missing careInstructions, it's a legacy schema
      const firstDoc = productsSnap.docs[0].data() as Product;
      if (!firstDoc.careInstructions) {
        console.log("Legacy Firestore products detected. Initializing database upgrade...");
        needsUpgrade = true;
      }
    }

    if (needsUpgrade) {
      console.log("Seeding/Upgrading Firestore with default categories and products...");
      
      // Seed Categories
      const categoriesRef = collection(db, "categories");
      for (const cat of DEFAULT_CATEGORIES) {
        await setDoc(doc(categoriesRef, cat.id), cat);
      }

      // Seed/Upgrade Products
      for (const prod of DEFAULT_PRODUCTS) {
        await setDoc(doc(productsRef, prod.id), prod);
      }

      // Seed Orders (only if empty)
      const ordersRef = collection(db, "orders");
      const ordersSnap = await getDocs(ordersRef);
      if (ordersSnap.empty) {
        for (const ord of DEFAULT_ORDERS) {
          await setDoc(doc(ordersRef, ord.orderId), ord);
        }
      }

      // Seed Inquiries (only if empty)
      const inquiriesRef = collection(db, "inquiries");
      const inquiriesSnap = await getDocs(inquiriesRef);
      if (inquiriesSnap.empty) {
        for (const inq of DEFAULT_INQUIRIES) {
          await setDoc(doc(inquiriesRef, inq.id), inq);
        }
      }
      
      console.log("Firestore database seeding/upgrade complete.");
    }
  } catch (error) {
    console.error("Error seeding Firestore:", error);
  }
}

// Try to seed on module import if environment allows
if (typeof window !== "undefined") {
  seedFirestoreIfNeeded();
}

// --- EXPORTED DB OPERATIONS ---

// 1. Get Categories
export async function getCategories(): Promise<Category[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "categories"), orderBy("name"));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(doc => doc.data() as Category);
      }
    } catch (e) {
      console.error("Firestore getCategories failed, falling back", e);
    }
  }
  return getLocal('pawfect_categories', DEFAULT_CATEGORIES);
}

// 2. Get Products
export async function getProducts(): Promise<Product[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, "products"));
      if (!snap.empty) {
        return snap.docs.map(doc => doc.data() as Product);
      }
    } catch (e) {
      console.error("Firestore getProducts failed, falling back", e);
    }
  }
  
  const localData = getLocal('pawfect_products', DEFAULT_PRODUCTS);
  
  // Safe Version Migration check
  if (typeof window !== 'undefined') {
    const localVersion = localStorage.getItem('pawfect_db_version');
    if (localVersion !== CURRENT_DB_VERSION) {
      localStorage.setItem('pawfect_db_version', CURRENT_DB_VERSION);
      setLocal('pawfect_products', DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }
  }
  
  return localData;
}

// 3. Get Product By Id
export async function getProductById(id: string): Promise<Product | null> {
  if (isFirebaseConfigured && db) {
    try {
      const docSnap = await getDoc(doc(db, "products", id));
      if (docSnap.exists()) {
        return docSnap.data() as Product;
      }
    } catch (e) {
      console.error("Firestore getProductById failed, falling back", e);
    }
  }
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

// 4. Save Product (Create or Update)
export async function saveProduct(product: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
  const id = product.id || 'prod-' + Date.now();
  const savedProd: Product = {
    ...product,
    id
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "products", id), savedProd);
      return savedProd;
    } catch (e) {
      console.error("Firestore saveProduct failed, falling back to LocalStorage", e);
    }
  }

  const products = await getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    products[idx] = savedProd;
  } else {
    products.push(savedProd);
  }
  setLocal('pawfect_products', products);
  return savedProd;
}

// 5. Delete Product
export async function deleteProduct(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, "products", id));
      return;
    } catch (e) {
      console.error("Firestore deleteProduct failed, falling back to LocalStorage", e);
    }
  }
  const products = await getProducts();
  const filtered = products.filter(p => p.id !== id);
  setLocal('pawfect_products', filtered);
}

// 6. Get Orders
export async function getOrders(): Promise<Order[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "orders"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(doc => doc.data() as Order);
    } catch (e) {
      console.error("Firestore getOrders failed, falling back", e);
    }
  }
  return getLocal('pawfect_orders', DEFAULT_ORDERS);
}

// 7. Save Order (Places a checkout order and deducts stock)
export async function saveOrder(orderInput: Omit<Order, 'orderId' | 'date' | 'status'>): Promise<Order> {
  const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
  const date = new Date().toISOString();
  const newOrder: Order = {
    ...orderInput,
    orderId,
    date,
    status: 'Pending'
  };

  if (isFirebaseConfigured && db) {
    try {
      // Perform database Transaction to ensure atomicity in stock updates
      await runTransaction(db, async (transaction) => {
        // 1. Read and check product stocks
        for (const item of newOrder.items) {
          const productRef = doc(db!, "products", item.id);
          const productSnap = await transaction.get(productRef);
          if (productSnap.exists()) {
            const product = productSnap.data() as Product;
            const newStock = Math.max(0, product.stock - item.quantity);
            transaction.update(productRef, { stock: newStock });
          }
        }
        
        // 2. Write the order
        const orderRef = doc(db!, "orders", orderId);
        transaction.set(orderRef, newOrder);
      });
      return newOrder;
    } catch (e) {
      console.error("Firestore transaction saveOrder failed, falling back to LocalStorage", e);
    }
  }

  // Fallback Local Storage
  const orders = await getOrders();
  orders.push(newOrder);
  setLocal('pawfect_orders', orders);

  // Deduct Local Stock
  const products = await getProducts();
  newOrder.items.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });
  setLocal('pawfect_products', products);

  return newOrder;
}

// 8. Update Order Status
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  if (isFirebaseConfigured && db) {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status });
      const updatedSnap = await getDoc(orderRef);
      return updatedSnap.data() as Order;
    } catch (e) {
      console.error("Firestore updateOrderStatus failed, falling back to LocalStorage", e);
    }
  }

  const orders = await getOrders();
  const idx = orders.findIndex(o => o.orderId === orderId);
  if (idx !== -1) {
    orders[idx].status = status;
    setLocal('pawfect_orders', orders);
    return orders[idx];
  }
  throw new Error("Order not found");
}

// 9. Get Inquiries
export async function getInquiries(): Promise<Inquiry[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "inquiries"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(doc => doc.data() as Inquiry);
    } catch (e) {
      console.error("Firestore getInquiries failed, falling back", e);
    }
  }
  return getLocal('pawfect_inquiries', DEFAULT_INQUIRIES);
}

// 10. Save Inquiry
export async function saveInquiry(inquiryInput: Omit<Inquiry, 'id' | 'date'>): Promise<Inquiry> {
  const id = 'inq-' + Date.now();
  const date = new Date().toISOString();
  const newInq: Inquiry = {
    ...inquiryInput,
    id,
    date
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, "products", id), newInq);
      return newInq;
    } catch (e) {
      console.error("Firestore saveInquiry failed, falling back to LocalStorage", e);
    }
  }

  const inquiries = await getInquiries();
  inquiries.push(newInq);
  setLocal('pawfect_inquiries', inquiries);
  return newInq;
}

// 11. Reset Database
export async function resetDatabase(): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      // For safety, we only clear/reset local storage in Firebase mode,
      // as clearing Firestore collections requires deep recursive deletion.
      // We will re-seed local store and log success.
      console.log("Firestore reset is not supported directly for safety. Resetting local store fallback.");
    } catch (e) {
      console.error(e);
    }
  }
  setLocal('pawfect_categories', DEFAULT_CATEGORIES);
  setLocal('pawfect_products', DEFAULT_PRODUCTS);
  setLocal('pawfect_orders', DEFAULT_ORDERS);
  setLocal('pawfect_inquiries', DEFAULT_INQUIRIES);
}

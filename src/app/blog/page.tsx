"use client";

import React, { useState } from "react";
import { ArrowRight, Calendar, Tag, X, BookOpen, MessageSquare } from "lucide-react";

interface BlogSection {
  type: "p" | "h3" | "quote" | "list";
  text?: string;
  items?: string[];
}

interface BlogPost {
  id: string;
  tag: string;
  date: string;
  title: string;
  desc: string;
  image: string;
  content: BlogSection[];
}

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const posts: BlogPost[] = [
    {
      id: "post-1",
      tag: "Cat Life",
      date: "3 มิ.ย. 2026",
      title: "วิธีการเลือกคอนโดแมวให้ถูกใจเจ้าเหมียวและเจ้าของบ้าน",
      desc: "น้องแมวชอบปีนป่ายและชมวิวจากที่สูง แต่เราจะเลือกคอนโดแมวอย่างไรให้ประหยัดพื้นที่ แข็งแรงปลอดภัย และแมวยอมใช้จริง...",
      image: "assets/hero_cat.png",
      content: [
        {
          type: "p",
          text: "น้องแมวมีสัญชาตญาณตามธรรมชาติในการปีนป่าย ขึ้นที่สูง เพื่อความปลอดภัยและการสำรวจอาณาเขต การมี 'คอนโดแมว' จึงเป็นมากกว่าของเล่น แต่เป็นพื้นที่ส่วนตัวที่ช่วยให้น้องแมวรู้สึกผ่อนคลายและลดพฤติกรรมความเครียดได้เป็นอย่างดี"
        },
        {
          type: "h3",
          text: "ความมั่นคงแข็งแรงคือหัวใจหลัก"
        },
        {
          type: "p",
          text: "สิ่งแรกที่ต้องพิจารณาคือฐานของคอนโดแมว ต้องมีความกว้างและหนาพอที่จะไม่ล้มคว่ำเมื่อน้องแมวกระโดดขึ้นลงอย่างรวดเร็ว โครงสร้างไม้แท้ (เช่น ไม้โอ๊ค หรือไม้เบิร์ช) จะให้ความมั่นคงและทนทานกว่ากระดาษอัดทั่วไปมาก"
        },
        {
          type: "quote",
          text: "คอนโดแมวที่โยกเยกจะทำให้น้องแมวรู้สึกไม่ปลอดภัย และพวกเขาจะไม่ยอมกลับไปใช้อีกเลย"
        },
        {
          type: "h3",
          text: "วัสดุเสาลับเล็บที่ทนทาน"
        },
        {
          type: "p",
          text: "ควรเลือกเสาที่พันด้วยเชือกป่านธรรมชาติเกรดพรีเมียมที่มีความหนาแน่นสูงและพันแน่น เพื่อทนทานต่อแรงขีดข่วนของกรงเล็บ และช่วยลับเล็บน้องแมวให้สะอาดอยู่เสมอ โดยสามารถช่วยปกป้องโซฟาหลักในบ้านของคุณได้"
        },
        {
          type: "h3",
          text: "เลือกตำแหน่งจัดวางให้เหมาะสม"
        },
        {
          type: "list",
          items: [
            "จัดวางริมหน้าต่าง: แมวชอบชมวิวภายนอก นกบิน หรือรับแสงแดดอุ่นๆ ยามบ่าย",
            "วางในมุมสงบ: หลีกเลี่ยงบริเวณทางเดินที่มีคนพลุกพล่านเพื่อให้เขาได้นอนพักผ่อนอย่างเงียบสงบเต็มที่",
            "วางใกล้จุดที่ครอบครัวทำกิจกรรม: เพื่อให้น้องแมวรู้สึกเป็นส่วนหนึ่งของกลุ่มและปลอดภัยที่จะมองเห็นทุกคน"
          ]
        }
      ]
    },
    {
      id: "post-2",
      tag: "Dog Care",
      date: "1 มิ.ย. 2026",
      title: "แต่งมุมสัตว์เลี้ยงในบ้านสไตล์มินิมอล/สแกนดิเนเวียน",
      desc: "แชร์ไอเดียจัดโซนที่นอนสุนัขและที่เก็บของเล่นให้เรียบร้อย ดูสะอาดสบายตา แต่ยังคงฟังก์ชันความสะดวกสำหรับสัตว์เลี้ยง...",
      image: "assets/about_pets.png",
      content: [
        {
          type: "p",
          text: "การแต่งบ้านสไตล์มินิมอลและสแกนดิเนเวียน (Japandi) กำลังได้รับความนิยมสูงมากในปัจจุบัน แต่หลายคนมักเจอปัญหาในการจัดวางโซนสัตว์เลี้ยงให้สวยงามและเข้ากับดีไซน์บ้าน การเลือกเฟอร์นิเจอร์สัตว์เลี้ยงที่เป็นไม้แท้โทนอบอุ่นและมีฟังก์ชันหลากหลายคือคำตอบสำหรับการผสานสองสิ่งนี้เข้าด้วยกัน"
        },
        {
          type: "h3",
          text: "ซ่อนของใช้ด้วยตู้จัดเก็บอเนกประสงค์"
        },
        {
          type: "p",
          text: "การซ่อนชามข้าวหรือถุงอาหารสุนัขไว้ในลิ้นชักที่เลื่อนเปิดปิดได้ ช่วยลดความเกะกะและป้องกันไม่ให้น้องๆ แตะชามล้ม ตู้เก็บอาหารควรมีฝาปิดสนิทเพื่อเก็บกลิ่นและกันแมลง หรือเลือกใช้ตู้บุฟเฟต์ให้อาหารที่มีฟังก์ชันเก็บของใช้ส่วนตัวของน้องหมาไว้ด้านบน"
        },
        {
          type: "quote",
          text: "ความกะทัดรัดและความเป็นระเบียบของบ้านช่วยลดกลิ่นไม่พึงประสงค์ และทำให้พื้นที่ใช้สอยในบ้านกว้างขวางขึ้น"
        },
        {
          type: "h3",
          text: "เลือกที่นอนสัตว์เลี้ยงที่มีโทนสีธรรมชาติ"
        },
        {
          type: "p",
          text: "หลีกเลี่ยงการใช้ที่นอนพลาสติกหรือผ้าที่มีสีสดใสสะดุดตาเกินไป ให้เปลี่ยนมาเลือกใช้โครงเตียงไม้เบิร์ชธรรมชาติพร้อมเบาะรองนอนโทนสีเอิร์ธโทน เช่น สีเบจ สีเทาอ่อน หรือสีเขียวโอลีฟ ซึ่งจะเข้ากับเฟอร์นิเจอร์หลักของบ้านได้อย่างดีเยี่ยมและให้บรรยากาศอบอุ่น"
        }
      ]
    },
    {
      id: "post-3",
      tag: "Pet Furniture",
      date: "25 พ.ค. 2026",
      title: "ความสำคัญของชามอาหารสุนัขและแมวแบบยกระดับ",
      desc: "ทำไมชามข้าวที่ติดพื้นเกินไปอาจส่งผลเสียต่อกระดูกสันหลังและคอของสัตว์เลี้ยง และชามอาหารยกสูงปรับเอียงช่วยอะไรได้บ้าง...",
      image: "assets/storage_cabinet.png",
      content: [
        {
          type: "p",
          text: "เจ้าของสัตว์เลี้ยงหลายคนคุ้นเคยกับการวางชามอาหารไว้กับพื้นโดยตรง แต่ผลวิจัยพฤติกรรมและสรีระวิทยาพบว่าสุนัขและแมวไม่ได้ถูกออกแบบมาให้ก้มกินอาหารในลักษณะนั้นเป็นเวลานาน การใช้ชามอาหารยกระดับจึงช่วยดูแลรักษาสุขภาพของน้องๆ ได้ตั้งแต่เยาว์วัยและป้องกันโรคเมื่อเขาโตขึ้น"
        },
        {
          type: "h3",
          text: "ช่วยลดภาระที่แนวกระดูกสันหลังคอ"
        },
        {
          type: "p",
          text: "เมื่อสัตว์เลี้ยงก้มกินอาหารต่ำเกินไป แนวคอและหลังจะอยู่ในลักษณะโก่งงอ ซึ่งสร้างแรงกดทับสะสมที่กระดูกข้อต่อคอ การยกระดับชามขึ้นมาให้อยู่ในระดับแนวหน้าอกจะช่วยรักษาสรีระการยืนกินอาหารที่เป็นธรรมชาติและผ่อนคลายที่สุด ลดการเกร็งตัวขณะทานอาหาร"
        },
        {
          type: "quote",
          text: "การทานอาหารในท่าทางที่ถูกต้องช่วยให้ระบบทางเดินอาหารทำงานได้ดีขึ้น ป้องกันการกลืนอากาศที่จะทำให้น้องท้องอืด"
        },
        {
          type: "h3",
          text: "องศาการเอียง 15 องศาช่วยอะไรบ้าง"
        },
        {
          type: "p",
          text: "ชามที่มีมุมเอียง 15 องศาช่วยให้อาหารมารวมกันที่ส่วนล่างของชาม ทำให้สัตว์เลี้ยงรับประทานได้ง่ายขึ้นโดยไม่ต้องมุดหัวลึก ป้องกันไม่ให้อาหารหกกระเด็นเปรอะเปื้อนใบหน้าและพื้นห้อง ช่วยอำนวยความสะดวกให้สุนัขและแมวสูงอายุเป็นพิเศษ"
        }
      ]
    },
    {
      id: "post-4",
      tag: "Dog Life",
      date: "28 พ.ค. 2026",
      title: "เทคนิคการเตรียมความพร้อมเมื่อนำน้องหมาตัวใหม่เข้าบ้าน",
      desc: "ต้อนรับสมาชิกสี่ขาตัวใหม่ด้วยความอบอุ่นและปลอดภัย เรียนรู้ขั้นตอนสำคัญในการจัดเตรียมพื้นที่และสิ่งของใช้ที่จำเป็น...",
      image: "assets/new_dog_guide.png",
      content: [
        {
          type: "p",
          text: "การนำสุนัขตัวใหม่เข้ามาในบ้านเป็นช่วงเวลาที่ตื่นเต้นและเต็มไปด้วยความสุข แต่ก็อาจสร้างความกังวลและสับสนให้กับสุนัขได้หากเราไม่มีการเตรียมสภาพแวดล้อมที่ดี การสร้างสภาพแวดล้อมที่อบอุ่น ปลอดภัย และมีขอบเขตที่ชัดเจนจะช่วยให้น้องๆ ปรับตัวได้เร็วและลดอาการตื่นตระหนก"
        },
        {
          type: "h3",
          text: "จัดโซนปลอดภัย (Quiet Safe Zone)"
        },
        {
          type: "p",
          text: "ควรเลือกมุมที่เงียบสงบในบ้านเพื่อจัดตั้งเตียงนอนไม้หรือคอกสุนัข จัดเตรียมเตียงหนานุ่มเพื่อให้เขารู้สึกมีพื้นที่ส่วนตัวที่ปลอดภัยเมื่อต้องการพักผ่อน การวางที่นอนยกระดับจากพื้นจะช่วยลดความชื้นสะสมและทำให้น้องนอนหลับได้ลึกขึ้น"
        },
        {
          type: "quote",
          text: "ความสงบและพื้นที่ส่วนตัวคือสิ่งสำคัญที่สุดที่สุนัขต้องการในช่วง 3 วันแรก เพื่อสร้างความไว้วางใจกับสถานที่ใหม่"
        },
        {
          type: "h3",
          text: "เช็กลิสต์ขั้นตอนการต้อนรับสุนัขใหม่"
        },
        {
          type: "list",
          items: [
            "เก็บสิ่งของอันตราย: เคลียร์สายไฟ สารเคมี วัตถุชิ้นเล็ก และต้นไม้ที่เป็นพิษต่อสุนัขให้อยู่ในที่สูงพ้นมือ",
            "ทำความรู้จักผ่านกลิ่น: นำผ้าขนหนูหรือเสื้อผ้าที่มีกลิ่นตัวเจ้าของเดิมมาวางไว้ที่เบาะเพื่อสร้างความรู้สึกคุ้นเคยและลดอาการซึมเศร้า",
            "สร้างตารางเวลาที่แน่นอน: กำหนดเวลาอาหาร เวลาขับถ่าย และเวลาเล่นให้สม่ำเสมอทุกวัน ช่วยลดความเครียดและฝึกนิสัยได้รวดเร็ว"
          ]
        }
      ]
    },
    {
      id: "post-5",
      tag: "Cat Care",
      date: "20 พ.ค. 2026",
      title: "พฤติกรรมการฝนเล็บของแมวและการเลือกที่ฝนเล็บให้คุ้มค่า",
      desc: "ทำไมแมวต้องฝนเล็บ? เข้าใจธรรมชาติของพฤติกรรมนี้ และวิธีการจัดหาแผ่นลับเล็บให้เหมาะสมโดยไม่ต้องเสียเงินเปลี่ยนบ่อย...",
      image: "assets/cat_scratching_guide.png",
      content: [
        {
          type: "p",
          text: "ทาสแมวหลายคนคงปวดหัวกับปัญหาน้องแมวชอบข่วนโซฟาหนัง พรมเช็ดเท้า หรือตามเสาบ้านจนฉีกขาดเสียหาย แต่ความจริงแล้วการฝนเล็บไม่ใช่พฤติกรรมก้าวร้าวหรือการเกเร แต่เป็นพฤติกรรมทางกายภาพตามธรรมชาติที่จำเป็นต่อสุขอนามัยของแมวทุกตัว"
        },
        {
          type: "h3",
          text: "ความสำคัญของพฤติกรรมฝนเล็บ"
        },
        {
          type: "p",
          text: "แมวฝนเล็บเพื่อขจัดเปลือกเล็บเก่าที่ตายและเสื่อมสภาพออก เพื่อเผยเล็บใหม่ที่แข็งแรงและแหลมคมกว่า นอกจากนี้ยังเป็นการออกกำลังกายยืดกล้ามเนื้อขาและไหล่ รวมถึงเป็นการปล่อยกลิ่นฟีโรโมนจากต่อมใต้ฝ่าเท้าเพื่อแสดงอาณาเขต"
        },
        {
          type: "quote",
          text: "การลงโทษแมวไม่ให้ฝนเล็บจะสร้างความเครียดอย่างรุนแรง ทางออกที่ดีที่สุดคือการวางที่ลับเล็บไว้ในจุดที่เหมาะสม"
        },
        {
          type: "h3",
          text: "การเลือกอุปกรณ์ลับเล็บให้คุ้มค่าประหยัดงบ"
        },
        {
          type: "p",
          text: "แนะนำให้เลือกซื้อของเล่นลับเล็บหรือคอนโดแมวที่เป็นระบบโครงสร้างไม้แท้ที่มีช่องใส่แผ่นลับเล็บกระดาษลูกฟูกแบบถอดสลับทิศทางหรือถอดเปลี่ยนอะไหล่ได้ เพราะเมื่อแผ่นกระดาษลูกฟูกสึกหรอจากการฝนเล็บ เราเพียงซื้อเฉพาะแผ่นกระดาษลูกฟูกชิ้นใหม่มาเปลี่ยนทดแทน โดยไม่ต้องทิ้งกล่องไม้หรือซื้อคอนโดใหม่ทั้งชุด ซึ่งช่วยประหยัดเงินในกระเป๋าของทาสแมวได้มากกว่า 50% ในระยะยาว"
        }
      ]
    },
    {
      id: "post-6",
      tag: "Furniture Care",
      date: "15 พ.ค. 2026",
      title: "วิธีการทำความสะอาดและดูแลรักษาเฟอร์นิเจอร์สัตว์เลี้ยงไม้แท้",
      desc: "เคล็ดลับการยืดอายุการใช้งานเฟอร์นิเจอร์สัตว์เลี้ยงไม้เบิร์ชและไม้โอ๊คแท้ ให้ดูใหม่ สวยงาม ปราศจากคราบและเชื้อโรค...",
      image: "assets/furniture_care_guide.png",
      content: [
        {
          type: "p",
          text: "เฟอร์นิเจอร์สัตว์เลี้ยงไม้แท้ให้ผิวสัมผัสที่เป็นธรรมชาติ แข็งแรง และดูพรีเมียม แต่ก็มีข้อควรระวังในการรักษาและทำความสะอาดที่แตกต่างจากพลาสติกทั่วไป คราบน้ำ คราบน้ำลาย หรือการขับถ่ายของสัตว์เลี้ยง หากละเลยอาจทำลายหน้าไม้ ก่อเกิดเชื้อรา และเป็นแหล่งสะสมของแบคทีเรียที่เป็นอันตรายต่อสุขภาพสัตว์เลี้ยงได้"
        },
        {
          type: "h3",
          text: "การทำความสะอาดประจำวันอย่างถูกวิธี"
        },
        {
          type: "p",
          text: "ปัดฝุ่นละอองและเศษขนเป็นประจำด้วยแปรงปัดหรือเครื่องดูดฝุ่น หากพบรอยเปื้อน คราบน้ำลาย หรือเศษอาหารเปียก ให้รีบเช็ดออกทันทีด้วยผ้าไมโครไฟเบอร์ชุบน้ำหมาดบิดเกลือบแห้งสนิท แล้วเช็ดตามด้วยผ้าแห้ง หลีกเลี่ยงการพ่นแอลกอฮอล์เข้มข้นลงบนเนื้อไม้โดยตรงเพราะจะกัดกร่อนชั้นแล็กเกอร์เคลือบผิว"
        },
        {
          type: "quote",
          text: "การดูแลรักษาไม้แท้ให้แห้งอยู่เสมอและมีอากาศถ่ายเทสะดวก คือหัวใจสำคัญในการยืดอายุเฟอร์นิเจอร์ไม้ให้ยาวนานนับสิบปี"
        },
        {
          type: "h3",
          text: "การจัดการสุขอนามัยและการลบรอยขีดข่วน"
        },
        {
          type: "list",
          items: [
            "ใช้น้ำยาทำความสะอาดชนิดเป็นมิตรต่อสัตว์เลี้ยง: เลือกใช้น้ำยาออร์แกนิกสูตรอ่อนโยนเช็ดทำความสะอาด เพื่อความปลอดภัยและไร้สารเคมีตกค้าง",
            "ห้ามแช่น้ำขังเด็ดขาด: ห้ามนำชิ้นส่วนไม้ไปล้างน้ำหรือแช่น้ำยา หากเปียกต้องผึ่งลมในที่ร่มให้แห้งสนิท ห้ามตากแดดจัดโดยตรงเพราะไม้แท้อาจร้าวบิดงอ",
            "ลบรอยขีดข่วนบางเบา: หากเนื้อไม้มีรอยเล็บข่วนตื้นๆ สามารถใช้น้ำมันขัดไม้ธรรมชาติหรือไขผึ้ง (Beeswax) ขัดวนเบาๆ เพื่อสมานผิวและเพิ่มความเงางามเคลือบเงา"
          ]
        }
      ]
    }
  ];

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleClosePost = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
      {/* Header */}
      <div className="text-center flex flex-col gap-3 mb-16">
        <span className="text-xs font-bold text-primary tracking-wider uppercase">บล็อกและสาระน่ารู้</span>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-text-main flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-primary stroke-[1.5]" /> Pawfect Lifestyle Blog
        </h1>
        <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
          อัปเดตบทความการจัดแต่งบ้าน และเทคนิคการดูแลสรีระ/พฤติกรรมสัตว์เลี้ยงโดยผู้เชี่ยวชาญ
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl overflow-hidden border border-[#E3D9CE]/30 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
          >
            <div className="h-48 overflow-hidden relative cursor-pointer" onClick={() => handleOpenPost(post)}>
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/95 text-text-main font-semibold px-4 py-2 rounded-full shadow-md text-xs scale-90 group-hover:scale-100 transition-all duration-300">
                  อ่านบทความ
                </span>
              </div>
            </div>
            <div className="p-6 flex flex-col items-start gap-3 flex-grow justify-between text-left">
              <div className="flex flex-col gap-2.5 w-full">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wide flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> {post.tag} • {post.date}
                </span>
                <h3
                  onClick={() => handleOpenPost(post)}
                  className="font-display font-bold text-base text-text-main group-hover:text-primary transition-colors leading-snug line-clamp-2 cursor-pointer"
                >
                  {post.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                  {post.desc}
                </p>
              </div>
              <button
                onClick={() => handleOpenPost(post)}
                className="inline-flex items-center gap-1 font-display font-bold text-xs text-primary group-hover:text-primary-hover border-b border-transparent hover:border-primary-hover pb-0.5 mt-2 transition-all cursor-pointer"
              >
                อ่านเพิ่มเติม 
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* --- DETAILED BLOG POST MODAL --- */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={handleClosePost} />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-3xl bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col font-sans">
            {/* Close Button */}
            <button
              onClick={handleClosePost}
              className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center text-text-main shadow-md hover:bg-white transition-all cursor-pointer border border-[#E3D9CE]/30"
              title="ปิดหน้าต่าง"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Container */}
            <div className="overflow-y-auto flex-grow">
              
              {/* Cover Banner Image */}
              <div className="w-full h-64 sm:h-80 relative overflow-hidden">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Meta details overlaid */}
                <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col gap-2">
                  <span className="bg-[#B58E6D] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider self-start flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {selectedPost.tag}
                  </span>
                  <h2 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl leading-tight shadow-text">
                    {selectedPost.title}
                  </h2>
                  <span className="text-[10px] sm:text-xs opacity-90 flex items-center gap-1.5 font-medium mt-1">
                    <Calendar className="w-3.5 h-3.5" /> เผยแพร่เมื่อ: {selectedPost.date} • โดย ทีมผู้เชี่ยวชาญ Pawfect
                  </span>
                </div>
              </div>

              {/* Blog Content Section */}
              <div className="p-6 sm:p-10 flex flex-col gap-5 text-left bg-[#FAF8F5]">
                {selectedPost.content.map((sec, index) => {
                  if (sec.type === "p") {
                    return (
                      <p key={index} className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans">
                        {sec.text}
                      </p>
                    );
                  }
                  if (sec.type === "h3") {
                    return (
                      <h3 key={index} className="font-display font-bold text-base sm:text-lg text-text-main mt-4 border-l-3 border-primary pl-3">
                        {sec.text}
                      </h3>
                    );
                  }
                  if (sec.type === "quote") {
                    return (
                      <div key={index} className="border-l-4 border-primary bg-[#F0EBE3]/30 py-4 px-5 rounded-r-xl italic text-xs sm:text-sm text-text-main font-medium my-2">
                        "{sec.text}"
                      </div>
                    );
                  }
                  if (sec.type === "list" && sec.items) {
                    return (
                      <ul key={index} className="flex flex-col gap-2.5 bg-white border border-[#E3D9CE]/25 rounded-2xl p-5 shadow-xs my-1">
                        {sec.items.map((item, i) => (
                          <li key={i} className="text-xs sm:text-sm text-text-muted flex gap-2.5 items-start leading-relaxed">
                            <span className="text-primary mt-0.5">🐾</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return null;
                })}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-[#E3D9CE]/30 flex justify-end">
              <button
                onClick={handleClosePost}
                className="bg-[#B58E6D] hover:bg-[#9B7757] text-white px-6 py-2 rounded-full font-display font-semibold text-xs transition-all cursor-pointer shadow-sm active:scale-98"
              >
                ปิดบทความ
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

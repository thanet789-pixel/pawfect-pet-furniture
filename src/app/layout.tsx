import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

export const metadata: Metadata = {
  title: {
    default: "Pawfect - เฟอร์นิเจอร์สัตว์เลี้ยงระดับพรีเมียม | Pet Furniture",
    template: "%s | Pawfect"
  },
  description: "Pawfect Pet Furniture - ออกแบบเฟอร์นิเจอร์สัตว์เลี้ยงระดับพรีเมียม แข็งแรง ปลอดภัย ดีไซน์สวยงามผสมผสานสไตล์สแกนดิเนเวียนและ Japandi มินิมอลที่เข้ากับบ้านทุกสไตล์ของคุณ",
  keywords: ["เฟอร์นิเจอร์สัตว์เลี้ยง", "คอนโดแมว", "เตียงสุนัข", "บ้านแมว", "อุปกรณ์สัตว์เลี้ยง", "เฟอร์นิเจอร์มินิมอล", "ตกแต่งบ้าน", "คอนโดแมวไม้แท้", "Pawfect", "Pawfect Pet Furniture"],
  authors: [{ name: "Pawfect Team" }],
  creator: "Pawfect Pet Furniture",
  publisher: "Pawfect Pet Furniture",
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://pawfect-pet-furniture.com",
    title: "Pawfect - เฟอร์นิเจอร์สัตว์เลี้ยงระดับพรีเมียม",
    description: "ออกแบบเฟอร์นิเจอร์สัตว์เลี้ยงระดับพรีเมียม แข็งแรง ปลอดภัย เข้ากับทุกสไตล์ดีไซน์บ้านของคุณ",
    siteName: "Pawfect Pet Furniture",
    images: [
      {
        url: "/assets/hero_cat.png",
        width: 1200,
        height: 630,
        alt: "Pawfect Premium Pet Furniture"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full">
      <body className="min-h-full flex flex-col bg-bg-primary text-text-main antialiased selection:bg-primary-light selection:text-primary">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

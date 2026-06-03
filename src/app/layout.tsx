import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

export const metadata: Metadata = {
  title: "Pawfect - เฟอร์นิเจอร์สัตว์เลี้ยงระดับพรีเมียม",
  description: "Pawfect Pet Furniture - ออกแบบเฟอร์นิเจอร์สัตว์เลี้ยงระดับพรีเมียม แข็งแรง สวยงาม เข้ากับทุกดีไซน์บ้านของคุณ ผสมผสานสไตล์สแกนดิเนเวียนและมินิมอล",
  keywords: "เฟอร์นิเจอร์สัตว์เลี้ยง, คอนโดแมว, เตียงสุนัข, บ้านแมว, อุปกรณ์สัตว์เลี้ยง, เฟอร์นิเจอร์มินิมอล, ตกแต่งบ้าน",
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

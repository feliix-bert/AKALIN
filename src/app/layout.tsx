import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akalin — Temukan Inspirasi. Rancang Ruanganmu. Wujudkan Idemu.",
  description:
    "Platform inspirasi penataan kamar kos dan ruang mungil dengan Interactive 3D Room Planner. Visualisasikan tata letak perabotan sebelum membeli.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#121316] text-stone-900 dark:text-stone-100 antialiased`}
      >
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AKALIN — Ruang Kecil. Kemungkinan Besar.",
  description:
    "Platform inspirasi penataan kamar kos dan ruang mungil dengan Interactive 3D Room Planner. Visualisasikan tata letak perabotan sebelum membeli.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${plusJakartaSans.variable} ${poppins.variable} ${montserrat.variable} ${playfair.variable} font-sans min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#121316] text-[#25251F] dark:text-stone-100 antialiased selection:bg-[#009B75] selection:text-white`}
      >
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast'
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "momez - Premium Ayakkabı Mağazası",
  description: "Erkek, kadın ve spor ayakkabı koleksiyonları. Kaliteli ve uygun fiyatlı ayakkabılar için momez.",
  keywords: ["ayakkabı", "erkek ayakkabı", "kadın ayakkabı", "spor ayakkabı", "momez"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="light">
      <body className="font-sans antialiased bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 transition-colors duration-300">
        {children}
        <CookieBanner />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

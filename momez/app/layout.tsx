import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast'
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
      <body className="font-sans antialiased bg-white dark:bg-[#111111]">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

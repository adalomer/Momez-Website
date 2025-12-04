import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast'
import CookieBanner from "@/components/CookieBanner";
import { LanguageProvider } from "@/lib/i18n";
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
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  var lang = localStorage.getItem('language');
                  if (lang === 'ar') {
                    document.documentElement.dir = 'rtl';
                    document.documentElement.lang = 'ar';
                  } else if (lang === 'en') {
                    document.documentElement.lang = 'en';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 transition-colors duration-300">
        <LanguageProvider>
          {children}
          <CookieBanner />
          <Toaster position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}

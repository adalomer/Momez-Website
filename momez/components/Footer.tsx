'use client'

import Link from 'next/link'
import { Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-background-dark border-t border-slate-200/80 dark:border-slate-800/80 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">momez</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Premium ayakkabı koleksiyonları ile stil ve konforun buluşma noktası.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/momez"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white hover:scale-110 transition-transform shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/momez"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white hover:scale-110 transition-transform shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Alışveriş</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/kategori/erkek" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                  Erkek Ayakkabı
                </Link>
              </li>
              <li>
                <Link href="/kategori/kadin" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                  Kadın Ayakkabı
                </Link>
              </li>
              <li>
                <Link href="/kategori/spor" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                  Spor Ayakkabı
                </Link>
              </li>
              <li>
                <Link href="/kategori/cocuk" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                  Çocuk Ayakkabı
                </Link>
              </li>
              <li>
                <Link href="/indirim" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                  İndirimli Ürünler
                </Link>
              </li>
            </ul>
          </div>



          {/* About Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Kurumsal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hakkimizda" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/gizlilik-politikasi" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {currentYear} momez. Tüm Hakları Saklıdır.
            </p>
            <div className="flex gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                İletişim: <a href="tel:+905551234567" className="hover:text-primary">+90 555 123 4567</a>
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Email: <a href="mailto:iletisim@momez.com" className="hover:text-primary">iletisim@momez.com</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/kategori/erkek', label: 'Erkek' },
    { href: '/kategori/kadin', label: 'Kadın' },
    { href: '/kategori/cocuk', label: 'Çocuk' },
    { href: '/kampanyalar', label: 'Kampanyalar' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 text-primary group-hover:scale-110 transition-transform">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
              </svg>
            </div>
            <span className="text-2xl font-bold text-primary">momez</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-slate-700 dark:text-slate-300 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center rounded-full h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Arama"
            >
              <Search className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
            
            <Link
              href="/favoriler"
              className="flex items-center justify-center rounded-full h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Favoriler"
            >
              <Heart className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </Link>
            
            <Link
              href="/sepet"
              className="relative flex items-center justify-center rounded-full h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Sepet"
            >
              <ShoppingCart className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                2
              </span>
            </Link>
            
            <Link
              href="/profil"
              className="flex items-center justify-center rounded-full h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Hesabım"
            >
              <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex items-center justify-center rounded-full h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menü"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-600" />
              ) : (
                <Menu className="h-5 w-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

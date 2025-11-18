'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Heart, User, Search, Menu, X, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface UserData {
  id: number
  email: string
  full_name: string
  role: string
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    fetchUser()
    fetchCartCount()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      
      if (data.success && data.data?.user) {
        setUser(data.data.user)
      }
    } catch (error) {
      console.error('User load error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart')
      const data = await response.json()
      
      if (data.success && data.data) {
        const total = data.data.reduce((sum: number, item: any) => sum + item.quantity, 0)
        setCartCount(total)
      }
    } catch (error) {
      // Giriş yapılmamışsa sepet 0
      setCartCount(0)
    }
  }

  const handleLogout = async () => {
    try {
      // Logout animasyonu için toast göster
      toast.loading('Çıkış yapılıyor...', { id: 'logout' })
      
      await fetch('/api/auth/logout', { method: 'POST' })
      
      toast.success('Başarıyla çıkış yapıldı', { id: 'logout' })
      
      setUser(null)
      
      // Kısa bir gecikme ile sayfayı yenile (animasyon için)
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 500)
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Çıkış yapılırken hata oluştu', { id: 'logout' })
    }
  }

  const navLinks = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/kategori/erkek', label: 'Erkek' },
    { href: '/kategori/kadin', label: 'Kadın' },
    { href: '/kategori/cocuk', label: 'Çocuk' },
    { href: '/kampanyalar', label: 'Kampanyalar' },
  ]

  return (
    <header className="sticky top-0 z-50 glass border-b border-border-light dark:border-border-dark shadow-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 text-red-500">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
              </svg>
            </div>
            <span className="text-2xl font-bold hidden sm:block text-red-500">
              momez
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                  pathname === link.href
                    ? 'bg-red-500 text-white shadow-lg scale-105'
                    : 'text-red-500 hover:bg-red-500 hover:text-white hover:scale-105 hover:shadow-md'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-3">
            <Link
              href="/sepet"
              className="relative flex items-center justify-center rounded-xl h-11 w-11 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Sepet"
            >
              <ShoppingCart className="h-5 w-5 transition-all duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-soft">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <Link
              href="/favoriler"
              className="flex items-center justify-center rounded-xl h-11 w-11 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110 group"
              aria-label="Favoriler"
            >
              <Heart className="h-5 w-5 transition-all duration-300 group-hover:fill-current" />
            </Link>
            
            {/* User Menu */}
            {loading ? (
              <div className="flex items-center justify-center rounded-xl h-11 w-11">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-400 border-t-transparent"></div>
              </div>
            ) : user ? (
              <div className="relative group">
                <Link 
                  href="/profil"
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-accent-lighter transition-all hover:scale-105"
                >
                  <div className="flex items-center justify-center rounded-full h-10 w-10 bg-red-500 text-white font-bold text-base shadow-soft">
                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block text-base font-bold text-red-500">
                    {user.full_name}
                  </span>
                </Link>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-soft-lg border border-border-light dark:border-border-dark opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 animate-scaleIn z-50">
                  <div className="p-2">
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all font-medium"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      href="/profil"
                      className="block px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all font-medium"
                    >
                      Profilim
                    </Link>
                    <Link
                      href="/profil/siparisler"
                      className="block px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all font-medium"
                    >
                      Siparişlerim
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2 transition-all font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center justify-center rounded-xl h-11 w-11 hover:bg-accent-lighter hover:text-primary-600 transition-all hover:scale-105"
                aria-label="Giriş Yap"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex items-center justify-center rounded-xl h-11 w-11 hover:bg-accent-lighter hover:text-primary-600 transition-all hover:scale-105 ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menü"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border-light dark:border-border-dark animate-slideIn">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    pathname === link.href
                      ? 'bg-red-500 text-white'
                      : 'text-red-500 hover:bg-red-500 hover:text-white'
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

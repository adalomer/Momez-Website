'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Heart, User, Search, Menu, X, LogOut, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/lib/i18n'

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
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [fetchKey, setFetchKey] = useState(0) // Force re-fetch için

  useEffect(() => {
    // Initialize theme
    if (typeof window !== 'undefined') {
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setTheme('dark')
        document.documentElement.classList.add('dark')
      } else {
        setTheme('light')
        document.documentElement.classList.remove('dark')
      }
    }
  }, [])

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      setTheme('light')
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }

  // Sayfa yüklendiğinde ve pathname değiştiğinde kullanıcı bilgisini çek
  useEffect(() => {
    // Her pathname değişiminde loading'i true yap ve yeniden fetch et
    setLoading(true)
    fetchUser()
    fetchCartCount()
  }, [pathname, fetchKey])

  // Sayfa focus aldığında kullanıcı bilgisini yeniden çek (tab değişikliği vs.)
  useEffect(() => {
    const handleFocus = () => {
      setFetchKey(prev => prev + 1) // Force re-fetch
    }
    
    // Sayfa görünür olduğunda da kontrol et
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setFetchKey(prev => prev + 1)
      }
    }
    
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const fetchUser = async () => {
    try {
      // Timestamp ekleyerek cache'i bypass et
      const timestamp = Date.now()
      const response = await fetch(`/api/auth/me?_t=${timestamp}`, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      const data = await response.json()
      
      if (data.success && data.data?.user) {
        setUser(data.data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('User load error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchCartCount = async () => {
    try {
      const timestamp = Date.now()
      const response = await fetch(`/api/cart?_t=${timestamp}`, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
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
      toast.loading(t('logout.loggingOut'), { id: 'logout' })
      
      await fetch('/api/auth/logout', { 
        method: 'POST',
        cache: 'no-store'
      })
      
      toast.success(t('logout.success'), { id: 'logout' })
      
      setUser(null)
      setCartCount(0)
      
      // Tam sayfa yenilemesi yap - tüm cache'i temizle
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } catch (error) {
      console.error('Logout error:', error)
      toast.error(t('common.error'), { id: 'logout' })
    }
  }

  const { t } = useLanguage()

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/kategori/erkek', label: t('nav.men') },
    { href: '/kategori/kadin', label: t('nav.women') },
    { href: '/kategori/cocuk', label: t('nav.kids') },
    { href: '/kampanyalar', label: t('nav.campaigns') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-border-light dark:border-border-dark shadow-soft transition-colors duration-300">
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
              aria-label={t('nav.cart')}
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
              aria-label={t('nav.favorites')}
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
                      {t('nav.profile')}
                    </Link>
                    <Link
                      href="/profil/siparisler"
                      className="block px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all font-medium"
                    >
                      {t('admin.orders')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2 transition-all font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center justify-center rounded-xl h-11 w-11 hover:bg-accent-lighter hover:text-primary-600 transition-all hover:scale-105"
                aria-label={t('nav.login')}
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center rounded-xl h-11 w-11 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110 ml-1"
              aria-label="Tema Değiştir"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 transition-all duration-300" />
              ) : (
                <Sun className="h-5 w-5 transition-all duration-300" />
              )}
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

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

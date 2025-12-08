'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Settings, 
  LogOut,
  Tag,
  Menu,
  X,
  Users,
  Sun,
  Moon,
  Globe,
  ChevronDown
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/lib/i18n'

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const langMenuRef = useRef<HTMLDivElement>(null)
  const { t, language, setLanguage, languages } = useLanguage()

  useEffect(() => {
    // Sayfa yüklendiğinde mevcut temayı kontrol et
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const currentLang = languages.find(l => l.code === language)

  const navLinks = [
    { href: '/admin', icon: LayoutDashboard, label: t('admin.dashboard') },
    { href: '/admin/urunler', icon: Package, label: t('admin.products') },
    { href: '/admin/siparisler', icon: ShoppingCart, label: t('admin.orders') },
    { href: '/admin/musteriler', icon: Users, label: t('admin.customers') },
    { href: '/admin/kategoriler', icon: Tag, label: t('admin.categories') },
    { href: '/admin/ayarlar', icon: Settings, label: t('admin.settings') },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        dir="ltr"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{ left: '1rem', right: 'auto' }}
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        dir="ltr"
        className={`fixed lg:sticky top-0 left-0 z-40 w-64 h-screen transition-transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700`}
        style={{ left: 0, right: 'auto', textAlign: 'left' }}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight">{t('admin.title')}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs">{t('admin.subtitle')}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 flex-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || (link.href !== '/admin' && pathname?.startsWith(link.href))
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 mt-auto">
            {/* Language Switcher */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Globe className="h-5 w-5" />
                <span className="text-lg">{currentLang?.flag}</span>
                <span className="text-sm font-medium flex-1">{currentLang?.name}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code)
                        setLangMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                        language === lang.code
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="text-sm font-medium">{isDark ? t('admin.lightTheme') : t('admin.darkTheme')}</span>
            </button>
            
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium">{t('admin.homepage')}</span>
            </Link>
            <button
              onClick={async () => {
                try {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  window.location.href = '/'
                } catch (error) {
                  alert(t('common.error'))
                }
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          dir="ltr"
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          style={{ left: 0, right: 0 }}
        />
      )}
    </>
  )
}

'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'
import PageTransition from '@/components/PageTransition'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useEffect } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { language } = useLanguage()
  
  useEffect(() => {
    // Admin paneli her zaman LTR olmalı - layout bozulmasını önle
    // Dil Arapça olsa bile admin panelinde LTR kullan
    document.documentElement.setAttribute('dir', 'ltr')
    document.documentElement.classList.remove('rtl')
    
    // Cleanup: Admin panelinden çıkınca eski ayarları geri yükle
    return () => {
      if (language === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl')
        document.documentElement.classList.add('rtl')
      }
    }
  }, [language])

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" dir="ltr">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-10 relative overflow-x-hidden">
        <PageTransition>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </PageTransition>
      </main>
    </div>
  )
}

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
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900" dir="ltr">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-10 relative">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  )
}

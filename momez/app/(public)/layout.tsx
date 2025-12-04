'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useEffect } from 'react'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { language } = useLanguage()
  
  useEffect(() => {
    // RTL desteği: Public sayfalarda dile göre dir attribute'unu ayarla
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl')
      document.documentElement.classList.add('rtl')
    } else {
      document.documentElement.setAttribute('dir', 'ltr')
      document.documentElement.classList.remove('rtl')
    }
  }, [language])

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <Header />
      <main className="min-h-screen relative">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}

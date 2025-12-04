'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, languages, getTranslation } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
  languages: typeof languages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // LocalStorage'dan dil tercihini al
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && ['tr', 'en', 'ar'].includes(savedLang)) {
      setLanguageState(savedLang)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      // HTML dir attribute'unu güncelle
      const langConfig = languages.find(l => l.code === language)
      document.documentElement.dir = langConfig?.dir || 'ltr'
      document.documentElement.lang = language
    }
  }, [language, mounted])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string) => getTranslation(language, key)

  const currentLang = languages.find(l => l.code === language)
  const dir = currentLang?.dir || 'ltr'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, languages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    // Server-side veya Provider dışında kullanılırsa varsayılan değerler döndür
    return {
      language: 'tr' as Language,
      setLanguage: () => {},
      t: (key: string) => getTranslation('tr', key),
      dir: 'ltr' as const,
      languages
    }
  }
  return context
}

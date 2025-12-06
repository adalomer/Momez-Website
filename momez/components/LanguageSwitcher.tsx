'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const { language, setLanguage, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = languages.find(l => l.code === language)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative flex-shrink-0" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer"
        aria-label="Dil seçimi"
        type="button"
      >
        <Globe className="h-5 w-5 flex-shrink-0" />
        <span className="text-lg flex-shrink-0">{currentLang?.flag}</span>
        <span className="hidden sm:inline text-sm font-medium">{currentLang?.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-[100]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setLanguage(lang.code)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
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
  )
}

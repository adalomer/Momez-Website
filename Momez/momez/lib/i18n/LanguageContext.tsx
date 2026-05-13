'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Language, languages, getTranslation } from './translations'

interface LanguageContextType {
	language: Language
	setLanguage: (lang: Language) => void
	t: (key: string) => string
	dir: 'ltr' | 'rtl'
	isRTL: boolean
	languages: typeof languages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguageState] = useState<Language>('en')
	const [mounted, setMounted] = useState(false)
	const pathname = usePathname()

	useEffect(() => {
		// Get language preference from localStorage
		const savedLang = localStorage.getItem('language') as Language
		if (savedLang && ['en', 'ar'].includes(savedLang)) {
			setLanguageState(savedLang)
		}
		setMounted(true)
	}, [])

	useEffect(() => {
		if (mounted) {
			// Skip RTL in admin panel - admin should always be LTR
			const isAdminPanel = pathname?.startsWith('/admin')

			if (isAdminPanel) {
				// Always LTR in admin panel
				document.documentElement.dir = 'ltr'
				document.documentElement.classList.remove('rtl')
			} else {
				// Set dir based on language for public pages
				const langConfig = languages.find(l => l.code === language)
				document.documentElement.dir = langConfig?.dir || 'ltr'
				if (langConfig?.dir === 'rtl') {
					document.documentElement.classList.add('rtl')
				} else {
					document.documentElement.classList.remove('rtl')
				}
			}
			document.documentElement.lang = language
		}
	}, [language, mounted, pathname])

	const setLanguage = (lang: Language) => {
		setLanguageState(lang)
		localStorage.setItem('language', lang)
	}

	const t = (key: string) => getTranslation(language, key)

	const currentLang = languages.find(l => l.code === language)
	const dir = currentLang?.dir || 'ltr'
	const isRTL = dir === 'rtl'

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t, dir, isRTL, languages }}>
			{children}
		</LanguageContext.Provider>
	)
}

export function useLanguage() {
	const context = useContext(LanguageContext)
	if (context === undefined) {
		// Return default values when used outside Provider or server-side
		return {
			language: 'en' as Language,
			setLanguage: () => { },
			t: (key: string) => getTranslation('en', key),
			dir: 'ltr' as const,
			isRTL: false,
			languages
		}
	}
	return context
}

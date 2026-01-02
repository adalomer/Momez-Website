'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie, Settings, Check } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface CookiePreferences {
	necessary: boolean      // Zorunlu - her zaman true
	functional: boolean     // İşlevsel
	analytics: boolean      // Analitik
	marketing: boolean      // Pazarlama
}

export default function CookieBanner() {
	const { t } = useLanguage()
	const [showBanner, setShowBanner] = useState(false)
	const [showSettings, setShowSettings] = useState(false)
	const [preferences, setPreferences] = useState<CookiePreferences>({
		necessary: true,
		functional: false,
		analytics: false,
		marketing: false
	})

	useEffect(() => {
		// Cookie tercihlerini kontrol et
		const savedPreferences = localStorage.getItem('cookiePreferences')
		if (!savedPreferences) {
			// Tercihler kaydedilmemişse banner'ı göster
			setShowBanner(true)
		} else {
			try {
				const parsed = JSON.parse(savedPreferences)
				setPreferences(parsed)
			} catch (e) {
				setShowBanner(true)
			}
		}
	}, [])

	const savePreferences = (prefs: CookiePreferences) => {
		localStorage.setItem('cookiePreferences', JSON.stringify(prefs))
		localStorage.setItem('cookieConsentDate', new Date().toISOString())
		setPreferences(prefs)
		setShowBanner(false)
		setShowSettings(false)
	}

	const acceptAll = () => {
		savePreferences({
			necessary: true,
			functional: true,
			analytics: true,
			marketing: true
		})
	}

	const acceptNecessaryOnly = () => {
		savePreferences({
			necessary: true,
			functional: false,
			analytics: false,
			marketing: false
		})
	}

	const saveCustomPreferences = () => {
		savePreferences(preferences)
	}

	if (!showBanner) return null

	return (
		<>
			{/* Ana Cookie Banner */}
			<div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-white dark:bg-slate-900 border-t-2 border-red-500 shadow-2xl">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
						<div className="flex items-start gap-3 flex-1">
							<div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full shrink-0">
								<Cookie className="h-6 w-6 text-red-500" />
							</div>
							<div>
								<h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
									{t('cookie.banner.title')}
								</h3>
								<p className="text-sm text-slate-600 dark:text-slate-400">
									{t('cookie.banner.description')}{' '}
									<Link href="/cerez-politikasi" className="text-red-500 hover:underline font-medium">
										{t('cookie.title')}
									</Link>
								</p>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2 shrink-0">
							<button
								onClick={() => setShowSettings(!showSettings)}
								className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
							>
								<Settings className="h-4 w-4" />
								{t('cookie.banner.settings')}
							</button>
							<button
								onClick={acceptNecessaryOnly}
								className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
							>
								{t('cookie.banner.necessaryOnly')}
							</button>
							<button
								onClick={acceptAll}
								className="px-6 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2"
							>
								<Check className="h-4 w-4" />
								{t('cookie.banner.acceptAll')}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Detaylı Ayarlar Modal */}
			{showSettings && (
				<div className="fixed inset-0 z-[101] bg-black/50 flex items-center justify-center p-4">
					<div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
						<div className="sticky top-0 bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
							<h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
								<Cookie className="h-6 w-6 text-red-500" />
								{t('cookie.banner.preferences')}
							</h2>
							<button
								onClick={() => setShowSettings(false)}
								className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
							>
								<X className="h-5 w-5 text-slate-500" />
							</button>
						</div>

						<div className="p-6 space-y-6">
							{/* Zorunlu Çerezler */}
							<div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
								<div className="flex items-center justify-between mb-2">
									<h3 className="font-bold text-slate-900 dark:text-white">{t('cookie.banner.necessary')}</h3>
									<span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
										{t('cookie.banner.alwaysActive')}
									</span>
								</div>
								<p className="text-sm text-slate-600 dark:text-slate-400">
									{t('cookie.banner.necessaryDesc')}
								</p>
								<div className="mt-3 text-xs text-slate-500 dark:text-slate-500">
									<strong>{t('cookie.banner.example')}</strong> auth_token, session_id, csrf_token
								</div>
							</div>

							{/* İşlevsel Çerezler */}
							<div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
								<div className="flex items-center justify-between mb-2">
									<h3 className="font-bold text-slate-900 dark:text-white">{t('cookie.banner.functional')}</h3>
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={preferences.functional}
											onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
											className="sr-only peer"
										/>
										<div className="w-11 h-6 bg-slate-300 peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
									</label>
								</div>
								<p className="text-sm text-slate-600 dark:text-slate-400">
									{t('cookie.banner.functionalDesc')}
								</p>
								<div className="mt-3 text-xs text-slate-500 dark:text-slate-500">
									<strong>{t('cookie.banner.example')}</strong> theme, language, timezone
								</div>
							</div>

							{/* Analitik Çerezler */}
							<div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
								<div className="flex items-center justify-between mb-2">
									<h3 className="font-bold text-slate-900 dark:text-white">{t('cookie.banner.analytics')}</h3>
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={preferences.analytics}
											onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
											className="sr-only peer"
										/>
										<div className="w-11 h-6 bg-slate-300 peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
									</label>
								</div>
								<p className="text-sm text-slate-600 dark:text-slate-400">
									{t('cookie.banner.analyticsDesc')}
								</p>
								<div className="mt-3 text-xs text-slate-500 dark:text-slate-500">
									<strong>{t('cookie.banner.example')}</strong> Google Analytics, Hotjar
								</div>
							</div>

							{/* Pazarlama Çerezleri */}
							<div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
								<div className="flex items-center justify-between mb-2">
									<h3 className="font-bold text-slate-900 dark:text-white">{t('cookie.banner.marketing')}</h3>
									<label className="relative inline-flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={preferences.marketing}
											onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
											className="sr-only peer"
										/>
										<div className="w-11 h-6 bg-slate-300 peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
									</label>
								</div>
								<p className="text-sm text-slate-600 dark:text-slate-400">
									{t('cookie.banner.marketingDesc')}
								</p>
								<div className="mt-3 text-xs text-slate-500 dark:text-slate-500">
									<strong>{t('cookie.banner.example')}</strong> Facebook Pixel, Google Ads
								</div>
							</div>

							<div className="text-sm text-slate-500 dark:text-slate-400">
								{t('cookie.banner.moreInfo')}{' '}
								<Link href="/cerez-politikasi" className="text-red-500 hover:underline">
									{t('cookie.title')}
								</Link>{' '}
								{t('cookie.banner.and')}{' '}
								<Link href="/gizlilik-politikasi" className="text-red-500 hover:underline">
									{t('privacy.title')}
								</Link>{' '}
							</div>
						</div>

						<div className="sticky bottom-0 bg-white dark:bg-slate-800 p-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 justify-end">
							<button
								onClick={acceptNecessaryOnly}
								className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
							>
								{t('cookie.banner.necessaryOnly')}
							</button>
							<button
								onClick={saveCustomPreferences}
								className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
							>
								{t('cookie.banner.saveSelected')}
							</button>
							<button
								onClick={acceptAll}
								className="px-6 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
							>
								{t('cookie.banner.acceptAll')}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

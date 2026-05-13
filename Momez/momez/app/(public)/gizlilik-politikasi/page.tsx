'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

export default function GizlilikPolitikasiPage() {
	const { t, language } = useLanguage()

	return (
		<div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-900">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12">
					<h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
						🔐 {t('privacyPolicy.title')}
					</h1>
					<p className="text-slate-500 dark:text-slate-400 mb-8">
						{t('privacyPolicy.lastUpdate')}: {new Date().toLocaleDateString(language === 'ar' ? 'ar-IQ' : 'en-GB')}
					</p>

					<div className="prose prose-slate dark:prose-invert max-w-none">
						<section className="mb-8">
							<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
								1. {t('privacyPolicy.introTitle')}
							</h2>
							<p className="text-slate-600 dark:text-slate-400">
								{t('privacyPolicy.introText')}
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
								2. {t('privacyPolicy.collectedInfoTitle')}
							</h2>
							<p className="text-slate-600 dark:text-slate-400 mb-4">
								{t('privacyPolicy.collectedInfoDesc')}
							</p>

							<h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">
								2.1 {t('privacyPolicy.providedInfoTitle')}
							</h3>
							<ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
								<li>{t('privacyPolicy.providedInfo1')}</li>
								<li>{t('privacyPolicy.providedInfo2')}</li>
								<li>{t('privacyPolicy.providedInfo3')}</li>
							</ul>

							<h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">
								2.2 {t('privacyPolicy.autoCollectedTitle')}
							</h3>
							<ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
								<li>{t('privacyPolicy.autoCollected1')}</li>
								<li>{t('privacyPolicy.autoCollected2')}</li>
								<li>{t('privacyPolicy.autoCollected3')}</li>
								<li>{t('privacyPolicy.autoCollected4')}</li>
							</ul>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
								3. {t('privacyPolicy.usagePurposesTitle')}
							</h2>
							<ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
								<li>{t('privacyPolicy.usage1')}</li>
								<li>{t('privacyPolicy.usage2')}</li>
								<li>{t('privacyPolicy.usage3')}</li>
								<li>{t('privacyPolicy.usage4')}</li>
								<li>{t('privacyPolicy.usage5')}</li>
								<li>{t('privacyPolicy.usage6')}</li>
							</ul>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
								4. {t('privacyPolicy.securityTitle')}
							</h2>
							<p className="text-slate-600 dark:text-slate-400">
								{t('privacyPolicy.securityDesc')}
							</p>
							<div className="mt-4 grid md:grid-cols-2 gap-4">
								<div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
									<span className="text-2xl">🔒</span>
									<p className="text-slate-700 dark:text-slate-300 font-medium mt-2">{t('privacyPolicy.sslTitle')}</p>
									<p className="text-slate-600 dark:text-slate-400 text-sm">{t('privacyPolicy.sslDesc')}</p>
								</div>
								<div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
									<span className="text-2xl">🛡️</span>
									<p className="text-slate-700 dark:text-slate-300 font-medium mt-2">{t('privacyPolicy.secureServersTitle')}</p>
									<p className="text-slate-600 dark:text-slate-400 text-sm">{t('privacyPolicy.secureServersDesc')}</p>
								</div>
								<div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
									<span className="text-2xl">🔑</span>
									<p className="text-slate-700 dark:text-slate-300 font-medium mt-2">{t('privacyPolicy.encryptedPasswordsTitle')}</p>
									<p className="text-slate-600 dark:text-slate-400 text-sm">{t('privacyPolicy.encryptedPasswordsDesc')}</p>
								</div>
								<div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
									<span className="text-2xl">👁️</span>
									<p className="text-slate-700 dark:text-slate-300 font-medium mt-2">{t('privacyPolicy.accessControlTitle')}</p>
									<p className="text-slate-600 dark:text-slate-400 text-sm">{t('privacyPolicy.accessControlDesc')}</p>
								</div>
							</div>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
								5. {t('privacyPolicy.thirdPartyTitle')}
							</h2>
							<p className="text-slate-600 dark:text-slate-400 mb-4">
								{t('privacyPolicy.thirdPartyDesc')}
							</p>
							<ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
								<li>{t('privacyPolicy.thirdParty1')}</li>
								<li>{t('privacyPolicy.thirdParty2')}</li>
								<li>{t('privacyPolicy.thirdParty3')}</li>
							</ul>
							<div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
								<p className="text-slate-700 dark:text-slate-300">
									<strong>⚠️ {t('privacyPolicy.important')}:</strong> {t('privacyPolicy.noSellData')}
								</p>
							</div>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
								6. {t('privacyPolicy.cookiesTitle')}
							</h2>
							<p className="text-slate-600 dark:text-slate-400">
								{t('privacyPolicy.cookiesDesc')}
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
								7. {t('privacyPolicy.yourRightsTitle')}
							</h2>
							<p className="text-slate-600 dark:text-slate-400 mb-4">
								{t('privacyPolicy.yourRightsDesc')}
							</p>
							<ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
								<li>{t('privacyPolicy.right1')}</li>
								<li>{t('privacyPolicy.right2')}</li>
								<li>{t('privacyPolicy.right3')}</li>
								<li>{t('privacyPolicy.right4')}</li>
							</ul>
						</section>

						<section>
							<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
								8. {t('privacyPolicy.contactTitle')}
							</h2>
							<p className="text-slate-600 dark:text-slate-400">
								{t('privacyPolicy.contactDesc')}
							</p>
							<div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
								<p className="text-slate-700 dark:text-slate-300">
									<strong>{t('privacyPolicy.email')}:</strong> support@momez.co
								</p>
							</div>
						</section>
					</div>

					<div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
						<div className="flex flex-wrap gap-4">
							<Link
								href="/kvkk"
								className="text-red-500 hover:text-red-600 font-medium"
							>
								{t('footer.kvkk')} →
							</Link>
							<Link
								href="/kullanim-kosullari"
								className="text-red-500 hover:text-red-600 font-medium"
							>
								{t('footer.terms')} →
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

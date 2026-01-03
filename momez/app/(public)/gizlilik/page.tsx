'use client'

import { useLanguage } from '@/lib/i18n'

export default function GizlilikPage() {
	const { t } = useLanguage()

	return (
		<div className="min-h-screen py-12">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
					{t('privacy.title')}
				</h1>
				<div className="prose dark:prose-invert max-w-none">
					<p className="text-slate-600 dark:text-slate-400">
						{t('privacy.intro')}
					</p>

					<h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
						{t('privacy.dataCollection')}
					</h2>
					<p className="text-slate-600 dark:text-slate-400">
						{t('privacy.dataCollectionDesc')}
					</p>

					<h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
						{t('privacy.dataUsage')}
					</h2>
					<p className="text-slate-600 dark:text-slate-400">
						{t('privacy.dataUsageDesc')}
					</p>

					<h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
						{t('privacy.dataSecurity')}
					</h2>
					<p className="text-slate-600 dark:text-slate-400">
						{t('privacy.dataSecurityDesc')}
					</p>

					<h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
						{t('privacy.cookies')}
					</h2>
					<p className="text-slate-600 dark:text-slate-400">
						{t('privacy.cookiesDesc')}
					</p>

					<h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
						{t('privacy.contact')}
					</h2>
					<p className="text-slate-600 dark:text-slate-400">
						{t('privacy.contactDesc')}
					</p>
				</div>
			</div>
		</div>
	)
}

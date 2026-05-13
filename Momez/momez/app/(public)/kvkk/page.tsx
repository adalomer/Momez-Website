'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function KVKKPage() {
  const { t, isRTL } = useLanguage()
  
  return (
    <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            📋 {t('kvkkPage.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {t('kvkkPage.lastUpdate')}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mb-8">
              <p className="text-slate-700 dark:text-slate-300">
                {t('kvkkPage.intro')}
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('kvkkPage.dataController')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {t('kvkkPage.dataControllerDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('kvkkPage.collectedData')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {t('kvkkPage.collectedDataDesc')}
              </p>
              <ul className={`list-disc ${isRTL ? 'list-inside mr-4' : 'list-inside'} text-slate-600 dark:text-slate-400 space-y-2`}>
                <li>{t('kvkkPage.identityInfo')}</li>
                <li>{t('kvkkPage.contactInfo')}</li>
                <li>{t('kvkkPage.transactionInfo')}</li>
                <li>{t('kvkkPage.usageInfo')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('kvkkPage.purposes')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {t('kvkkPage.purposesDesc')}
              </p>
              <ul className={`list-disc ${isRTL ? 'list-inside mr-4' : 'list-inside'} text-slate-600 dark:text-slate-400 space-y-2`}>
                <li>{t('kvkkPage.purpose1')}</li>
                <li>{t('kvkkPage.purpose2')}</li>
                <li>{t('kvkkPage.purpose3')}</li>
                <li>{t('kvkkPage.purpose4')}</li>
                <li>{t('kvkkPage.purpose5')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('kvkkPage.legalBasis')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {t('kvkkPage.legalBasisDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('kvkkPage.dataSharing')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {t('kvkkPage.dataSharingDesc')}
              </p>
              <ul className={`list-disc ${isRTL ? 'list-inside mr-4' : 'list-inside'} text-slate-600 dark:text-slate-400 space-y-2`}>
                <li>{t('kvkkPage.sharing1')}</li>
                <li>{t('kvkkPage.sharing2')}</li>
                <li>{t('kvkkPage.sharing3')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('kvkkPage.yourRights')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {t('kvkkPage.yourRightsDesc')}
              </p>
              <ul className={`list-disc ${isRTL ? 'list-inside mr-4' : 'list-inside'} text-slate-600 dark:text-slate-400 space-y-2`}>
                <li>{t('kvkkPage.right1')}</li>
                <li>{t('kvkkPage.right2')}</li>
                <li>{t('kvkkPage.right3')}</li>
                <li>{t('kvkkPage.right4')}</li>
                <li>{t('kvkkPage.right5')}</li>
                <li>{t('kvkkPage.right6')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('kvkkPage.contactInfo2')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {t('kvkkPage.contactDesc')}
              </p>
              <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>E-posta:</strong> info@momez.com.tr<br />
                  <strong>{isRTL ? 'العنوان' : 'Adres'}:</strong> İstanbul, Türkiye
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/gizlilik-politikasi" 
                className="text-red-500 hover:text-red-600 font-medium"
              >
                {t('privacy.title')} →
              </Link>
              <Link 
                href="/cerez-politikasi" 
                className="text-red-500 hover:text-red-600 font-medium"
              >
                {t('cookie.title')} →
              </Link>
              <Link 
                href="/kullanim-kosullari" 
                className="text-red-500 hover:text-red-600 font-medium"
              >
                {t('terms.title')} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

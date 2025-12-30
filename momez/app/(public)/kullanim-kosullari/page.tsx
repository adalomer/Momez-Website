'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function KullanimKosullariPage() {
  const { t, isRTL } = useLanguage()
  
  return (
    <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            📜 {t('termsPage.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {t('termsPage.lastUpdate')}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mb-8">
              <p className="text-slate-700 dark:text-slate-300">
                {t('termsPage.intro')}
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('termsPage.generalTerms')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {t('termsPage.generalTermsDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('termsPage.userAccount')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {t('termsPage.userAccountDesc')}
              </p>
              <ul className={`list-disc ${isRTL ? 'list-inside mr-4' : 'list-inside'} text-slate-600 dark:text-slate-400 space-y-2`}>
                <li>{t('termsPage.account1')}</li>
                <li>{t('termsPage.account2')}</li>
                <li>{t('termsPage.account3')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('termsPage.ordersPayment')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {t('termsPage.ordersPaymentDesc')}
              </p>
              <ul className={`list-disc ${isRTL ? 'list-inside mr-4' : 'list-inside'} text-slate-600 dark:text-slate-400 space-y-2`}>
                <li>{t('termsPage.order1')}</li>
                <li>{t('termsPage.order2')}</li>
                <li>{t('termsPage.order3')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('termsPage.shippingDelivery')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {t('termsPage.shippingDeliveryDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('termsPage.returnExchange')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {t('termsPage.returnExchangeDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('termsPage.intellectualProperty')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {t('termsPage.intellectualPropertyDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('termsPage.limitationLiability')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {t('termsPage.limitationLiabilityDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('termsPage.changes')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {t('termsPage.changesDesc')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('termsPage.contact')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {t('termsPage.contactDesc')}
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
                href="/kvkk" 
                className="text-red-500 hover:text-red-600 font-medium"
              >
                {t('kvkk.title')} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

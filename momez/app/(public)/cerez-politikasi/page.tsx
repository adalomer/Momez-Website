'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function CerezPolitikasiPage() {
  const { t, isRTL } = useLanguage()
  
  return (
    <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {t('cookiePage.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {t('cookiePage.lastUpdate')}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('cookiePage.whatIsCookie')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {t('cookiePage.whatIsCookieDesc')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('cookiePage.cookieTypes')}
              </h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-2">
                    {t('cookiePage.requiredCookies')}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {t('cookiePage.requiredCookiesDesc')}
                  </p>
                  <ul className={`list-disc ${isRTL ? 'list-inside mr-4' : 'list-inside'} text-slate-600 dark:text-slate-400 space-y-1`}>
                    <li>{t('cookiePage.authToken')}</li>
                    <li>{t('cookiePage.sessionId')}</li>
                    <li>{t('cookiePage.csrfToken')}</li>
                    <li>{t('cookiePage.cookiePrefs')}</li>
                  </ul>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-3 font-medium">
                    {t('cookiePage.requiredCookiesNote')}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-bold text-blue-800 dark:text-blue-400 mb-2">
                    {t('cookiePage.functionalCookies')}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {t('cookiePage.functionalCookiesDesc')}
                  </p>
                  <ul className={`list-disc ${isRTL ? 'list-inside mr-4' : 'list-inside'} text-slate-600 dark:text-slate-400 space-y-1`}>
                    <li>{t('cookiePage.theme')}</li>
                    <li>{t('cookiePage.language')}</li>
                    <li>{t('cookiePage.recentlyViewed')}</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <h3 className="text-lg font-bold text-purple-800 dark:text-purple-400 mb-2">
                    {t('cookiePage.analyticCookies')}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {t('cookiePage.analyticCookiesDesc')}
                  </p>
                  <ul className={`list-disc ${isRTL ? 'list-inside mr-4' : 'list-inside'} text-slate-600 dark:text-slate-400 space-y-1`}>
                    <li>{t('cookiePage.googleAnalytics')}</li>
                    <li>{t('cookiePage.hotjar')}</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <h3 className="text-lg font-bold text-orange-800 dark:text-orange-400 mb-2">
                    {t('cookiePage.marketingCookies')}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {t('cookiePage.marketingCookiesDesc')}
                  </p>
                  <ul className={`list-disc ${isRTL ? 'list-inside mr-4' : 'list-inside'} text-slate-600 dark:text-slate-400 space-y-1`}>
                    <li>{t('cookiePage.fbPixel')}</li>
                    <li>{t('cookiePage.googleAds')}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('cookiePage.manageCookies')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {t('cookiePage.manageCookiesDesc')}
              </p>
              <ul className={`list-disc ${isRTL ? 'list-inside mr-4' : 'list-inside'} text-slate-600 dark:text-slate-400 space-y-2`}>
                <li>{t('cookiePage.cookieBanner')}</li>
                <li>{t('cookiePage.browserSettings')}</li>
              </ul>
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  {t('cookiePage.cookieWarning')}
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('cookiePage.thirdPartyCookies')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {t('cookiePage.thirdPartyCookiesDesc')}
              </p>
              <ul className={`list-disc ${isRTL ? 'list-inside mr-4' : 'list-inside'} text-slate-600 dark:text-slate-400 space-y-2`}>
                <li><strong>Google Analytics:</strong> Site usage analysis</li>
                <li><strong>Google Ads:</strong> Ad conversion tracking</li>
                <li><strong>Facebook Pixel:</strong> Social media ads</li>
                <li><strong>Hotjar:</strong> User behavior analysis</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('cookiePage.cookieDuration')}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-100 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-bold">{t('cookiePage.cookieType')}</th>
                      <th className="px-4 py-3 font-bold">{t('cookiePage.storageDuration')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr>
                      <td className="px-4 py-3">{t('cookiePage.sessionCookies')}</td>
                      <td className="px-4 py-3">{t('cookiePage.untilBrowserClose')}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">{t('cookiePage.authCookies')}</td>
                      <td className="px-4 py-3">{t('cookiePage.days7')}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">{t('cookiePage.preferenceCookies')}</td>
                      <td className="px-4 py-3">{t('cookiePage.year1')}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">{t('cookiePage.analyticCookiesTable')}</td>
                      <td className="px-4 py-3">{t('cookiePage.years2')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('cookiePage.legalBasis')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {t('cookiePage.legalBasisDesc')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t('cookiePage.contact')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {t('cookiePage.contactDesc')}
              </p>
              <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>E-posta:</strong> info@momez.com.tr<br />
                  <strong>{t('contact.title') === 'اتصل بنا' ? 'العنوان' : 'Adres'}:</strong> İstanbul, Türkiye
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
                href="/kvkk" 
                className="text-red-500 hover:text-red-600 font-medium"
              >
                {t('kvkk.title')} →
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

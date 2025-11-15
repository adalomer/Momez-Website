'use client'

import { Save } from 'lucide-react'

// Admin genel ayarlar sayfası - Demo

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Genel Ayarlar
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Site ayarlarını yönetin
        </p>
      </div>

      {/* Settings Form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault()
          alert('Ayarlar kaydedildi (Demo)')
        }}>
          {/* Site Info */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Site Bilgileri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Site Adı
                </label>
                <input
                  type="text"
                  defaultValue="Momez"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Site Sloganı
                </label>
                <input
                  type="text"
                  defaultValue="Adımınıza Stil Katın"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Site Açıklaması
                </label>
                <textarea
                  rows={3}
                  defaultValue="En trend ayakkabı modellerini keşfedin. Kaliteli ve şık ayakkabılar Momez'de!"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              İletişim Bilgileri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  defaultValue="info@momez.com"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  defaultValue="+90 555 123 4567"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  defaultValue="+90 555 123 4567"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Adres
                </label>
                <input
                  type="text"
                  defaultValue="İstanbul, Türkiye"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Shipping Settings */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Kargo Ayarları
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Ücretsiz Kargo Limiti (TL)
                </label>
                <input
                  type="number"
                  defaultValue="500"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Standart Kargo Ücreti (TL)
                </label>
                <input
                  type="number"
                  defaultValue="50"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Sosyal Medya
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  defaultValue="@momez"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Facebook
                </label>
                <input
                  type="text"
                  defaultValue="momez"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Twitter
                </label>
                <input
                  type="text"
                  defaultValue="@momez"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  YouTube
                </label>
                <input
                  type="text"
                  defaultValue="momez"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="h-5 w-5" />
              Ayarları Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

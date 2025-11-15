'use client'

import Link from 'next/link'
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react'

// Kullanıcı profil sayfası - Supabase kurulunca çalışacak

export default function ProfilePage() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Hesabım
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="space-y-1">
                <Link
                  href="/profil"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
                >
                  <User className="h-5 w-5" />
                  Profil Bilgileri
                </Link>
                <Link
                  href="/profil/siparisler"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Package className="h-5 w-5" />
                  Siparişlerim
                </Link>
                <Link
                  href="/favoriler"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Heart className="h-5 w-5" />
                  Favorilerim
                </Link>
                <Link
                  href="/profil/adresler"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <MapPin className="h-5 w-5" />
                  Adreslerim
                </Link>
                <Link
                  href="/profil/ayarlar"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Settings className="h-5 w-5" />
                  Ayarlar
                </Link>
                <button
                  onClick={() => alert('Çıkış yapılıyor (Supabase kurulunca çalışacak)')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5" />
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Profil Bilgileri
              </h2>

              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault()
                alert('Profil güncellendi (Supabase kurulunca çalışacak)')
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Ad
                    </label>
                    <input
                      type="text"
                      defaultValue="Ahmet"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Soyad
                    </label>
                    <input
                      type="text"
                      defaultValue="Yılmaz"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    defaultValue="ahmet@example.com"
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400"
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    E-posta adresi değiştirilemez
                  </p>
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
                    Doğum Tarihi
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                  >
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </form>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  ℹ️ <strong>Bu sayfa Supabase kurulumu sonrası aktif olacak.</strong> Giriş yaptıktan sonra profil bilgilerinizi güncelleyebileceksiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

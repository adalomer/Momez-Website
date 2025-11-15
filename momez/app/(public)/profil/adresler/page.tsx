'use client'

import Link from 'next/link'
import { User, Package, Heart, MapPin, Settings, LogOut, Plus, Edit, Trash2 } from 'lucide-react'

// Kullanıcı adresler sayfası - Supabase kurulunca çalışacak

export default function AddressesPage() {
  // Demo adresler
  const addresses = [
    {
      id: 1,
      title: 'Ev',
      fullName: 'Ahmet Yılmaz',
      phone: '+90 555 123 4567',
      address: 'Atatürk Caddesi No:123 Daire:5',
      district: 'Kadıköy',
      city: 'İstanbul',
      postalCode: '34740',
      isDefault: true,
    },
    {
      id: 2,
      title: 'İş',
      fullName: 'Ahmet Yılmaz',
      phone: '+90 555 123 4567',
      address: 'Büyükdere Caddesi No:45 Kat:8',
      district: 'Şişli',
      city: 'İstanbul',
      postalCode: '34394',
      isDefault: false,
    },
  ]

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
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Adreslerim
                </h2>
                <button
                  onClick={() => alert('Yeni adres ekleme formu açılacak (Supabase kurulunca çalışacak)')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Yeni Adres
                </button>
              </div>

              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                          {address.title}
                        </h3>
                        {address.isDefault && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                            Varsayılan
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert('Adres düzenleme (Demo)')}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => alert('Adres silme (Demo)')}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-slate-600 dark:text-slate-400">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {address.fullName}
                      </p>
                      <p>{address.phone}</p>
                      <p>{address.address}</p>
                      <p>
                        {address.district} / {address.city}
                      </p>
                      <p>Posta Kodu: {address.postalCode}</p>
                    </div>

                    {!address.isDefault && (
                      <button
                        onClick={() => alert('Varsayılan adres yapıldı (Demo)')}
                        className="mt-3 text-sm text-primary hover:underline font-medium"
                      >
                        Varsayılan Adres Yap
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {addresses.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
                    Henüz kayıtlı adresiniz yok
                  </p>
                  <button
                    onClick={() => alert('Yeni adres ekleme (Demo)')}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                  >
                    İlk Adresini Ekle
                  </button>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  ℹ️ <strong>Adresleriniz güvende.</strong> Supabase kurulumu sonrası adresleriniz kaydedilecek ve tüm cihazlarınızda senkronize olacaktır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

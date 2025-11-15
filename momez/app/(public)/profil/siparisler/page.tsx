'use client'

import Link from 'next/link'
import { User, Package, Heart, MapPin, Settings, LogOut, CheckCircle, Clock, Truck, XCircle } from 'lucide-react'

// Kullanıcı siparişler sayfası - Supabase kurulunca çalışacak

export default function OrdersPage() {
  // Demo siparişler
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-11-15',
      total: 3498,
      status: 'delivered',
      items: [
        {
          name: 'AeroGlide Pro',
          size: '42',
          quantity: 1,
          price: 1899,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
        },
        {
          name: 'Urban Classic',
          size: '41',
          quantity: 1,
          price: 1599,
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
        },
      ],
    },
    {
      id: 'ORD-2024-002',
      date: '2024-11-14',
      total: 2299,
      status: 'shipped',
      items: [
        {
          name: 'Street Dunker',
          size: '43',
          quantity: 1,
          price: 2299,
          image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200&h=200&fit=crop',
        },
      ],
    },
  ]

  const statusConfig = {
    pending: { label: 'Beklemede', icon: Clock, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
    processing: { label: 'Hazırlanıyor', icon: Package, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
    shipped: { label: 'Kargoda', icon: Truck, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
    delivered: { label: 'Teslim Edildi', icon: CheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
    cancelled: { label: 'İptal', icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
  }

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
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
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
                Siparişlerim
              </h2>

              <div className="space-y-6">
                {orders.map((order) => {
                  const status = statusConfig[order.status as keyof typeof statusConfig]
                  const StatusIcon = status.icon

                  return (
                    <div
                      key={order.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:border-primary transition-colors"
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-lg">
                            Sipariş #{order.id}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {new Date(order.date).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${status.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">{status.label}</span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900 dark:text-white">
                                {item.name}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Beden: {item.size} • Adet: {item.quantity}
                              </p>
                            </div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              ₺{item.price.toLocaleString('tr-TR')}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => alert('Sipariş detayı (Demo)')}
                          className="text-primary hover:underline font-medium"
                        >
                          Detayları Görüntüle
                        </button>
                        <p className="text-lg font-bold text-primary">
                          Toplam: ₺{order.total.toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {orders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
                    Henüz siparişiniz yok
                  </p>
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                  >
                    Alışverişe Başla
                  </Link>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  ℹ️ <strong>Sipariş takibi aktif olacak.</strong> Supabase kurulumu sonrası tüm siparişlerinizi takip edebileceksiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

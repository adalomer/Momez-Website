'use client'

import Link from 'next/link'
import { User, Package, Heart, MapPin, LogOut, CheckCircle, Clock, Truck, XCircle, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { ordersAPI, authAPI } from '@/lib/api'

interface OrderItem {
  product_name: string
  size: string
  quantity: number
  price: number
  image_url: string
}

interface Order {
  id: number
  order_number: string
  total_amount: number
  status: string
  created_at: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const userResult = await authAPI.me() as { success: boolean; data?: any; error?: string }
      if (!userResult || !userResult.success) {
        router.push('/auth/login?redirect=/profil/siparisler')
        return
      }

      const result = await ordersAPI.getAll() as { success: boolean; data?: any[]; error?: string }
      if (result.success && result.data) {
        setOrders(result.data)
      }
    } catch (error) {
      console.error('Orders load error:', error)
      toast.error('Siparişler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      toast.success('Çıkış yapıldı')
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (error) {
      toast.error('Çıkış yapılamadı')
    }
  }

  const statusConfig = {
    pending: { label: 'Beklemede', icon: Clock, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
    confirmed: { label: 'Onaylandı', icon: CheckCircle, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
    preparing: { label: 'Hazırlanıyor', icon: Package, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
    shipped: { label: 'Kargoda', icon: Truck, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' },
    delivered: { label: 'Teslim Edildi', icon: CheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
    cancelled: { label: 'İptal', icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Toaster position="top-center" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <Toaster position="top-center" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Hesabım
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5" />
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Siparişlerim
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-slate-400 mx-auto mb-4" />
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
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => {
                    const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
                    const StatusIcon = status.icon

                    return (
                      <div
                        key={order.id}
                        className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:border-primary transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-lg">
                              Sipariş #{order.order_number}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {new Date(order.created_at).toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className={'flex items-center gap-2 px-3 py-2 rounded-lg ' + status.color}>
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">{status.label}</span>
                          </div>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="space-y-3 mb-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                                  <img
                                    src={item.image_url}
                                    alt={item.product_name}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-slate-900 dark:text-white">
                                    {item.product_name}
                                  </p>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Beden: {item.size} • Adet: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-bold text-slate-900 dark:text-white">
                                  ₺{Number(item.price).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-lg font-bold text-primary">
                            Toplam: ₺{(Number(order.total_amount) || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

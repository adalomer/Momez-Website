'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign,
  AlertCircle
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: string
  created_at: string
}

interface LowStockProduct {
  id: number
  name: string
  size: string
  stock: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data.stats)
        setRecentOrders(data.data.recentOrders)
        setLowStockProducts(data.data.lowStockProducts)
      } else {
        toast.error('Veriler yüklenemedi')
      }
    } catch (error) {
      console.error('Dashboard load error:', error)
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; class: string }> = {
      pending: { label: 'Beklemede', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      confirmed: { label: 'Onaylandı', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      preparing: { label: 'Hazırlanıyor', class: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
      shipped: { label: 'Kargoda', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
      delivered: { label: 'Teslim Edildi', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      cancelled: { label: 'İptal', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    }
    return badges[status] || badges.pending
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Toaster position="top-center" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-center" />
      
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Hoş geldiniz! İşletmenizin genel durumu.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-lg shadow-sm">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {stats?.totalOrders || 0}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Toplam Sipariş</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-lg shadow-sm">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            ₺{Number(stats?.totalRevenue || 0).toFixed(2)}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Toplam Gelir</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500 p-3 rounded-lg shadow-sm">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {stats?.totalProducts || 0}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Toplam Ürün</p>
        </div>

        <Link href="/admin/musteriler" className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500 p-3 rounded-lg shadow-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {stats?.totalCustomers || 0}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Toplam Müşteri</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Son Siparişler</h2>
              <Link href="/admin/siparisler" className="text-sm text-primary hover:underline">
                Tümünü Gör
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentOrders.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Henüz sipariş yok</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const badge = getStatusBadge(order.status)
                  return (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link 
                            href={`/admin/siparisler/${order.id}`}
                            className="font-medium text-slate-900 dark:text-white hover:text-primary"
                          >
                            {order.order_number}
                          </Link>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{order.customer_name}</p>
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        ₺{Number(order.total_amount).toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Düşük Stok Uyarıları</h2>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <div className="p-6">
            {lowStockProducts.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Düşük stoklu ürün yok</p>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={`${product.id}-${product.size}`} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Beden: {product.size}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.stock <= 3 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {product.stock} adet
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

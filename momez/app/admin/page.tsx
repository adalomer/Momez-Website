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
import { useLanguage } from '@/lib/i18n/LanguageContext'

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
  total: number
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
  const { t } = useLanguage()
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
        toast.error(t('common.error'))
      }
    } catch (error) {
      console.error('Dashboard load error:', error)
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; class: string }> = {
      pending: { label: t('admin.pending'), class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      confirmed: { label: t('admin.confirmed'), class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      preparing: { label: t('admin.processing'), class: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
      shipped: { label: t('admin.shipped'), class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
      delivered: { label: t('admin.delivered'), class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      cancelled: { label: t('admin.cancelled'), class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    }
    return badges[status] || badges.pending
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Toaster position="top-center" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-center" />
      
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 shadow-lg text-white">
        <h1 className="text-4xl font-bold mb-2">{t('admin.dashboard')}</h1>
        <p className="text-red-100 text-lg">
          {t('admin.welcome')}! {t('admin.welcomeSubtitle')}.
        </p>
      </div>

      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <div className="text-right">
              <h3 className="text-4xl font-bold mb-1">
                {stats?.totalOrders || 0}
              </h3>
              <p className="text-blue-100 text-sm font-medium">{t('admin.totalOrders')}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <Link href="/admin/siparisler" className="text-sm font-medium hover:underline flex items-center gap-2">
              {t('admin.viewAll')} →
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <DollarSign className="h-8 w-8" />
            </div>
            <div className="text-right">
              <h3 className="text-3xl font-bold mb-1">
                ₺{Number(stats?.totalRevenue || 0).toFixed(2)}
              </h3>
              <p className="text-green-100 text-sm font-medium">{t('admin.totalRevenue')}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm text-green-100">Bu ay</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Package className="h-8 w-8" />
            </div>
            <div className="text-right">
              <h3 className="text-4xl font-bold mb-1">
                {stats?.totalProducts || 0}
              </h3>
              <p className="text-purple-100 text-sm font-medium">{t('admin.totalProducts')}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <Link href="/admin/urunler" className="text-sm font-medium hover:underline flex items-center gap-2">
              {t('admin.viewAll')} →
            </Link>
          </div>
        </div>

        <Link 
          href="/admin/musteriler" 
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Users className="h-8 w-8" />
            </div>
            <div className="text-right">
              <h3 className="text-4xl font-bold mb-1">
                {stats?.totalCustomers || 0}
              </h3>
              <p className="text-orange-100 text-sm font-medium">{t('admin.totalCustomers')}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <span className="text-sm font-medium hover:underline flex items-center gap-2">
              {t('admin.viewAll')} →
            </span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('admin.recentOrders')}</h2>
              </div>
              <Link href="/admin/siparisler" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                {t('admin.viewAll')} →
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">{t('admin.noOrders')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const badge = getStatusBadge(order.status)
                  return (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link 
                            href={`/admin/siparisler/${order.id}`}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {order.order_number}
                          </Link>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${badge.class}`}>
                            {badge.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{order.customer_name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {new Date(order.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                          ₺{Number(order.total).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 p-2 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('admin.lowStockAlerts')}</h2>
              </div>
            </div>
          </div>
          <div className="p-6">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">{t('admin.noLowStock')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div key={`${product.id}-${product.size}`} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white mb-1">{product.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t('admin.size')} <span className="font-semibold">{product.size}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-2 rounded-xl text-sm font-bold inline-block ${
                        product.stock <= 3 
                          ? 'bg-red-500 text-white shadow-lg' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {product.stock} {t('admin.pieces')}
                      </span>
                    </div>
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

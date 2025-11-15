'use client'

import Link from 'next/link'
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp,
  DollarSign,
  AlertCircle
} from 'lucide-react'

export default function AdminDashboard() {
  // Demo data - Supabase'den gelecek
  const stats = [
    {
      title: 'Toplam Sipariş',
      value: '156',
      change: '+12%',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Toplam Gelir',
      value: '₺45,230',
      change: '+18%',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Toplam Ürün',
      value: '89',
      change: '+5',
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Toplam Müşteri',
      value: '324',
      change: '+24',
      icon: Users,
      color: 'bg-orange-500',
    },
  ]

  const recentOrders = [
    { id: 'MZ20251115000001', customer: 'Ali Yılmaz', total: 1899, status: 'pending' },
    { id: 'MZ20251115000002', customer: 'Ayşe Demir', total: 2499, status: 'confirmed' },
    { id: 'MZ20251115000003', customer: 'Mehmet Kara', total: 1599, status: 'shipped' },
    { id: 'MZ20251115000004', customer: 'Fatma Şahin', total: 3299, status: 'delivered' },
  ]

  const lowStockProducts = [
    { name: 'AeroGlide Pro', size: '42', stock: 2 },
    { name: 'Urban Classic', size: '40', stock: 1 },
    { name: 'Street Dunker', size: '43', stock: 3 },
  ]

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; class: string }> = {
      pending: { label: 'Bekliyor', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      confirmed: { label: 'Onaylandı', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      shipped: { label: 'Kargoda', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
      delivered: { label: 'Teslim Edildi', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    }
    return badges[status] || badges.pending
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Hoş geldiniz! İşte işletmenizin genel durumu.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg shadow-sm`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Son Siparişler</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const badge = getStatusBadge(order.status)
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {order.id}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{order.customer}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        ₺{order.total.toLocaleString('tr-TR')}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${badge.class}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Düşük Stok Uyarısı</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-900/30"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Numara: {product.size}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold text-orange-800 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    {product.stock} adet
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/urunler/yeni" className="flex flex-col items-center gap-2 p-4 bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary rounded-lg transition-colors">
            <Package className="h-6 w-6" />
            <span className="text-sm font-medium">Yeni Ürün</span>
          </Link>
          <Link href="/admin/siparisler" className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors">
            <ShoppingCart className="h-6 w-6" />
            <span className="text-sm font-medium">Siparişler</span>
          </Link>
          <button className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg transition-colors">
            <TrendingUp className="h-6 w-6" />
            <span className="text-sm font-medium">Raporlar</span>
          </button>
          <Link href="/admin/kategoriler" className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg transition-colors">
            <Users className="h-6 w-6" />
            <span className="text-sm font-medium">Kategoriler</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

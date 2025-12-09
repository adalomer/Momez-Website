'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useLanguage } from '@/lib/i18n'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  total: number
  status: string
  payment_method: string
  item_count: number
  created_at: string
}

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const timestamp = Date.now()
      const response = await fetch(`/api/admin/orders?_t=${timestamp}`, {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data || [])
      } else {
        toast.error(t('admin.loadError'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status: newStatus })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(t('admin.updateSuccess'))
        fetchOrders()
      } else {
        toast.error(data.error || t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    }
  }

  const deleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(t('admin.deleteConfirm'))) {
      return
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(t('admin.deleteSuccess'))
        fetchOrders()
      } else {
        toast.error(data.error || t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    }
  }

  const statusColors = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
    confirmed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
    preparing: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400',
    shipped: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400',
    delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
  }

  const statusLabels: Record<string, string> = {
    pending: t('admin.pending'),
    confirmed: t('admin.confirmed'),
    preparing: t('admin.processing'),
    shipped: t('admin.shipped'),
    delivered: t('admin.delivered'),
    cancelled: t('admin.cancelled'),
  }

  const filteredOrders = orders.filter(order =>
    order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('admin.orderManagement')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {filteredOrders.length} {t('admin.orders').toLowerCase()}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder={t('orders.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-primary"></div>
            <p className="mt-4 text-slate-500">{t('common.loading')}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500">{searchTerm ? t('orders.notFound') : t('admin.noOrders')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b-2 border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {t('admin.orderNo')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {t('admin.customer')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {t('admin.date')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {t('orders.productCount')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {t('order.total')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {t('admin.status')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-slate-900/50 dark:hover:to-transparent transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`/admin/siparisler/${order.id}`}
                        className="font-bold text-primary hover:text-primary/80 underline decoration-2 underline-offset-2"
                      >
                        {order.order_number}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {order.customer_name || '-'}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {order.customer_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium">
                      {new Date(order.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                        {order.item_count} {t('orders.products')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ₺{(Number(order.total) || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                        statusColors[order.status as keyof typeof statusColors] || statusColors.pending
                      }`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/admin/siparisler/${order.id}`}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Siparişi İncele"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-sm border-2 border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all hover:border-primary hover:shadow-lg font-semibold hover:scale-105 transform duration-200"
                        >
                          <option value="pending">🕒 {t('admin.pending')}</option>
                          <option value="confirmed">✅ {t('admin.confirmed')}</option>
                          <option value="preparing">📦 {t('admin.processing')}</option>
                          <option value="shipped">🚚 {t('admin.shipped')}</option>
                          <option value="delivered">✨ {t('admin.delivered')}</option>
                          <option value="cancelled">❌ {t('admin.cancelled')}</option>
                        </select>
                        <button
                          onClick={() => deleteOrder(order.id, order.order_number)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Siparişi Sil"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

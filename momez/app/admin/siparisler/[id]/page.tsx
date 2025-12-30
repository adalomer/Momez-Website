'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface OrderItem {
  id: string
  product_id: string
  product_name: string
  size: string
  quantity: number
  price: number
}

interface Order {
  id: string
  order_number: string
  user_id: string
  customer_name: string
  customer_email: string
  address_title: string
  full_name: string
  phone: string
  city: string
  district: string
  address_line: string
  postal_code: string
  payment_method: string
  subtotal: number
  shipping_cost: number
  total: number
  status: string
  notes: string
  created_at: string
  items: OrderItem[]
}

export default function OrderDetailPage() {
  const { t, language } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setOrder(data.data)
      } else {
        toast.error(t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (newStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: order?.id, status: newStatus })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(t('admin.updateSuccess'))
        fetchOrder()
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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: t('admin.pending'),
      confirmed: t('admin.confirmed'),
      preparing: t('admin.processing'),
      shipped: t('admin.shipped'),
      delivered: t('admin.delivered'),
      cancelled: t('admin.cancelled'),
    }
    return labels[status] || status
  }

  const getPaymentLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash_on_delivery: t('order.cashOnDelivery'),
      card: t('order.creditCard'),
    }
    return labels[method] || method
  }

  const getLocale = () => {
    if (language === 'ar') return 'ar-SA'
    if (language === 'en') return 'en-US'
    return 'tr-TR'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-600 dark:text-slate-400">{t('common.loading')}</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-600 dark:text-slate-400">{t('order.notFound')}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/siparisler')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('order.detail')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {order.order_number}
          </p>
        </div>
        <div>
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-400 dark:border-slate-500 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary-200 transition-all"
          >
            <option value="pending">{t('admin.pending')}</option>
            <option value="confirmed">{t('admin.confirmed')}</option>
            <option value="preparing">{t('admin.processing')}</option>
            <option value="shipped">{t('admin.shipped')}</option>
            <option value="delivered">{t('admin.delivered')}</option>
            <option value="cancelled">{t('admin.cancelled')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ana İçerik */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ürünler */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('order.products')}
              </h2>
            </div>
            
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {item.product_name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t('order.size')}: {item.size} • {t('order.quantity')}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900 dark:text-white">
                      ₺{(item.price * item.quantity).toLocaleString(getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      ₺{item.price.toLocaleString(getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {t('order.perItem')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Toplam */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t('order.subtotal')}</span>
                <span>₺{order.subtotal?.toLocaleString(getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t('order.shipping')}</span>
                <span>₺{order.shipping_cost?.toLocaleString(getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>{t('order.total')}</span>
                <span>₺{order.total?.toLocaleString(getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Teslimat Adresi */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('order.deliveryAddress')}
              </h2>
            </div>
            
            {order.full_name || order.address_line ? (
              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                {order.address_title && (
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    {order.address_title}
                  </p>
                )}
                {order.full_name && (
                  <p className="font-medium text-slate-900 dark:text-white">
                    {order.full_name}
                  </p>
                )}
                {order.phone && <p className="flex items-center gap-2">
                  <span className="text-slate-500">{t('order.phone')}:</span>
                  <a href={`tel:${order.phone}`} className="text-blue-600 hover:underline">
                    {order.phone}
                  </a>
                </p>}
                {order.address_line && (
                  <p className="mt-2">{order.address_line}</p>
                )}
                {(order.district || order.city) && (
                  <p className="font-medium">
                    {order.district && `${order.district} / `}{order.city}
                  </p>
                )}
                {order.postal_code && (
                  <p className="text-sm text-slate-500">{t('order.postalCode')}: {order.postal_code}</p>
                )}
                {(order.city || order.district) && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.address_line || ''} ${order.district || ''} ${order.city || ''}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <MapPin className="w-4 h-4" />
                      {t('order.showOnMap')}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-amber-700 dark:text-amber-400 text-sm">
                  {t('order.noAddress')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Yan Bilgiler */}
        <div className="space-y-6">
          {/* Sipariş Bilgileri */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {t('order.orderInfo')}
            </h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.status')}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  statusColors[order.status as keyof typeof statusColors] || statusColors.pending
                }`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('order.orderDate')}</p>
                <p className="text-slate-900 dark:text-white">
                  {new Date(order.created_at).toLocaleString(getLocale())}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('order.paymentMethod')}</p>
                <div className="flex items-center gap-2 mt-1">
                  <CreditCard className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-slate-900 dark:text-white">
                    {getPaymentLabel(order.payment_method)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Müşteri Bilgileri */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {t('order.customerInfo')}
            </h2>
            
            <div className="space-y-2">
              <p className="font-medium text-slate-900 dark:text-white">
                {order.customer_name}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {order.customer_email}
              </p>
            </div>
          </div>

          {/* Notlar */}
          {order.notes && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {t('order.orderNotes')}
              </h2>
              <p className="text-slate-700 dark:text-slate-300">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

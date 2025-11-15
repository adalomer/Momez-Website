'use client'

import { useState } from 'react'
import { Search, Eye, Package } from 'lucide-react'

// Admin sipariş yönetimi sayfası - Demo

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Demo siparişler
  const orders = [
    {
      id: 'ORD-2024-001',
      customer: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      date: '2024-11-16',
      total: 3499,
      status: 'pending',
      items: 2,
    },
    {
      id: 'ORD-2024-002',
      customer: 'Ayşe Demir',
      email: 'ayse@example.com',
      date: '2024-11-16',
      total: 1899,
      status: 'processing',
      items: 1,
    },
    {
      id: 'ORD-2024-003',
      customer: 'Mehmet Kaya',
      email: 'mehmet@example.com',
      date: '2024-11-15',
      total: 4298,
      status: 'shipped',
      items: 3,
    },
    {
      id: 'ORD-2024-004',
      customer: 'Fatma Şahin',
      email: 'fatma@example.com',
      date: '2024-11-15',
      total: 2299,
      status: 'delivered',
      items: 1,
    },
  ]

  const statusColors = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
    processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
    shipped: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400',
    delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
  }

  const statusLabels = {
    pending: 'Beklemede',
    processing: 'Hazırlanıyor',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Sipariş Yönetimi
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {orders.length} sipariş
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Sipariş no, müşteri ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
        <select className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
          <option>Tüm Durumlar</option>
          <option>Beklemede</option>
          <option>Hazırlanıyor</option>
          <option>Kargoda</option>
          <option>Teslim Edildi</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Sipariş No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Durum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {order.customer}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {order.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {new Date(order.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                    ₺{order.total.toLocaleString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[order.status as keyof typeof statusColors]
                    }`}>
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        onClick={() => alert('Sipariş detayı (Demo)')}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                        onClick={() => alert('Durumu güncelle (Demo)')}
                      >
                        <Package className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

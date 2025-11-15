'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react'

// Admin ürün yönetimi sayfası - Demo

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Demo ürünler
  const products = [
    {
      id: 1,
      name: 'AeroGlide Pro',
      category: 'Erkek',
      price: 1899,
      stock: 45,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      active: true,
    },
    {
      id: 2,
      name: 'Urban Classic',
      category: 'Kadın',
      price: 1499,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
      active: true,
    },
    {
      id: 3,
      name: 'Street Dunker',
      category: 'Erkek',
      price: 2299,
      stock: 0,
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200&h=200&fit=crop',
      active: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Ürün Yönetimi
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {products.length} ürün
          </p>
        </div>
        <Link 
          href="/admin/urunler/yeni"
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Yeni Ürün
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Stok
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
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                    ₺{product.price.toLocaleString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${
                      product.stock === 0 
                        ? 'text-red-600 dark:text-red-400' 
                        : product.stock < 20
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-green-600 dark:text-green-400'
                    } font-medium`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.active
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400'
                    }`}>
                      {product.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        onClick={() => alert('Ürün görüntüle (Demo)')}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        onClick={() => alert('Ürün düzenle (Demo)')}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        onClick={() => alert('Ürün sil (Demo)')}
                      >
                        <Trash2 className="h-4 w-4" />
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

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

// Admin kategori yönetimi sayfası - Demo

export default function AdminCategoriesPage() {
  // Demo kategoriler
  const categories = [
    {
      id: 1,
      name: 'Erkek Ayakkabı',
      slug: 'erkek',
      image: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=200&h=200&fit=crop',
      productCount: 45,
      active: true,
    },
    {
      id: 2,
      name: 'Kadın Ayakkabı',
      slug: 'kadin',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop',
      productCount: 38,
      active: true,
    },
    {
      id: 3,
      name: 'Çocuk Ayakkabı',
      slug: 'cocuk',
      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=200&h=200&fit=crop',
      productCount: 22,
      active: true,
    },
    {
      id: 4,
      name: 'Spor Ayakkabı',
      slug: 'spor',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=200&fit=crop',
      productCount: 56,
      active: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kategori Yönetimi
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {categories.length} kategori
          </p>
        </div>
        <button 
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          onClick={() => alert('Yeni kategori ekle (Demo)')}
        >
          <Plus className="h-5 w-5" />
          Yeni Kategori
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="relative h-48 bg-slate-200 dark:bg-slate-700">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {category.productCount} ürün
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  category.active
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400'
                }`}>
                  {category.active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  className="flex-1 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => alert('Kategori görüntüle (Demo)')}
                >
                  <Eye className="h-4 w-4" />
                  Görüntüle
                </button>
                <button 
                  className="flex-1 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => alert('Kategori düzenle (Demo)')}
                >
                  <Edit className="h-4 w-4" />
                  Düzenle
                </button>
                <button 
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  onClick={() => alert('Kategori sil (Demo)')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

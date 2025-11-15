'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart } from 'lucide-react'

// Bu sayfa şimdilik demo verilerle çalışıyor
// Supabase kurulunca gerçek verilerle değiştirilecek

export default function CategoryPage() {
  // Demo ürünler
  const products = [
    {
      id: 1,
      name: 'AeroGlide Pro',
      price: 1899,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
      slug: 'aeroglide-pro',
    },
    {
      id: 2,
      name: 'Urban Classic',
      price: 1499,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
      slug: 'urban-classic',
    },
    {
      id: 3,
      name: 'Street Dunker',
      price: 2299,
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=800&fit=crop',
      slug: 'street-dunker',
    },
    {
      id: 4,
      name: 'Runner Elite',
      price: 1799,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',
      slug: 'runner-elite',
    },
    {
      id: 5,
      name: 'Sport Max',
      price: 1699,
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=800&fit=crop',
      slug: 'sport-max',
    },
    {
      id: 6,
      name: 'Classic Leather',
      price: 1999,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
      slug: 'classic-leather',
    },
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-primary">
            Ana Sayfa
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 dark:text-white font-medium">Erkek Ayakkabı</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Erkek Ayakkabı
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {products.length} ürün bulundu
          </p>
        </div>

        {/* Filters (Basit versiyon - Supabase sonrası detaylandırılacak) */}
        <div className="mb-6 flex flex-wrap gap-4">
          <select className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
            <option>Sıralama</option>
            <option>Fiyat: Düşükten Yükseğe</option>
            <option>Fiyat: Yüksekten Düşüğe</option>
            <option>En Yeniler</option>
          </select>
          
          <select className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
            <option>Tüm Bedenler</option>
            <option>39</option>
            <option>40</option>
            <option>41</option>
            <option>42</option>
            <option>43</option>
            <option>44</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group">
              <Link href={`/urun/${product.slug}`} className="block">
                <div className="relative overflow-hidden rounded-xl aspect-square bg-slate-200 dark:bg-slate-800 mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button 
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('Favorilere eklendi! (Supabase kurulunca çalışacak)')
                    }}
                  >
                    <Heart className="h-5 w-5 text-slate-800 dark:text-white" />
                  </button>
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-lg font-semibold text-primary mt-1">
                    ₺{product.price.toLocaleString('tr-TR')}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Bu kategoride henüz ürün bulunmuyor.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

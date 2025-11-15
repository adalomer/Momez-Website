'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Check } from 'lucide-react'

// Demo ürün detay sayfası
// Supabase kurulunca gerçek verilerle değiştirilecek

export default function ProductPage() {
  // Demo veri
  const product = {
    name: 'AeroGlide Pro',
    price: 1899,
    description: 'Hafif ve konforlu koşu ayakkabısı. Özel tasarım taban yapısı ile maksimum rahatlık sağlar. Uzun mesafe koşuları için idealdir.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',
    ],
    sizes: ['39', '40', '41', '42', '43', '44'],
    stock: {
      '39': 5,
      '40': 10,
      '41': 8,
      '42': 3,
      '43': 0,
      '44': 12,
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-primary">
            Ana Sayfa
          </Link>
          <span className="text-slate-400">/</span>
          <Link href="/kategori/erkek" className="text-slate-600 dark:text-slate-400 hover:text-primary">
            Erkek Ayakkabı
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl aspect-square bg-slate-200 dark:bg-slate-800">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-lg aspect-square bg-slate-200 dark:bg-slate-800 cursor-pointer border-2 border-transparent hover:border-primary">
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-primary">
                ₺{product.price.toLocaleString('tr-TR')}
              </p>
            </div>

            <p className="text-slate-600 dark:text-slate-400">
              {product.description}
            </p>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                Beden Seçin
              </label>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => {
                  const stock = product.stock[size as keyof typeof product.stock]
                  const outOfStock = stock === 0
                  
                  return (
                    <button
                      key={size}
                      disabled={outOfStock}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                        outOfStock
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed line-through'
                          : 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 hover:border-primary text-slate-900 dark:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button 
                className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                onClick={() => alert('Sepete eklendi! (Supabase kurulunca çalışacak)')}
              >
                <ShoppingCart className="h-5 w-5" />
                Sepete Ekle
              </button>
              
              <button 
                className="w-full px-6 py-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 hover:border-primary text-slate-900 dark:text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                onClick={() => alert('Favorilere eklendi! (Supabase kurulunca çalışacak)')}
              >
                <Heart className="h-5 w-5" />
                Favorilere Ekle
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Check className="h-5 w-5 text-green-500" />
                <span>Ücretsiz kargo (500 TL üzeri)</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Check className="h-5 w-5 text-green-500" />
                <span>14 gün içinde kolay iade</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Check className="h-5 w-5 text-green-500" />
                <span>Kapıda ödeme imkanı</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

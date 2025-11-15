'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Trash2 } from 'lucide-react'

// Favoriler sayfası - Supabase kurulunca gerçek verilerle çalışacak

export default function FavoritesPage() {
  // Demo favoriler
  const favorites = [
    {
      id: 1,
      name: 'AeroGlide Pro',
      price: 1899,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
      slug: 'aeroglide-pro',
      inStock: true,
    },
    {
      id: 2,
      name: 'Urban Classic',
      price: 1499,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
      slug: 'urban-classic',
      inStock: true,
    },
    {
      id: 3,
      name: 'Street Dunker',
      price: 2299,
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=800&fit=crop',
      slug: 'street-dunker',
      inStock: false,
    },
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Favorilerim
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {favorites.length} ürün
            </p>
          </div>
          
          {favorites.length > 0 && (
            <button 
              className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
              onClick={() => alert('Tüm favoriler temizlendi (Demo)')}
            >
              Tümünü Temizle
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
              Henüz favori ürününüz yok
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="group">
                <div className="relative">
                  <Link href={`/urun/${product.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-xl aspect-square bg-slate-200 dark:bg-slate-800 mb-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg font-medium text-sm">
                            Stokta Yok
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <button 
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-black/70 hover:bg-white dark:hover:bg-black transition-colors"
                    onClick={() => alert('Favorilerden kaldırıldı (Demo)')}
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
                
                <div className="text-left">
                  <Link href={`/urun/${product.slug}`}>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-primary">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-semibold text-primary mt-1">
                    ₺{product.price.toLocaleString('tr-TR')}
                  </p>
                  
                  {product.inStock && (
                    <button 
                      className="mt-2 w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
                      onClick={() => alert('Sepete eklendi (Demo)')}
                    >
                      Sepete Ekle
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ <strong>Favoriler sadece kayıtlı kullanıcılar için.</strong> Supabase kurulumu ve giriş yapıldıktan sonra favorileriniz kaydedilecek ve tüm cihazlarınızda senkronize olacaktır.
          </p>
        </div>
      </div>
    </div>
  )
}

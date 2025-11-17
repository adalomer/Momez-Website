'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { favoritesAPI, authAPI, cartAPI } from '@/lib/api'

interface FavoriteItem {
  id: number
  product_id: string
  product_name: string
  product_slug: string
  price: number
  image_url: string
  in_stock: boolean
}

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthAndLoadFavorites()
  }, [])

  const checkAuthAndLoadFavorites = async () => {
    try {
      const userResult = await authAPI.me()
      if (!userResult.success) {
        router.push('/auth/login?redirect=/favoriler')
        return
      }
      
      const favResult = await favoritesAPI.get()
      if (favResult.success) {
        setFavorites(favResult.data || [])
      }
    } catch (error) {
      console.error('Favorites load error:', error)
      toast.error('Favoriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (productId: string) => {
    try {
      const result = await favoritesAPI.remove(productId)
      if (result.success) {
        setFavorites(items => items.filter(i => i.product_id !== productId))
        toast.success('Favorilerden çıkarıldı')
      } else {
        toast.error('Çıkarılamadı')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Toaster position="top-center" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <Toaster position="top-center" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Favorilerim
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl">
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
              Henüz favori ürününüz yok
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <div key={item.id} className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <Link href={`/urun/${item.product_slug}`} className="block relative aspect-square bg-slate-100 dark:bg-slate-700">
                  <Image
                    src={item.image_url}
                    alt={item.product_name}
                    fill
                    className="object-cover group-hover:scale-110 transition"
                  />
                  {!item.in_stock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Stokta Yok</span>
                    </div>
                  )}
                </Link>
                
                <div className="p-4 space-y-3">
                  <Link href={`/urun/${item.product_slug}`}>
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition line-clamp-2">
                      {item.product_name}
                    </h3>
                  </Link>
                  
                  <p className="text-lg font-bold text-primary">
                    ₺{Number(item.price).toFixed(2)}
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeFavorite(item.product_id)}
                      className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Çıkar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

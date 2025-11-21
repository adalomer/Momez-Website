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
  name: string
  slug: string
  price: number
  discount_price?: number
  stock: number
  image_url: string
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
      const userResult = await authAPI.me() as { success: boolean; data?: any; error?: string }
      if (!userResult || !userResult.success) {
        router.push('/auth/login?redirect=/favoriler')
        return
      }
      
      const favResult = await favoritesAPI.get() as { success: boolean; data?: FavoriteItem[]; error?: string }
      if (favResult.success && favResult.data) {
        setFavorites(favResult.data)
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
      const result = await favoritesAPI.remove(productId) as { success: boolean; error?: string }
      if (result.success) {
        setFavorites(items => items.filter(i => i.product_id !== productId))
        toast.success('Favorilerden çıkarıldı')
      } else {
        toast.error(result.error || 'Çıkarılamadı')
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
    <div className="min-h-screen py-12">
      <Toaster position="top-center" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Favorilerim
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
            Beğendiğiniz ürünler burada
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg">
            <p className="text-slate-900 dark:text-white text-xl font-bold mb-4">
              Henüz favori ürününüz yok
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <div key={item.id} className="group bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <Link href={`/urun/${item.slug}`} className="block relative aspect-square bg-slate-100 dark:bg-slate-700">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition"
                  />
                  {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Stokta Yok</span>
                    </div>
                  )}
                </Link>
                
                <div className="p-4 space-y-3">
                  <Link href={`/urun/${item.slug}`}>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-2">
                    {item.discount_price ? (
                      <>
                        <p className="text-xl font-bold text-primary">
                          ₺{Number(item.discount_price).toFixed(2)}
                        </p>
                        <p className="text-sm text-slate-500 line-through">
                          ₺{Number(item.price).toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="text-xl font-bold text-primary">
                        ₺{Number(item.price).toFixed(2)}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeFavorite(item.product_id)}
                      className="group/remove flex-1 px-4 py-3 border-2 border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                      <Trash2 className="w-4 h-4 group-hover/remove:scale-110 transition-transform" />
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

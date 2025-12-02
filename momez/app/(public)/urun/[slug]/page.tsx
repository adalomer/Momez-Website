'use client'

import { Heart, Minus, Plus, ShoppingCart, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { productsAPI, cartAPI, favoritesAPI } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    loadProduct()
  }, [])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const resolvedParams = await params
      const result = await productsAPI.getBySlug(resolvedParams.slug) as { success: boolean; data?: any; error?: string }
      
      if (result.success && result.data) {
        setProduct(result.data)
        // Otomatik seçim kaldırıldı - Kullanıcı beden seçmeli
      } else {
        toast.error(result.error || 'Ürün bulunamadı')
        router.push('/')
      }
    } catch (error) {
      console.error('Product load error:', error)
      toast.error('Ürün yüklenirken hata oluştu')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Lütfen beden seçin')
      return
    }

    try {
      const result = await cartAPI.add(product.id, selectedSize, quantity) as { success: boolean; error?: string }
      
      if (result.success) {
        toast.success('Ürün sepete eklendi')
      } else {
        // Giriş gerekiyor
        if (result.error?.includes('Giriş')) {
          toast.error('Sepete eklemek için giriş yapmalısınız', {
            duration: 3000,
            icon: '🔒'
          })
          setTimeout(() => {
            router.push(`/auth/login?redirect=/urun/${product.slug}`)
          }, 1500)
        } else {
          toast.error(result.error || 'Sepete eklenemedi')
        }
      }
    } catch (error) {
      toast.error('Sepete eklenirken hata oluştu')
    }
  }

  const handleAddToFavorites = async () => {
    try {
      const result = await favoritesAPI.add(product.id) as { success: boolean; error?: string }
      
      if (result.success) {
        toast.success('Favorilere eklendi', { id: 'favorite-add' })
      } else {
        if (result.error?.includes('Giriş')) {
          toast.error('Favorilere eklemek için giriş yapmalısınız', {
            duration: 3000,
            icon: '🔒',
            id: 'favorite-error'
          })
          setTimeout(() => {
            router.push(`/auth/login?redirect=/urun/${product.slug}`)
          }, 1500)
        } else {
          toast.error(result.error || 'Favorilere eklenemedi', { id: 'favorite-error' })
        }
      }
    } catch (error) {
      toast.error('Favorilere eklenirken hata oluştu', { id: 'favorite-error' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Toaster position="top-center" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee2b2b] mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const availableStock = product.stock?.find((s: any) => s.size === selectedSize)?.quantity || 0

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <Toaster position="top-center" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-8">
          <Link href="/" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/kategori/${product.category.slug}`} className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Görseller */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-surface-dark mb-4 relative group shadow-lg border border-border-light dark:border-border-dark transition-all duration-300">
              {product.images && product.images[selectedImage] ? (
                <>
                  <Image
                    src={product.images[selectedImage].image_url}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage((selectedImage - 1 + product.images.length) % product.images.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                        aria-label="Önceki resim"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setSelectedImage((selectedImage + 1) % product.images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                        aria-label="Sonraki resim"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                  Görsel Yok
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === idx ? 'border-primary-500 dark:border-primary-500 shadow-md scale-105' : 'border-border-light dark:border-border-dark hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={`${product.name} ${idx + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bilgiler */}
          <div className="bg-white dark:bg-surface-dark rounded-xl p-8 shadow-lg border border-border-light dark:border-border-dark transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">{product.name}</h1>
            
            <div className="flex items-baseline gap-4 mb-6">
              <p className="text-4xl font-bold text-primary-500 dark:text-primary-400">
                ₺{Number(product.price).toFixed(2)}
              </p>
            </div>

            {/* Beden Seçimi */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-slate-900 dark:text-white">Beden Seç</label>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 11 }, (_, i) => 36 + i).map((size) => {
                  const sizeStr = size.toString()
                  const stockItem = product.stock?.find((s: any) => s.size === sizeStr)
                  const quantity = stockItem?.quantity || 0
                  const hasStock = quantity > 0

                  return (
                    <div key={size} className="flex flex-col">
                      <button
                        onClick={() => hasStock && setSelectedSize(sizeStr)}
                        disabled={!hasStock}
                        className={`py-3 rounded-lg border-2 font-medium transition-all duration-300 relative ${
                          selectedSize === sizeStr
                            ? 'border-primary-500 bg-primary-500 text-white shadow-md scale-105'
                            : hasStock
                            ? 'border-border-light dark:border-border-dark hover:border-primary-500 dark:hover:border-primary-500 text-slate-900 dark:text-white'
                            : 'border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        <span className={!hasStock ? 'line-through' : ''}>{size}</span>
                      </button>
                      {hasStock && (
                        <span className="text-xs text-center mt-1 text-green-600 dark:text-green-400 font-medium">
                          {quantity} adet
                        </span>
                      )}
                      {!hasStock && (
                        <span className="text-xs text-center mt-1 text-slate-400 dark:text-slate-600">
                          Yok
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
              {selectedSize && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Stok: {availableStock} adet
                </p>
              )}
            </div>

            {/* Miktar */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-slate-900 dark:text-white">Miktar</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-xl font-semibold w-12 text-center text-slate-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  className="p-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                  disabled={quantity >= availableStock}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Butonlar */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock || !selectedSize}
                className="w-full px-6 py-4 border-2 border-primary-500 bg-white dark:bg-transparent text-primary-500 hover:bg-primary-500 hover:text-white font-bold rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ShoppingCart className="w-5 h-5" />
                Sepete Ekle
              </button>
              
              <button
                onClick={handleAddToFavorites}
                className="w-full px-6 py-4 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Heart className="w-5 h-5" />
                Favorilere Ekle
              </button>
            </div>

            {/* Özellikler */}
            <div className="border-t border-border-light dark:border-border-dark pt-6 space-y-4">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Truck className="w-5 h-5" />
                <span>Ücretsiz kargo (150 TL üzeri)</span>
              </div>
              {product.description && (
                <div className="pt-4">
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Ürün Açıklaması</h3>
                  <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

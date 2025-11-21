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
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-[#ee2b2b]">Ana Sayfa</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/kategori/${product.category.slug}`} className="hover:text-[#ee2b2b]">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Görseller */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-white mb-4 relative group">
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Önceki resim"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setSelectedImage((selectedImage + 1) % product.images.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
                <div className="w-full h-full flex items-center justify-center text-gray-400">
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
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-[#ee2b2b]' : 'border-gray-200'
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
          <div className="bg-white rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-baseline gap-4 mb-6">
              <p className="text-4xl font-bold text-[#ee2b2b]">
                ₺{Number(product.price).toFixed(2)}
              </p>
            </div>

            {/* Beden Seçimi */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Beden Seç</label>
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
                        className={`py-3 rounded-lg border-2 font-medium transition relative ${
                          selectedSize === sizeStr
                            ? 'border-[#ee2b2b] bg-[#ee2b2b] text-white'
                            : hasStock
                            ? 'border-gray-300 hover:border-[#ee2b2b]'
                            : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <span className={!hasStock ? 'line-through' : ''}>{size}</span>
                      </button>
                      {hasStock && (
                        <span className="text-xs text-center mt-1 text-green-600 font-medium">
                          {quantity} adet
                        </span>
                      )}
                      {!hasStock && (
                        <span className="text-xs text-center mt-1 text-gray-400">
                          Yok
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
              {selectedSize && (
                <p className="text-sm text-gray-600 mt-2">
                  Stok: {availableStock} adet
                </p>
              )}
            </div>

            {/* Miktar */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Miktar</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
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
                className="w-full px-6 py-4 border-2 border-red-500 bg-white text-red-500 hover:bg-red-500 hover:text-white font-bold rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ShoppingCart className="w-5 h-5" />
                Sepete Ekle
              </button>
              
              <button
                onClick={handleAddToFavorites}
                className="w-full px-6 py-4 border-2 border-[#ee2b2b] text-[#ee2b2b] hover:bg-[#ee2b2b] hover:text-white font-bold rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Heart className="w-5 h-5" />
                Favorilere Ekle
              </button>
            </div>

            {/* Özellikler */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Truck className="w-5 h-5" />
                <span>Ücretsiz kargo (150 TL üzeri)</span>
              </div>
              {product.description && (
                <div className="pt-4">
                  <h3 className="font-semibold mb-2">Ürün Açıklaması</h3>
                  <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
      const result = await productsAPI.getBySlug(resolvedParams.slug)
      
      if (result.success) {
        setProduct(result.data)
        // İlk bedeni otomatik seç
        if (result.data.stock && result.data.stock.length > 0) {
          setSelectedSize(result.data.stock[0].size)
        }
      } else {
        toast.error('Ürün bulunamadı')
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
      const result = await cartAPI.add(product.id, selectedSize, quantity)
      
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
          toast.error(result.error)
        }
      }
    } catch (error) {
      toast.error('Sepete eklenirken hata oluştu')
    }
  }

  const handleAddToFavorites = async () => {
    try {
      const result = await favoritesAPI.add(product.id)
      
      if (result.success) {
        toast.success('Favorilere eklendi')
      } else {
        if (result.error?.includes('Giriş')) {
          toast.error('Favorilere eklemek için giriş yapmalısınız', {
            duration: 3000,
            icon: '🔒'
          })
          setTimeout(() => {
            router.push(`/auth/login?redirect=/urun/${product.slug}`)
          }, 1500)
        } else {
          toast.error(result.error)
        }
      }
    } catch (error) {
      toast.error('Favorilere eklenirken hata oluştu')
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
    <div className="min-h-screen bg-gray-50">
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
            <div className="aspect-square rounded-lg overflow-hidden bg-white mb-4">
              {product.images && product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage].image_url}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
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
              <div className="grid grid-cols-5 gap-2">
                {product.stock && product.stock.length > 0 ? (
                  product.stock.map((s: any) => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s.size)}
                      disabled={s.quantity === 0}
                      className={`py-3 rounded-lg border-2 font-medium transition ${
                        selectedSize === s.size
                          ? 'border-[#ee2b2b] bg-[#ee2b2b] text-white'
                          : s.quantity > 0
                          ? 'border-gray-300 hover:border-[#ee2b2b]'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {s.size}
                    </button>
                  ))
                ) : (
                  <p className="col-span-5 text-gray-500">Stok bilgisi yok</p>
                )}
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
                className="w-full px-6 py-4 bg-[#ee2b2b] hover:bg-red-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
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

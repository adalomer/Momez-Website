'use client'

import { Heart, Minus, Plus, ShoppingCart, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { productsAPI, cartAPI, favoritesAPI } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n'

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('description')
  const [shippingSettings, setShippingSettings] = useState({ freeLimit: 500, fee: 50 })
  const { t, language } = useLanguage()

  useEffect(() => {
    loadProduct()
    loadShippingSettings()
  }, [])

  const loadShippingSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      if (data.success && data.data) {
        const settingsObj = data.data.reduce((acc: any, item: any) => {
          acc[item.key] = item.value
          return acc
        }, {})
        
        const freeLimit = parseFloat(settingsObj.free_shipping_limit || 500)
        const fee = parseFloat(settingsObj.standard_shipping_fee || 50)
        setShippingSettings({ freeLimit, fee })
      }
    } catch (error) {
      console.error('Settings load error:', error)
    }
  }

  const loadProduct = async () => {
    try {
      setLoading(true)
      const resolvedParams = await params
      const result = await productsAPI.getBySlug(resolvedParams.slug) as { success: boolean; data?: any; error?: string }
      
      if (result.success && result.data) {
        setProduct(result.data)
        // Varsayılan rengi seç
        if (result.data.colors && result.data.colors.length > 0) {
          const defaultColor = result.data.colors.find((c: any) => c.is_default) || result.data.colors[0]
          setSelectedColor(defaultColor.id?.toString() || defaultColor.color_hex)
        }
        // Benzer ürünleri yükle
        loadRelatedProducts(result.data.category?.slug)
      } else {
        toast.error(result.error || t('common.error'))
        router.push('/')
      }
    } catch (error) {
      console.error('Product load error:', error)
      toast.error(t('common.error'))
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedProducts = async (categorySlug?: string) => {
    if (!categorySlug) return
    
    try {
      const resolvedParams = await params
      const result = await productsAPI.getAll({ 
        category: categorySlug, 
        limit: 8 
      }) as { success: boolean; data?: any[]; error?: string }
      
      if (result.success && result.data) {
        // Mevcut ürünü hariç tut
        const filtered = result.data.filter((p: any) => p.slug !== resolvedParams.slug)
        setRelatedProducts(filtered.slice(0, 6))
      }
    } catch (error) {
      console.error('Related products load error:', error)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error(t('product.pleaseSelectSize'), { id: 'select-size' })
      return
    }

    try {
      const result = await cartAPI.add(product.id, selectedSize, quantity) as { success: boolean; error?: string }
      
      if (result.success) {
        toast.success(t('product.addedToCart'), { id: 'cart-add-success' })
      } else {
        // Giriş gerekiyor
        if (result.error?.includes('Giriş')) {
          toast.error(t('product.loginRequired'), {
            duration: 3000,
            icon: '🔒',
            id: 'login-required'
          })
          setTimeout(() => {
            router.push(`/auth/login?redirect=/urun/${product.slug}`)
          }, 1500)
        } else {
          toast.error(result.error || t('common.error'), { id: 'cart-error' })
        }
      }
    } catch (error) {
      toast.error(t('common.error'), { id: 'cart-error' })
    }
  }

  const handleAddToFavorites = async () => {
    try {
      const result = await favoritesAPI.add(product.id) as { success: boolean; error?: string }
      
      if (result.success) {
        toast.success(t('product.addedToFavorites'), { id: 'favorite-add' })
      } else {
        if (result.error?.includes('Giriş')) {
          toast.error(t('product.loginRequired'), {
            duration: 3000,
            icon: '🔒',
            id: 'favorite-error'
          })
          setTimeout(() => {
            router.push(`/auth/login?redirect=/urun/${product.slug}`)
          }, 1500)
        } else {
          toast.error(result.error || t('common.error'), { id: 'favorite-error' })
        }
      }
    } catch (error) {
      toast.error(t('common.error'), { id: 'favorite-error' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Toaster position="top-center" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee2b2b] mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const availableStock = product.stock?.find((s: any) => s.size === selectedSize)?.quantity || 0

  // Seçilen rengin görsellerini al (yeni sistem)
  const getDisplayImages = () => {
    if (product.colors && product.colors.length > 0) {
      const currentColor = product.colors.find((c: any) => 
        c.id?.toString() === selectedColor || c.color_hex === selectedColor
      )
      if (currentColor && currentColor.images && currentColor.images.length > 0) {
        // Renk görselleri varsa onları kullan
        return currentColor.images.map((url: string, idx: number) => ({
          image_url: url,
          id: `color-img-${idx}`
        }))
      }
    }
    // Eski sistem veya renk görseli yoksa product.images kullan
    return product.images || []
  }
  
  const displayImages = getDisplayImages()

  // Renk değiştiğinde görsel indeksini sıfırla
  const handleColorChange = (colorId: string) => {
    setSelectedColor(colorId)
    setSelectedImage(0)
  }

  // Seçili rengin bilgisini al
  const getSelectedColorInfo = () => {
    if (!product.colors || product.colors.length === 0) return null
    return product.colors.find((c: any) => 
      c.id?.toString() === selectedColor || c.color_hex === selectedColor
    )
  }

  const selectedColorInfo = getSelectedColorInfo()

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <Toaster position="top-center" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className={`flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-8 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <Link href="/" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">{t('nav.home')}</Link>
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
              {displayImages && displayImages[selectedImage] ? (
                <>
                  <Image
                    src={displayImages[selectedImage].image_url}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                  {displayImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage((selectedImage - 1 + displayImages.length) % displayImages.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                        aria-label="Önceki resim"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setSelectedImage((selectedImage + 1) % displayImages.length)}
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
                  {t('product.noImage')}
                </div>
              )}
            </div>
            
            {displayImages && displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {displayImages.map((img: any, idx: number) => (
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

            {/* Renk Seçimi - Alo Yoga Tarzı Swatch */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-900 dark:text-white">
                    {t('product.color')}
                  </label>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedColorInfo?.color_name || ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color: any) => {
                    const colorId = color.id?.toString() || color.color_hex
                    const isSelected = selectedColor === colorId
                    return (
                      <button
                        key={colorId}
                        onClick={() => handleColorChange(colorId)}
                        className={`group relative w-10 h-10 rounded-full transition-all duration-200 ${
                          isSelected
                            ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-800'
                            : 'hover:ring-2 hover:ring-offset-2 hover:ring-slate-300 dark:hover:ring-slate-600 dark:hover:ring-offset-slate-800'
                        }`}
                        style={{ backgroundColor: color.color_hex }}
                        title={color.color_name}
                      >
                        {color.color_hex?.toUpperCase() === '#FFFFFF' && (
                          <span className="absolute inset-0 rounded-full border border-slate-300 dark:border-slate-600" />
                        )}
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <svg className={`w-5 h-5 ${color.color_hex?.toUpperCase() === '#FFFFFF' ? 'text-slate-900' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Beden Seçimi - Alo Yoga Tarzı */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-slate-900 dark:text-white">
                  {t('product.selectSize')}
                </label>
                {selectedSize && (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    EU {selectedSize}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 11 }, (_, i) => 36 + i).map((size) => {
                  const sizeStr = size.toString()
                  const stockItem = product.stock?.find((s: any) => s.size === sizeStr)
                  const quantity = stockItem?.quantity || 0
                  const hasStock = quantity > 0

                  return (
                    <button
                      key={size}
                      onClick={() => hasStock && setSelectedSize(sizeStr)}
                      disabled={!hasStock}
                      className={`relative min-w-[56px] h-12 px-4 rounded-md border text-sm font-medium transition-all duration-200 ${
                        selectedSize === sizeStr
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                          : hasStock
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-600 hover:border-slate-900 dark:hover:border-white'
                          : 'bg-slate-50 dark:bg-slate-900/50 text-slate-300 dark:text-slate-600 border-slate-100 dark:border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      <span className={!hasStock ? 'relative' : ''}>
                        {size}
                        {!hasStock && (
                          <span className="absolute left-1/2 top-1/2 w-[120%] h-px bg-slate-300 dark:bg-slate-600 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
              {selectedSize && availableStock > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  ✓ {availableStock} {t('product.stockCount')} {t('product.inStock')}
                </p>
              )}
            </div>

            {/* Miktar */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-slate-900 dark:text-white">{t('product.quantity')}</label>
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
                {t('product.addToCart')}
              </button>
              
              <button
                onClick={handleAddToFavorites}
                className="w-full px-6 py-4 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Heart className="w-5 h-5" />
                {t('product.addToFavorites')}
              </button>
            </div>

            {/* Özellikler */}
            <div className="border-t border-border-light dark:border-border-dark pt-6 space-y-4">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Truck className="w-5 h-5" />
                <span>{t('product.freeShipping')}</span>
              </div>
              {product.description && (
                <div className="pt-4">
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">{t('product.description')}</h3>
                  <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs: Açıklama, Özellikler, Yorumlar */}
        <div className="mt-16">
          <div className="border-b border-gray-200 dark:border-slate-700">
            <nav className="flex gap-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'description'
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {t('product.description')}
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'features'
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {t('product.features')}
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {t('product.shipping')}
              </button>
            </nav>
          </div>

          <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{t('product.productDetails')}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {product.description || t('product.noDescription')}
                </p>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('product.productFeatures')}</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✓</span>
                    <span className="text-slate-600 dark:text-slate-400">{t('product.feature1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✓</span>
                    <span className="text-slate-600 dark:text-slate-400">{t('product.feature2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✓</span>
                    <span className="text-slate-600 dark:text-slate-400">{t('product.feature3')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✓</span>
                    <span className="text-slate-600 dark:text-slate-400">{t('product.feature4')}</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('product.shippingInfo')}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Truck className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{t('product.freeShipping')}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {shippingSettings.freeLimit} TL {language === 'tr' ? 've üzeri alışverişlerde kargo bedava' : language === 'en' ? 'and above free shipping' : 'والأكثر شحن مجاني'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{t('product.returnPolicy')}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{t('product.returnPolicyDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Benzer Ürünler */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('product.similarProducts')}</h2>
              {product.category && (
                <Link 
                  href={`/kategori/${product.category.slug}`}
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400 font-semibold text-sm md:text-base hover:underline transition-all"
                >
                  {t('home.viewAll')} →
                </Link>
              )}
            </div>
            
            <div className="relative">
              <div className="overflow-x-auto scrollbar-thin pb-4">
                <div className="flex gap-6 min-w-max">
                  {relatedProducts.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.id}
                      href={`/urun/${relatedProduct.slug}`}
                      className="group w-[280px] bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex-shrink-0"
                    >
                      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-slate-700 relative">
                        {relatedProduct.images && relatedProduct.images[0] ? (
                          <Image
                            src={relatedProduct.images[0].image_url}
                            alt={relatedProduct.name}
                            width={280}
                            height={280}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {t('product.noImage')}
                          </div>
                        )}
                        {relatedProduct.discount_price && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                            %{Math.round((1 - relatedProduct.discount_price / relatedProduct.price) * 100)}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors line-clamp-2 min-h-[3rem] mb-2">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {relatedProduct.discount_price ? (
                            <>
                              <p className="text-xl font-bold text-red-500">
                                ₺{Number(relatedProduct.discount_price).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                ₺{Number(relatedProduct.price).toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p className="text-xl font-bold text-red-500">
                              ₺{Number(relatedProduct.price).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { cartAPI, favoritesAPI, authAPI } from '@/lib/api'
import { useLanguage } from '@/lib/i18n'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  discount_price?: number
  in_stock: boolean
  images?: { image_url: string }[]
  colors?: Array<{
    id: string
    color_name: string
    color_hex: string
    is_default: number
    images: Array<string | { image_url: string }>
  }>
  stock?: { size: string; quantity: number }[]
}

interface ProductCardProps {
  product: Product
  user?: any
}

export default function ProductCard({ product, user }: ProductCardProps) {
  const [showSizeModal, setShowSizeModal] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColorId, setSelectedColorId] = useState<string>('')
  const [adding, setAdding] = useState(false)
  const { t } = useLanguage()

  const displayPrice = product.discount_price || product.price

  // Renklere göre görsel al
  const getDisplayImage = () => {
    if (product.colors && product.colors.length > 0) {
      // Seçili renk varsa onun görselini göster
      if (selectedColorId) {
        const selectedColor = product.colors.find(c => c.id === selectedColorId)
        if (selectedColor && selectedColor.images && selectedColor.images.length > 0) {
          const img = selectedColor.images[0]
          // images array obje veya string olabilir
          return typeof img === 'string' ? img : (img as any).image_url
        }
      }
      // Varsayılan rengin görselini göster
      const defaultColor = product.colors.find(c => c.is_default === 1) || product.colors[0]
      if (defaultColor && defaultColor.images && defaultColor.images.length > 0) {
        const img = defaultColor.images[0]
        return typeof img === 'string' ? img : (img as any).image_url
      }
    }
    // Eski sistem - images array
    if (product.images && product.images[0]) {
      return product.images[0].image_url
    }
    return null
  }

  const displayImage = getDisplayImage()

  const handleAddToCart = async () => {
    if (!user) {
      toast.error(t('product.loginRequired'), {
        duration: 2000,
        icon: '🔒',
        id: 'login-required'
      })
      return
    }

    if (!product.in_stock) {
      toast.error(t('product.outOfStock'), { id: 'out-of-stock' })
      return
    }

    setShowSizeModal(true)
  }

  const handleAddToFavorites = async () => {
    if (!user) {
      toast.error(t('product.loginRequired'), {
        duration: 2000,
        icon: '🔒',
        id: 'login-required'
      })
      return
    }

    try {
      const result = await favoritesAPI.add(product.id)
      if (result.success) {
        toast.success(t('product.addedToFavorites'), { id: 'fav-add-success' })
      } else {
        toast.error(result.error || t('common.error'), { id: 'fav-add-error' })
      }
    } catch (error) {
      toast.error(t('common.error'), { id: 'fav-add-error' })
    }
  }

  const confirmAddToCart = async () => {
    if (!selectedSize) {
      toast.error(t('product.pleaseSelectSize'), { id: 'select-size' })
      return
    }

    setAdding(true)
    try {
      const result = await cartAPI.add(product.id, selectedSize, 1)
      if (result.success) {
        toast.success(t('product.addedToCart'), { id: 'cart-add-success' })
        setShowSizeModal(false)
        setSelectedSize('')
      } else {
        toast.error(result.error || t('common.error'), { id: 'cart-add-error' })
      }
    } catch (error) {
      toast.error(t('common.error'), { id: 'cart-add-error' })
    } finally {
      setAdding(false)
    }
  }

  // Mevcut stoktaki bedenleri al
  const availableSizes = product.stock?.filter(s => s.quantity > 0).map(s => s.size) || []
  const allSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']

  return (
    <>
      <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <Link href={`/urun/${product.slug}`}>
          <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-slate-700 relative">
            {displayImage ? (
              <Image
                src={displayImage}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                {t('product.noImage')}
              </div>
            )}
            {!product.in_stock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg">{t('product.outOfStock')}</span>
              </div>
            )}
            {product.discount_price && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                %{Math.round((1 - product.discount_price / product.price) * 100)} {t('product.discount')}
              </div>
            )}
          </div>
        </Link>
        
        <div className="p-4 space-y-3">
          <Link href={`/urun/${product.slug}`}>
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300 line-clamp-2 min-h-[3rem]">
              {product.name}
            </h3>
          </Link>

          {/* Renk Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 5).map((color) => (
                <button
                  key={color.id}
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedColorId(color.id)
                  }}
                  className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-110 ${
                    selectedColorId === color.id || (!selectedColorId && color.is_default === 1)
                      ? 'border-slate-900 dark:border-white ring-1 ring-offset-1 ring-slate-400'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                  style={{ backgroundColor: color.color_hex }}
                  title={color.color_name}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {product.discount_price ? (
              <>
                <p className="text-xl font-bold text-red-500">
                  ₺{Number(displayPrice).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ₺{Number(product.price).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-red-500">
                ₺{Number(product.price).toFixed(2)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <button
              onClick={handleAddToFavorites}
              className="group/fav p-3 border-2 border-gray-200 dark:border-slate-600 hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300"
              title={t('product.addToFavorites')}
            >
              <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-all group-hover/fav:fill-red-500 group-hover/fav:text-red-500 dark:group-hover/fav:text-red-400 group-hover/fav:scale-110" />
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-4 py-3 bg-red-500 text-white hover:bg-red-600 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold shadow-md hover:shadow-lg active:scale-95"
              disabled={!product.in_stock}
              title={t('product.addToCart')}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm font-bold">{t('product.addToCart')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Beden Seçimi Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowSizeModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-700 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{t('product.selectSize')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {product.name}
            </p>
            
            <div className="grid grid-cols-6 gap-2 mb-6">
              {allSizes.map(size => {
                const isAvailable = availableSizes.includes(size)
                const isSelected = selectedSize === size
                
                return (
                  <button
                    key={size}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    disabled={!isAvailable}
                    className={`
                      p-3 rounded-xl border-2 font-bold transition-all duration-200
                      ${isSelected 
                        ? 'border-red-500 bg-red-500 text-white shadow-lg scale-105' 
                        : isAvailable
                          ? 'border-gray-300 dark:border-slate-600 hover:border-red-500 dark:hover:border-red-400 hover:scale-105 bg-white dark:bg-slate-700 text-slate-900 dark:text-white'
                          : 'border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-900 text-gray-400 dark:text-gray-600 line-through cursor-not-allowed'
                      }
                    `}
                  >
                    {size}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSizeModal(false)
                  setSelectedSize('')
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all font-semibold text-slate-700 dark:text-slate-300"
                disabled={adding}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmAddToCart}
                disabled={!selectedSize || adding}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl active:scale-95"
              >
                {adding ? t('common.loading') : t('product.addToCart')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

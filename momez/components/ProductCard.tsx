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
  stock?: { size: string; quantity: number }[]
}

interface ProductCardProps {
  product: Product
  user?: any
}

export default function ProductCard({ product, user }: ProductCardProps) {
  const [showSizeModal, setShowSizeModal] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [adding, setAdding] = useState(false)
  const { t } = useLanguage()

  const displayPrice = product.discount_price || product.price

  const handleAddToCart = async () => {
    if (!user) {
      toast.error(t('product.loginRequired'), {
        duration: 2000,
        icon: '🔒'
      })
      return
    }

    if (!product.in_stock) {
      toast.error(t('product.outOfStock'))
      return
    }

    setShowSizeModal(true)
  }

  const handleAddToFavorites = async () => {
    if (!user) {
      toast.error(t('product.loginRequired'), {
        duration: 2000,
        icon: '🔒'
      })
      return
    }

    try {
      const result = await favoritesAPI.add(product.id)
      if (result.success) {
        toast.success(t('product.addedToFavorites'))
      } else {
        toast.error(result.error || t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    }
  }

  const confirmAddToCart = async () => {
    if (!selectedSize) {
      toast.error(t('product.pleaseSelectSize'))
      return
    }

    setAdding(true)
    try {
      const result = await cartAPI.add(product.id, selectedSize, 1)
      if (result.success) {
        toast.success(t('product.addedToCart'))
        setShowSizeModal(false)
        setSelectedSize('')
      } else {
        toast.error(result.error || t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    } finally {
      setAdding(false)
    }
  }

  // Mevcut stoktaki bedenleri al
  const availableSizes = product.stock?.filter(s => s.quantity > 0).map(s => s.size) || []
  const allSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']

  return (
    <>
      <div className="group">
        <Link href={`/urun/${product.slug}`}>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-surface-dark mb-3 relative shadow-sm hover:shadow-md transition-all duration-300">
            {product.images && product.images[0] ? (
              <Image
                src={product.images[0].image_url}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {t('product.noImage')}
              </div>
            )}
            {!product.in_stock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">{t('product.outOfStock')}</span>
              </div>
            )}
            {product.discount_price && (
              <div className="absolute top-2 right-2 bg-[#ee2b2b] text-white px-2 py-1 rounded text-sm font-bold">
                %{Math.round((1 - product.discount_price / product.price) * 100)} {t('product.discount')}
              </div>
            )}
          </div>
        </Link>
        
        <div className="space-y-2">
          <Link href={`/urun/${product.slug}`}>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 group-hover:text-primary-500 transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2">
            {product.discount_price ? (
              <>
                <p className="text-lg font-bold text-[#ee2b2b]">
                  ₺{Number(displayPrice).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 line-through">
                  ₺{Number(product.price).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-[#ee2b2b]">
                ₺{Number(product.price).toFixed(2)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToFavorites}
              className="group/fav flex-1 p-2.5 border-2 border-border-light dark:border-border-dark hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-300"
              title={t('product.addToFavorites')}
            >
              <Heart className="w-5 h-5 mx-auto text-slate-600 dark:text-slate-400 transition-all group-hover/fav:fill-primary-500 group-hover/fav:text-primary-500 group-hover/fav:scale-110" />
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-3 py-2.5 border-2 border-red-500 bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-surface-dark rounded-xl max-w-md w-full p-6 shadow-2xl border border-border-light dark:border-border-dark animate-scale-in">
            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t('product.selectSize')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
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
                      p-3 rounded-lg border-2 font-medium transition
                      ${isSelected 
                        ? 'border-[#ee2b2b] bg-[#ee2b2b] text-white' 
                        : isAvailable
                          ? 'border-gray-300 hover:border-[#ee2b2b]'
                          : 'border-gray-200 bg-gray-100 text-gray-400 line-through cursor-not-allowed'
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                disabled={adding}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmAddToCart}
                disabled={!selectedSize || adding}
                className="flex-1 px-4 py-2 bg-[#ee2b2b] text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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

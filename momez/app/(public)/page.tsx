'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { productsAPI, categoriesAPI } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'
import ProductCard from '@/components/ProductCard'
import { useLanguage } from '@/lib/i18n'

interface UserData {
  id: string
  email: string
  full_name: string
  role: string
}

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserData | null>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    loadData()
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      
      if (data.success && data.data?.user) {
        setUser(data.data.user)
      }
    } catch (error) {
      // User not logged in, ignore
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Ürünleri çek
      const productsRes = await productsAPI.getAll({ limit: 16 }) as { success: boolean; data?: any[]; error?: string }
      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data)
      }
      
      // Kategorileri çek
      const categoriesRes = await categoriesAPI.getAll() as { success: boolean; data?: any[]; error?: string }
      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data.slice(0, 6))
      }
    } catch (error) {
      console.error('Data load error:', error)
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Toaster position="top-center" />
      
      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-[#ee2b2b] via-red-600 to-red-700 mb-12 md:mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className={`text-white max-w-3xl ${language === 'ar' ? 'text-right mr-auto' : ''}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-lg animate-fade-in">
              {t('home.hero.title')}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/90 drop-shadow animate-slide-up">
              {t('home.hero.subtitle')}
            </p>
            <Link
              href="/kategori/tum-urunler"
              className="inline-block bg-white text-[#ee2b2b] px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('home.hero.cta')}
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        {/* Kategoriler */}
        <section className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{t('home.categories')}</h2>
            <Link href="/kategoriler" className="text-[#ee2b2b] hover:text-red-700 dark:hover:text-red-400 font-semibold text-sm md:text-base hover:underline transition-all">
              {t('home.viewAll')} →
            </Link>
          </div>
          
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
              {t('home.noCategories')}
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-gray-100 dark:scrollbar-track-slate-800" style={{scrollbarWidth: 'thin', scrollbarColor: '#ef4444 #f3f4f6'}}>
                <div className="flex gap-4 md:gap-6 pb-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/kategori/${category.slug}`}
                      className="group flex-shrink-0 w-[140px] md:w-[180px] lg:w-[200px]"
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 mb-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        {category.image_url ? (
                          <Image
                            src={category.image_url}
                            alt={category.name}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 font-medium">
                            {category.name}
                          </div>
                        )}
                      </div>
                      <p className="text-center font-semibold group-hover:text-[#ee2b2b] dark:group-hover:text-red-400 transition-colors text-sm md:text-base">
                        {category.name}
                      </p>
                      <p className="text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        {category.product_count || 0} {t('home.products')}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Ürünler */}
        <section>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-slate-900 dark:text-white">{t('home.featured')}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{t('home.featuredDesc')}</p>
            </div>
            <Link href="/kategori/tum-urunler" className="text-[#ee2b2b] hover:text-red-700 dark:hover:text-red-400 font-semibold text-sm md:text-base hover:underline transition-all">
              {t('home.viewAll')} →
            </Link>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-16 md:py-20">
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-base md:text-lg">{t('home.noProducts')}</p>
              {user?.role === 'admin' && (
                <Link 
                  href="/admin/urunler/yeni" 
                  className="inline-block bg-[#ee2b2b] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold text-base md:text-lg hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {t('home.addFirstProduct')}
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} user={user} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

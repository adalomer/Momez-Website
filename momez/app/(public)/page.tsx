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
    <div className="min-h-screen">
      <Toaster position="top-center" />
      
      {/* Hero Banner */}
      <section className="relative h-[500px] bg-gradient-to-r from-[#ee2b2b] to-red-700 mb-16">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className={`text-white max-w-2xl ${language === 'ar' ? 'text-right mr-auto' : ''}`}>
            <h1 className="text-5xl font-bold mb-4">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl mb-8">
              {t('home.hero.subtitle')}
            </p>
            <Link
              href="/kategori/tum-urunler"
              className="inline-block bg-white text-[#ee2b2b] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              {t('home.hero.cta')}
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Kategoriler */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-red-500">{t('home.categories')}</h2>
            <Link href="/kategoriler" className="text-[#ee2b2b] hover:underline">
              {t('home.viewAll')}
            </Link>
          </div>
          
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t('home.noCategories')}
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-x-auto overflow-y-hidden" style={{scrollbarWidth: 'thin', scrollbarColor: '#ef4444 #f3f4f6'}}>
                <div className="flex gap-4 pb-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/kategori/${category.slug}`}
                      className="group flex-shrink-0 w-[140px] md:w-[160px]"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2 shadow-md">
                        {category.image_url ? (
                          <Image
                            src={category.image_url}
                            alt={category.name}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-110 transition"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {category.name}
                          </div>
                        )}
                      </div>
                      <p className="text-center font-medium group-hover:text-[#ee2b2b] transition text-sm">
                        {category.name}
                      </p>
                      <p className="text-center text-xs text-gray-500">
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-red-500">{t('home.featured')}</h2>
              <p className="text-red-500">{t('home.featuredDesc')}</p>
            </div>
            <Link href="/kategori/tum-urunler" className="text-[#ee2b2b] hover:underline">
              {t('home.viewAll')}
            </Link>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">{t('home.noProducts')}</p>
              {user?.role === 'admin' && (
                <Link 
                  href="/admin/urunler/yeni" 
                  className="inline-block bg-[#ee2b2b] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  {t('home.addFirstProduct')}
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

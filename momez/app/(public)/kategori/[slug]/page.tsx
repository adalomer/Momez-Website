'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart } from 'lucide-react'
import { use, useEffect, useState } from 'react'
import { productsAPI, categoriesAPI, authAPI } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'
import ProductCard from '@/components/ProductCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = use(params)
  const [products, setProducts] = useState<any[]>([])
  const [category, setCategory] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadData()
    fetchUser()
  }, [slug])

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
      
      // Kategori bilgisi
      const categoriesRes = await categoriesAPI.getAll() as { success: boolean; data?: any[]; error?: string }
      if (categoriesRes.success && categoriesRes.data) {
        const foundCategory = categoriesRes.data.find((c: any) => c.slug === slug)
        setCategory(foundCategory)
      }
      
      // Ürünleri çek
      const productsRes = await productsAPI.getAll({ category: slug }) as { success: boolean; data?: any[]; error?: string }
      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data)
      }
    } catch (error) {
      console.error('Data load error:', error)
      toast.error('Veriler yüklenirken hata oluştu')
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
          <p className="mt-4">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <Toaster position="top-center" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-primary">
            Ana Sayfa
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 dark:text-white font-medium">
            {category?.name || 'Kategori'}
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {category?.name || 'Ürünler'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {products.length} ürün bulundu
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Bu kategoride henüz ürün bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { categoriesAPI } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function KategorilerPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const result = await categoriesAPI.getAll() as { success: boolean; data?: any[]; error?: string }
      if (result.success && result.data) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-red-500 mb-8">
          Tüm Kategoriler
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="group"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3 shadow-md">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {category.name}
                  </div>
                )}
              </div>
              <h3 className="text-center font-semibold group-hover:text-red-500 transition text-base">
                {category.name}
              </h3>
              <p className="text-center text-sm text-gray-500 mt-1">
                {category.product_count || 0} ürün
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

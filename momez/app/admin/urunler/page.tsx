'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus, Edit, Trash2, Upload, X, Save } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { uploadAPI } from '@/lib/api'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  discount_price?: number
  images?: Array<{ image_url: string; display_order: number }>
  is_active: boolean
  category?: { name: string }
  stock?: Array<{ size: string; quantity: number }>
}

export default function AdminProductsPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    discount_price: '',
    images: [] as string[],
    stock: {} as Record<string, number>
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('Categories load error:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=100')
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data || [])
      } else {
        toast.error(t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (product: Product) => {
    setSelectedProduct(product)
    
    // Tüm bedenler için stok objesi hazırla (36-46)
    const allSizesStock: Record<string, number> = {}
    for (let i = 36; i <= 46; i++) {
      const sizeStr = i.toString()
      const existingStock = product.stock?.find(s => s.size === sizeStr)
      allSizesStock[sizeStr] = existingStock?.quantity || 0
    }
    
    setEditForm({
      name: product.name,
      description: product.description || '',
      category_id: (product as any).category_id || '',
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || '',
      images: product.images?.sort((a, b) => a.display_order - b.display_order).map(img => img.image_url) || [],
      stock: allSizesStock
    })
    setShowEditModal(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('common.error'))
      return
    }

    setUploadingImage(true)
    try {
      const result = await uploadAPI.uploadImage(file) as { success: boolean; url?: string; error?: string }
      if (result.success && result.url) {
        const imageUrl = result.url
        setEditForm(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }))
        toast.success(t('common.success'))
      } else {
        toast.error(result.error || t('common.error'))
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(t('common.error'))
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return

    if (!editForm.price || parseFloat(editForm.price) <= 0) {
      toast.error(t('common.error'))
      return
    }

    if (editForm.images.length === 0) {
      toast.error(t('common.error'))
      return
    }

    try {
      const response = await fetch(`/api/products/${selectedProduct.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description,
          category_id: editForm.category_id,
          price: parseFloat(editForm.price),
          discount_price: editForm.discount_price ? parseFloat(editForm.discount_price) : null,
          images: editForm.images,
          stock: Object.entries(editForm.stock).map(([size, quantity]) => ({
            size,
            quantity
          }))
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(t('admin.updateSuccess'))
        setShowEditModal(false)
        fetchProducts()
      } else {
        toast.error(data.error || t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t('admin.deleteConfirm'))) {
      return
    }

    try {
      const product = products.find(p => p.id === id)
      if (!product) return

      const response = await fetch(`/api/products/${product.slug}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(t('admin.deleteSuccess'))
        fetchProducts()
      } else {
        toast.error(data.error || t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calculateFinalPrice = (price: number, discount?: number) => {
    return discount && discount > 0 ? discount : price
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('admin.productManagement')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {filteredProducts.length} {t('admin.products')}
          </p>
        </div>
        <Link 
          href="/admin/urunler/yeni"
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          {t('admin.newProduct')}
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder={t('admin.searchProduct')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-500">
            {t('common.loading')}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500">
            {searchTerm ? t('admin.productNotFound') : t('admin.noProducts')}
          </div>
        ) : (
          filteredProducts.map((product) => {
            const mainImage = product.images?.sort((a, b) => a.display_order - b.display_order)[0]?.image_url
            const totalStock = product.stock?.reduce((sum, s) => sum + s.quantity, 0) || 0
            const hasDiscount = product.discount_price && product.discount_price > 0

            return (
              <div key={product.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group">
                <div className="relative aspect-square bg-slate-200 dark:bg-slate-700">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      {t('admin.noImage')}
                    </div>
                  )}
                  {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {t('admin.discount')}
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {hasDiscount ? (
                      <>
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">
                          ₺{product.discount_price?.toLocaleString('tr-TR')}
                        </span>
                        <span className="text-sm text-slate-500 line-through">
                          ₺{product.price.toLocaleString('tr-TR')}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        ₺{product.price.toLocaleString('tr-TR')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className={`font-medium ${
                      totalStock === 0
                        ? 'text-red-600 dark:text-red-400'
                        : totalStock < 20
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {t('admin.stock')}: {totalStock}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {product.category?.name || t('admin.noCategory')}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full p-6 my-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {t('admin.productEdit')}: {selectedProduct.name}
            </h2>

            {/* Ürün Adı */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('admin.productNameLabel')}
              </label>
              <input
                type="text"
                value={editForm.name || selectedProduct.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>

            {/* Açıklama */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('admin.descriptionLabel')}
              </label>
              <textarea
                rows={4}
                value={editForm.description || selectedProduct.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>

            {/* Kategori */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('admin.categoryLabel')}
              </label>
              <select
                value={editForm.category_id}
                onChange={(e) => setEditForm(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                required
              >
                <option value="">{t('admin.selectCategory')}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fiyat */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('admin.priceLabel')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* İndirimli Fiyat */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('admin.discountPriceLabel')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.discount_price}
                  onChange={(e) => setEditForm(prev => ({ ...prev, discount_price: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Görseller */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                {t('admin.productImages')}
              </label>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                {editForm.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 group">
                    <img src={img} alt={`${t('admin.images')} ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                        {t('admin.mainImage')}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-5 w-5 text-slate-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {uploadingImage ? t('admin.uploading') : t('admin.addNewImage')}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>

            {/* Stok Yönetimi */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                {t('admin.updateStock')}
              </label>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 11 }, (_, i) => (36 + i).toString()).map((size) => {
                  const currentStock = selectedProduct.stock?.find((s: any) => s.size === size)?.quantity || 0
                  return (
                    <div key={size} className="flex items-center gap-2">
                      <span className="w-12 px-2 py-2 bg-slate-100 dark:bg-slate-700 rounded text-center font-medium text-sm">
                        {size}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={editForm.stock[size] ?? currentStock}
                        onChange={(e) => setEditForm(prev => ({
                          ...prev,
                          stock: { ...prev.stock, [size]: parseInt(e.target.value) || 0 }
                        }))}
                        className="flex-1 px-2 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedProduct(null)
                }}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleUpdateProduct}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

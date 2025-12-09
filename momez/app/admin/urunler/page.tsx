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
    stock: {} as Record<string, string> // store stock as strings so inputs can be cleared by user
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
    const allSizesStock: Record<string, string> = {}
    for (let i = 36; i <= 46; i++) {
      const sizeStr = i.toString()
      const existingStock = product.stock?.find(s => s.size === sizeStr)
      allSizesStock[sizeStr] = existingStock?.quantity?.toString() || ''
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
            quantity: parseInt(quantity as string) || 0
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-primary"></div>
            <p className="mt-4">{t('common.loading')}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500">{searchTerm ? t('admin.productNotFound') : t('admin.noProducts')}</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const mainImage = product.images?.sort((a, b) => a.display_order - b.display_order)[0]?.image_url
            const totalStock = product.stock?.reduce((sum, s) => sum + s.quantity, 0) || 0
            const hasDiscount = product.discount_price && product.discount_price > 0

            return (
              <div key={product.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <div className="text-center">
                        <Upload className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t('admin.noImage')}</p>
                      </div>
                    </div>
                  )}
                  {hasDiscount && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      {t('admin.discount')}
                    </div>
                  )}
                  {!product.is_active && (
                    <div className="absolute top-3 left-3 bg-gray-500/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Pasif
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    {hasDiscount ? (
                      <>
                        <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                          ₺{product.discount_price?.toLocaleString('tr-TR')}
                        </span>
                        <span className="text-sm text-slate-500 line-through">
                          ₺{product.price.toLocaleString('tr-TR')}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-slate-900 dark:text-white">
                        ₺{product.price.toLocaleString('tr-TR')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs mb-4 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${
                        totalStock === 0 ? 'bg-red-500' :
                        totalStock < 20 ? 'bg-orange-500' : 'bg-green-500'
                      } animate-pulse`}></div>
                      <span className={`font-semibold ${
                        totalStock === 0 ? 'text-red-600 dark:text-red-400' :
                        totalStock < 20 ? 'text-orange-600 dark:text-orange-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {t('admin.stock')}: {totalStock}
                      </span>
                    </div>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {product.category?.name || t('admin.noCategory')}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 px-3 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Edit className="h-4 w-4" />
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="px-3 py-2.5 text-sm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl max-w-5xl w-full p-8 my-8 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  {t('admin.productEdit')}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">{selectedProduct.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedProduct(null)
                }}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Ürün Adı */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></span>
                  {t('admin.productNameLabel')}
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 font-medium"
                  placeholder="Ürün adını girin"
                  required
                />
              </div>

              {/* Açıklama */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></span>
                  {t('admin.descriptionLabel')}
                </label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 resize-none"
                  placeholder="Ürün açıklamasını girin"
                  required
                />
              </div>

              {/* Kategori */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></span>
                  {t('admin.categoryLabel')}
                </label>
                <select
                  value={editForm.category_id}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 cursor-pointer font-medium"
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

              {/* Fiyat ve İndirimli Fiyat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fiyat */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></span>
                    {t('admin.priceLabel')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-bold">₺</span>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 font-bold"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* İndirimli Fiyat */}
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></span>
                    {t('admin.discountPriceLabel')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-bold">₺</span>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.discount_price}
                      onChange={(e) => setEditForm(prev => ({ ...prev, discount_price: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/10 transition-all duration-200 font-bold"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Görseller */}
              <div className="mt-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border-2 border-dashed border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full"></span>
                  {t('admin.productImages')}
                </label>
                
                {editForm.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                    {editForm.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 group shadow-md hover:shadow-xl transition-all duration-300">
                        <img src={img} alt={`${t('admin.images')} ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg transform hover:scale-110"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {idx === 0 && (
                          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-lg font-bold shadow-lg">
                            {t('admin.mainImage')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 group">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform duration-200">
                    <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      {uploadingImage ? t('admin.uploading') : t('admin.addNewImage')}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      PNG, JPG, GIF (maks. 5MB)
                    </span>
                  </div>
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
              <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-xl p-6 border-2 border-indigo-100 dark:border-indigo-900/50 shadow-lg">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  {t('admin.updateStock')}
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Array.from({ length: 11 }, (_, i) => (36 + i).toString()).map((size) => {
                  const currentStock = selectedProduct.stock?.find((s: any) => s.size === size)?.quantity || 0
                  const stockValue = editForm.stock[size] ?? currentStock.toString()
                  const stockNum = parseInt(stockValue) || 0
                  return (
                    <div key={size} className="group">
                      <div className="flex flex-col gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg text-center font-bold text-sm shadow-md">
                            {size}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            stockNum === 0 ? 'bg-red-500' :
                            stockNum < 10 ? 'bg-orange-500' : 'bg-green-500'
                          } animate-pulse shadow-lg`}></div>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={stockValue}
                          onChange={(e) => {
                            // keep raw string so user can delete, but remove leading zeros when typing numbers
                            const raw = e.target.value
                            const normalized = raw === '' ? '' : raw.replace(/^0+(?=\d)/, '')
                            setEditForm(prev => ({
                              ...prev,
                              stock: { ...prev.stock, [size]: normalized }
                            }))
                          }}
                          className="w-full px-3 py-2 border-2 border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-center text-base font-bold focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedProduct(null)
                }}
                className="flex-1 px-6 py-3.5 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 transform"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleUpdateProduct}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 transform"
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

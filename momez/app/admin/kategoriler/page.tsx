'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Upload, X } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { categoriesAPI, uploadAPI } from '@/lib/api'
import { useLanguage } from '@/lib/i18n'

interface Category {
  id: string
  name: string
  slug: string
  image_url?: string
  is_active: boolean
  created_at?: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const { t } = useLanguage()
  
  const [formData, setFormData] = useState({
    name: '',
    image_url: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    console.log('Loading categories...')
    setLoading(true)
    try {
      const result = await categoriesAPI.getAll() as { success: boolean; data?: any[]; error?: string }
      console.log('Categories API result:', result)
      if (result.success && result.data) {
        console.log('Categories loaded:', result.data.length)
        setCategories(result.data)
      } else {
        console.error('Categories API error:', result)
      }
    } catch (error) {
      console.error('Categories load exception:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen bir resim dosyası seçin')
      return
    }

    setUploadingImage(true)
    try {
      const result = await uploadAPI.uploadImage(file) as { success: boolean; url?: string; error?: string }
      if (result.success && result.url) {
        const imageUrl = result.url
        setFormData(prev => ({ ...prev, image_url: imageUrl }))
        toast.success('Görsel yüklendi')
      } else {
        toast.error(result.error || 'Görsel yüklenemedi')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Görsel yüklenirken hata oluştu')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error(t('categories.nameRequired'))
      return
    }

    try {
      const result = await categoriesAPI.create({
        name: formData.name,
        slug: formData.name.toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
        image_url: formData.image_url || null,
        is_active: true
      }) as { success: boolean; error?: string }

      if (result.success) {
        toast.success(t('categories.added'))
        setShowAddModal(false)
        setFormData({ name: '', image_url: '' })
        loadCategories()
      } else {
        toast.error(result.error || 'Kategori eklenemedi')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return

    if (!formData.name.trim()) {
      toast.error('Kategori adı gerekli')
      return
    }

    try {
      const result = await categoriesAPI.update(selectedCategory.id, {
        name: formData.name,
        slug: formData.name.toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
        image_url: formData.image_url || null
      }) as { success: boolean; error?: string }

      if (result.success) {
        toast.success(t('categories.updated'))
        setShowEditModal(false)
        setSelectedCategory(null)
        setFormData({ name: '', image_url: '' })
        loadCategories()
      } else {
        toast.error(result.error || t('common.error'))
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
      const result = await categoriesAPI.delete(id) as { success: boolean; error?: string }
      if (result.success) {
        toast.success(t('categories.deleted'))
        loadCategories()
      } else {
        toast.error(result.error || t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    }
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      image_url: category.image_url || ''
    })
    setShowEditModal(true)
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('admin.categoryManagement')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {categories.length} {t('admin.categories').toLowerCase()}
          </p>
        </div>
        <button 
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-5 w-5" />
          {t('categories.newCategory')}
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-primary"></div>
          <p className="mt-4 text-slate-500">{t('common.loading')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">{t('admin.noImage')}</p>
                    </div>
                  </div>
                )}
                <span className={`absolute top-3 right-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                  category.is_active
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-gray-500/90 text-white'
                }`}>
                  {category.is_active ? t('admin.active') : t('admin.inactive')}
                </span>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {category.slug}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className="flex-1 px-3 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                    onClick={() => openEditModal(category)}
                  >
                    <Edit className="h-4 w-4" />
                    {t('common.edit')}
                  </button>
                  <button 
                    className="p-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                    onClick={() => handleDelete(category.id, category.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {t('categories.addNew')}
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('categories.categoryName')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder={t('categories.categoryNamePlaceholder')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('categories.categoryImage')}
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <Upload className="h-5 w-5 text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {uploadingImage ? t('admin.uploading') : t('categories.selectImage')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  {formData.image_url && (
                    <div className="relative w-32 h-32">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setFormData({ name: '', image_url: '' })
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  {t('common.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {t('categories.editCategory')}
            </h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('categories.categoryName')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('categories.categoryImage')}
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <Upload className="h-5 w-5 text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {uploadingImage ? t('admin.uploading') : t('categories.selectNewImage')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  {formData.image_url && (
                    <div className="relative w-32 h-32">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedCategory(null)
                    setFormData({ name: '', image_url: '' })
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  {t('common.update')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

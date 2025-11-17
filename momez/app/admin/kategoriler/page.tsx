'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Upload, X } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { categoriesAPI, uploadAPI } from '@/lib/api'

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
      const result = await categoriesAPI.getAll()
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
      const result = await uploadAPI.uploadImage(file)
      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, image_url: result.url }))
        toast.success('Görsel yüklendi')
      } else {
        toast.error('Görsel yüklenemedi')
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
      toast.error('Kategori adı gerekli')
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
      })

      if (result.success) {
        toast.success('Kategori eklendi')
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
      })

      if (result.success) {
        toast.success('Kategori güncellendi')
        setShowEditModal(false)
        setSelectedCategory(null)
        setFormData({ name: '', image_url: '' })
        loadCategories()
      } else {
        toast.error(result.error || 'Kategori güncellenemedi')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) {
      return
    }

    try {
      const result = await categoriesAPI.delete(id)
      if (result.success) {
        toast.success('Kategori silindi')
        loadCategories()
      } else {
        toast.error(result.error || 'Kategori silinemedi')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
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
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kategori Yönetimi
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {categories.length} kategori
          </p>
        </div>
        <button 
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-5 w-5" />
          Yeni Kategori
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="relative h-48 bg-slate-200 dark:bg-slate-700">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Eye className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">
                      {category.name}
                    </h3>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.is_active
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400'
                  }`}>
                    {category.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className="flex-1 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                    onClick={() => openEditModal(category)}
                  >
                    <Edit className="h-4 w-4" />
                    Düzenle
                  </button>
                  <button 
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Yeni Kategori Ekle
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Kategori Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Örn: Erkek Ayakkabı"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Kategori Görseli
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <Upload className="h-5 w-5 text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {uploadingImage ? 'Yükleniyor...' : 'Görsel Seç'}
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
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Kategori Düzenle
            </h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Kategori Adı
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
                  Kategori Görseli
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <Upload className="h-5 w-5 text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {uploadingImage ? 'Yükleniyor...' : 'Yeni Görsel Seç'}
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
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { categoriesAPI } from '@/lib/api'

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  product_count: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const result = await categoriesAPI.getAll()
      if (result.success) {
        setCategories(result.data || [])
      }
    } catch (error) {
      console.error('Categories load error:', error)
      toast.error('Kategoriler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingCategory) {
        const result = await categoriesAPI.update(editingCategory.id, formData)
        if (result.success) {
          toast.success('Kategori güncellendi')
          loadCategories()
          closeModal()
        } else {
          toast.error(result.message || 'Güncellenemedi')
        }
      } else {
        const result = await categoriesAPI.create(formData)
        if (result.success) {
          toast.success('Kategori eklendi')
          loadCategories()
          closeModal()
        } else {
          toast.error(result.message || 'Eklenemedi')
        }
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?\n\n' + name)) return
    
    try {
      const result = await categoriesAPI.delete(id)
      if (result.success) {
        toast.success('Kategori silindi')
        loadCategories()
      } else {
        toast.error(result.message || 'Silinemedi')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || ''
      })
    } else {
      setEditingCategory(null)
      setFormData({ name: '', slug: '', description: '' })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({ name: '', slug: '', description: '' })
  }

  const generateSlug = (name: string) => {
    const turkishMap: Record<string, string> = {
      'ç': 'c', 'ğ': 'g', 'ı': 'i', 'İ': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
      'Ç': 'c', 'Ğ': 'g', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
    }
    
    return name
      .split('')
      .map(char => turkishMap[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name, slug: generateSlug(name) })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      
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
          onClick={() => openModal()}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Yeni Kategori
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                Kategori Adı
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                Slug
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                Ürün Sayısı
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900 dark:text-white">{category.name}</p>
                  {category.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{category.description}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                  /{category.slug}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                  {category.product_count || 0} ürün
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openModal(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-600 dark:text-slate-400">
                  Henüz kategori eklenmemiş
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Kategori Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Açıklama (Opsiyonel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition"
                >
                  {editingCategory ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

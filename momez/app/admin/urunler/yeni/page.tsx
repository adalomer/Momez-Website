'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { categoriesAPI, productsAPI, uploadAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminProductFormPage() {
  const router = useRouter()
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['40', '41', '42'])
  const [images, setImages] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    sku: '',
    is_active: true,
    is_featured: false,
    is_new: false,
    tags: ''
  })
  
  const [sizeStocks, setSizeStocks] = useState<Record<string, number>>({})

  const availableSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']

  useEffect(() => {
    const loadCategories = async () => {
      const result = await categoriesAPI.getAll() as { success: boolean; data?: any[]; error?: string }
      if (result.success && result.data) {
        setCategories(result.data)
      }
    }
    loadCategories()
  }, [])

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
      
      if (!newSizes.includes(size)) {
        const newStocks = {...sizeStocks}
        delete newStocks[size]
        setSizeStocks(newStocks)
      }
      
      return newSizes
    })
  }
  
  const handleStockChange = (size: string, value: string) => {
    setSizeStocks(prev => ({
      ...prev,
      [size]: parseInt(value) || 0
    }))
  }
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploadingImage(true)
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const result = await uploadAPI.uploadImage(file) as { success: boolean; url?: string; error?: string }
        if (result.success && result.url) {
          return result.url
        }
        return null
      })
      
      const uploadedUrls = await Promise.all(uploadPromises)
      const validUrls = uploadedUrls.filter(url => url !== null) as string[]
      
      if (validUrls.length > 0) {
        setImages(prev => [...prev, ...validUrls])
        toast.success(validUrls.length + ' görsel yüklendi')
      }
      
      // Input'u temizle
      e.target.value = ''
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Görsel yüklenirken hata oluştu')
    } finally {
      setUploadingImage(false)
    }
  }
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    toast.success('Görsel kaldırıldı')
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submit başladı')
    console.log('FormData:', formData)
    console.log('Images:', images)
    console.log('Selected Sizes:', selectedSizes)
    
    if (!formData.name || !formData.description || !formData.category_id || !formData.price) {
      toast.error('Lütfen zorunlu alanları doldurun')
      return
    }
    
    if (selectedSizes.length === 0) {
      toast.error('En az bir beden seçmelisiniz')
      return
    }
    
    if (images.length === 0) {
      toast.error('En az bir görsel yüklemelisiniz')
      return
    }
    
    const stockData = selectedSizes.map(size => ({
      size,
      quantity: sizeStocks[size] || 0
    }))
    
    setLoading(true)
    
    try {
      console.log('API çağrısı yapılıyor...')
      const result = await productsAPI.create({
        name: formData.name,
        slug: formData.name.toLowerCase()
          .replace(/[^a-z0-9ğüşıöçİĞÜŞÖÇ\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-'),
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        images,
        stock: stockData,
        sku: formData.sku || null,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        is_new: formData.is_new,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
      })
      
      console.log('API yanıtı:', result)
      
      const apiResult = result as { success: boolean; error?: string; data?: any }
      if (apiResult.success) {
        toast.success('Ürün başarıyla eklendi!')
        setTimeout(() => {
          router.push('/admin/urunler')
        }, 1000)
      } else {
        toast.error(apiResult.error || 'Ürün eklenirken hata oluştu')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Bir hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/urunler"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Yeni Ürün Ekle
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            MySQL veritabanına kaydedilecek
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Temel Bilgiler
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Ürün Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Örn: AeroGlide Pro"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Ürün hakkında detaylı açıklama"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Kategori *
                    </label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={e => setFormData({...formData, category_id: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Kategori Seçin</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Fiyat (₺) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="1899.00"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    SKU (Stok Kodu)
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                    placeholder="AGLP-2024-001"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Beden ve Stok
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                    Bedenler *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={'px-4 py-2 rounded-lg font-medium transition-colors ' + (
                          selectedSizes.includes(size)
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedSizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                      Stok Miktarları
                    </label>
                    <div className="space-y-3">
                      {selectedSizes.sort((a, b) => Number(a) - Number(b)).map((size) => (
                        <div key={size} className="flex items-center gap-4">
                          <div className="w-16 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-center font-medium">
                            {size}
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={sizeStocks[size] || 0}
                            onChange={e => handleStockChange(size, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Görseller
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 group">
                    <img src={img} alt={'Ürün ' + (idx + 1)} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary flex flex-col items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <Upload className="h-6 w-6" />
                  <span className="text-sm font-medium">
                    {uploadingImage ? 'Yükleniyor...' : 'Yükle'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Durum
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.is_active}
                    onChange={e => setFormData({...formData, is_active: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" 
                  />
                  <span className="text-slate-700 dark:text-slate-300">Aktif</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" 
                  />
                  <span className="text-slate-700 dark:text-slate-300">Öne Çıkan</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.is_new}
                    onChange={e => setFormData({...formData, is_new: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" 
                  />
                  <span className="text-slate-700 dark:text-slate-300">Yeni</span>
                </label>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Etiketler
              </h2>
              <input
                type="text"
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
                placeholder="koşu, spor, hafif"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <Link
                href="/admin/urunler"
                className="w-full px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                İptal
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

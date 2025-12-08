'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { categoriesAPI, productsAPI, uploadAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminProductFormPage() {
  const router = useRouter()
  const { t } = useLanguage()
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
    sku: ''
  })
  
  const [sizeStocks, setSizeStocks] = useState<Record<string, string>>({})

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
        setSizeStocks(prev => {
          const newStocks = {...prev}
          delete newStocks[size]
          return newStocks
        })
      }
      
      return newSizes
    })
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
        toast.success(t('admin.imagesUploaded').replace('{count}', validUrls.length.toString()))
      }
      
      // Input'u temizle
      e.target.value = ''
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error(t('admin.imageUploadError'))
    } finally {
      setUploadingImage(false)
    }
  }
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    toast.success(t('admin.imageRemoved'))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submit başladı')
    console.log('FormData:', formData)
    console.log('Images:', images)
    console.log('Selected Sizes:', selectedSizes)
    
    if (!formData.name || !formData.description || !formData.category_id || !formData.price) {
      toast.error(t('admin.fillRequiredFields'))
      return
    }
    
    if (selectedSizes.length === 0) {
      toast.error(t('admin.selectAtLeastOneSize'))
      return
    }
    
    if (images.length === 0) {
      toast.error(t('admin.uploadAtLeastOneImage'))
      return
    }
    
    const stockData = selectedSizes.map(size => ({
      size,
      quantity: parseInt(sizeStocks[size]) || 0
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
        is_active: true,
        is_featured: false,
        is_new: false
      })
      
      console.log('API yanıtı:', result)
      
      const apiResult = result as { success: boolean; error?: string; data?: any }
      if (apiResult.success) {
        toast.success(t('admin.productAddedSuccessfully'))
        setTimeout(() => {
          router.push('/admin/urunler')
        }, 1000)
      } else {
        toast.error(apiResult.error || t('admin.productAddError'))
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(t('common.error') + ': ' + (error instanceof Error ? error.message : t('common.error')))
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
            {t('admin.addNewProduct')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {t('admin.savedToMySQL')}
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                {t('admin.basicInfo')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    {t('admin.productNameLabel')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                    placeholder={t('admin.productNamePlaceholder')}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    {t('admin.descriptionLabel')}
                  </label>
                  <textarea
                    rows={5}
                    value={formData.description}
                    onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
                    placeholder={t('admin.descriptionPlaceholder')}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      {t('admin.categoryLabel')}
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={e => setFormData(prev => ({...prev, category_id: e.target.value}))}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{t('admin.selectCategoryPlaceholder')}</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      {t('admin.priceLabel')}
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={formData.price}
                      onChange={e => {
                        const val = e.target.value
                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                          setFormData(prev => ({...prev, price: val}))
                        }
                      }}
                      placeholder={t('admin.pricePlaceholder')}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    {t('admin.skuLabel')}
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={e => setFormData(prev => ({...prev, sku: e.target.value}))}
                    placeholder={t('admin.skuPlaceholder')}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                {t('admin.sizeAndStock')}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                    {t('admin.sizesLabel')}
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
                      {t('admin.stockQuantities')}
                    </label>
                    <div className="space-y-3">
                      {selectedSizes.sort((a, b) => Number(a) - Number(b)).map((size) => (
                        <div key={size} className="flex items-center gap-4">
                          <div className="w-16 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-center font-medium">
                            {size}
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={sizeStocks[size] ?? ''}
                            onChange={e => {
                              const val = e.target.value
                              // Sadece rakam kabul et, başındaki 0'ları temizle
                              if (val === '') {
                                setSizeStocks(prev => ({...prev, [size]: ''}))
                              } else if (/^\d+$/.test(val)) {
                                // Başındaki gereksiz 0'ları kaldır (örn: 045 -> 45)
                                setSizeStocks(prev => ({...prev, [size]: String(parseInt(val))}))
                              }
                            }}
                            onFocus={e => {
                              // Focus olunca 0 ise temizle
                              if (e.target.value === '0') {
                                setSizeStocks(prev => ({...prev, [size]: ''}))
                              }
                              e.target.select()
                            }}
                            onBlur={e => {
                              // Boşsa 0 yap
                              if (e.target.value === '') {
                                setSizeStocks(prev => ({...prev, [size]: '0'}))
                              }
                            }}
                            placeholder="0"
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
                {t('admin.imagesLabel')}
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
                    {uploadingImage ? t('admin.uploadingImages') : t('admin.uploadButton')}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {loading ? t('admin.savingButton') : t('admin.saveButton')}
              </button>
              <Link
                href="/admin/urunler"
                className="w-full px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                {t('admin.cancelButton')}
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

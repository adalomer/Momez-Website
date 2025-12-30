'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Upload, X, Plus, Palette, Trash2 } from 'lucide-react'
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

interface ColorVariant {
  id: string
  name: string
  hex: string
  images: string[]
  isDefault: boolean
}

// Önceden tanımlı renkler
const PRESET_COLORS = [
  { name: 'Siyah', hex: '#000000' },
  { name: 'Beyaz', hex: '#FFFFFF' },
  { name: 'Kırmızı', hex: '#EF4444' },
  { name: 'Mavi', hex: '#3B82F6' },
  { name: 'Lacivert', hex: '#1E3A5F' },
  { name: 'Yeşil', hex: '#22C55E' },
  { name: 'Gri', hex: '#6B7280' },
  { name: 'Kahverengi', hex: '#92400E' },
  { name: 'Pembe', hex: '#EC4899' },
  { name: 'Mor', hex: '#8B5CF6' },
  { name: 'Turuncu', hex: '#F97316' },
  { name: 'Sarı', hex: '#EAB308' },
  { name: 'Bej', hex: '#D4B896' },
  { name: 'Bordo', hex: '#881337' },
  { name: 'Haki', hex: '#4B5320' },
]

export default function AdminProductFormPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)
  
  // Temel ürün bilgileri
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    sku: ''
  })
  
  // Renk varyantları
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [customColor, setCustomColor] = useState({ name: '', hex: '#000000' })
  
  // Beden ve stok
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['40', '41', '42'])
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

  // Renk ekleme
  const addColor = (name: string, hex: string) => {
    const newColor: ColorVariant = {
      id: Date.now().toString(),
      name,
      hex,
      images: [],
      isDefault: colorVariants.length === 0
    }
    setColorVariants(prev => [...prev, newColor])
    setShowColorPicker(false)
    setCustomColor({ name: '', hex: '#000000' })
    toast.success(`${name} rengi eklendi`)
  }

  // Renk silme
  const removeColor = (colorId: string) => {
    setColorVariants(prev => {
      const filtered = prev.filter(c => c.id !== colorId)
      if (filtered.length > 0 && !filtered.some(c => c.isDefault)) {
        filtered[0].isDefault = true
      }
      return filtered
    })
    toast.success('Renk kaldırıldı')
  }

  // Varsayılan renk ayarlama
  const setDefaultColor = (colorId: string) => {
    setColorVariants(prev => prev.map(c => ({
      ...c,
      isDefault: c.id === colorId
    })))
  }

  // Renge görsel ekleme
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, colorId: string) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploadingImage(colorId)
    
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
        setColorVariants(prev => prev.map(c => {
          if (c.id === colorId) {
            return { ...c, images: [...c.images, ...validUrls] }
          }
          return c
        }))
        toast.success(`${validUrls.length} görsel yüklendi`)
      }
      
      e.target.value = ''
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Görsel yüklenirken hata oluştu')
    } finally {
      setUploadingImage(null)
    }
  }

  // Görsel silme
  const removeImage = (colorId: string, imageIndex: number) => {
    setColorVariants(prev => prev.map(c => {
      if (c.id === colorId) {
        return { ...c, images: c.images.filter((_, i) => i !== imageIndex) }
      }
      return c
    }))
    toast.success('Görsel kaldırıldı')
  }

  // Beden toggle
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

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.category_id || !formData.price) {
      toast.error('Lütfen tüm zorunlu alanları doldurun')
      return
    }
    
    if (colorVariants.length === 0) {
      toast.error('En az bir renk eklemelisiniz')
      return
    }
    
    const hasImages = colorVariants.some(c => c.images.length > 0)
    if (!hasImages) {
      toast.error('En az bir renk için görsel yüklemelisiniz')
      return
    }
    
    if (selectedSizes.length === 0) {
      toast.error('En az bir beden seçmelisiniz')
      return
    }
    
    const stockData = selectedSizes.map(size => ({
      size,
      quantity: parseInt(sizeStocks[size]) || 0
    }))
    
    const colorsData = colorVariants.map(c => ({
      name: c.name,
      hex: c.hex,
      images: c.images,
      isDefault: c.isDefault
    }))
    
    setLoading(true)
    
    try {
      const result = await productsAPI.create({
        name: formData.name,
        slug: formData.name.toLowerCase()
          .replace(/[^a-z0-9ğüşıöçİĞÜŞÖÇ\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-'),
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        colors: colorsData,
        stock: stockData,
        sku: formData.sku || null,
        is_active: true,
        is_featured: false,
        is_new: false
      })
      
      const apiResult = result as { success: boolean; error?: string; data?: any }
      if (apiResult.success) {
        toast.success('Ürün başarıyla eklendi')
        setTimeout(() => {
          router.push('/admin/urunler')
        }, 1000)
      } else {
        toast.error(apiResult.error || 'Ürün eklenirken hata oluştu')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Bir hata oluştu')
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
            Renk varyantları ile ürün oluşturun
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Temel Bilgiler */}
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
                    value={formData.name}
                    onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                    placeholder="Örn: Nike Air Max 270"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Ürün açıklaması..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Kategori *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={e => setFormData(prev => ({...prev, category_id: e.target.value}))}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Kategori seçin</option>
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
                      type="text"
                      inputMode="decimal"
                      value={formData.price}
                      onChange={e => {
                        const val = e.target.value
                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                          setFormData(prev => ({...prev, price: val}))
                        }
                      }}
                      placeholder="0.00"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    SKU (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={e => setFormData(prev => ({...prev, sku: e.target.value}))}
                    placeholder="Stok kodu"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Renk Varyantları */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Renk Varyantları
                </h2>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Renk Ekle
                </button>
              </div>

              {showColorPicker && (
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h3 className="font-medium text-slate-900 dark:text-white mb-3">Renk Seç</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => addColor(color.name, color.hex)}
                        className="group relative w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-600 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {color.hex === '#FFFFFF' && (
                          <span className="absolute inset-0 rounded-full border border-slate-300" />
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <input
                      type="color"
                      value={customColor.hex}
                      onChange={e => setCustomColor(prev => ({...prev, hex: e.target.value}))}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customColor.name}
                      onChange={e => setCustomColor(prev => ({...prev, name: e.target.value}))}
                      placeholder="Renk adı"
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customColor.name) {
                          addColor(customColor.name, customColor.hex)
                        } else {
                          toast.error('Renk adı girin')
                        }
                      }}
                      className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:opacity-90"
                    >
                      Ekle
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(false)}
                      className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}

              {colorVariants.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Henüz renk eklenmedi</p>
                  <p className="text-sm">Yukarıdaki butona tıklayarak renk ekleyin</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {colorVariants.map(color => (
                    <div key={color.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-600"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="font-medium text-slate-900 dark:text-white">{color.name}</span>
                          {color.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Varsayılan</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!color.isDefault && (
                            <button
                              type="button"
                              onClick={() => setDefaultColor(color.id)}
                              className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary"
                            >
                              Varsayılan yap
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeColor(color.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-3">
                        {color.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 group">
                            <img src={img} alt={`${color.name} ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(color.id, idx)}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        
                        <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, color.id)}
                            disabled={uploadingImage !== null}
                            className="hidden"
                          />
                          <Upload className="h-5 w-5" />
                          <span className="text-xs">
                            {uploadingImage === color.id ? 'Yükleniyor...' : 'Ekle'}
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Beden ve Stok */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Beden ve Stok
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                    Mevcut Bedenler
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`min-w-[48px] px-3 py-2 rounded-lg font-medium transition-all ${
                          selectedSizes.includes(size)
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedSizes.sort((a, b) => Number(a) - Number(b)).map((size) => (
                        <div key={size} className="flex items-center gap-2">
                          <div className="w-12 px-2 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-center font-medium text-sm">
                            {size}
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={sizeStocks[size] ?? ''}
                            onChange={e => {
                              const val = e.target.value
                              if (val === '' || /^\d+$/.test(val)) {
                                setSizeStocks(prev => ({...prev, [size]: val === '' ? '' : String(parseInt(val))}))
                              }
                            }}
                            onBlur={e => {
                              if (e.target.value === '') {
                                setSizeStocks(prev => ({...prev, [size]: '0'}))
                              }
                            }}
                            placeholder="0"
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Taraf */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sticky top-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Özet</h3>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Renk sayısı:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{colorVariants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Toplam görsel:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {colorVariants.reduce((sum, c) => sum + c.images.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Beden sayısı:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{selectedSizes.length}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || uploadingImage !== null}
                  className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {loading ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
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
        </div>
      </form>
    </div>
  )
}

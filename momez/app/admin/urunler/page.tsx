'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Plus, Edit, Trash2, Upload, X, Save, Palette } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { uploadAPI } from '@/lib/api'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface ColorVariant {
  id: string
  color_name: string
  color_hex: string
  is_default: number
  images: string[]
}

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  discount_price?: number
  images?: Array<{ image_url: string; display_order: number }>
  colors?: ColorVariant[]
  is_active: boolean
  category?: { name: string }
  category_id?: string
  stock?: Array<{ size: string; quantity: number }>
}

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

interface EditColorVariant {
  id: string
  name: string
  hex: string
  images: string[]
  isDefault: boolean
}

export default function AdminProductsPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [customColor, setCustomColor] = useState({ name: '', hex: '#000000' })
  
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
    discount_price: '',
    colors: [] as EditColorVariant[],
    stock: {} as Record<string, string>
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
    
    const allSizesStock: Record<string, string> = {}
    for (let i = 36; i <= 46; i++) {
      const sizeStr = i.toString()
      const existingStock = product.stock?.find(s => s.size === sizeStr)
      allSizesStock[sizeStr] = existingStock?.quantity?.toString() || ''
    }
    
    const editColors: EditColorVariant[] = (product.colors || []).map((c, idx) => ({
      id: c.id || `color-${idx}`,
      name: c.color_name,
      hex: c.color_hex,
      // images hem string hem obje formatında gelebilir
      images: (c.images || []).map((img: any) => typeof img === 'string' ? img : (img?.image_url || '')).filter((url: string) => url),
      isDefault: c.is_default === 1
    }))
    
    if (editColors.length === 0 && product.images && product.images.length > 0) {
      editColors.push({
        id: 'default-color',
        name: 'Varsayılan',
        hex: '#000000',
        images: product.images.map(img => img.image_url),
        isDefault: true
      })
    }
    
    setEditForm({
      name: product.name,
      description: product.description || '',
      category_id: product.category_id || '',
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || '',
      colors: editColors,
      stock: allSizesStock
    })
    setShowEditModal(true)
  }

  const addColor = (name: string, hex: string) => {
    const newColor: EditColorVariant = {
      id: Date.now().toString(),
      name,
      hex,
      images: [],
      isDefault: editForm.colors.length === 0
    }
    setEditForm(prev => ({ ...prev, colors: [...prev.colors, newColor] }))
    setShowColorPicker(false)
    setCustomColor({ name: '', hex: '#000000' })
    toast.success(`${name} rengi eklendi`)
  }

  const removeColor = (colorId: string) => {
    setEditForm(prev => {
      const filtered = prev.colors.filter(c => c.id !== colorId)
      if (filtered.length > 0 && !filtered.some(c => c.isDefault)) {
        filtered[0].isDefault = true
      }
      return { ...prev, colors: filtered }
    })
  }

  const setDefaultColor = (colorId: string) => {
    setEditForm(prev => ({
      ...prev,
      colors: prev.colors.map(c => ({ ...c, isDefault: c.id === colorId }))
    }))
  }

  const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, colorId: string) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploadingImage(colorId)
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const result = await uploadAPI.uploadImage(file) as { success: boolean; url?: string }
        return result.success && result.url ? result.url : null
      })
      
      const uploadedUrls = (await Promise.all(uploadPromises)).filter(url => url !== null) as string[]
      
      if (uploadedUrls.length > 0) {
        setEditForm(prev => ({
          ...prev,
          colors: prev.colors.map(c => c.id === colorId ? { ...c, images: [...c.images, ...uploadedUrls] } : c)
        }))
        toast.success(`${uploadedUrls.length} görsel yüklendi`)
      }
      e.target.value = ''
    } catch (error) {
      toast.error('Görsel yüklenirken hata oluştu')
    } finally {
      setUploadingImage(null)
    }
  }

  const removeColorImage = (colorId: string, imageIndex: number) => {
    setEditForm(prev => ({
      ...prev,
      colors: prev.colors.map(c => c.id === colorId ? { ...c, images: c.images.filter((_, i) => i !== imageIndex) } : c)
    }))
  }

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return
    if (!editForm.price || parseFloat(editForm.price) <= 0) {
      toast.error('Geçerli bir fiyat girin')
      return
    }
    if (!editForm.colors.some(c => c.images.length > 0)) {
      toast.error('En az bir renk için görsel yüklemelisiniz')
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
          colors: editForm.colors.map(c => ({ name: c.name, hex: c.hex, images: c.images, isDefault: c.isDefault })),
          stock: Object.entries(editForm.stock).map(([size, quantity]) => ({ size, quantity: parseInt(quantity) || 0 }))
        })
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Ürün güncellendi')
        setShowEditModal(false)
        fetchProducts()
      } else {
        toast.error(data.error || 'Hata oluştu')
      }
    } catch (error) {
      toast.error('Hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return
    const product = products.find(p => p.id === id)
    if (!product) return

    try {
      const response = await fetch(`/api/products/${product.slug}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        toast.success('Ürün silindi')
        fetchProducts()
      } else {
        toast.error(data.error || 'Hata oluştu')
      }
    } catch (error) {
      toast.error('Hata oluştu')
    }
  }

  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getProductMainImage = (product: Product) => {
    if (product.colors && product.colors.length > 0) {
      const defaultColor = product.colors.find(c => c.is_default === 1) || product.colors[0]
      if (defaultColor.images && defaultColor.images.length > 0) {
        const img = defaultColor.images[0]
        return typeof img === 'string' ? img : (img as any).image_url
      }
    }
    if (product.images && product.images.length > 0) {
      return product.images.sort((a, b) => a.display_order - b.display_order)[0]?.image_url
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ürün Yönetimi</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{filteredProducts.length} ürün</p>
        </div>
        <Link href="/admin/urunler/yeni" className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg flex items-center gap-2">
          <Plus className="h-5 w-5" />Yeni Ürün
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input type="text" placeholder="Ürün ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-primary"></div></div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500">Ürün bulunamadı</div>
        ) : (
          filteredProducts.map((product) => {
            const mainImage = getProductMainImage(product)
            const totalStock = product.stock?.reduce((sum, s) => sum + s.quantity, 0) || 0
            return (
              <div key={product.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group hover:shadow-xl transition-all">
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-700">
                  {mainImage ? <img src={mainImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><Upload className="h-12 w-12 opacity-50" /></div>}
                  {product.discount_price && product.discount_price > 0 && <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">İNDİRİM</div>}
                  {product.colors && product.colors.length > 0 && (
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {product.colors.slice(0, 4).map((color, idx) => <div key={idx} className="w-5 h-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: color.color_hex }} title={color.color_name} />)}
                      {product.colors.length > 4 && <div className="w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center border-2 border-white">+{product.colors.length - 4}</div>}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    {product.discount_price && product.discount_price > 0 ? (
                      <><span className="text-lg font-bold text-red-600">₺{product.discount_price.toLocaleString('tr-TR')}</span><span className="text-sm text-slate-500 line-through">₺{product.price.toLocaleString('tr-TR')}</span></>
                    ) : (
                      <span className="text-lg font-bold text-slate-900 dark:text-white">₺{product.price.toLocaleString('tr-TR')}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className={`font-medium ${totalStock === 0 ? 'text-red-500' : totalStock < 20 ? 'text-orange-500' : 'text-green-500'}`}>Stok: {totalStock}</span>
                    {product.colors && product.colors.length > 0 && <span className="text-slate-500">{product.colors.length} renk</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(product)} className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-1"><Edit className="h-4 w-4" />Düzenle</button>
                    <button onClick={() => handleDelete(product.id)} className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full p-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ürün Düzenle</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ürün Adı</label>
                  <input type="text" value={editForm.name} onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori</label>
                  <select value={editForm.category_id} onChange={(e) => setEditForm(prev => ({ ...prev, category_id: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900">
                    <option value="">Kategori seçin</option>
                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <textarea rows={3} value={editForm.description} onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fiyat (₺)</label>
                  <input type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">İndirimli Fiyat (₺)</label>
                  <input type="number" step="0.01" value={editForm.discount_price} onChange={(e) => setEditForm(prev => ({ ...prev, discount_price: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900" />
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2"><Palette className="w-5 h-5 text-primary" />Renk Varyantları</h3>
                  <button type="button" onClick={() => setShowColorPicker(true)} className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg flex items-center gap-1"><Plus className="w-4 h-4" />Renk Ekle</button>
                </div>

                {showColorPicker && (
                  <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-medium mb-3">Renk Seç</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {PRESET_COLORS.map(color => <button key={color.hex} type="button" onClick={() => addColor(color.name, color.hex)} className="w-8 h-8 rounded-full border-2 border-slate-200 hover:scale-110 transition-transform" style={{ backgroundColor: color.hex }} title={color.name} />)}
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <input type="color" value={customColor.hex} onChange={e => setCustomColor(prev => ({...prev, hex: e.target.value}))} className="w-8 h-8 rounded cursor-pointer" />
                      <input type="text" value={customColor.name} onChange={e => setCustomColor(prev => ({...prev, name: e.target.value}))} placeholder="Renk adı" className="flex-1 px-2 py-1 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                      <button type="button" onClick={() => customColor.name && addColor(customColor.name, customColor.hex)} className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm rounded">Ekle</button>
                      <button type="button" onClick={() => setShowColorPicker(false)} className="px-3 py-1 text-slate-500 text-sm">İptal</button>
                    </div>
                  </div>
                )}

                {editForm.colors.length === 0 ? (
                  <div className="text-center py-6 text-slate-500"><Palette className="w-10 h-10 mx-auto mb-2 opacity-50" /><p>Henüz renk eklenmedi</p></div>
                ) : (
                  <div className="space-y-4">
                    {editForm.colors.map(color => (
                      <div key={color.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border border-slate-300" style={{ backgroundColor: color.hex }} />
                            <span className="font-medium">{color.name}</span>
                            {color.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Varsayılan</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            {!color.isDefault && <button type="button" onClick={() => setDefaultColor(color.id)} className="text-xs text-slate-500 hover:text-primary">Varsayılan yap</button>}
                            <button type="button" onClick={() => removeColor(color.id)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {color.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded overflow-hidden bg-slate-100 dark:bg-slate-700 group/img">
                              <img src={img} alt={`${color.name} ${idx + 1}`} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeColorImage(color.id, idx)} className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover/img:opacity-100"><X className="h-3 w-3" /></button>
                            </div>
                          ))}
                          <label className="aspect-square rounded border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary flex flex-col items-center justify-center text-slate-400 hover:text-primary cursor-pointer">
                            <input type="file" multiple accept="image/*" onChange={(e) => handleColorImageUpload(e, color.id)} disabled={uploadingImage !== null} className="hidden" />
                            <Upload className="h-4 w-4" /><span className="text-[10px] mt-1">{uploadingImage === color.id ? '...' : 'Ekle'}</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Beden Stokları</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {Array.from({ length: 11 }, (_, i) => (36 + i).toString()).map((size) => (
                    <div key={size} className="flex flex-col">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 text-center">{size}</span>
                      <input type="number" min="0" value={editForm.stock[size] || ''} onChange={(e) => setEditForm(prev => ({ ...prev, stock: { ...prev.stock, [size]: e.target.value } }))} className="w-full px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded text-center text-sm bg-white dark:bg-slate-900" placeholder="0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">İptal</button>
              <button onClick={handleUpdateProduct} className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center justify-center gap-2"><Save className="h-5 w-5" />Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
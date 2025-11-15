'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import Link from 'next/link'

// Admin ürün ekleme/düzenleme sayfası

export default function AdminProductFormPage() {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['40', '41', '42'])
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop'
  ])

  const availableSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
            Ürün bilgilerini doldurun
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={(e) => {
        e.preventDefault()
        alert('Ürün kaydedildi! (Supabase kurulunca gerçekten çalışacak)')
      }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
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
                    placeholder="Ürün hakkında detaylı açıklama yazın..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Ürünün özelliklerini, kullanım alanlarını ve avantajlarını detaylı bir şekilde açıklayın.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Kategori *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Kategori Seçin</option>
                      <option>Erkek Ayakkabı</option>
                      <option>Kadın Ayakkabı</option>
                      <option>Çocuk Ayakkabı</option>
                      <option>Spor Ayakkabı</option>
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
                    placeholder="Örn: AGLP-2024-001"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Size & Stock Management */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Beden ve Stok Yönetimi
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                    Mevcut Bedenler *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedSizes.includes(size)
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Seçili bedenler: {selectedSizes.length > 0 ? selectedSizes.join(', ') : 'Henüz beden seçilmedi'}
                  </p>
                </div>

                {selectedSizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                      Beden Bazında Stok Miktarları
                    </label>
                    <div className="space-y-3">
                      {selectedSizes.sort((a, b) => Number(a) - Number(b)).map((size) => (
                        <div key={size} className="flex items-center gap-4">
                          <div className="w-16 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-center font-medium text-slate-900 dark:text-white">
                            {size}
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              min="0"
                              defaultValue="0"
                              placeholder="Stok adedi"
                              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400 w-20">
                            adet
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Ürün Görselleri
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 group">
                      <Image src={img} alt={`Ürün ${idx + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => alert('Görsel yükleme (Supabase Storage kurulunca çalışacak)')}
                    className="aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary flex flex-col items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                  >
                    <Upload className="h-6 w-6" />
                    <span className="text-sm font-medium">Yükle</span>
                  </button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  İlk görsel ürün kapak fotoğrafı olarak kullanılacaktır. En az 800x800px boyutunda görseller yükleyin.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Durum
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="text-slate-700 dark:text-slate-300">Aktif (Yayında)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="text-slate-700 dark:text-slate-300">Öne Çıkan</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="text-slate-700 dark:text-slate-300">Yeni Ürün</span>
                </label>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Etiketler
              </h2>
              <input
                type="text"
                placeholder="Etiket ekle (virgülle ayırın)"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Örn: koşu, spor, hafif, rahat
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                Ürünü Kaydet
              </button>
              <Link
                href="/admin/urunler"
                className="w-full px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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

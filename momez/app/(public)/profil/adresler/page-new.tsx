'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Package, Heart, MapPin, Settings, LogOut, Plus, Edit, Trash2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface Address {
  id: string
  user_id: string
  title: string
  full_name: string
  phone: string
  address_line1: string
  district: string
  city: string
  postal_code: string
  is_default: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    full_name: '',
    phone: '',
    address: '',
    district: '',
    city: '',
    postal_code: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses')
      const data = await response.json()
      
      if (data.success) {
        setAddresses(data.data || [])
      } else if (data.error === 'Giriş yapmanız gerekiyor') {
        router.push('/giris')
      }
    } catch (error) {
      toast.error('Adresler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = 'Adres başlığı gerekli'
    }
    if (!formData.full_name.trim()) {
      errors.full_name = 'Ad soyad gerekli'
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Telefon numarası gerekli'
    } else if (!/^[+]?[0-9\s()-]{10,}$/.test(formData.phone)) {
      errors.phone = 'Geçerli bir telefon numarası girin'
    }
    if (!formData.address.trim()) {
      errors.address = 'Adres gerekli'
    }
    if (!formData.district.trim()) {
      errors.district = 'İlçe gerekli'
    }
    if (!formData.city.trim()) {
      errors.city = 'Şehir gerekli'
    }
    if (!formData.postal_code.trim()) {
      errors.postal_code = 'Posta kodu gerekli'
    } else if (!/^\d{5}$/.test(formData.postal_code)) {
      errors.postal_code = 'Posta kodu 5 haneli olmalı'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Lütfen tüm alanları doğru doldurun')
      return
    }

    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Adres eklendi')
        setShowModal(false)
        setFormData({
          title: '',
          full_name: '',
          phone: '',
          address: '',
          district: '',
          city: '',
          postal_code: ''
        })
        setFormErrors({})
        fetchAddresses()
      } else {
        toast.error(data.error || 'Adres eklenemedi')
      }
    } catch (error) {
      toast.error('Ekleme hatası')
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" adresini silmek istediğinize emin misiniz?`)) {
      return
    }

    try {
      const response = await fetch(`/api/addresses?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Adres silindi')
        fetchAddresses()
      } else {
        toast.error(data.error || 'Adres silinemedi')
      }
    } catch (error) {
      toast.error('Silme hatası')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
      router.refresh()
    } catch (error) {
      toast.error('Çıkış yapılamadı')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <Toaster position="top-right" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Hesabım
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="space-y-1">
                <Link
                  href="/profil"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <User className="h-5 w-5" />
                  Profil Bilgileri
                </Link>
                <Link
                  href="/profil/siparisler"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Package className="h-5 w-5" />
                  Siparişlerim
                </Link>
                <Link
                  href="/favoriler"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Heart className="h-5 w-5" />
                  Favorilerim
                </Link>
                <Link
                  href="/profil/adresler"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
                >
                  <MapPin className="h-5 w-5" />
                  Adreslerim
                </Link>
                <Link
                  href="/profil/ayarlar"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Settings className="h-5 w-5" />
                  Ayarlar
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-5 w-5" />
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Adreslerim
                </h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Yeni Adres
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Henüz adres eklenmemiş</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                  >
                    İlk Adresini Ekle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg relative"
                    >
                      {address.is_default && (
                        <span className="absolute top-2 right-2 px-2 py-1 bg-primary text-white text-xs rounded">
                          Varsayılan
                        </span>
                      )}
                      
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                        {address.title}
                      </h3>
                      
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                        {address.full_name}
                      </p>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {address.phone}
                      </p>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {address.address_line1}
                      </p>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {address.district} / {address.city} - {address.postal_code}
                      </p>
                      
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleDelete(address.id, address.title)}
                          className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:underline"
                        >
                          <Trash2 className="h-4 w-4" />
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Yeni Adres Ekle
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Adres Başlığı *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${formErrors.title ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white`}
                  placeholder="Ev, İş, vb."
                />
                {formErrors.title && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.full_name ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white`}
                  />
                  {formErrors.full_name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white`}
                    placeholder="+90 555 123 4567"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Adres *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${formErrors.address ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white`}
                  rows={3}
                  placeholder="Mahalle, Cadde, No, Daire"
                />
                {formErrors.address && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    İlçe *
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.district ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white`}
                  />
                  {formErrors.district && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.district}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Şehir *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.city ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white`}
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Posta Kodu *
                  </label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.postal_code ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white`}
                    placeholder="34000"
                  />
                  {formErrors.postal_code && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.postal_code}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormErrors({})
                  }}
                  className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                >
                  Adresi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

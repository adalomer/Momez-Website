'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Package, MapPin, LogOut, Plus, Trash2 } from 'lucide-react'
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
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 shadow-lg">
              <div className="space-y-2">
                <Link
                  href="/profil"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-900 dark:text-white hover:bg-red-100 hover:text-primary-600 transition-all font-medium"
                >
                  <User className="h-5 w-5" />
                  Profil Bilgileri
                </Link>
                <Link
                  href="/siparislerim"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-900 dark:text-white hover:bg-red-100 hover:text-primary-600 transition-all font-medium"
                >
                  <Package className="h-5 w-5" />
                  Siparişlerim
                </Link>
                <Link
                  href="/profil/adresler"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white font-bold shadow-lg"
                >
                  <MapPin className="h-5 w-5" />
                  Adreslerim
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Adreslerim
                </h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-soft hover:shadow-lg transition-all"
                >
                  <Plus className="h-5 w-5" />
                  Yeni Adres
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-primary-300 mx-auto mb-4" />
                  <p className="text-slate-700 dark:text-slate-300 text-lg mb-4">Henüz adres eklenmemiş</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary px-8 py-3 rounded-xl font-bold shadow-soft"
                  >
                    İlk Adresini Ekle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-700 relative hover:shadow-lg hover:border-primary-300 transition-all"
                    >
                      {address.is_default && (
                        <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-primary to-primary-600 text-white text-xs font-bold rounded-full shadow-soft">
                          Varsayılan
                        </span>
                      )}
                      
                      <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">
                        {address.title}
                      </h3>
                      
                      <p className="text-sm text-slate-800 dark:text-slate-200 mb-1 font-medium">
                        {address.full_name}
                      </p>
                      
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
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
                          className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-soft-lg">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold gradient-text">
                Yeni Adres Ekle
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2">
                  Adres Başlığı *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${formErrors.title ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all`}
                  placeholder="Ev, İş, vb."
                />
                {formErrors.title && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${formErrors.full_name ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all`}
                  />
                  {formErrors.full_name && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${formErrors.phone ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all`}
                    placeholder="+90 555 123 4567"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2">
                  Adres *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${formErrors.address ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all`}
                  rows={3}
                  placeholder="Mahalle, Cadde, No, Daire"
                />
                {formErrors.address && (
                  <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2">
                    İlçe *
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${formErrors.district ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all`}
                  />
                  {formErrors.district && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.district}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2">
                    Şehir *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${formErrors.city ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all`}
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2">
                    Posta Kodu *
                  </label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${formErrors.postal_code ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all`}
                    placeholder="34000"
                  />
                  {formErrors.postal_code && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.postal_code}</p>
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
                  className="px-6 py-3 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn-primary px-8 py-3 rounded-xl font-bold shadow-soft hover:shadow-lg transition-all"
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

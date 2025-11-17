'use client'

import Link from 'next/link'
import { User, Package, Heart, MapPin, LogOut, Plus, Edit, Trash2, Home } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { addressesAPI, authAPI } from '@/lib/api'

interface Address {
  id: number
  title: string
  full_name: string
  phone: string
  address: string
  city: string
  district?: string
  postal_code?: string
  is_default: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    full_name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postal_code: '',
    is_default: false
  })

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    try {
      const userResult = await authAPI.me()
      if (!userResult.success) {
        router.push('/auth/login?redirect=/profil/adresler')
        return
      }

      const result = await addressesAPI.getAll()
      if (result.success) {
        setAddresses(result.data || [])
      }
    } catch (error) {
      console.error('Addresses load error:', error)
      toast.error('Adresler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      toast.success('Çıkış yapıldı')
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (error) {
      toast.error('Çıkış yapılamadı')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingAddress) {
        const result = await addressesAPI.update(editingAddress.id, formData)
        if (result.success) {
          toast.success('Adres güncellendi')
          loadAddresses()
          closeModal()
        } else {
          toast.error(result.message || 'Güncellenemedi')
        }
      } else {
        const result = await addressesAPI.create(formData)
        if (result.success) {
          toast.success('Adres eklendi')
          loadAddresses()
          closeModal()
        } else {
          toast.error(result.message || 'Eklenemedi')
        }
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`"${title}" adresini silmek istediğinize emin misiniz?`)) return
    
    try {
      const result = await addressesAPI.delete(id)
      if (result.success) {
        toast.success('Adres silindi')
        loadAddresses()
      } else {
        toast.error(result.message || 'Silinemedi')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const openModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address)
      setFormData({
        title: address.title,
        full_name: address.full_name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        district: address.district || '',
        postal_code: address.postal_code || '',
        is_default: address.is_default
      })
    } else {
      setEditingAddress(null)
      setFormData({
        title: '',
        full_name: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        postal_code: '',
        is_default: false
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingAddress(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Toaster position="top-center" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <Toaster position="top-center" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Hesabım
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Adreslerim
                </h2>
                <button
                  onClick={() => openModal()}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Yeni Adres
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
                    Henüz kayıtlı adresiniz yok
                  </p>
                  <button
                    onClick={() => openModal()}
                    className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                  >
                    İlk Adresinizi Ekleyin
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {address.title}
                            {address.is_default && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                Varsayılan
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {address.full_name}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openModal(address)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(address.id, address.title)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <p>{address.address}</p>
                        <p>
                          {address.district && `${address.district}, `}
                          {address.city}
                          {address.postal_code && ` - ${address.postal_code}`}
                        </p>
                        <p>{address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Adres Başlığı *
                </label>
                <input
                  type="text"
                  placeholder="Ev, İş, vb."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Adres *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    İl *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    İlçe
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Posta Kodu
                </label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_default" className="text-sm text-slate-900 dark:text-white">
                  Varsayılan adres olarak ayarla
                </label>
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
                  {editingAddress ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

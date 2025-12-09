'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Package, MapPin, LogOut } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useLanguage } from '@/lib/i18n'

interface UserData {
  id: string
  email: string
  full_name: string
  phone?: string
  role: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: ''
  })
  const { t, language } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Client-side'da token kontrolü yap
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login?redirect=/profil')
      setLoading(false)
      return
    }
    
    fetchUser()
  }, [mounted])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      const data = await response.json()
      
      if (data.success && data.data?.user) {
        setUser(data.data.user)
        setFormData({
          full_name: data.data.user.full_name || '',
          phone: data.data.user.phone || ''
        })
      } else {
        // Token geçersiz, temizle ve login'e yönlendir
        localStorage.removeItem('token')
        router.push('/auth/login?redirect=/profil')
      }
    } catch (error) {
      // Hata durumunda token temizle ve login'e yönlendir
      localStorage.removeItem('token')
      router.push('/auth/login?redirect=/profil')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(t('profile.updated'))
        fetchUser()
      } else {
        toast.error(data.error || t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        cache: 'no-store'
      })
      // Tam sayfa yenilemesi yap
      window.location.href = '/'
    } catch (error) {
      toast.error(t('common.error'))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <Toaster position="top-right" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          {t('profile.title')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-surface-dark rounded-xl border-2 border-border-light dark:border-border-dark p-4 shadow-lg transition-colors duration-300">
              <div className="space-y-2">
                <Link
                  href="/profil"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-600 text-white font-bold shadow-lg"
                >
                  <User className="h-5 w-5" />
                  {t('profile.info')}
                </Link>
                <Link
                  href="/siparislerim"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-900 dark:text-white hover:bg-red-100 hover:text-primary-600 transition-all font-medium"
                >
                  <Package className="h-5 w-5" />
                  {t('profile.orders')}
                </Link>
                <Link
                  href="/profil/adresler"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-900 dark:text-white hover:bg-red-100 hover:text-primary-600 transition-all font-medium"
                >
                  <MapPin className="h-5 w-5" />
                  {t('profile.addresses')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  {t('nav.logout')}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-surface-dark rounded-xl border-2 border-border-light dark:border-border-dark shadow-lg p-6 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                {t('profile.info')}
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {t('auth.email')}
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border-2 border-border-light dark:border-border-dark bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-medium transition-colors duration-300"
                  />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                    {t('profile.emailNote')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    {t('auth.name')}
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    {t('auth.phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+90 555 123 4567"
                    className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300"
                  />
                </div>

                <div className="pt-4 border-t border-border-light dark:border-border-dark">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                  >
                    {saving ? t('profile.saving') : t('profile.saveChanges')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

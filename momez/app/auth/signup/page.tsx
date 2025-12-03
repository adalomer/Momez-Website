'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authAPI } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'
import AuthTransition from '@/components/AuthTransition'

export default function SignupPage() {
  const router = useRouter()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Sözleşme onayları
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptKVKK, setAcceptKVKK] = useState(false)
  const [acceptMarketing, setAcceptMarketing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !password) {
      toast.error('Lütfen gerekli alanları doldurun')
      return
    }
    
    if (password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalı')
      return
    }
    
    if (password !== passwordConfirm) {
      toast.error('Şifreler eşleşmiyor')
      return
    }
    
    if (!acceptTerms) {
      toast.error('Kullanım koşullarını kabul etmelisiniz')
      return
    }
    
    if (!acceptKVKK) {
      toast.error('KVKK Aydınlatma Metnini kabul etmelisiniz')
      return
    }
    
    setLoading(true)
    
    try {
      const result = await authAPI.register(email, password, name, phone) as { success: boolean; user?: any; error?: string }
      
      if (result.success) {
        toast.success('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...')
        
        // Giriş sayfasına yönlendir - kullanıcı oradan giriş yapsın
        setTimeout(() => {
          window.location.href = '/auth/login?registered=true'
        }, 1000)
      } else {
        toast.error(result.error || 'Kayıt başarısız')
      }
    } catch (error) {
      toast.error('Kayıt olurken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthTransition type="login">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
        <Toaster position="top-center" />
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 text-[#ee2b2b]">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#ee2b2b]">momez</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hesap Oluşturun
          </h1>
          <p className="text-gray-600">
            Alışverişe başlamak için kayıt olun
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                Ad Soyad *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee2b2b] focus:border-transparent"
                placeholder="Ahmet Yılmaz"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                E-posta *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee2b2b] focus:border-transparent"
                placeholder="ornek@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                Telefon
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee2b2b] focus:border-transparent"
                placeholder="+90 555 123 4567"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Şifre *
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee2b2b] focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">En az 6 karakter</p>
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-900 mb-2">
                Şifre Tekrar *
              </label>
              <input
                id="passwordConfirm"
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee2b2b] focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Sözleşme Onayları */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-900">Yasal Onaylar</p>
              
              {/* Kullanım Koşulları ve Gizlilik */}
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#ee2b2b] focus:ring-[#ee2b2b]" 
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                  <Link href="/kullanim-kosullari" target="_blank" className="text-[#ee2b2b] hover:underline font-medium">
                    Kullanım Koşulları
                  </Link>
                  {' '}ve{' '}
                  <Link href="/gizlilik-politikasi" target="_blank" className="text-[#ee2b2b] hover:underline font-medium">
                    Gizlilik Politikası
                  </Link>
                  &apos;nı okudum ve kabul ediyorum. <span className="text-red-500">*</span>
                </label>
              </div>
              
              {/* KVKK Onayı */}
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="acceptKVKK"
                  checked={acceptKVKK}
                  onChange={(e) => setAcceptKVKK(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#ee2b2b] focus:ring-[#ee2b2b]" 
                />
                <label htmlFor="acceptKVKK" className="text-sm text-gray-700">
                  <Link href="/kvkk" target="_blank" className="text-[#ee2b2b] hover:underline font-medium">
                    KVKK Aydınlatma Metni
                  </Link>
                  &apos;ni okudum, kişisel verilerimin işlenmesini kabul ediyorum. <span className="text-red-500">*</span>
                </label>
              </div>
              
              {/* Pazarlama İzni (Opsiyonel) */}
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="acceptMarketing"
                  checked={acceptMarketing}
                  onChange={(e) => setAcceptMarketing(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#ee2b2b] focus:ring-[#ee2b2b]" 
                />
                <label htmlFor="acceptMarketing" className="text-sm text-gray-700">
                  Kampanya, indirim ve yeni ürünlerden haberdar olmak için e-posta ve SMS almak istiyorum. (İsteğe bağlı)
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-[#ee2b2b] hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link href="/auth/login" className="text-[#ee2b2b] hover:underline font-medium">
              Giriş Yapın
            </Link>
          </div>
        </div>
      </div>
      </div>
    </AuthTransition>
  )
}

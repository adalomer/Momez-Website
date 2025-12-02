'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [devCode, setDevCode] = useState('')

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (data.success) {
        setStep('code')
        // DEV: Geliştirme modunda kodu göster
        if (data.dev_code) {
          setDevCode(data.dev_code)
        }
      } else {
        setError(data.error || 'Bir hata oluştu')
      }
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalı')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      })

      const data = await res.json()

      if (data.success) {
        setStep('success')
      } else {
        setError(data.error || 'Bir hata oluştu')
      }
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="mx-auto max-w-md w-full px-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
          
          {/* Step 1: Email */}
          {step === 'email' && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Şifremi Unuttum
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                E-posta adresinizi girin, size şifre sıfırlama kodu gönderelim.
              </p>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                             focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium 
                           rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Gönderiliyor...' : 'Kod Gönder'}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Enter Code & New Password */}
          {step === 'code' && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Şifre Sıfırlama
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                E-posta adresinize gönderilen 6 haneli kodu ve yeni şifrenizi girin.
              </p>

              {/* DEV: Geliştirme modunda kodu göster */}
              {devCode && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>DEV:</strong> Sıfırlama kodunuz: <code className="font-mono bg-yellow-100 dark:bg-yellow-900 px-1 rounded">{devCode}</code>
                  </p>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Sıfırlama Kodu
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                             focus:ring-2 focus:ring-orange-500 focus:border-transparent
                             text-center text-2xl tracking-widest font-mono"
                    placeholder="000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                             focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="En az 6 karakter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Yeni Şifre (Tekrar)
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg 
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                             focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Şifrenizi tekrar girin"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium 
                           rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full py-2 px-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 
                           dark:hover:text-white font-medium transition-colors"
                >
                  ← Geri Dön
                </button>
              </form>
            </>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Şifre Güncellendi!
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.
              </p>
              <Link
                href="/auth/login"
                className="inline-block py-2 px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium 
                         rounded-lg transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          )}

          {/* Login Link */}
          {step !== 'success' && (
            <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              Şifrenizi hatırladınız mı?{' '}
              <Link href="/auth/login" className="text-orange-500 hover:text-orange-600 font-medium">
                Giriş Yap
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

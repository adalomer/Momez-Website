'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function ForgotPasswordPage() {
  const { t, isRTL } = useLanguage()
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
        setError(data.error || t('forgotPassword.genericError'))
      }
    } catch {
      setError(t('forgotPassword.connectionError'))
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError(t('register.passwordMismatch'))
      return
    }

    if (newPassword.length < 6) {
      setError(t('signup.passwordMinLength'))
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
        setError(data.error || t('forgotPassword.genericError'))
      }
    } catch {
      setError(t('forgotPassword.connectionError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-md w-full px-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
          
          {/* Step 1: Email */}
          {step === 'email' && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {t('forgotPassword.title')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {t('forgotPassword.subtitle')}
              </p>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('forgotPassword.email')}
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
                  {loading ? t('forgotPassword.sending') : t('forgotPassword.submit')}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Enter Code & New Password */}
          {step === 'code' && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {t('forgotPassword.resetTitle')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {t('forgotPassword.resetSubtitle')}
              </p>

              {/* DEV: Geliştirme modunda kodu göster */}
              {devCode && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>DEV:</strong> {t('forgotPassword.resetCode')}: <code className="font-mono bg-yellow-100 dark:bg-yellow-900 px-1 rounded">{devCode}</code>
                  </p>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('forgotPassword.resetCode')}
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
                    {t('forgotPassword.newPassword')}
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
                    placeholder={t('signup.passwordHint')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t('forgotPassword.confirmNewPassword')}
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
                    placeholder={t('register.confirmPassword')}
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
                  {loading ? t('forgotPassword.updating') : t('forgotPassword.updatePassword')}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full py-2 px-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 
                           dark:hover:text-white font-medium transition-colors"
                >
                  {t('forgotPassword.goBack')}
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
                {t('forgotPassword.successTitle')}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {t('forgotPassword.successMessage')}
              </p>
              <Link
                href="/auth/login"
                className="inline-block py-2 px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium 
                         rounded-lg transition-colors"
              >
                {t('auth.login')}
              </Link>
            </div>
          )}

          {/* Login Link */}
          {step !== 'success' && (
            <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              {t('forgotPassword.rememberPassword')}{' '}
              <Link href="/auth/login" className="text-orange-500 hover:text-orange-600 font-medium">
                {t('auth.login')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

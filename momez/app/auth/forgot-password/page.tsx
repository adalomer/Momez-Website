'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'
import toast, { Toaster } from 'react-hot-toast'

type Step = 'email' | 'code' | 'success'

export default function ForgotPasswordPage() {
	const { t } = useLanguage()
	const [step, setStep] = useState<Step>('email')
	const [email, setEmail] = useState('')
	const [code, setCode] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSendCode = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!email) {
			toast.error(t('register.fillAllFields'))
			return
		}

		setLoading(true)
		try {
			const response = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			})

			const data = await response.json()

			if (data.success) {
				toast.success(t('forgotPassword.success'))
				setStep('code')
			} else {
				toast.error(data.error || t('forgotPassword.genericError'))
			}
		} catch (error) {
			toast.error(t('forgotPassword.connectionError'))
		} finally {
			setLoading(false)
		}
	}

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!code || !newPassword || !confirmPassword) {
			toast.error(t('register.fillAllFields'))
			return
		}

		if (newPassword !== confirmPassword) {
			toast.error(t('register.passwordMismatch'))
			return
		}

		if (newPassword.length < 6) {
			toast.error(t('signup.passwordMinLength'))
			return
		}

		setLoading(true)
		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, code, newPassword })
			})

			const data = await response.json()

			if (data.success) {
				toast.success(t('forgotPassword.successMessage'))
				setStep('success')
			} else {
				toast.error(data.error || t('forgotPassword.genericError'))
			}
		} catch (error) {
			toast.error(t('forgotPassword.connectionError'))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center py-12 bg-background-light dark:bg-background-dark">
			<Toaster position="top-center" />
			<div className="mx-auto max-w-md w-full px-4">
				<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-lg">

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
										className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
										placeholder="email@example.com"
										required
									/>
								</div>

								<button
									type="submit"
									disabled={loading}
									className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
								>
									{loading ? t('forgotPassword.sending') : t('forgotPassword.submit')}
								</button>
							</form>

							<p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
								{t('forgotPassword.rememberPassword')}{' '}
								<Link href="/auth/login" className="text-primary hover:underline font-medium">
									{t('nav.login')}
								</Link>
							</p>
						</>
					)}

					{step === 'code' && (
						<>
							<button
								onClick={() => setStep('email')}
								className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-4 flex items-center gap-1"
							>
								{t('forgotPassword.goBack')}
							</button>

							<h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
								{t('forgotPassword.resetTitle')}
							</h1>
							<p className="text-slate-600 dark:text-slate-400 mb-6">
								{t('forgotPassword.resetSubtitle')}
							</p>

							<form onSubmit={handleResetPassword} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
										{t('forgotPassword.resetCode')}
									</label>
									<input
										type="text"
										value={code}
										onChange={(e) => setCode(e.target.value)}
										className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl tracking-widest font-mono"
										placeholder="000000"
										maxLength={6}
										required
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
										className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
										placeholder="••••••••"
										required
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
										className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
										placeholder="••••••••"
										required
									/>
								</div>

								<button
									type="submit"
									disabled={loading}
									className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
								>
									{loading ? t('forgotPassword.updating') : t('forgotPassword.updatePassword')}
								</button>
							</form>
						</>
					)}

					{step === 'success' && (
						<div className="text-center py-8">
							<div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
								className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
							>
								{t('nav.login')}
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

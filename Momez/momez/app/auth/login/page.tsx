'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { authAPI } from '@/lib/api'
import toast, { Toaster } from 'react-hot-toast'
import AuthTransition from '@/components/AuthTransition'
import { useLanguage } from '@/lib/i18n/LanguageContext'

function LoginForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const redirect = searchParams.get('redirect') || '/'
	const { t } = useLanguage()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!email || !password) {
			toast.error(t('login.fillAllFields'))
			return
		}

		setLoading(true)

		try {
			const result = await authAPI.login(email, password) as { success: boolean; data?: { user?: any }; error?: string }

			if (result.success && result.data?.user) {
				toast.success(t('login.success'))

				// Redirect based on role
				const targetUrl = result.data.user.role === 'admin'
					? '/admin'
					: (redirect !== '/' ? redirect : '/')

				// Redirect immediately
				window.location.href = targetUrl
			} else {
				toast.error(result.error || t('login.invalidCredentials'))
			}
		} catch (error) {
			toast.error(t('common.error'))
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
							{t('login.welcome')}
						</h1>
						<p className="text-gray-600">
							{t('login.subtitle')}
						</p>
					</div>

					<div className="bg-white rounded-xl p-8 shadow-lg">
						<form className="space-y-6" onSubmit={handleSubmit}>
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
									{t('auth.email')}
								</label>
								<input
									id="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee2b2b] focus:border-transparent"
									placeholder="example@email.com"
									disabled={loading}
								/>
							</div>

							<div>
								<label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
									{t('auth.password')}
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
							</div>

							<div className="flex items-center justify-between text-sm">
								<label className="flex items-center gap-2 text-gray-700">
									<input type="checkbox" className="rounded text-[#ee2b2b] focus:ring-[#ee2b2b]" />
									<span>{t('login.rememberMe')}</span>
								</label>
								<Link href="/auth/forgot-password" className="text-[#ee2b2b] hover:underline">
									{t('auth.forgotPassword')}
								</Link>
							</div>

							<button
								type="submit"
								disabled={loading}
								className="w-full px-6 py-4 bg-[#ee2b2b] hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? t('login.loggingIn') : t('auth.login')}
							</button>
						</form>

						<div className="mt-6 text-center text-sm text-gray-600">
							{t('login.noAccount')}{' '}
							<Link href="/auth/signup" className="text-[#ee2b2b] hover:underline font-medium">
								{t('auth.register')}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</AuthTransition>
	)
}

export default function LoginPage() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
			<LoginForm />
		</Suspense>
	)
}

'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function AdminSettingsPage() {
	const { t } = useLanguage()
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [settings, setSettings] = useState({
		site_name: '',
		site_tagline: '',
		site_description: '',
		email: '',
		phone: '',
		whatsapp: '',
		address: '',
		free_shipping_limit: '',
		standard_shipping_fee: '',
		instagram: '',
		facebook: '',
		twitter: '',
		youtube: ''
	})

	useEffect(() => {
		fetchSettings()
	}, [])

	const fetchSettings = async () => {
		try {
			const response = await fetch('/api/settings')
			const data = await response.json()

			if (data.success && data.data) {
				// API artık object döndürüyor (key: value formatında)
				const settingsMap = data.data
				setSettings({
					site_name: settingsMap.site_name || 'Momez',
					site_tagline: settingsMap.site_tagline || 'Adımınıza Stil Katın',
					site_description: settingsMap.site_description || 'En trend ayakkabı modellerini keşfedin',
					email: settingsMap.contact_email || settingsMap.email || 'info@momez.com',
					phone: settingsMap.contact_phone || settingsMap.phone || '+90 555 123 4567',
					whatsapp: settingsMap.whatsapp || '+90 555 123 4567',
					address: settingsMap.address || 'İstanbul, Türkiye',
					free_shipping_limit: settingsMap.free_shipping_threshold || settingsMap.free_shipping_limit || '500',
					standard_shipping_fee: settingsMap.shipping_cost || settingsMap.standard_shipping_fee || '50',
					instagram: settingsMap.instagram || '@momez',
					facebook: settingsMap.facebook || 'momez',
					twitter: settingsMap.twitter || '@momez',
					youtube: settingsMap.youtube || 'momez'
				})
			}
		} catch (error) {
			console.error('Settings load error:', error)
			toast.error(t('common.error'))
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)

		try {
			const response = await fetch('/api/settings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(settings)
			})

			const data = await response.json()

			if (data.success) {
				toast.success(t('admin.saveSuccess'))
			} else {
				toast.error(data.error || t('common.error'))
			}
		} catch (error) {
			toast.error(t('common.error'))
		} finally {
			setSaving(false)
		}
	}

	const handleChange = (key: string, value: string) => {
		setSettings({ ...settings, [key]: value })
	}

	if (loading) {
		return (
			<div className="p-12 text-center text-slate-500">
				{t('common.loading')}
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<Toaster position="top-right" />

			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-slate-900 dark:text-white">
					{t('admin.generalSettings')}
				</h1>
				<p className="text-slate-600 dark:text-slate-400 mt-1">
					{t('admin.manageSettings')}
				</p>
			</div>

			{/* Settings Form */}
			<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
				<form className="space-y-6" onSubmit={handleSubmit}>
					{/* Site Info */}
					<div>
						<h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
							{t('admin.siteInfo')}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
									{t('admin.siteName')}
								</label>
								<input
									type="text"
									value={settings.site_name}
									onChange={(e) => handleChange('site_name', e.target.value)}
									className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
									{t('admin.siteSlogan')}
								</label>
								<input
									type="text"
									value={settings.site_tagline}
									onChange={(e) => handleChange('site_tagline', e.target.value)}
									className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
								/>
							</div>
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
									{t('admin.siteDescription')}
								</label>
								<textarea
									rows={3}
									value={settings.site_description}
									onChange={(e) => handleChange('site_description', e.target.value)}
									className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
								/>
							</div>
						</div>
					</div>

					{/* Contact Info */}
					<div className="pt-6 border-t border-slate-200 dark:border-slate-700">
						<h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
							{t('admin.contactInfo')}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
									{t('admin.email')}
								</label>
								<input
									type="email"
									value={settings.email}
									onChange={(e) => handleChange('email', e.target.value)}
									className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
									{t('admin.phone')}
								</label>
								<input
									type="tel"
									value={settings.phone}
									onChange={(e) => handleChange('phone', e.target.value)}
									className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
									{t('admin.whatsapp')}
								</label>
								<input
									type="tel"
									value={settings.whatsapp}
									onChange={(e) => handleChange('whatsapp', e.target.value)}
									className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
									{t('admin.address')}
								</label>
								<input
									type="text"
									value={settings.address}
									onChange={(e) => handleChange('address', e.target.value)}
									className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
								/>
							</div>
						</div>
					</div>

					{/* Shipping Settings */}
					<div className="pt-6 border-t border-slate-200 dark:border-slate-700">
						<h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
							{t('admin.shippingSettings')}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
									{t('admin.freeShippingLimit')}
								</label>
								<input
									type="number"
									value={settings.free_shipping_limit}
									onChange={(e) => handleChange('free_shipping_limit', e.target.value)}
									className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
									{t('admin.standardShippingFee')}
								</label>
								<input
									type="number"
									value={settings.standard_shipping_fee}
									onChange={(e) => handleChange('standard_shipping_fee', e.target.value)}
									className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
								/>
							</div>
						</div>
					</div>

					{/* Submit Button */}
					<div className="pt-6 border-t border-slate-200 dark:border-slate-700">
						<button
							type="submit"
							disabled={saving}
							className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
						>
							<Save className="h-5 w-5" />
							{saving ? t('admin.saving') : t('admin.saveSettings')}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Plus, CreditCard, Banknote, Check, Trash2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { cartAPI, authAPI } from '@/lib/api'
import { useLanguage } from '@/lib/i18n'
import { formatPrice, type Language } from '@/lib/currency'

interface CartItem {
	id: string
	product_id: string
	product_name: string
	product_slug: string
	size: string
	quantity: number
	price: number
	image_url: string
}

interface Address {
	id: string
	title: string
	full_name: string
	phone: string
	city: string
	district: string
	address_line: string
	postal_code?: string
	is_default: boolean
}

export default function CheckoutPage() {
	const router = useRouter()
	const { t, language } = useLanguage()
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [cartItems, setCartItems] = useState<CartItem[]>([])
	const [addresses, setAddresses] = useState<Address[]>([])
	const [selectedAddress, setSelectedAddress] = useState<string>('')
	const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash_on_delivery'>('cash_on_delivery')
	const [notes, setNotes] = useState('')
	const [showAddressForm, setShowAddressForm] = useState(false)
	const [user, setUser] = useState<any>(null)
	const [shippingSettings, setShippingSettings] = useState({ freeLimit: 500, fee: 50 })

	// Yeni adres formu
	const [newAddress, setNewAddress] = useState({
		title: '',
		full_name: '',
		phone: '',
		city: '',
		district: '',
		address_line: '',
		postal_code: '',
		is_default: false
	})

	useEffect(() => {
		checkAuthAndLoadData()
		loadShippingSettings()
	}, [])

	const loadShippingSettings = async () => {
		try {
			const response = await fetch('/api/settings')
			const data = await response.json()
			if (data.success && data.data) {
				// Array'i object'e çevir
				const settingsObj = data.data.reduce((acc: any, item: any) => {
					acc[item.key] = item.value
					return acc
				}, {})

				const freeLimit = parseFloat(settingsObj.free_shipping_limit || 500)
				const fee = parseFloat(settingsObj.standard_shipping_fee || 50)
				setShippingSettings({ freeLimit, fee })
				console.log('Kargo ayarları yüklendi:', { freeLimit, fee })
			}
		} catch (error) {
			console.error('Settings load error:', error)
		}
	}

	const checkAuthAndLoadData = async () => {
		try {
			// Kullanıcı kontrolü
			const userResult = await authAPI.me() as { success: boolean; data?: any; error?: string }
			if (!userResult || !userResult.success) {
				router.push('/auth/login?redirect=/siparis')
				return
			}

			setUser(userResult.data)

			// Sepeti yükle
			const cartResult = await cartAPI.get() as { success: boolean; data?: any[]; error?: string }
			if (cartResult.success && cartResult.data) {
				if (cartResult.data.length === 0) {
					toast.error(t('checkout.cartEmpty'))
					router.push('/sepet')
					return
				}
				setCartItems(cartResult.data)
			}

			// Adresleri yükle
			const addressesResult = await fetch('/api/addresses')
			const addressesData = await addressesResult.json()
			if (addressesData.success) {
				setAddresses(addressesData.data)
				// Varsayılan adresi seç
				const defaultAddr = addressesData.data.find((a: Address) => a.is_default)
				if (defaultAddr) {
					setSelectedAddress(defaultAddr.id)
				}
			}
		} catch (error) {
			console.error('Load error:', error)
			toast.error(t('checkout.loadError'))
		} finally {
			setLoading(false)
		}
	}

	const handleAddAddress = async () => {
		if (!newAddress.title || !newAddress.full_name || !newAddress.phone ||
			!newAddress.city || !newAddress.district || !newAddress.address_line) {
			toast.error(t('checkout.fillAllFields'))
			return
		}

		try {
			const response = await fetch('/api/addresses', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newAddress)
			})

			const result = await response.json()
			if (result.success) {
				toast.success(t('checkout.addressAdded'))
				setAddresses([...addresses, result.data])
				setSelectedAddress(result.data.id)
				setShowAddressForm(false)
				setNewAddress({
					title: '',
					full_name: '',
					phone: '',
					city: '',
					district: '',
					address_line: '',
					postal_code: '',
					is_default: false
				})
			} else {
				toast.error(result.error || t('checkout.addressAddError'))
			}
		} catch (error) {
			toast.error(t('checkout.error'))
		}
	}

	const handleDeleteAddress = async (addressId: string, addressTitle: string) => {
		if (!confirm(`"${addressTitle}" ${t('checkout.confirmDeleteAddress')}`)) {
			return
		}

		try {
			const response = await fetch(`/api/addresses?id=${addressId}`, {
				method: 'DELETE'
			})

			const result = await response.json()
			if (result.success) {
				toast.success(t('checkout.addressDeleted'))
				setAddresses(addresses.filter(a => a.id !== addressId))
				if (selectedAddress === addressId) {
					setSelectedAddress('')
				}
			} else {
				toast.error(result.error || t('checkout.addressDeleteError'))
			}
		} catch (error) {
			toast.error(t('checkout.error'))
		}
	}

	const handleSubmitOrder = async () => {
		if (!selectedAddress) {
			toast.error(t('checkout.selectAddress'))
			return
		}

		setSubmitting(true)
		try {
			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					address_id: selectedAddress,
					payment_method: paymentMethod,
					notes
				})
			})

			const result = await response.json()
			if (result.success) {
				toast.success(t('checkout.orderSuccess'))
				setTimeout(() => {
					router.push('/siparislerim')
				}, 1500)
			} else {
				toast.error(result.error || t('checkout.orderError'))
			}
		} catch (error) {
			toast.error(t('checkout.error'))
		} finally {
			setSubmitting(false)
		}
	}

	const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
	const shipping = subtotal >= shippingSettings.freeLimit ? 0 : shippingSettings.fee
	const total = subtotal + shipping

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Toaster position="top-center" />
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
					<p className="mt-4">{t('checkout.loading')}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen py-8 bg-gray-50 dark:bg-slate-900">
			<Toaster position="top-center" />
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
					{t('checkout.summary')}
				</h1>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Sol Taraf - Adres ve Ödeme */}
					<div className="lg:col-span-2 space-y-6">
						{/* Teslimat Adresi */}
						<div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-bold text-red-500 flex items-center gap-2">
									<MapPin className="w-5 h-5" />
									{t('checkout.address')}
								</h2>
								<button
									onClick={() => setShowAddressForm(!showAddressForm)}
									className="text-sm text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 hover:scale-105 transition"
								>
									<Plus className="w-4 h-4" />
									{t('checkout.addNewAddress')}
								</button>
							</div>

							{/* Adres Listesi */}
							{addresses.length === 0 && !showAddressForm ? (
								<p className="text-slate-600 dark:text-slate-400 text-center py-4">
									{t('checkout.noAddresses')}
								</p>
							) : (
								<div className="space-y-3 mb-4">
									{addresses.map((address) => (
										<label
											key={address.id}
											className={`block p-4 border-2 rounded-lg cursor-pointer transition shadow-sm ${selectedAddress === address.id
													? 'border-red-500 bg-red-50 dark:bg-red-900/10 shadow-md'
													: 'border-slate-300 dark:border-slate-600 hover:border-red-300 hover:shadow-md'
												}`}
										>
											<input
												type="radio"
												name="address"
												value={address.id}
												checked={selectedAddress === address.id}
												onChange={(e) => setSelectedAddress(e.target.value)}
												className="sr-only"
											/>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<p className="font-bold text-slate-900 dark:text-white">{address.title}</p>
														{address.is_default && (
															<span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-medium">
																{t('checkout.default')}
															</span>
														)}
													</div>
													<p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{address.full_name}</p>
													<p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{address.phone}</p>
													<p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
														{address.address_line}, {address.district}, {address.city}
														{address.postal_code && ` - ${address.postal_code}`}
													</p>
												</div>
												<div className="flex items-center gap-2">
													<button
														type="button"
														onClick={(e) => {
															e.preventDefault()
															e.stopPropagation()
															handleDeleteAddress(address.id, address.title)
														}}
														className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
														title={t('checkout.deleteAddress')}
													>
														<Trash2 className="w-4 h-4" />
													</button>
													{selectedAddress === address.id && (
														<Check className="w-5 h-5 text-primary flex-shrink-0" />
													)}
												</div>
											</div>
										</label>
									))}
								</div>
							)}

							{/* Yeni Adres Formu */}
							{showAddressForm && (
								<div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-4">
									<h3 className="font-bold text-red-500 text-lg">{t('checkout.addNewAddress')}</h3>
									<div className="grid grid-cols-2 gap-4">
										<input
											type="text"
											placeholder={`${t('checkout.addressTitle')} *`}
											value={newAddress.title}
											onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
											className="col-span-2 px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition"
										/>
										<input
											type="text"
											placeholder={`${t('checkout.fullName')} *`}
											value={newAddress.full_name}
											onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
											className="px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition"
										/>
										<input
											type="tel"
											placeholder={`${t('checkout.phone')} *`}
											value={newAddress.phone}
											onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
											className="px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition"
										/>
										<input
											type="text"
											placeholder={`${t('checkout.city')} *`}
											value={newAddress.city}
											onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
											className="px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition"
										/>
										<input
											type="text"
											placeholder={`${t('checkout.district')} *`}
											value={newAddress.district}
											onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
											className="px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition"
										/>
										<textarea
											placeholder={`${t('checkout.addressLine')} *`}
											value={newAddress.address_line}
											onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })}
											className="col-span-2 px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition resize-none"
											rows={3}
										/>
										<input
											type="text"
											placeholder={t('checkout.postalCode')}
											value={newAddress.postal_code}
											onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
											className="px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition"
										/>
										<label className="flex items-center gap-2 col-span-2 cursor-pointer">
											<input
												type="checkbox"
												checked={newAddress.is_default}
												onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
												className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-red-500 focus:ring-2 focus:ring-red-500/20"
											/>
											<span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('checkout.setAsDefault')}</span>
										</label>
									</div>
									<div className="flex gap-3">
										<button
											onClick={() => setShowAddressForm(false)}
											className="flex-1 px-4 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
										>
											{t('checkout.cancel')}
										</button>
										<button
											onClick={handleAddAddress}
											className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition shadow-lg"
										>
											{t('checkout.saveAddress')}
										</button>
									</div>
								</div>
							)}
						</div>

						{/* Ödeme Yöntemi */}
						<div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
							<h2 className="text-xl font-bold text-red-500 mb-4">{t('checkout.payment')}</h2>
							<div className="space-y-3">
								<label className={`block p-4 border-2 rounded-lg cursor-pointer transition shadow-sm ${paymentMethod === 'cash_on_delivery'
										? 'border-red-500 bg-red-50 dark:bg-red-900/10 shadow-md'
										: 'border-slate-300 dark:border-slate-600 hover:border-red-300 hover:shadow-md'
									}`}>
									<input
										type="radio"
										name="payment"
										value="cash_on_delivery"
										checked={paymentMethod === 'cash_on_delivery'}
										onChange={(e) => setPaymentMethod(e.target.value as 'cash_on_delivery')}
										className="sr-only"
									/>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<Banknote className="w-6 h-6" />
											<div>
												<p className="font-bold text-slate-900 dark:text-white">{t('checkout.cashOnDelivery')}</p>
												<p className="text-sm text-slate-600 dark:text-slate-400">{t('checkout.cashOrCard')}</p>
											</div>
										</div>
										{paymentMethod === 'cash_on_delivery' && (
											<Check className="w-5 h-5 text-primary" />
										)}
									</div>
								</label>

								<label className={`block p-4 border-2 rounded-lg cursor-pointer transition shadow-sm ${paymentMethod === 'card'
										? 'border-red-500 bg-red-50 dark:bg-red-900/10 shadow-md'
										: 'border-slate-300 dark:border-slate-600 hover:border-red-300 hover:shadow-md'
									}`}>
									<input
										type="radio"
										name="payment"
										value="card"
										checked={paymentMethod === 'card'}
										onChange={(e) => setPaymentMethod(e.target.value as 'card')}
										className="sr-only"
									/>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<CreditCard className="w-6 h-6" />
											<div>
												<p className="font-bold text-slate-900 dark:text-white">{t('checkout.creditDebitCard')}</p>
												<p className="text-sm text-slate-600 dark:text-slate-400">{t('checkout.onlinePaymentSoon')}</p>
											</div>
										</div>
										{paymentMethod === 'card' && (
											<Check className="w-5 h-5 text-primary" />
										)}
									</div>
								</label>
							</div>
						</div>

						{/* Sipariş Notu */}
						<div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
							<h2 className="text-xl font-bold text-red-500 mb-4">{t('checkout.orderNote')}</h2>
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder={t('checkout.orderNotePlaceholder')}
								className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition resize-none"
								rows={4}
							/>
						</div>
					</div>

					{/* Sağ Taraf - Sipariş Özeti */}
					<div className="lg:col-span-1">
						<div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 sticky top-4">
							<h2 className="text-xl font-bold text-red-500 mb-6">{t('checkout.summary')}</h2>

							{/* Ürünler */}
							<div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
								{cartItems.map((item) => (
									<div key={item.id} className="flex gap-3">
										<div className="relative w-16 h-16 rounded bg-slate-200 dark:bg-slate-700 flex-shrink-0">
											<Image
												src={item.image_url}
												alt={item.product_name}
												fill
												className="object-cover rounded"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate">{item.product_name}</p>
											<p className="text-xs text-slate-600 dark:text-slate-400">
												{t('checkout.size')}: {item.size} - {t('checkout.quantity')}: {item.quantity}
											</p>
											<p className="text-sm font-bold text-primary">
												{formatPrice(item.price * item.quantity, language as Language)}
											</p>
										</div>
									</div>
								))}
							</div>

							{/* Fiyat Özeti */}
							<div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
								<div className="flex justify-between text-slate-600 dark:text-slate-400">
									<span>{t('cart.subtotal')}</span>
									<span>{formatPrice(subtotal, language as Language)}</span>
								</div>
								<div className="flex justify-between text-slate-600 dark:text-slate-400">
									<span>{t('cart.shipping')}</span>
									<span>{shipping === 0 ? t('checkout.free') : formatPrice(shipping, language as Language)}</span>
								</div>
								{shipping === 0 && (
									<p className="text-xs text-green-600 dark:text-green-400">
										✓ {t('checkout.freeShippingNote').replace('{limit}', String(shippingSettings.freeLimit))}
									</p>
								)}
								{subtotal < shippingSettings.freeLimit && shipping > 0 && (
									<p className="text-xs text-slate-500">
										{t('checkout.addMoreForFreeShipping').replace('{amount}', (shippingSettings.freeLimit - subtotal).toFixed(2))}
									</p>
								)}
								<div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between text-lg font-bold">
									<span>{t('cart.total')}</span>
									<span className="text-primary">{formatPrice(total, language as Language)}</span>
								</div>
							</div>

							{/* Sipariş Ver Butonu */}
							<button
								onClick={handleSubmitOrder}
								disabled={submitting || !selectedAddress}
								className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
							>
								{submitting ? (
									<span className="flex items-center justify-center gap-2">
										<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										{t('checkout.processing')}
									</span>
								) : (
									<span className="flex items-center justify-center gap-2">
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
										{t('checkout.placeOrder')}
									</span>
								)}
							</button>

							<p className="text-xs text-center text-slate-500 mt-4">
								{t('checkout.termsNote')}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

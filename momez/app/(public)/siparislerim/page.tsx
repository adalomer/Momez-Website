'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Package, MapPin, Calendar, CreditCard } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { authAPI } from '@/lib/api'
import { useLanguage } from '@/lib/i18n'

interface OrderItem {
	id: string
	product_id: string
	product_name: string
	size: string
	quantity: number
	price: number
	image_url?: string
}

interface Order {
	id: string
	order_number: string
	status: string
	payment_method: string
	subtotal: number
	shipping_cost: number
	total: number
	created_at: string
	address_title?: string
	full_name?: string
	phone?: string
	city?: string
	district?: string
	items: OrderItem[]
}

export default function OrdersPage() {
	const { t, language } = useLanguage()
	const router = useRouter()
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)
	const [user, setUser] = useState<any>(null)
	const [mounted, setMounted] = useState(false)

	const getStatusLabel = (status: string) => {
		const statusMap: Record<string, string> = {
			pending: t('admin.pending'),
			confirmed: t('admin.confirmed'),
			preparing: t('admin.preparing'),
			shipped: t('admin.shipped'),
			delivered: t('admin.delivered'),
			cancelled: t('admin.cancelled')
		}
		return statusMap[status] || t('admin.pending')
	}

	const getStatusColor = (status: string) => {
		const colorMap: Record<string, string> = {
			pending: 'bg-yellow-100 text-yellow-800',
			confirmed: 'bg-blue-100 text-blue-800',
			preparing: 'bg-purple-100 text-purple-800',
			shipped: 'bg-indigo-100 text-indigo-800',
			delivered: 'bg-green-100 text-green-800',
			cancelled: 'bg-red-100 text-red-800'
		}
		return colorMap[status] || 'bg-yellow-100 text-yellow-800'
	}

	const getPaymentLabel = (method: string) => {
		if (method === 'cash_on_delivery') return t('order.cashOnDelivery')
		if (method === 'card') return t('order.creditCard')
		return method
	}

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		if (!mounted) return

		checkAuthAndLoadOrders()
	}, [mounted])

	const checkAuthAndLoadOrders = async () => {
		try {
			const userResult = await authAPI.me() as { success: boolean; data?: any; error?: string }
			if (!userResult || !userResult.success) {
				router.push('/auth/login?redirect=/siparislerim')
				setLoading(false)
				return
			}

			setUser(userResult.data)

			const response = await fetch('/api/orders')
			const result = await response.json()

			if (result.success) {
				setOrders(result.data)
			} else {
				toast.error(t('common.error'))
			}
		} catch (error) {
			console.error('Load error:', error)
			toast.error(t('common.error'))
		} finally {
			setLoading(false)
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Toaster position="top-center" />
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
					<p className="mt-4">{t('common.loading')}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen py-8">
			<Toaster position="top-center" />
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
					{t('profile.orders')}
				</h1>

				{orders.length === 0 ? (
					<div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl">
						<Package className="w-16 h-16 mx-auto text-slate-400 mb-4" />
						<p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
							{t('admin.noOrders')}
						</p>
						<button
							onClick={() => router.push('/')}
							className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
						>
							{t('cart.continue')}
						</button>
					</div>
				) : (
					<div className="space-y-6">
						{orders.map((order) => (
							<div key={order.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
								{/* Order Header */}
								<div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
									<div>
										<h3 className="text-lg font-bold text-slate-900 dark:text-white">
											{t('admin.orderNo')} #{order.order_number}
										</h3>
										<p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 mt-1">
											<Calendar className="w-4 h-4" />
											{new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-IQ' : 'en-US', {
												day: 'numeric',
												month: 'long',
												year: 'numeric',
												hour: '2-digit',
												minute: '2-digit'
											})}
										</p>
									</div>
									<div className="flex items-center gap-3">
										<span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
											{getStatusLabel(order.status)}
										</span>
										<span className="text-lg font-bold text-primary">
											₺{(() => {
												const calculatedTotal = (order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0) + (Number(order.shipping_cost) || 0)
												const orderTotal = Number(order.total) || 0
												return (orderTotal > 0 ? orderTotal : calculatedTotal).toFixed(2)
											})()}
										</span>
									</div>
								</div>

								{/* Order Details */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Left: Products */}
									<div>
										<h4 className="font-bold mb-3">{t('order.products')}</h4>
										<div className="space-y-3">
											{order.items.map((item) => {
												const itemTotal = item.price * item.quantity
												return (
													<div key={item.id} className="flex gap-3 text-sm">
														{item.image_url && (
															<div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
																<Image
																	src={item.image_url}
																	alt={item.product_name}
																	fill
																	className="object-cover"
																/>
															</div>
														)}
														<div className="flex-1">
															<p className="font-medium">{item.product_name}</p>
															<p className="text-slate-600 dark:text-slate-400">
																{t('order.size')}: {item.size} - {t('order.quantity')}: {item.quantity}
															</p>
															<p className="text-slate-600 dark:text-slate-400">
																{item.quantity} x ₺{item.price.toFixed(2)} = ₺{itemTotal.toFixed(2)}
															</p>
														</div>
													</div>
												)
											})}
										</div>
										<div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-1 text-sm">
											<div className="flex justify-between text-slate-600 dark:text-slate-400">
												<span>{t('order.subtotal')}</span>
												<span>₺{((Number(order.subtotal) || 0) > 0
													? (Number(order.subtotal) || 0).toFixed(2)
													: (order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0).toFixed(2))}
												</span>
											</div>
											<div className="flex justify-between text-slate-600 dark:text-slate-400">
												<span>{t('order.shipping')}</span>
												<span>{(Number(order.shipping_cost) || 0) === 0 ? t('cart.freeShipping') : `₺${(Number(order.shipping_cost) || 0).toFixed(2)}`}</span>
											</div>
											<div className="flex justify-between font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
												<span>{t('order.total')}</span>
												<span>₺{(() => {
													const calculatedTotal = (order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0) + (Number(order.shipping_cost) || 0)
													const orderTotal = Number(order.total) || 0
													return (orderTotal > 0 ? orderTotal : calculatedTotal).toFixed(2)
												})()}
												</span>
											</div>
										</div>
									</div>

									{/* Right: Address and Payment */}
									<div className="space-y-4">
										{/* Delivery Address */}
										{order.full_name && (
											<div>
												<h4 className="font-bold mb-2 flex items-center gap-2">
													<MapPin className="w-4 h-4" />
													{t('order.deliveryAddress')}
												</h4>
												<div className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
													<p className="font-medium text-slate-900 dark:text-white">{order.full_name}</p>
													<p>{order.phone}</p>
													<p className="mt-1">{order.city}, {order.district}</p>
												</div>
											</div>
										)}

										{/* Payment Method */}
										<div>
											<h4 className="font-bold mb-2 flex items-center gap-2">
												<CreditCard className="w-4 h-4" />
												{t('order.paymentMethod')}
											</h4>
											<p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
												{getPaymentLabel(order.payment_method)}
											</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

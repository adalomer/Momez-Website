'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Upload, X, Plus, Palette, Trash2 } from 'lucide-react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { categoriesAPI, productsAPI, uploadAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Category {
	id: string
	name: string
	slug: string
}

interface ColorVariant {
	id: string
	name: string
	hex: string
	images: string[]
	isDefault: boolean
}

// Predefined colors
const PRESET_COLORS = [
	{ name: 'Black', hex: '#000000' },
	{ name: 'White', hex: '#FFFFFF' },
	{ name: 'Red', hex: '#EF4444' },
	{ name: 'Blue', hex: '#3B82F6' },
	{ name: 'Navy', hex: '#1E3A5F' },
	{ name: 'Green', hex: '#22C55E' },
	{ name: 'Gray', hex: '#6B7280' },
	{ name: 'Brown', hex: '#92400E' },
	{ name: 'Pink', hex: '#EC4899' },
	{ name: 'Purple', hex: '#8B5CF6' },
	{ name: 'Orange', hex: '#F97316' },
	{ name: 'Yellow', hex: '#EAB308' },
	{ name: 'Beige', hex: '#D4B896' },
	{ name: 'Burgundy', hex: '#881337' },
	{ name: 'Khaki', hex: '#4B5320' },
]

export default function AdminProductFormPage() {
	const router = useRouter()
	const { t } = useLanguage()
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(false)
	const [uploadingImage, setUploadingImage] = useState<string | null>(null)

	// Temel ürün bilgileri
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		category_id: '',
		price: '',
		sku: ''
	})

	// Color variants
	const [colorVariants, setColorVariants] = useState<ColorVariant[]>([])
	const [showColorPicker, setShowColorPicker] = useState(false)
	const [customColor, setCustomColor] = useState({ name: '', hex: '#000000' })

	// Size and stock
	const [selectedSizes, setSelectedSizes] = useState<string[]>(['40', '41', '42'])
	const [sizeStocks, setSizeStocks] = useState<Record<string, string>>({})

	const availableSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']

	useEffect(() => {
		const loadCategories = async () => {
			const result = await categoriesAPI.getAll() as { success: boolean; data?: any[]; error?: string }
			if (result.success && result.data) {
				setCategories(result.data)
			}
		}
		loadCategories()
	}, [])

	// Add color
	const addColor = (name: string, hex: string) => {
		const newColor: ColorVariant = {
			id: Date.now().toString(),
			name,
			hex,
			images: [],
			isDefault: colorVariants.length === 0
		}
		setColorVariants(prev => [...prev, newColor])
		setShowColorPicker(false)
		setCustomColor({ name: '', hex: '#000000' })
		toast.success(`${name} color added`)
	}

	// Remove color
	const removeColor = (colorId: string) => {
		setColorVariants(prev => {
			const filtered = prev.filter(c => c.id !== colorId)
			if (filtered.length > 0 && !filtered.some(c => c.isDefault)) {
				filtered[0].isDefault = true
			}
			return filtered
		})
		toast.success('Color removed')
	}

	// Set default color
	const setDefaultColor = (colorId: string) => {
		setColorVariants(prev => prev.map(c => ({
			...c,
			isDefault: c.id === colorId
		})))
	}

	// Add image to color
	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, colorId: string) => {
		const files = e.target.files
		if (!files || files.length === 0) return

		setUploadingImage(colorId)

		try {
			const uploadPromises = Array.from(files).map(async (file) => {
				const result = await uploadAPI.uploadImage(file) as { success: boolean; url?: string; error?: string }
				if (result.success && result.url) {
					return result.url
				}
				return null
			})

			const uploadedUrls = await Promise.all(uploadPromises)
			const validUrls = uploadedUrls.filter(url => url !== null) as string[]

			if (validUrls.length > 0) {
				setColorVariants(prev => prev.map(c => {
					if (c.id === colorId) {
						return { ...c, images: [...c.images, ...validUrls] }
					}
					return c
				}))
				toast.success(`${validUrls.length} images uploaded`)
			}

			e.target.value = ''
		} catch (error) {
			console.error('Image upload error:', error)
			toast.error('Error uploading image')
		} finally {
			setUploadingImage(null)
		}
	}

	// Remove image
	const removeImage = (colorId: string, imageIndex: number) => {
		setColorVariants(prev => prev.map(c => {
			if (c.id === colorId) {
				return { ...c, images: c.images.filter((_, i) => i !== imageIndex) }
			}
			return c
		}))
		toast.success('Image removed')
	}

	// Size toggle
	const toggleSize = (size: string) => {
		setSelectedSizes(prev => {
			const newSizes = prev.includes(size)
				? prev.filter(s => s !== size)
				: [...prev, size]

			if (!newSizes.includes(size)) {
				setSizeStocks(prev => {
					const newStocks = { ...prev }
					delete newStocks[size]
					return newStocks
				})
			}

			return newSizes
		})
	}

	// Form submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!formData.name || !formData.description || !formData.category_id || !formData.price) {
			toast.error('Please fill in all required fields')
			return
		}

		if (colorVariants.length === 0) {
			toast.error('You must add at least one color')
			return
		}

		const hasImages = colorVariants.some(c => c.images.length > 0)
		if (!hasImages) {
			toast.error('You must upload at least one image for a color')
			return
		}

		if (selectedSizes.length === 0) {
			toast.error('You must select at least one size')
			return
		}

		const stockData = selectedSizes.map(size => ({
			size,
			quantity: parseInt(sizeStocks[size]) || 0
		}))

		const colorsData = colorVariants.map(c => ({
			name: c.name,
			hex: c.hex,
			images: c.images,
			isDefault: c.isDefault
		}))

		setLoading(true)

		try {
			const result = await productsAPI.create({
				name: formData.name,
				slug: formData.name.toLowerCase()
					.replace(/[^a-z0-9ğüşıöçİĞÜŞÖÇ\s-]/g, '')
					.replace(/\s+/g, '-')
					.replace(/-+/g, '-'),
				description: formData.description,
				price: parseFloat(formData.price),
				category_id: formData.category_id,
				colors: colorsData,
				stock: stockData,
				sku: formData.sku || null,
				is_active: true,
				is_featured: false,
				is_new: false
			})

			const apiResult = result as { success: boolean; error?: string; data?: any }
			if (apiResult.success) {
				toast.success('Product added successfully')
				setTimeout(() => {
					router.push('/admin/products')
				}, 1000)
			} else {
				toast.error(apiResult.error || 'Error adding product')
			}
		} catch (error) {
			console.error('Submit error:', error)
			toast.error('An error occurred')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="space-y-6">
			<Toaster position="top-right" />

			<div className="flex items-center gap-4">
				<Link
					href="/admin/urunler"
					className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
				>
					<ArrowLeft className="h-5 w-5" />
				</Link>
				<div>
					<h1 className="text-2xl font-bold text-slate-900 dark:text-white">
						Add New Product
					</h1>
					<p className="text-slate-600 dark:text-slate-400 mt-1">
						Create product with color variants
					</p>
				</div>
			</div>

			<form className="space-y-6" onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-6">
						{/* Basic Information */}
						<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
							<h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
								Basic Information
							</h2>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
										Product Name *
									</label>
									<input
										type="text"
										value={formData.name}
										onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
										placeholder="E.g.: Nike Air Max 270"
										className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
										Description *
									</label>
									<textarea
										rows={4}
										value={formData.description}
										onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
										placeholder="Product description..."
										className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
											Category *
										</label>
										<select
											value={formData.category_id}
											onChange={e => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
											className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
										>
											<option value="">Select category</option>
											{categories.map(cat => (
												<option key={cat.id} value={cat.id}>{cat.name}</option>
											))}
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
											{t('admin.priceLabel')}
										</label>
										<input
											type="text"
											inputMode="decimal"
											value={formData.price}
											onChange={e => {
												const val = e.target.value
												if (val === '' || /^\d*\.?\d*$/.test(val)) {
													setFormData(prev => ({ ...prev, price: val }))
												}
											}}
											placeholder="0.00"
											className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
										SKU (Optional)
									</label>
									<input
										type="text"
										value={formData.sku}
										onChange={e => setFormData(prev => ({ ...prev, sku: e.target.value }))}
										placeholder="Stock code"
										className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>
							</div>
						</div>

						{/* Color Variants */}
						<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
									<Palette className="w-5 h-5 text-primary" />
									Color Variants
								</h2>
								<button
									type="button"
									onClick={() => setShowColorPicker(true)}
									className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
								>
									<Plus className="w-4 h-4" />
									Add Color
								</button>
							</div>

							{showColorPicker && (
								<div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
									<h3 className="font-medium text-slate-900 dark:text-white mb-3">Select Color</h3>

									<div className="flex flex-wrap gap-2 mb-4">
										{PRESET_COLORS.map(color => (
											<button
												key={color.hex}
												type="button"
												onClick={() => addColor(color.name, color.hex)}
												className="group relative w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-600 hover:scale-110 transition-transform"
												style={{ backgroundColor: color.hex }}
												title={color.name}
											>
												{color.hex === '#FFFFFF' && (
													<span className="absolute inset-0 rounded-full border border-slate-300" />
												)}
											</button>
										))}
									</div>

									<div className="flex items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
										<input
											type="color"
											value={customColor.hex}
											onChange={e => setCustomColor(prev => ({ ...prev, hex: e.target.value }))}
											className="w-10 h-10 rounded cursor-pointer"
										/>
										<input
											type="text"
											value={customColor.name}
											onChange={e => setCustomColor(prev => ({ ...prev, name: e.target.value }))}
											placeholder="Color name"
											className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
										/>
										<button
											type="button"
											onClick={() => {
												if (customColor.name) {
													addColor(customColor.name, customColor.hex)
												} else {
													toast.error('Enter color name')
												}
											}}
											className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:opacity-90"
										>
											Add
										</button>
										<button
											type="button"
											onClick={() => setShowColorPicker(false)}
											className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
										>
											Cancel
										</button>
									</div>
								</div>
							)}

							{colorVariants.length === 0 ? (
								<div className="text-center py-8 text-slate-500 dark:text-slate-400">
									<Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
									<p>No colors added yet</p>
									<p className="text-sm">Click the button above to add a color</p>
								</div>
							) : (
								<div className="space-y-4">
									{colorVariants.map(color => (
										<div key={color.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
											<div className="flex items-center justify-between mb-3">
												<div className="flex items-center gap-3">
													<div
														className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-600"
														style={{ backgroundColor: color.hex }}
													/>
													<span className="font-medium text-slate-900 dark:text-white">{color.name}</span>
													{color.isDefault && (
														<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Default</span>
													)}
												</div>
												<div className="flex items-center gap-2">
													{!color.isDefault && (
														<button
															type="button"
															onClick={() => setDefaultColor(color.id)}
															className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary"
														>
															Make default
														</button>
													)}
													<button
														type="button"
														onClick={() => removeColor(color.id)}
														className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</div>

											<div className="grid grid-cols-4 gap-3">
												{color.images.map((img, idx) => (
													<div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 group">
														<img src={img} alt={`${color.name} ${idx + 1}`} className="w-full h-full object-cover" />
														<button
															type="button"
															onClick={() => removeImage(color.id, idx)}
															className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
														>
															<X className="h-3 w-3" />
														</button>
													</div>
												))}

												<label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer">
													<input
														type="file"
														multiple
														accept="image/*"
														onChange={(e) => handleImageUpload(e, color.id)}
														disabled={uploadingImage !== null}
														className="hidden"
													/>
													<Upload className="h-5 w-5" />
													<span className="text-xs">
														{uploadingImage === color.id ? 'Uploading...' : 'Add'}
													</span>
												</label>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Size and Stock */}
						<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
							<h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
								Size and Stock
							</h2>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
										Available Sizes
									</label>
									<div className="flex flex-wrap gap-2">
										{availableSizes.map((size) => (
											<button
												key={size}
												type="button"
												onClick={() => toggleSize(size)}
												className={`min-w-[48px] px-3 py-2 rounded-lg font-medium transition-all ${selectedSizes.includes(size)
													? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
													: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
													}`}
											>
												{size}
											</button>
										))}
									</div>
								</div>

								{selectedSizes.length > 0 && (
									<div>
										<label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
											Stock Quantities
										</label>
										<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
											{selectedSizes.sort((a, b) => Number(a) - Number(b)).map((size) => (
												<div key={size} className="flex items-center gap-2">
													<div className="w-12 px-2 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-center font-medium text-sm">
														{size}
													</div>
													<input
														type="text"
														inputMode="numeric"
														value={sizeStocks[size] ?? ''}
														onChange={e => {
															const val = e.target.value
															if (val === '' || /^\d+$/.test(val)) {
																setSizeStocks(prev => ({ ...prev, [size]: val === '' ? '' : String(parseInt(val)) }))
															}
														}}
														onBlur={e => {
															if (e.target.value === '') {
																setSizeStocks(prev => ({ ...prev, [size]: '0' }))
															}
														}}
														placeholder="0"
														className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
													/>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Sağ Taraf */}
					<div className="space-y-6">
						<div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sticky top-6">
							<h3 className="font-bold text-slate-900 dark:text-white mb-4">Summary</h3>

							<div className="space-y-3 text-sm mb-6">
								<div className="flex justify-between">
									<span className="text-slate-600 dark:text-slate-400">Number of colors:</span>
									<span className="font-medium text-slate-900 dark:text-white">{colorVariants.length}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-600 dark:text-slate-400">Total images:</span>
									<span className="font-medium text-slate-900 dark:text-white">
										{colorVariants.reduce((sum, c) => sum + c.images.length, 0)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-600 dark:text-slate-400">Number of sizes:</span>
									<span className="font-medium text-slate-900 dark:text-white">{selectedSizes.length}</span>
								</div>
							</div>

							<div className="space-y-3">
								<button
									type="submit"
									disabled={loading || uploadingImage !== null}
									className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
								>
									<Save className="h-5 w-5" />
									{loading ? 'Saving...' : 'Save Product'}
								</button>
								<Link
									href="/admin/urunler"
									className="w-full px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg transition-colors flex items-center justify-center"
								>
									Cancel
								</Link>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	)
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { cartAPI, authAPI } from '@/lib/api'

interface CartItem {
  id: string
  product_id: string
  product_name: string
  product_slug: string
  size: string
  quantity: number
  price: number
  image_url: string
  stock: number
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuthAndLoadCart()
  }, [])

  const checkAuthAndLoadCart = async () => {
    try {
      // Kullanıcı kontrolü
      const userResult = await authAPI.me()
      if (!userResult.success) {
        router.push('/auth/login?redirect=/sepet')
        return
      }
      
      setUser(userResult.data)
      
      // Sepeti yükle
      const cartResult = await cartAPI.get()
      if (cartResult.success) {
        setCartItems(cartResult.data || [])
      }
    } catch (error) {
      console.error('Cart load error:', error)
      toast.error('Sepet yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    const item = cartItems.find(i => i.id === itemId)
    if (!item) return
    
    if (newQuantity > item.stock) {
      toast.error('Stok miktarını aştınız')
      return
    }

    try {
      // Önce UI'ı güncelle
      setCartItems(items =>
        items.map(i => i.id === itemId ? { ...i, quantity: newQuantity } : i)
      )

      // Sonra API'ye gönder
      const result = await cartAPI.add(item.product_id, item.size, newQuantity)
      if (!result.success) {
        toast.error('Miktar güncellenemedi')
        // Hata durumunda geri al
        await checkAuthAndLoadCart()
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
      await checkAuthAndLoadCart()
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const result = await cartAPI.remove(itemId)
      if (result.success) {
        setCartItems(items => items.filter(i => i.id !== itemId))
        toast.success('Ürün sepetten çıkarıldı')
      } else {
        toast.error('Ürün çıkarılamadı')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal >= 500 ? 0 : 50
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Toaster position="top-center" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <Toaster position="top-center" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Sepetim
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl">
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
              Sepetiniz boş
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex gap-4">
                    <Link href={`/urun/${item.product_slug}`} className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/urun/${item.product_slug}`}>
                          <h3 className="font-bold text-slate-900 dark:text-white mb-1 hover:text-primary">
                            {item.product_name}
                          </h3>
                        </Link>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Beden: {item.size}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="p-1 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-slate-900 dark:text-white">
                            ₺{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 sticky top-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Sipariş Özeti
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Ara Toplam</span>
                    <span>₺{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Kargo</span>
                    <span>{shipping === 0 ? 'Ücretsiz' : `₺${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      ✓ 500 TL ve üzeri alışverişlerde kargo ücretsiz
                    </p>
                  )}
                  {subtotal < 500 && shipping > 0 && (
                    <p className="text-xs text-slate-500">
                      {(500 - subtotal).toFixed(2)} TL daha alışveriş yapın, kargo ücretsiz olsun
                    </p>
                  )}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between text-lg font-bold text-slate-900 dark:text-white">
                    <span>Toplam</span>
                    <span>₺{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Link
                  href="/siparis"
                  className="block w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-center transition-colors"
                >
                  Siparişi Tamamla
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

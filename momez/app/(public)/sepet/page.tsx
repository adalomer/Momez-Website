'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus } from 'lucide-react'

// Demo sepet sayfası
// Supabase kurulunca gerçek sepet yönetimiyle değiştirilecek

export default function CartPage() {
  // Demo sepet ürünleri
  const cartItems = [
    {
      id: 1,
      name: 'AeroGlide Pro',
      price: 1899,
      size: '42',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
    },
    {
      id: 2,
      name: 'Urban Classic',
      price: 1499,
      size: '41',
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 50
  const total = subtotal + shipping

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Sepetim
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
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
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Beden: {item.size}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => alert('Miktar azaltıldı (Demo)')}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button 
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => alert('Miktar artırıldı (Demo)')}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <p className="text-lg font-bold text-primary">
                            ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                          </p>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            onClick={() => alert('Ürün silindi (Demo)')}
                          >
                            <Trash2 className="h-5 w-5" />
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
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 sticky top-4 shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Sipariş Özeti
                </h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Ara Toplam</span>
                    <span>₺{subtotal.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Kargo</span>
                    <span>₺{shipping.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between text-lg font-bold text-slate-900 dark:text-white">
                    <span>Toplam</span>
                    <span className="text-primary">₺{total.toLocaleString('tr-TR')}</span>
                  </div>
                </div>

                <button 
                  className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
                  onClick={() => alert('Ödeme sayfasına yönlendiriliyorsunuz (Demo)')}
                >
                  Ödemeye Geç
                </button>

                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">
                  Kapıda ödeme imkanı
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

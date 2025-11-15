'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Tag } from 'lucide-react'

// Kampanyalar sayfası - Demo

export default function CampaignsPage() {
  // Demo kampanyalar
  const campaigns = [
    {
      id: 1,
      title: 'Yaz İndirimi',
      description: 'Tüm yaz koleksiyonunda %40 indirim! Sezonun en trend modellerini kaçırmayın.',
      discount: 40,
      image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1200&h=600&fit=crop',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      active: true,
    },
    {
      id: 2,
      title: 'Spor Günleri',
      description: 'Spor ayakkabılarda özel fiyatlar. Koşu, basketbol ve fitness ayakkabılarında büyük indirim.',
      discount: 30,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&h=600&fit=crop',
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      active: true,
    },
    {
      id: 3,
      title: 'Kış Fırsatları',
      description: 'Yeni sezon botlarda indirim! Kışa hazır olun, ayağınızı sıcak tutun.',
      discount: 25,
      image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=1200&h=600&fit=crop',
      startDate: '2024-12-01',
      endDate: '2025-02-28',
      active: true,
    },
    {
      id: 4,
      title: 'Bahar Koleksiyonu',
      description: 'Yeni sezon ayakkabılarında %35 indirim. Bahara renk katın!',
      discount: 35,
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&h=600&fit=crop',
      startDate: '2025-03-01',
      endDate: '2025-05-31',
      active: true,
    },
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Aktif Kampanyalar
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Fırsatları kaçırmayın! Tüm kampanyalarımız burada.
          </p>
        </div>

        {/* Campaigns Grid */}
        <div className="space-y-8">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={campaign.image}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-primary text-white px-6 py-3 rounded-full font-bold text-2xl shadow-lg">
                      %{campaign.discount}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-3">
                    <Tag className="h-4 w-4" />
                    <span>KAMPANYA</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    {campaign.title}
                  </h2>
                  
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                    {campaign.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(campaign.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                    </div>
                    <span>-</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(campaign.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <Link
                    href={`/kategori/erkek?kampanya=${campaign.id}`}
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
                  >
                    Kampanya Ürünlerini İncele
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-red-100 dark:from-primary/20 dark:to-red-900/20 rounded-xl border border-primary/20">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Kampanyalardan Haberdar Olun!
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Yeni kampanyalarımızdan ve özel fırsatlardan ilk siz haberdar olun. E-posta bültenimize abone olun.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors">
              Abone Ol
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

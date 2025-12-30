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
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-primary text-primary px-6 py-3 rounded-full font-bold text-base mb-4 shadow-lg">
            <Tag className="h-5 w-5" />
            <span>AKTİF KAMPANYALAR</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Özel Fırsatlar
          </h1>
          <p className="text-lg text-slate-800 dark:text-slate-200 max-w-2xl mx-auto font-medium">
            Kazanılı alabileceğiniz harika kampanyalar. Fırsatları kaçırmayın!
          </p>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border-2 border-slate-200 dark:border-slate-700">
              <div className="relative h-56">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white text-primary-600 px-5 py-2 rounded-full font-bold text-xl shadow-soft-lg">
                    %{campaign.discount}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {campaign.title}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-slate-800 dark:text-slate-200 mb-6 text-base leading-relaxed font-medium">
                  {campaign.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700 dark:text-slate-300 mb-6">
                  <div className="flex items-center gap-2 bg-accent-lighter px-3 py-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary-500" />
                    <span className="font-medium">{new Date(campaign.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                  </div>
                  <span className="font-bold">-</span>
                  <div className="flex items-center gap-2 bg-accent-lighter px-3 py-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary-500" />
                    <span className="font-medium">{new Date(campaign.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                <Link
                  href={`/kategori/erkek?kampanya=${campaign.id}`}
                  className="btn-primary inline-flex items-center justify-center w-full px-6 py-3 rounded-xl font-bold shadow-soft hover:shadow-lg transition-all"
                >
                  Kampanya Ürünlerini İncele
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

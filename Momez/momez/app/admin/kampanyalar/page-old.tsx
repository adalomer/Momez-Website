'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

// Admin kampanya yönetimi sayfası - Demo

export default function AdminCampaignsPage() {
  // Demo kampanyalar
  const campaigns = [
    {
      id: 1,
      title: 'Yaz İndirimi',
      description: 'Tüm yaz koleksiyonunda %40 indirim',
      discount: 40,
      image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=400&fit=crop',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      active: true,
    },
    {
      id: 2,
      title: 'Spor Günleri',
      description: 'Spor ayakkabılarda özel fiyatlar',
      discount: 30,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=400&fit=crop',
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      active: true,
    },
    {
      id: 3,
      title: 'Kış Fırsatları',
      description: 'Yeni sezon botlarda indirim',
      discount: 25,
      image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=400&fit=crop',
      startDate: '2024-12-01',
      endDate: '2025-02-28',
      active: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kampanya Yönetimi
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {campaigns.length} kampanya
          </p>
        </div>
        <button 
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          onClick={() => alert('Yeni kampanya ekle (Demo)')}
        >
          <Plus className="h-5 w-5" />
          Yeni Kampanya
        </button>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-64 h-48 md:h-auto bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-lg font-bold">
                  %{campaign.discount}
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-2">
                      {campaign.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                      {campaign.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="font-medium">Başlangıç:</span>{' '}
                        {new Date(campaign.startDate).toLocaleDateString('tr-TR')}
                      </div>
                      <div>
                        <span className="font-medium">Bitiş:</span>{' '}
                        {new Date(campaign.endDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    campaign.active
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400'
                  }`}>
                    {campaign.active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <button 
                    className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
                    onClick={() => alert('Kampanya görüntüle (Demo)')}
                  >
                    <Eye className="h-4 w-4" />
                    Görüntüle
                  </button>
                  <button 
                    className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2"
                    onClick={() => alert('Kampanya düzenle (Demo)')}
                  >
                    <Edit className="h-4 w-4" />
                    Düzenle
                  </button>
                  <button 
                    className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                    onClick={() => alert('Kampanya sil (Demo)')}
                  >
                    <Trash2 className="h-4 w-4" />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

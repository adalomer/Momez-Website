'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useLanguage } from '@/lib/i18n'

interface Campaign {
  id: string
  title: string
  description: string
  image_url: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  start_date: string
  end_date: string
  is_active: boolean
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    start_date: '',
    end_date: ''
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns')
      const data = await response.json()
      
      if (data.success) {
        setCampaigns(data.data || [])
      } else {
        toast.error(t('admin.loadError'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.discount_value || !formData.start_date || !formData.end_date) {
      toast.error(t('campaigns.fillRequired'))
      return
    }

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          discount_value: parseFloat(formData.discount_value)
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(t('campaigns.added'))
        setShowModal(false)
        setFormData({
          title: '',
          description: '',
          image_url: '',
          discount_type: 'percentage',
          discount_value: '',
          start_date: '',
          end_date: ''
        })
        fetchCampaigns()
      } else {
        toast.error(data.error || t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(t('admin.deleteConfirm'))) {
      return
    }

    try {
      const response = await fetch(`/api/campaigns?id=${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(t('campaigns.deleted'))
        fetchCampaigns()
      } else {
        toast.error(data.error || t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('admin.campaignManagement')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {campaigns.length} {t('admin.campaigns').toLowerCase()}
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          {t('campaigns.newCampaign')}
        </button>
      </div>

      {/* Campaigns List */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-primary"></div>
          <p className="mt-4 text-slate-500">{t('common.loading')}</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <Plus className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-500">{t('campaigns.noCampaigns')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="flex flex-col md:flex-row">
                {campaign.image_url && (
                  <div className="relative w-full md:w-80 h-56 md:h-auto bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex-shrink-0">
                    <Image
                      src={campaign.image_url}
                      alt={campaign.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-xl">
                      {campaign.discount_type === 'percentage' ? `%${campaign.discount_value} İNDİRİM` : `₺${campaign.discount_value} İNDİRİM`}
                    </div>
                  </div>
                )}
                
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {campaign.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {campaign.description}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                      campaign.is_active
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-gray-500/90 text-white'
                    }`}>
                      {campaign.is_active ? t('admin.active') : t('admin.inactive')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm mb-6 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-400">{t('campaigns.startDate')}:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{new Date(campaign.start_date).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-400">{t('campaigns.endDate')}:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{new Date(campaign.end_date).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(campaign.id, campaign.title)}
                      className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-300 flex items-center gap-2 font-medium shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Trash2 className="h-4 w-4" />
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('campaigns.addNew')}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  {t('campaigns.title')} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  {t('admin.description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  {t('campaigns.image')}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setFormData({ ...formData, image_url: reader.result as string })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <Image src={formData.image_url} alt="Preview" width={200} height={100} className="rounded-lg" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    {t('campaigns.discountType')} *
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="percentage">{t('campaigns.percentage')}</option>
                    <option value="fixed">{t('campaigns.fixedAmount')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    {t('campaigns.discountValue')} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    {t('campaigns.startDate')} *
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    {t('campaigns.endDate')} *
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                >
                  {t('campaigns.addCampaign')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

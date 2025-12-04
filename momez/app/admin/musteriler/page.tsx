'use client'

import { useState, useEffect } from 'react'
import { Edit, X, Save, Trash2, AlertTriangle } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Customer {
  id: string
  full_name: string
  email: string
  phone?: string
  role: string
  created_at: string
}

export default function CustomersPage() {
  const { t, language } = useLanguage()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null)
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const timestamp = Date.now()
      const response = await fetch(`/api/admin/customers?_t=${timestamp}`, {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setCustomers(data.data || [])
      } else {
        toast.error(t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer)
    setEditForm({
      full_name: customer.full_name || '',
      email: customer.email || '',
      phone: customer.phone || ''
    })
  }

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return

    if (!editForm.full_name || !editForm.email) {
      toast.error(t('common.error'))
      return
    }

    try {
      const response = await fetch(`/api/admin/customers/${editingCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(t('admin.updateSuccess'))
        setEditingCustomer(null)
        fetchCustomers()
      } else {
        toast.error(data.error || t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    }
  }

  const handleDeleteCustomer = async () => {
    if (!deletingCustomer) return

    try {
      const response = await fetch(`/api/admin/customers?id=${deletingCustomer.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        toast.success(t('admin.deleteSuccess'))
        setDeletingCustomer(null)
        fetchCustomers()
      } else {
        toast.error(data.error || t('common.error'))
      }
    } catch (error) {
      toast.error(t('common.error'))
    }
  }

  const getLocale = () => {
    if (language === 'ar') return 'ar-SA'
    if (language === 'en') return 'en-US'
    return 'tr-TR'
  }

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.customerManagement')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t('admin.viewCustomers')}</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg shadow border border-slate-200 dark:border-slate-700">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <input
            type="text"
            placeholder={t('admin.searchCustomer')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ee2b2b]"
          />
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            {t('common.loading')}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? t('admin.customerNotFound') : t('admin.noCustomers')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                    {t('admin.id')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                    {t('admin.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                    {t('admin.email')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                    {t('admin.phone')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                    {t('admin.role')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                    {t('admin.registrationDate')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-red-50/30 dark:bg-slate-800/80 divide-y divide-gray-200 dark:divide-slate-700">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-red-100/50 dark:hover:bg-red-900/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      #{customer.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {customer.full_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {customer.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {customer.role === 'admin' ? t('admin.admin') : t('admin.customerRole')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {new Date(customer.created_at).toLocaleDateString(getLocale())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(customer)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-bold flex items-center gap-1 hover:scale-105 transition-transform"
                        >
                          <Edit className="h-4 w-4" />
                          {t('common.edit')}
                        </button>
                        <button
                          onClick={() => setDeletingCustomer(customer)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-bold flex items-center gap-1 hover:scale-105 transition-transform"
                        >
                          <Trash2 className="h-4 w-4" />
                          {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('admin.totalCustomersCount')}: {filteredCustomers.length}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('admin.editCustomer')}
              </h2>
              <button
                onClick={() => setEditingCustomer(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('admin.fullNameLabel')}
                </label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ee2b2b]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('admin.email')} *
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ee2b2b]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('admin.phone')}
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ee2b2b]"
                  placeholder="5XX XXX XX XX"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingCustomer(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleUpdateCustomer}
                className="flex-1 px-4 py-2 bg-[#ee2b2b] hover:bg-[#d62626] text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('admin.deleteCustomer')}
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-2">
              <strong className="text-gray-900 dark:text-white">{deletingCustomer.full_name}</strong> - {t('admin.deleteWarning')}
            </p>
            
            <p className="text-sm text-red-600 dark:text-red-400 mb-6">
              ⚠️ {t('admin.deleteConfirm')}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingCustomer(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t('admin.yesDelete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

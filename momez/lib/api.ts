/**
 * API Helper Functions
 * Frontend'den API çağrıları için yardımcı fonksiyonlar
 */

// Production'da relative path kullan, development'ta localhost
const API_URL = typeof window !== 'undefined' 
  ? '' // Client-side: relative path (same origin)
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000' // Server-side

// API hata yönetimi için yardımcı fonksiyon
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  
  if (!response.ok) {
    const error = new Error(data.error || 'Bir hata oluştu')
    ;(error as any).status = response.status
    ;(error as any).data = data
    throw error
  }
  
  return data as T
}

// Auth API
export const authAPI = {
  // Kayıt ol
  async register(email: string, password: string, name: string, phone?: string) {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: JSON.stringify({ email, password, name, phone }),
        cache: 'no-store'
      })
      return handleResponse(res)
    } catch (error: any) {
      console.error('Register error:', error)
      throw error
    }
  },

  // Giriş yap
  async login(email: string, password: string) {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: JSON.stringify({ email, password }),
        cache: 'no-store'
      })
      return handleResponse(res)
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    }
  },

  // Çıkış yap
  async logout() {
    try {
      const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        cache: 'no-store'
      })
      return handleResponse(res)
    } catch (error: any) {
      console.error('Logout error:', error)
      throw error
    }
  },

  // Kullanıcı bilgisi al
  async me() {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      })
      // 401 hatası normal (kullanıcı giriş yapmamış), sessizce yakalıyoruz
      if (res.status === 401) {
        return { success: false, user: null }
      }
      return handleResponse(res)
    } catch (error: any) {
      // Network hatalarını sessizce yakala
      return { success: false, user: null }
    }
  }
}

// Products API
export const productsAPI = {
  // Ürün listesi
  async getAll(params?: { category?: string; search?: string; limit?: number; offset?: number }) {
    try {
      const query = new URLSearchParams()
      if (params?.category) query.set('category', params.category)
      if (params?.search) query.set('search', params.search)
      if (params?.limit) query.set('limit', params.limit.toString())
      if (params?.offset) query.set('offset', params.offset.toString())
      
      const res = await fetch(`${API_URL}/api/products?${query}`)
      return handleResponse(res)
    } catch (error: any) {
      console.error('Get products error:', error)
      throw error
    }
  },

  // Ürün detayı
  async getBySlug(slug: string) {
    try {
      const res = await fetch(`${API_URL}/api/products/${slug}`)
      return handleResponse(res)
    } catch (error: any) {
      console.error('Get product by slug error:', error)
      throw error
    }
  },

  // Ürün ekle (Admin)
  async create(data: any) {
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return handleResponse(res)
    } catch (error: any) {
      console.error('Create product error:', error)
      throw error
    }
  },

  // Ürün güncelle (Admin)
  async update(slug: string, data: any) {
    try {
      const res = await fetch(`${API_URL}/api/products/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return handleResponse(res)
    } catch (error: any) {
      console.error('Update product error:', error)
      throw error
    }
  },

  // Ürün sil (Admin)
  async delete(slug: string) {
    try {
      const res = await fetch(`${API_URL}/api/products/${slug}`, {
        method: 'DELETE'
      })
      return handleResponse(res)
    } catch (error: any) {
      console.error('Delete product error:', error)
      throw error
    }
  }
}

// Categories API
export const categoriesAPI = {
  // Kategori listesi
  async getAll(parentId?: string) {
    const query = parentId ? `?parent_id=${parentId}` : ''
    const res = await fetch(`${API_URL}/api/categories${query}`)
    return res.json()
  },

  // Kategori ekle (Admin)
  async create(data: any) {
    const res = await fetch(`${API_URL}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  // Kategori güncelle (Admin)
  async update(id: string, data: any) {
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  // Kategori sil (Admin)
  async delete(id: string) {
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'DELETE'
    })
    return res.json()
  }
}

// Cart API
export const cartAPI = {
  // Sepeti getir
  async get() {
    try {
      const res = await fetch(`${API_URL}/api/cart`)
      // 401 hatası normal (kullanıcı giriş yapmamış)
      if (res.status === 401) {
        return { success: true, items: [] }
      }
      return res.json()
    } catch (error) {
      // Network hatalarını sessizce yakala
      return { success: true, items: [] }
    }
  },

  // Sepete ekle
  async add(product_id: string, size: string, quantity: number) {
    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id, size, quantity })
      })
      if (res.status === 401) {
        return { success: false, error: 'Lütfen giriş yapın' }
      }
      return res.json()
    } catch (error) {
      return { success: false, error: 'Bir hata oluştu' }
    }
  },

  // Sepetten çıkar
  async remove(itemId: string) {
    try {
      const res = await fetch(`${API_URL}/api/cart?id=${itemId}`, {
        method: 'DELETE'
      })
      if (res.status === 401) {
        return { success: false, error: 'Lütfen giriş yapın' }
      }
      return res.json()
    } catch (error) {
      return { success: false, error: 'Bir hata oluştu' }
    }
  }
}

// Favorites API
export const favoritesAPI = {
  // Favorileri getir
  async get() {
    const res = await fetch(`${API_URL}/api/favorites`)
    return res.json()
  },

  // Favorilere ekle
  async add(product_id: string) {
    const res = await fetch(`${API_URL}/api/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id })
    })
    return res.json()
  },

  // Favorilerden çıkar
  async remove(product_id: string) {
    const res = await fetch(`${API_URL}/api/favorites?product_id=${product_id}`, {
      method: 'DELETE'
    })
    return res.json()
  }
}

// Orders API
export const ordersAPI = {
  // Siparişleri getir
  async get() {
    const res = await fetch(`${API_URL}/api/orders`)
    return res.json()
  },

  // Tüm siparişleri getir (alias)
  async getAll() {
    const res = await fetch(`${API_URL}/api/orders`)
    return res.json()
  },

  // Sipariş oluştur
  async create(address_id: number, payment_method: string, items: any[]) {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address_id, payment_method, items })
    })
    return res.json()
  }
}

// Upload API
export const uploadAPI = {
  // Dosya yükle
  async uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData
    })
    return res.json()
  }
}

// Addresses API
export const addressesAPI = {
  // Adresleri getir
  async getAll() {
    const res = await fetch(`${API_URL}/api/addresses`)
    return res.json()
  },

  // Adres ekle
  async create(data: any) {
    const res = await fetch(`${API_URL}/api/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  // Adres güncelle
  async update(id: number, data: any) {
    const res = await fetch(`${API_URL}/api/addresses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  // Adres sil
  async delete(id: number) {
    const res = await fetch(`${API_URL}/api/addresses/${id}`, {
      method: 'DELETE'
    })
    return res.json()
  }
}

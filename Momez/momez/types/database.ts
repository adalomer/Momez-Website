export type UserRole = 'customer' | 'employee' | 'admin'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentMethod = 'cash_on_delivery'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  description: string | null
  price: number
  category_id: string | null
  is_active: boolean
  is_featured: boolean
  is_new: boolean
  images: string[]
  colors: string[]
  created_at: string
  updated_at: string
  created_by: string | null
  category?: Category
  stock?: ProductStock[]
}

export interface ProductStock {
  id: string
  product_id: string
  size: string
  quantity: number
  low_stock_threshold: number
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  full_name: string
  phone: string
  city: string
  district: string | null
  address_line: string
  postal_code: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface ShippingRate {
  id: string
  city: string
  rate: number
  is_active: boolean
  estimated_days: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  customer_name: string
  customer_email: string | null
  customer_phone: string
  shipping_address_id: string | null
  shipping_city: string
  shipping_district: string | null
  shipping_address: string
  shipping_cost: number
  subtotal: number
  total: number
  status: OrderStatus
  payment_method: PaymentMethod
  tracking_number: string | null
  estimated_delivery: string | null
  delivered_at: string | null
  customer_notes: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
  user?: Profile
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_sku: string
  product_image: string | null
  size: string
  quantity: number
  price: number
  subtotal: number
  created_at: string
  product?: Product
}

export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  size: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface SiteSetting {
  id: string
  key: string
  value: any
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  title: string
  description: string | null
  banner_image: string | null
  discount_percentage: number | null
  is_active: boolean
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

// Form types
export interface CheckoutFormData {
  customer_name: string
  customer_email?: string
  customer_phone: string
  shipping_city: string
  shipping_district?: string
  shipping_address: string
  customer_notes?: string
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  inStock?: boolean
  search?: string
}

// Cart item for local storage
export interface LocalCartItem {
  product_id: string
  product_name: string
  product_image: string
  size: string
  quantity: number
  price: number
}

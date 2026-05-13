import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'

// Cache'lemeyi devre dışı bırak
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }
    
    const user = await getUserFromToken(token)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    // Tüm siparişleri kullanıcı bilgisi ile getir
    const orders = await query(`
      SELECT 
        o.id,
        o.user_id,
        o.order_number,
        o.shipping_address_id,
        o.payment_method,
        o.subtotal,
        o.shipping_cost,
        o.total,
        o.status,
        o.notes,
        o.created_at,
        o.updated_at,
        u.full_name as customer_name,
        u.email as customer_email,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id COLLATE utf8mb4_unicode_ci = u.id COLLATE utf8mb4_unicode_ci
      LEFT JOIN order_items oi ON o.id COLLATE utf8mb4_unicode_ci = oi.order_id COLLATE utf8mb4_unicode_ci
      GROUP BY o.id, o.user_id, o.order_number, o.shipping_address_id, o.payment_method, o.subtotal, o.shipping_cost, o.total, o.status, o.notes, o.created_at, o.updated_at, u.full_name, u.email
      ORDER BY o.created_at DESC
    `)

    // Numeric alanları parse et
    const formattedOrders = orders.map((order: any) => ({
      ...order,
      subtotal: parseFloat(order.subtotal || '0') || 0,
      shipping_cost: parseFloat(order.shipping_cost || '0') || 0,
      total: parseFloat(order.total || '0') || 0,
      item_count: parseInt(order.item_count || '0') || 0
    }))

    const response = NextResponse.json({
      success: true,
      data: formattedOrders
    })
    
    // Cache'lemeyi önle
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Admin Orders Error:', error)
    return NextResponse.json(
      { success: false, error: 'Siparişler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// PATCH - Sipariş durumunu güncelle
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }
    
    const user = await getUserFromToken(token)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const { order_id, status } = await request.json()
    
    if (!order_id || !status) {
      return NextResponse.json(
        { success: false, error: 'Sipariş ID ve durum gerekli' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz durum' },
        { status: 400 }
      )
    }

    await query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, order_id]
    )

    return NextResponse.json({
      success: true,
      message: 'Sipariş durumu güncellendi'
    })
  } catch (error) {
    console.error('Update Order Status Error:', error)
    return NextResponse.json(
      { success: false, error: 'Sipariş durumu güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

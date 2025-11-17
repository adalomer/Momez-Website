import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'

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
        o.*,
        u.full_name as customer_name,
        u.email as customer_email,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `)

    return NextResponse.json({
      success: true,
      data: orders
    })
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

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
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

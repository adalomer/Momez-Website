import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'
import { db } from '@/lib/db/mysql'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Sipariş detayını getir
    const orderQuery = `
      SELECT 
        o.*,
        u.full_name as customer_name,
        u.email as customer_email,
        a.title as address_title,
        a.full_name as shipping_full_name,
        a.phone as shipping_phone,
        a.city,
        a.district,
        a.address_line1 as address_line,
        a.postal_code
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN addresses a ON o.address_id = a.id
      WHERE o.id = ?
    `
    
    const orders = await query(orderQuery, [id])
    
    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }
    
    const order = orders[0]
    
    // Sipariş kalemlerini getir
    const items = await db.findMany('order_items', { order_id: id })
    
    // Numeric alanları parse et
    const formattedOrder = {
      ...order,
      subtotal: parseFloat(order.subtotal || '0') || 0,
      shipping_cost: parseFloat(order.shipping_cost || '0') || 0,
      total: parseFloat(order.total || '0') || 0,
      items: items.map((item: any) => ({
        ...item,
        price: parseFloat(item.price || '0') || 0,
        quantity: parseInt(item.quantity || '0') || 0
      }))
    }

    return NextResponse.json({
      success: true,
      data: formattedOrder
    })
  } catch (error) {
    console.error('Admin Order Detail Error:', error)
    return NextResponse.json(
      { success: false, error: 'Sipariş detayı alınamadı' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/orders/[id] - Siparişi sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Önce sipariş kalemlerini sil
    await query('DELETE FROM order_items WHERE order_id = ?', [id])
    
    // Siparişi sil
    await query('DELETE FROM orders WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Sipariş silindi'
    })
  } catch (error) {
    console.error('Delete Order Error:', error)
    return NextResponse.json(
      { success: false, error: 'Sipariş silinirken hata oluştu' },
      { status: 500 }
    )
  }
}

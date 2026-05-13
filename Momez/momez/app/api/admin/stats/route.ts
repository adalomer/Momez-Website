import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Auth kontrolü
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
        { success: false, error: 'Admin yetkisi gerekli' },
        { status: 403 }
      )
    }

    // İstatistikler
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers
    ] = await Promise.all([
      // Toplam sipariş sayısı
      query('SELECT COUNT(*) as count FROM orders'),
      // Toplam gelir
      query('SELECT SUM(total) as total FROM orders WHERE status != "cancelled"'),
      // Toplam ürün sayısı
      query('SELECT COUNT(*) as count FROM products WHERE is_active = 1'),
      // Toplam müşteri sayısı
      query('SELECT COUNT(*) as count FROM users WHERE role = "customer"')
    ])

    // Son siparişler (son 10)
    const recentOrdersRaw = await query(`
      SELECT 
        o.id,
        o.order_number,
        o.total,
        o.status,
        o.created_at,
        u.full_name as customer_name,
        u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id COLLATE utf8mb4_unicode_ci = u.id COLLATE utf8mb4_unicode_ci
      ORDER BY o.created_at DESC
      LIMIT 10
    `)
    
    const recentOrders = recentOrdersRaw.map((order: any) => ({
      ...order,
      total: parseFloat(order.total)
    }))

    // Düşük stoklu ürünler (stok < 10)
    const lowStockProducts = await query(`
      SELECT 
        p.id,
        p.name,
        ps.size,
        ps.quantity as stock
      FROM product_stock ps
      JOIN products p ON ps.product_id COLLATE utf8mb4_unicode_ci = p.id COLLATE utf8mb4_unicode_ci
      WHERE ps.quantity < 10 AND ps.quantity > 0 AND p.is_active = 1
      ORDER BY ps.quantity ASC
      LIMIT 10
    `)

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalOrders: totalOrders[0]?.count || 0,
          totalRevenue: parseFloat(totalRevenue[0]?.total || '0'),
          totalProducts: totalProducts[0]?.count || 0,
          totalCustomers: totalCustomers[0]?.count || 0
        },
        recentOrders,
        lowStockProducts
      }
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { success: false, error: 'İstatistikler alınamadı' },
      { status: 500 }
    )
  }
}

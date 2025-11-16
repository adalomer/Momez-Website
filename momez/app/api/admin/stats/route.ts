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
      query('SELECT SUM(total_amount) as total FROM orders WHERE status != "cancelled"'),
      // Toplam ürün sayısı
      query('SELECT COUNT(*) as count FROM products WHERE is_active = 1'),
      // Toplam müşteri sayısı
      query('SELECT COUNT(*) as count FROM users WHERE role = "customer"')
    ])

    // Son siparişler (son 10)
    const recentOrders = await query(`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.created_at,
        u.full_name as customer_name,
        u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `)

    // Düşük stoklu ürünler (stok < 10)
    const lowStockProducts = await query(`
      SELECT 
        p.id,
        p.name,
        ps.size,
        ps.stock
      FROM product_sizes ps
      JOIN products p ON ps.product_id = p.id
      WHERE ps.stock < 10 AND ps.stock > 0
      ORDER BY ps.stock ASC
      LIMIT 10
    `)

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalOrders: totalOrders[0]?.count || 0,
          totalRevenue: totalRevenue[0]?.total || 0,
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

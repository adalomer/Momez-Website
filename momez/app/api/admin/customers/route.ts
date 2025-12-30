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

    const customers = await query(
      `SELECT id, full_name, email, phone, role, created_at 
       FROM users 
       WHERE role = 'customer'
       ORDER BY created_at DESC`
    )

    const response = NextResponse.json({
      success: true,
      data: customers
    })
    
    // Cache'lemeyi önle
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Müşteriler yüklenirken hata:', error)
    return NextResponse.json(
      { success: false, error: 'Müşteriler yüklenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Müşteri sil
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('id')
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Müşteri ID gerekli' },
        { status: 400 }
      )
    }

    // Admin kendini silemesin
    if (customerId === user.id) {
      return NextResponse.json(
        { success: false, error: 'Kendinizi silemezsiniz' },
        { status: 400 }
      )
    }

    // Önce müşterinin siparişlerini, sepetini, favorilerini ve adreslerini sil
    await query('DELETE FROM cart_items WHERE user_id = ?', [customerId])
    await query('DELETE FROM favorites WHERE user_id = ?', [customerId])
    await query('DELETE FROM addresses WHERE user_id = ?', [customerId])
    
    // Siparişleri sil (order_items cascade ile silinecek)
    await query('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = ?)', [customerId])
    await query('DELETE FROM orders WHERE user_id = ?', [customerId])
    
    // Kullanıcıyı sil
    await query('DELETE FROM users WHERE id = ?', [customerId])

    return NextResponse.json({
      success: true,
      message: 'Müşteri başarıyla silindi'
    })
  } catch (error) {
    console.error('Müşteri silinirken hata:', error)
    return NextResponse.json(
      { success: false, error: 'Müşteri silinemedi' },
      { status: 500 }
    )
  }
}

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

    const customers = await query(
      `SELECT id, full_name, email, phone, role, created_at 
       FROM users 
       WHERE role = 'customer'
       ORDER BY created_at DESC`
    )

    return NextResponse.json({
      success: true,
      data: customers
    })
  } catch (error) {
    console.error('Müşteriler yüklenirken hata:', error)
    return NextResponse.json(
      { success: false, error: 'Müşteriler yüklenemedi' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'

export async function PUT(
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
        { success: false, error: 'Admin yetkisi gerekli' },
        { status: 403 }
      )
    }

    const { full_name, email, phone } = await request.json()

    if (!full_name || !email) {
      return NextResponse.json(
        { success: false, error: 'İsim ve email gerekli' },
        { status: 400 }
      )
    }

    // Email başka kullanıcıda var mı kontrol et
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    )

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Bu email zaten kullanılıyor' },
        { status: 400 }
      )
    }

    await query(
      'UPDATE users SET full_name = ?, email = ?, phone = ? WHERE id = ?',
      [full_name, email, phone || null, id]
    )

    return NextResponse.json({
      success: true,
      message: 'Müşteri bilgileri güncellendi'
    })
  } catch (error) {
    console.error('Update customer error:', error)
    return NextResponse.json(
      { success: false, error: 'Güncelleme başarısız' },
      { status: 500 }
    )
  }
}

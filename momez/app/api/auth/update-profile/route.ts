import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { query } from '@/lib/db/mysql'

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      )
    }

    // Get user from token
    const user = await getUserFromToken(token)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()
    const { full_name, phone } = body

    // Validate
    if (!full_name || full_name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Ad soyad gerekli' },
        { status: 400 }
      )
    }

    // Update user
    await query(
      'UPDATE users SET full_name = ?, phone = ? WHERE id = ?',
      [full_name.trim(), phone || null, user.id]
    )

    return NextResponse.json({
      success: true,
      message: 'Profil güncellendi'
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { success: false, error: 'Profil güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

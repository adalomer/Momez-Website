import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapılmamış' },
        { status: 401 }
      )
    }

    const user = await getUserFromToken(token)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Me API error:', error)
    return NextResponse.json(
      { success: false, error: 'Kullanıcı bilgisi alınamadı' },
      { status: 500 }
    )
  }
}

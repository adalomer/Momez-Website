import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'

// Bu endpoint'in cache'lenmemesini sağla
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json()

    // Validasyon
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, şifre ve isim gerekli' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      )
    }

    // Kullanıcı kaydı (full_name parametresi)
    const result = await registerUser(email, password, name, phone)

    if ('error' in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // Cookie'ye token kaydet
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Kayıt başarılı'
    })

    response.cookies.set('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: '/'
    })

    // Cache'lemeyi önle
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Register API error:', error)
    return NextResponse.json(
      { success: false, error: 'Kayıt sırasında hata oluştu' },
      { status: 500 }
    )
  }
}

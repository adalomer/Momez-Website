import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validasyon
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email ve şifre gerekli' },
        { status: 400 }
      )
    }

    // Giriş yap
    const result = await loginUser(email, password)

    if ('error' in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      )
    }

    // Cookie'ye token kaydet
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Giriş başarılı'
    })

    response.cookies.set('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 gün
    })

    return response
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, error: 'Giriş sırasında hata oluştu' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

// Bu endpoint'in cache'lenmemesini sağla
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
      data: {
        user: result.user
      },
      message: 'Giriş başarılı'
    })

    response.cookies.set('auth_token', result.token, {
      httpOnly: true,
      secure: true, // HTTPS için her zaman true
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.momez.co' : undefined
    })

    // Cache'lemeyi önle
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, error: 'Giriş sırasında hata oluştu' },
      { status: 500 }
    )
  }
}

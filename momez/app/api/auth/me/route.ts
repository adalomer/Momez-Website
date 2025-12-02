import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'

// Bu endpoint'in cache'lenmemesini sağla
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      const response = NextResponse.json(
        { success: false, error: 'Giriş yapılmamış' },
        { status: 401 }
      )
      // Cache'lemeyi önle
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      return response
    }

    const user = await getUserFromToken(token)

    if (!user) {
      const response = NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      )
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
      return response
    }

    const response = NextResponse.json({
      success: true,
      data: { user }
    })
    
    // Cache'lemeyi önle
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Me API error:', error)
    const response = NextResponse.json(
      { success: false, error: 'Kullanıcı bilgisi alınamadı' },
      { status: 500 }
    )
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    return response
  }
}

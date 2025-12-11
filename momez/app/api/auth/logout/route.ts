import { NextResponse } from 'next/server'

// Bu endpoint'in cache'lenmemesini sağla
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Çıkış başarılı'
  })

  // Cookie'yi sil - path belirterek tüm sitedan sil
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: true, // HTTPS için her zaman true
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.momez.co' : undefined,
    expires: new Date(0)
  })

  // Cache'lemeyi önle
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')

  return response
}

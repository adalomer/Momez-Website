import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Admin sayfaları için auth kontrolü
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      // Login sayfasına yönlendir
      return NextResponse.redirect(new URL('/auth/login?redirect=/admin', request.url))
    }
    
    // Token'ı kontrol et (basit kontrol, production'da JWT verify yap)
    try {
      // Burada gerçek JWT verify yapılmalı
      // Şimdilik cookie varlığı yeterli
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }
  
  // Profil sayfaları için auth kontrolü
  if (pathname.startsWith('/profil')) {
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/profil/:path*']
}

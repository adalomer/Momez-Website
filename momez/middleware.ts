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
    
    // Token varlığını kontrol et (gerçek doğrulama sayfa seviyesinde yapılacak)
    return NextResponse.next()
  }
  
  // Profil sayfaları için auth kontrolü
  if (pathname.startsWith('/profil')) {
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login?redirect=' + pathname, request.url))
    }
    
    // Token varlığını kontrol et (gerçek doğrulama sayfa seviyesinde yapılacak)
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/profil/:path*']
}

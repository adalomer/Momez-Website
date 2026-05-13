import { NextResponse, type NextRequest } from 'next/server'

// Basit in-memory rate limiter (production için Redis önerilir)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function rateLimit(ip: string, key: string, limit: number = 100, windowMs: number = 60000): boolean {
	const now = Date.now()
	const mapKey = `${ip}:${key}`
	const record = rateLimitMap.get(mapKey)

	if (!record || now > record.resetTime) {
		rateLimitMap.set(mapKey, { count: 1, resetTime: now + windowMs })
		return true
	}

	if (record.count >= limit) {
		return false
	}

	record.count++
	return true
}

// Her 5 dakikada bir eski kayıtları temizle
if (typeof setInterval !== 'undefined') {
	setInterval(() => {
		const now = Date.now()
		for (const [key, record] of rateLimitMap.entries()) {
			if (now > record.resetTime) {
				rateLimitMap.delete(key)
			}
		}
	}, 300000)
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		request.headers.get('x-real-ip') ||
		'unknown'

	// API istekleri için rate limiting
	if (pathname.startsWith('/api/')) {
		// Bu endpoint'ler rate limit dışında (sık çağrılıyorlar)
		const exemptPaths = ['/api/auth/me', '/api/cart', '/api/favorites', '/api/categories', '/api/products']
		const isExempt = exemptPaths.some(path => pathname.startsWith(path))

		if (!isExempt) {
			// Login/register için brute force koruması
			if (pathname.includes('/auth/login') || pathname.includes('/auth/register')) {
				if (!rateLimit(ip, 'auth', 20, 60000)) { // Dakikada 20 istek
					return NextResponse.json(
						{ success: false, error: 'Too many requests. Please wait 1 minute.' },
						{ status: 429 }
					)
				}
			} else {
				// Diğer API'ler için normal limit
				if (!rateLimit(ip, 'api', 200, 60000)) { // Dakikada 200 istek
					return NextResponse.json(
						{ success: false, error: 'Too many requests. Please wait a moment.' },
						{ status: 429 }
					)
				}
			}
		}
	}

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

	// Güvenlik başlıkları ekle
	const response = NextResponse.next()

	// Clickjacking koruması
	response.headers.set('X-Frame-Options', 'SAMEORIGIN')

	// XSS koruması
	response.headers.set('X-Content-Type-Options', 'nosniff')
	response.headers.set('X-XSS-Protection', '1; mode=block')

	// Referrer politikası
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

	return response
}

export const config = {
	matcher: [
		'/admin/:path*',
		'/profil/:path*',
		'/api/:path*',
		'/((?!_next/static|_next/image|favicon.ico).*)',
	]
}

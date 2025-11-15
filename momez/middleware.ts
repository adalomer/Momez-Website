import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip Supabase check if URL is not configured (for local development without Supabase)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  // Supabase yapılandırılmamışsa tüm sayfalara izin ver (demo mod)
  if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
    return NextResponse.next()
  }
  
  // Supabase yapılandırılmışsa auth kontrolü yap
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

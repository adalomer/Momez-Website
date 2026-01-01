import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'

// GET - Ayarları getir
export async function GET(request: NextRequest) {
  try {
    const settings = await query('SELECT setting_key, setting_value, setting_type FROM site_settings')
    
    // Key-value formatına çevir
    const settingsMap: Record<string, any> = {}
    for (const s of settings as any[]) {
      settingsMap[s.setting_key] = s.setting_value
    }

    return NextResponse.json({
      success: true,
      data: settingsMap
    })
  } catch (error) {
    console.error('Settings GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Ayarlar yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}// POST - Ayarları kaydet (Admin)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }
    
    const user = await getUserFromToken(token)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const settings = await request.json()
    
    // Her ayarı güncelle veya ekle
    for (const [key, value] of Object.entries(settings)) {
      await query(
        `INSERT INTO site_settings (id, setting_key, setting_value, setting_type, created_at, updated_at) 
         VALUES (UUID(), ?, ?, 'string', NOW(), NOW()) 
         ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = NOW()`,
        [key, value, value]
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Ayarlar kaydedildi'
    })
  } catch (error) {
    console.error('Settings POST Error:', error)
    return NextResponse.json(
      { success: false, error: 'Ayarlar kaydedilirken hata oluştu' },
      { status: 500 }
    )
  }
}

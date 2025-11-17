import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'

// GET - Tüm kampanyaları listele
export async function GET(request: NextRequest) {
  try {
    const campaigns = await query(
      `SELECT * FROM campaigns WHERE is_active = 1 ORDER BY created_at DESC`
    )

    return NextResponse.json({
      success: true,
      data: campaigns
    })
  } catch (error) {
    console.error('Campaigns Error:', error)
    return NextResponse.json(
      { success: false, error: 'Kampanyalar yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST - Yeni kampanya ekle (Admin)
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

    const { title, description, image_url, discount_type, discount_value, start_date, end_date } = await request.json()
    
    if (!title || !discount_value || !start_date || !end_date) {
      return NextResponse.json(
        { success: false, error: 'Eksik bilgi' },
        { status: 400 }
      )
    }

    // Slug oluştur
    const slug = title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // UUID oluştur
    const crypto = require('crypto')
    const id = crypto.randomUUID()

    await query(
      `INSERT INTO campaigns (id, title, slug, description, image_url, discount_type, discount_value, start_date, end_date, is_active, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [id, title, slug, description || null, image_url || null, discount_type || 'percentage', discount_value, start_date, end_date, true]
    )

    const newCampaign = await query('SELECT * FROM campaigns WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      data: newCampaign[0],
      message: 'Kampanya oluşturuldu'
    })
  } catch (error: any) {
    console.error('Create Campaign Error:', error)
    
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, error: 'Bu isimde bir kampanya zaten var' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Kampanya oluşturulurken hata: ' + error.message },
      { status: 500 }
    )
  }
}

// DELETE - Kampanya sil (Admin)
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Kampanya ID gerekli' },
        { status: 400 }
      )
    }

    await query('DELETE FROM campaigns WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Kampanya silindi'
    })
  } catch (error) {
    console.error('Delete Campaign Error:', error)
    return NextResponse.json(
      { success: false, error: 'Kampanya silinirken hata oluştu' },
      { status: 500 }
    )
  }
}

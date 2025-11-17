import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'

// Adresleri getir
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Giriş yapmalısınız' },
        { status: 401 }
      )
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz token' },
        { status: 401 }
      )
    }

    const addresses = await query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [user.id]
    )

    return NextResponse.json({
      success: true,
      data: addresses,
    })
  } catch (error) {
    console.error('Addresses get error:', error)
    return NextResponse.json(
      { success: false, message: 'Adresler alınırken hata oluştu' },
      { status: 500 }
    )
  }
}

// Yeni adres ekle
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Giriş yapmalısınız' },
        { status: 401 }
      )
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, full_name, phone, address, city, district, postal_code, is_default } = body

    if (!title || !full_name || !phone || !address || !city) {
      return NextResponse.json(
        { success: false, message: 'Tüm zorunlu alanları doldurun' },
        { status: 400 }
      )
    }

    // Eğer varsayılan adres yapılıyorsa, diğer adresleri güncelle
    if (is_default) {
      await query(
        'UPDATE addresses SET is_default = 0 WHERE user_id = ?',
        [user.id]
      )
    }

    const result: any = await query(
      `INSERT INTO addresses 
      (user_id, title, full_name, phone, address, city, district, postal_code, is_default) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, title, full_name, phone, address, city, district || null, postal_code || null, is_default ? 1 : 0]
    )

    return NextResponse.json({
      success: true,
      message: 'Adres eklendi',
      data: { id: result.insertId },
    })
  } catch (error) {
    console.error('Address create error:', error)
    return NextResponse.json(
      { success: false, message: 'Adres eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

// GET /api/addresses - Kullanıcının adreslerini getir
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapılmamış' },
        { status: 401 }
      )
    }
    
    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      )
    }
    
    const addresses = await db.findMany('user_addresses', 
      { user_id: user.id },
      { orderBy: 'is_default DESC, created_at DESC' }
    )
    
    return NextResponse.json({
      success: true,
      data: addresses
    })
  } catch (error) {
    console.error('Addresses GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Adresler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST /api/addresses - Yeni adres ekle
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapılmamış' },
        { status: 401 }
      )
    }
    
    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      )
    }
    
    const { title, full_name, phone, city, district, address_line, postal_code, is_default } = await request.json()
    
    // Eğer bu adres varsayılan olarak işaretlendiyse, diğerlerini varsayılandan çıkar
    if (is_default) {
      await db.query(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [user.id]
      )
    }
    
    const addressId = uuidv4()
    await db.query(
      `INSERT INTO user_addresses 
        (id, user_id, title, full_name, phone, city, district, address_line, postal_code, is_default) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [addressId, user.id, title, full_name, phone, city, district, address_line, postal_code || null, is_default || false]
    )
    
    const newAddress = await db.findOne('user_addresses', { id: addressId })
    
    return NextResponse.json({
      success: true,
      data: newAddress,
      message: 'Adres başarıyla eklendi'
    })
  } catch (error) {
    console.error('Address POST Error:', error)
    return NextResponse.json(
      { success: false, error: 'Adres eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT /api/addresses - Adres güncelle
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapılmamış' },
        { status: 401 }
      )
    }
    
    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      )
    }
    
    const { id, title, full_name, phone, city, district, address_line, postal_code, is_default } = await request.json()
    
    // Bu adres bu kullanıcıya ait mi kontrol et
    const address = await db.findOne('user_addresses', { id, user_id: user.id })
    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Adres bulunamadı' },
        { status: 404 }
      )
    }
    
    // Eğer bu adres varsayılan olarak işaretlendiyse, diğerlerini varsayılandan çıkar
    if (is_default) {
      await db.query(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
        [user.id, id]
      )
    }
    
    await db.update(
      'user_addresses',
      { title, full_name, phone, city, district, address_line, postal_code, is_default },
      { id }
    )
    
    const updatedAddress = await db.findOne('user_addresses', { id })
    
    return NextResponse.json({
      success: true,
      data: updatedAddress,
      message: 'Adres başarıyla güncellendi'
    })
  } catch (error) {
    console.error('Address PUT Error:', error)
    return NextResponse.json(
      { success: false, error: 'Adres güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE /api/addresses - Adres sil
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapılmamış' },
        { status: 401 }
      )
    }
    
    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz token' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('id')
    
    if (!addressId) {
      return NextResponse.json(
        { success: false, error: 'Adres ID gerekli' },
        { status: 400 }
      )
    }
    
    // Bu adres bu kullanıcıya ait mi kontrol et
    const address = await db.findOne('user_addresses', { id: addressId, user_id: user.id })
    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Adres bulunamadı' },
        { status: 404 }
      )
    }
    
    await db.delete('user_addresses', { id: addressId })
    
    return NextResponse.json({
      success: true,
      message: 'Adres başarıyla silindi'
    })
  } catch (error) {
    console.error('Address DELETE Error:', error)
    return NextResponse.json(
      { success: false, error: 'Adres silinirken hata oluştu' },
      { status: 500 }
    )
  }
}

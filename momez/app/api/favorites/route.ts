import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'

// GET /api/favorites - Favorileri getir
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
    
    // Favorileri JOIN ile getir
    const favoritesQuery = `
      SELECT 
        f.id,
        f.user_id,
        f.product_id,
        f.added_at,
        p.name,
        p.slug,
        p.price,
        p.discount_price,
        p.is_active,
        pi.image_url
      FROM favorites f
      INNER JOIN products p ON f.product_id COLLATE utf8mb4_unicode_ci = p.id COLLATE utf8mb4_unicode_ci
      LEFT JOIN (
        SELECT product_id, image_url, ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY display_order) as rn
        FROM product_images
      ) pi ON f.product_id COLLATE utf8mb4_unicode_ci = pi.product_id COLLATE utf8mb4_unicode_ci AND pi.rn = 1
      WHERE f.user_id = ?
      ORDER BY f.added_at DESC
    `
    
    const favorites = await db.query(favoritesQuery, [user.id])
    
    return NextResponse.json({
      success: true,
      data: favorites
    })
  } catch (error) {
    console.error('Favorites GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Favoriler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Favorilere ekle
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
    
    const { product_id } = await request.json()
    
    // Zaten favorilerde mi?
    const existing = await db.findOne('favorites', {
      user_id: user.id,
      product_id
    })
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ürün zaten favorilerde' },
        { status: 400 }
      )
    }
    
    await db.insert('favorites', {
      user_id: user.id,
      product_id
    })
    
    return NextResponse.json({
      success: true,
      message: 'Favorilere eklendi'
    })
  } catch (error) {
    console.error('Favorites POST Error:', error)
    return NextResponse.json(
      { success: false, error: 'Eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - Favorilerden çıkar
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
    const productId = searchParams.get('product_id')
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Ürün ID gerekli' },
        { status: 400 }
      )
    }
    
    await db.delete('favorites', {
      user_id: user.id,
      product_id: productId
    })
    
    return NextResponse.json({
      success: true,
      message: 'Favorilerden çıkarıldı'
    })
  } catch (error) {
    console.error('Favorites DELETE Error:', error)
    return NextResponse.json(
      { success: false, error: 'Çıkarılırken hata oluştu' },
      { status: 500 }
    )
  }
}

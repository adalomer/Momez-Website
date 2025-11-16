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
    
    const favorites = await db.findMany('favorites', { user_id: user.id })
    
    // Her ürün için detay bilgisi
    const favoritesWithDetails = await Promise.all(
      favorites.map(async (fav: any) => {
        const product = await db.findOne('products', { id: fav.product_id })
        const images = await db.findMany('product_images',
          { product_id: fav.product_id },
          { orderBy: 'display_order ASC', limit: 1 }
        )
        
        return {
          ...fav,
          product,
          image: images[0] || null
        }
      })
    )
    
    return NextResponse.json({
      success: true,
      data: favoritesWithDetails
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
      product_id,
      added_at: new Date()
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
      product_id: parseInt(productId)
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

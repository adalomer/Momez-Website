import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'

// GET /api/cart - Sepeti getir
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
    
    // Sepet ürünlerini getir
    const cartItems = await db.findMany('cart_items', { user_id: user.id })
    
    // Her ürün için detay bilgisi ekle
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item: any) => {
        const product = await db.findOne('products', { id: item.product_id })
        const images = await db.findMany('product_images', 
          { product_id: item.product_id },
          { orderBy: 'display_order ASC', limit: 1 }
        )
        
        return {
          ...item,
          product,
          image: images[0] || null
        }
      })
    )
    
    return NextResponse.json({
      success: true,
      data: itemsWithDetails
    })
  } catch (error) {
    console.error('Cart GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Sepet yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Sepete ürün ekle
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
    
    const { product_id, size, quantity } = await request.json()
    
    // Ürün var mı kontrol et
    const product = await db.findOne('products', { id: product_id })
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }
    
    // Stok kontrolü
    const stock = await db.findOne('product_stock', { 
      product_id, 
      size 
    })
    
    if (!stock || (stock as any).quantity < quantity) {
      return NextResponse.json(
        { success: false, error: 'Yeterli stok yok' },
        { status: 400 }
      )
    }
    
    // Sepette zaten var mı?
    const existing = await db.findOne('cart_items', {
      user_id: user.id,
      product_id,
      size
    })
    
    if (existing) {
      // Miktarı güncelle
      await db.update(
        'cart_items',
        { quantity: (existing as any).quantity + quantity },
        { id: (existing as any).id }
      )
    } else {
      // Yeni ekle
      await db.insert('cart_items', {
        user_id: user.id,
        product_id,
        size,
        quantity,
        added_at: new Date()
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Ürün sepete eklendi'
    })
  } catch (error) {
    console.error('Cart POST Error:', error)
    return NextResponse.json(
      { success: false, error: 'Ürün eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Sepetten ürün çıkar
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
    const itemId = searchParams.get('id')
    
    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Ürün ID gerekli' },
        { status: 400 }
      )
    }
    
    await db.delete('cart_items', {
      id: parseInt(itemId),
      user_id: user.id
    })
    
    return NextResponse.json({
      success: true,
      message: 'Ürün sepetten çıkarıldı'
    })
  } catch (error) {
    console.error('Cart DELETE Error:', error)
    return NextResponse.json(
      { success: false, error: 'Ürün çıkarılırken hata oluştu' },
      { status: 500 }
    )
  }
}

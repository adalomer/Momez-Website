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
    
    // Sepet ürünlerini getir (JOIN ile)
    const query = `
      SELECT 
        ci.id,
        ci.product_id,
        ci.size,
        ci.quantity,
        p.name as product_name,
        p.slug as product_slug,
        p.price,
        p.discount_price,
        ps.quantity as stock,
        pi.image_url
      FROM cart_items ci
      INNER JOIN products p ON ci.product_id COLLATE utf8mb4_unicode_ci = p.id COLLATE utf8mb4_unicode_ci
      LEFT JOIN product_stock ps ON ci.product_id COLLATE utf8mb4_unicode_ci = ps.product_id COLLATE utf8mb4_unicode_ci AND ci.size = ps.size
      LEFT JOIN (
        SELECT product_id, image_url, 
               ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY display_order) as rn
        FROM product_images
      ) pi ON ci.product_id COLLATE utf8mb4_unicode_ci = pi.product_id COLLATE utf8mb4_unicode_ci AND pi.rn = 1
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `
    
    const cartItems = await db.query(query, [user.id])
    
    // Fiyat hesapla (indirimli varsa onu kullan)
    const formattedItems = cartItems.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_slug: item.product_slug,
      size: item.size,
      quantity: item.quantity,
      price: item.discount_price || item.price,
      image_url: item.image_url || '/placeholder.jpg',
      stock: item.stock || 0
    }))
    
    return NextResponse.json({
      success: true,
      data: formattedItems
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
        quantity
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
    
    // Önce bu item gerçekten bu kullanıcıya ait mi kontrol et
    const item = await db.findOne('cart_items', { id: itemId })
    if (!item || (item as any).user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }
    
    await db.delete('cart_items', { id: itemId })
    
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

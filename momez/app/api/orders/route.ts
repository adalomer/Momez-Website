import { NextRequest, NextResponse } from 'next/server'
import { db, transaction } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'

// GET /api/orders - Siparişleri listele
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
    
    // Kullanıcının siparişleri
    const orders = await db.findMany('orders', 
      { user_id: user.id },
      { orderBy: 'created_at DESC' }
    )
    
    // Her sipariş için ürün detayları
    const ordersWithItems = await Promise.all(
      orders.map(async (order: any) => {
        const items = await db.findMany('order_items', { order_id: order.id })
        
        const itemsWithProducts = await Promise.all(
          items.map(async (item: any) => {
            const product = await db.findOne('products', { id: item.product_id })
            return { ...item, product }
          })
        )
        
        return { ...order, items: itemsWithProducts }
      })
    )
    
    return NextResponse.json({
      success: true,
      data: ordersWithItems
    })
  } catch (error) {
    console.error('Orders GET Error:', error)
    return NextResponse.json(
      { success: false, error: 'Siparişler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Yeni sipariş oluştur
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
    
    const { address_id, payment_method, items } = await request.json()
    
    if (!address_id || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Adres ve ürünler gerekli' },
        { status: 400 }
      )
    }
    
    // Transaction içinde sipariş oluştur
    const result = await transaction(async (conn) => {
      // Toplam tutarı hesapla
      let totalAmount = 0
      for (const item of items) {
        const product = await db.findOne('products', { id: item.product_id })
        if (!product) {
          throw new Error(`Ürün bulunamadı: ${item.product_id}`)
        }
        totalAmount += (product as any).price * item.quantity
      }
      
      // Sipariş numarası oluştur
      const orderNumber = `ORD-${Date.now()}`
      
      // Sipariş oluştur
      const order = await db.insert<any>('orders', {
        user_id: user.id,
        order_number: orderNumber,
        address_id,
        total_amount: totalAmount,
        status: 'pending',
        payment_method: payment_method || 'credit_card',
        payment_status: 'pending',
        created_at: new Date()
      })
      
      if (!order) {
        throw new Error('Sipariş oluşturulamadı')
      }
      
      // Sipariş ürünlerini ekle
      for (const item of items) {
        const product = await db.findOne('products', { id: item.product_id })
        
        await db.insert('order_items', {
          order_id: order.id,
          product_id: item.product_id,
          size: item.size,
          quantity: item.quantity,
          price: (product as any).price
        })
        
        // Stoktan düş
        const stock = await db.findOne('product_stock', {
          product_id: item.product_id,
          size: item.size
        })
        
        if (stock) {
          await db.update(
            'product_stock',
            { quantity: (stock as any).quantity - item.quantity },
            { 
              product_id: item.product_id,
              size: item.size
            }
          )
        }
      }
      
      // Sepeti temizle
      await conn.execute(
        'DELETE FROM cart_items WHERE user_id = ?',
        [user.id]
      )
      
      return order
    })
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Sipariş oluşturuldu'
    })
  } catch (error) {
    console.error('Create Order Error:', error)
    return NextResponse.json(
      { success: false, error: 'Sipariş oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}

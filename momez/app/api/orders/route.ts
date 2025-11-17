import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

// GET /api/orders - Kullanıcının siparişlerini getir
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
    
    // Siparişleri getir
    const ordersQuery = `
      SELECT 
        o.*,
        a.title as address_title,
        a.full_name,
        a.phone,
        a.city,
        a.district
      FROM orders o
      LEFT JOIN user_addresses a ON o.address_id COLLATE utf8mb4_unicode_ci = a.id COLLATE utf8mb4_unicode_ci
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `
    
    const orders = await db.query(ordersQuery, [user.id])
    
    // Her sipariş için kalemleri getir
    const ordersWithItems = await Promise.all(
      orders.map(async (order: any) => {
        // Sipariş kalemlerini resimle birlikte getir
        const itemsQuery = `
          SELECT 
            oi.*,
            pi.image_url
          FROM order_items oi
          LEFT JOIN (
            SELECT product_id, image_url, ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY display_order) as rn
            FROM product_images
          ) pi ON oi.product_id COLLATE utf8mb4_unicode_ci = pi.product_id COLLATE utf8mb4_unicode_ci AND pi.rn = 1
          WHERE oi.order_id = ?
        `
        const items = await db.query(itemsQuery, [order.id])
        
        return {
          ...order,
          subtotal: parseFloat(order.subtotal),
          shipping_cost: parseFloat(order.shipping_cost),
          total: parseFloat(order.total),
          items: items.map((item: any) => ({
            ...item,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity)
          }))
        }
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
    
    const { address_id, payment_method, notes } = await request.json()
    
    if (!address_id || !payment_method) {
      return NextResponse.json(
        { success: false, error: 'Adres ve ödeme yöntemi gerekli' },
        { status: 400 }
      )
    }
    
    // Sepetteki ürünleri al
    const cartQuery = `
      SELECT 
        ci.id,
        ci.product_id,
        ci.size,
        ci.quantity,
        p.name as product_name,
        p.price,
        p.discount_price,
        ps.quantity as stock
      FROM cart_items ci
      INNER JOIN products p ON ci.product_id COLLATE utf8mb4_unicode_ci = p.id COLLATE utf8mb4_unicode_ci
      LEFT JOIN product_stock ps ON ci.product_id COLLATE utf8mb4_unicode_ci = ps.product_id COLLATE utf8mb4_unicode_ci AND ci.size = ps.size
      WHERE ci.user_id = ?
    `
    
    const cartItems = await db.query(cartQuery, [user.id])
    
    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Sepetiniz boş' },
        { status: 400 }
      )
    }
    
    // Stok kontrolü
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `${item.product_name} için yeterli stok yok` },
          { status: 400 }
        )
      }
    }
    
    // Toplam hesapla
    const subtotal = cartItems.reduce((sum: number, item: any) => {
      const price = item.discount_price || item.price
      return sum + (price * item.quantity)
    }, 0)
    
    const shipping_cost = subtotal >= 500 ? 0 : 50
    const total = subtotal + shipping_cost
    
    // Sipariş numarası oluştur (OR-20241117-XXXX formatında)
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const order_number = `OR-${dateStr}-${randomNum}`
    
    // Sipariş oluştur
    const orderId = uuidv4()
    await db.query(
      `INSERT INTO orders 
        (id, user_id, order_number, address_id, payment_method, subtotal, shipping_cost, total, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [orderId, user.id, order_number, address_id, payment_method, parseFloat(subtotal.toFixed(2)), parseFloat(shipping_cost.toFixed(2)), parseFloat(total.toFixed(2)), notes || null]
    )
    
    // Sipariş detaylarını ekle ve stoktan düş
    for (const item of cartItems) {
      const itemId = uuidv4()
      const price = item.discount_price || item.price
      
      // Sipariş kalemine ekle
      await db.query(
        `INSERT INTO order_items 
          (id, order_id, product_id, product_name, size, quantity, price) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [itemId, orderId, item.product_id, item.product_name, item.size, item.quantity, price]
      )
      
      // Stoktan düş
      await db.query(
        'UPDATE product_stock SET quantity = quantity - ? WHERE product_id = ? AND size = ?',
        [item.quantity, item.product_id, item.size]
      )
    }
    
    // Sepeti temizle
    await db.delete('cart_items', { user_id: user.id })
    
    // Siparişi getir (adres bilgisiyle birlikte)
    const orderQuery = `
      SELECT 
        o.*,
        a.title as address_title,
        a.full_name,
        a.phone,
        a.city,
        a.district,
        a.address_line,
        a.postal_code
      FROM orders o
      LEFT JOIN user_addresses a ON o.address_id COLLATE utf8mb4_unicode_ci = a.id COLLATE utf8mb4_unicode_ci
      WHERE o.id = ?
    `
    
    const orders = await db.query(orderQuery, [orderId])
    const order = orders[0]
    
    // Sipariş kalemlerini getir
    const items = await db.findMany('order_items', { order_id: orderId })
    
    return NextResponse.json({
      success: true,
      data: {
        ...order,
        subtotal: parseFloat(order.subtotal),
        shipping_cost: parseFloat(order.shipping_cost),
        total: parseFloat(order.total),
        items: items.map((item: any) => ({
          ...item,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity)
        }))
      },
      message: 'Sipariş başarıyla oluşturuldu'
    })
  } catch (error) {
    console.error('Order POST Error:', error)
    return NextResponse.json(
      { success: false, error: 'Sipariş oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db, query } from '@/lib/db/mysql'

// GET /api/products - Tüm ürünleri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')
    
    let sql = 'SELECT * FROM products WHERE is_active = 1'
    const params: any[] = []
    
    if (category) {
      // Kategori slug'ından ID bul
      const categoryData = await db.findOne('categories', { slug: category })
      if (categoryData) {
        sql += ' AND category_id = ?'
        params.push((categoryData as any).id)
      }
    }
    
    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }
    
    sql += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    
    const products = await query<any>(sql, params)
    
    // Her ürün için görsel ve stok bilgisi ekle
    const productsWithDetails = await Promise.all(
      products.map(async (product: any) => {
        // Görselleri çek
        const images = await db.findMany('product_images', 
          { product_id: product.id },
          { orderBy: 'display_order ASC' }
        )
        
        // Stok bilgisi
        const stock = await db.findMany('product_stock', { product_id: product.id })
        
        return {
          ...product,
          images,
          stock,
          in_stock: stock.some((s: any) => s.quantity > 0)
        }
      })
    )
    
    return NextResponse.json({
      success: true,
      data: productsWithDetails,
      pagination: {
        limit,
        offset,
        total: products.length
      }
    })
  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Ürünler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST /api/products - Yeni ürün ekle (Admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, category_id, images, stock } = body
    
    // Slug oluştur
    const slug = name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    
    // Ürün ekle
    const product = await db.insert('products', {
      name,
      slug,
      description,
      price,
      category_id,
      is_active: true,
      created_at: new Date()
    })
    
    const productId = (product as any).id
    
    // Görselleri ekle
    if (images && Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        await db.insert('product_images', {
          product_id: productId,
          image_url: images[i],
          display_order: i,
          is_primary: i === 0
        })
      }
    }
    
    // Stok ekle
    if (stock && Array.isArray(stock)) {
      for (const s of stock) {
        await db.insert('product_stock', {
          product_id: productId,
          size: s.size,
          quantity: s.quantity
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      data: product,
      message: 'Ürün başarıyla eklendi'
    })
  } catch (error) {
    console.error('Create Product Error:', error)
    return NextResponse.json(
      { success: false, error: 'Ürün eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

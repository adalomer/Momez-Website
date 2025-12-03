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
    
    // Güvenli LIMIT ve OFFSET kullanımı
    // MySQL'de LIMIT ve OFFSET prepared statement'lerde doğrudan kullanılamaz
    const safeLimit = Math.max(1, Math.min(100, limit)) // Max 100
    const safeOffset = Math.max(0, offset)
    
    sql += ` ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`
    
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
    
    // Validasyon
    if (!name || !description || !price || !category_id) {
      return NextResponse.json(
        { success: false, error: 'Lütfen tüm zorunlu alanları doldurun' },
        { status: 400 }
      )
    }
    
    // Benzersiz slug oluştur (timestamp ile)
    const timestamp = Date.now()
    const baseSlug = name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    
    // Slug benzersizliğini kontrol et
    let slug = baseSlug
    const existingProduct = await db.findOne('products', { slug: baseSlug })
    if (existingProduct) {
      slug = `${baseSlug}-${timestamp}`
    }
    
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
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        try {
          await db.insert('product_images', {
            product_id: productId,
            image_url: images[i],
            display_order: i,
            is_primary: i === 0
          })
        } catch (imgError) {
          console.error('Image insert error:', imgError)
        }
      }
    }
    
    // Stok ekle - duplicate kontrolü ile
    if (stock && Array.isArray(stock) && stock.length > 0) {
      // Aynı bedenleri filtrele
      const uniqueSizes = new Map()
      for (const s of stock) {
        if (!uniqueSizes.has(s.size)) {
          uniqueSizes.set(s.size, s.quantity)
        }
      }
      
      for (const [size, quantity] of uniqueSizes) {
        try {
          await db.insert('product_stock', {
            product_id: productId,
            size: size,
            quantity: quantity
          })
        } catch (stockError) {
          console.error('Stock insert error:', stockError)
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      data: product,
      message: 'Ürün başarıyla eklendi'
    })
  } catch (error: any) {
    console.error('Create Product Error:', error)
    
    // Hata mesajını daha anlaşılır yap
    let errorMessage = 'Ürün eklenirken hata oluştu'
    if (error?.sqlMessage?.includes('Duplicate entry')) {
      if (error.sqlMessage.includes('slug')) {
        errorMessage = 'Bu isimde bir ürün zaten mevcut. Farklı bir isim deneyin.'
      } else if (error.sqlMessage.includes('product_stock')) {
        errorMessage = 'Beden stok kaydı hatası. Lütfen tekrar deneyin.'
      }
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

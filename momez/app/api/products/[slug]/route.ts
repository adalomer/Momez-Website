import { NextRequest, NextResponse } from 'next/server'
import { db, query } from '@/lib/db/mysql'

// GET /api/products/[slug] - Ürün detayı
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const product = await db.findOne('products', { 
      slug,
      is_active: true 
    })
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }
    
    const productId = (product as any).id
    
    // Görseller
    const images = await db.findMany('product_images', 
      { product_id: productId },
      { orderBy: 'display_order ASC' }
    )
    
    // Stok
    const stock = await db.findMany('product_stock', { product_id: productId })
    
    // Kategori
    const category = await db.findOne('categories', { 
      id: (product as any).category_id 
    })
    
    return NextResponse.json({
      success: true,
      data: {
        ...product,
        images,
        stock,
        category,
        in_stock: stock.some((s: any) => s.quantity > 0)
      }
    })
  } catch (error) {
    console.error('Product Detail Error:', error)
    return NextResponse.json(
      { success: false, error: 'Ürün detayı yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[slug] - Ürün güncelle (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { images, stock, ...productData } = body
    
    // Ürünü bul
    const product = await db.findOne('products', { slug })
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }
    
    const productId = (product as any).id
    
    // Ürün bilgilerini güncelle
    if (Object.keys(productData).length > 0) {
      await db.update('products', productData, { slug })
    }
    
    // Görselleri güncelle
    if (images && Array.isArray(images)) {
      // Mevcut görselleri sil
      await query('DELETE FROM product_images WHERE product_id = ?', [productId])
      
      // Yeni görselleri ekle
      for (let i = 0; i < images.length; i++) {
        await db.insert('product_images', {
          product_id: productId,
          image_url: images[i],
          display_order: i,
          is_primary: i === 0
        })
      }
    }
    
    // Stokları güncelle
    if (stock && Array.isArray(stock)) {
      // Mevcut stokları sil
      await query('DELETE FROM product_stock WHERE product_id = ?', [productId])
      
      // Yeni stokları ekle
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
      message: 'Ürün güncellendi'
    })
  } catch (error) {
    console.error('Update Product Error:', error)
    return NextResponse.json(
      { success: false, error: 'Ürün güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[slug] - Ürün sil (Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    // Soft delete - is_active'i false yap
    const updated = await db.update(
      'products',
      { is_active: false },
      { slug }
    )
    
    if (updated === 0) {
      return NextResponse.json(
        { success: false, error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Ürün silindi'
    })
  } catch (error) {
    console.error('Delete Product Error:', error)
    return NextResponse.json(
      { success: false, error: 'Ürün silinirken hata oluştu' },
      { status: 500 }
    )
  }
}

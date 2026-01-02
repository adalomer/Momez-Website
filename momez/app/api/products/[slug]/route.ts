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
    
    // Renk varyantları
    const colors = await db.findMany('product_colors', 
      { product_id: productId },
      { orderBy: 'display_order ASC' }
    )
    
    // Her renk için görselleri çek
    const colorsWithImages = await Promise.all(
      (colors as any[]).map(async (color: any) => {
        const colorImages = await db.findMany('product_color_images',
          { product_color_id: color.id },
          { orderBy: 'display_order ASC' }
        )
        return {
          ...color,
          images: (colorImages as any[]).map((img: any) => img.image_url)
        }
      })
    )
    
    return NextResponse.json({
      success: true,
      data: {
        ...product,
        images,
        stock,
        category,
        colors: colorsWithImages,
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
    const { images, stock, colors, discount_price, ...restProductData } = body
    
    // discount_price'ı compare_at_price'a dönüştür
    const productData: any = { ...restProductData }
    if (discount_price !== undefined) {
      // Eğer discount_price varsa, mevcut fiyat eski fiyat olur, discount_price yeni fiyat olur
      // Veya: discount_price boşsa compare_at_price'ı null yap
      productData.compare_at_price = discount_price || null
    }
    
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
    
    // Görselleri güncelle - colors varsa onlardan al, yoksa images'dan
    const allImages: string[] = []
    if (colors && Array.isArray(colors) && colors.length > 0) {
      // Önce mevcut renklerin görsellerini sil
      const existingColors = await db.findMany('product_colors', { product_id: productId })
      for (const color of existingColors as any[]) {
        await query('DELETE FROM product_color_images WHERE product_color_id = ?', [color.id])
      }
      // Mevcut renkleri sil
      await query('DELETE FROM product_colors WHERE product_id = ?', [productId])
      
      // Yeni renkleri ekle
      for (let i = 0; i < colors.length; i++) {
        const colorData = colors[i]
        const colorResult = await db.insert('product_colors', {
          product_id: productId,
          color_name: colorData.name,
          color_hex: colorData.hex || '#000000',
          display_order: i,
          is_default: colorData.isDefault ? 1 : 0
        })
        
        const colorId = (colorResult as any).id
        
        // Renk görsellerini ekle
        if (colorData.images && Array.isArray(colorData.images)) {
          for (let j = 0; j < colorData.images.length; j++) {
            await db.insert('product_color_images', {
              product_color_id: colorId,
              image_url: colorData.images[j],
              display_order: j,
              is_primary: j === 0 ? 1 : 0
            })
            allImages.push(colorData.images[j])
          }
        }
      }
    } else if (images && Array.isArray(images)) {
      allImages.push(...images)
    }
    
    // Ana product_images tablosunu da güncelle (geriye uyumluluk için)
    if (allImages.length > 0) {
      // Mevcut görselleri sil
      await query('DELETE FROM product_images WHERE product_id = ?', [productId])
      
      // Yeni görselleri ekle
      for (let i = 0; i < allImages.length; i++) {
        await db.insert('product_images', {
          product_id: productId,
          image_url: allImages[i],
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

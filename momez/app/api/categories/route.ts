import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/mysql'

// GET /api/categories - Tüm kategorileri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parent_id')
    
    let where: Record<string, any> = { is_active: true }
    
    if (parentId) {
      where.parent_id = parseInt(parentId)
    } else if (parentId === null) {
      // Ana kategoriler
      where.parent_id = null
    }
    
    const categories = await db.findMany('categories', where, {
      orderBy: 'display_order ASC, name ASC'
    })
    
    // Her kategori için ürün sayısı
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat: any) => {
        const count = await db.count('products', {
          category_id: cat.id,
          is_active: true
        })
        return { ...cat, product_count: count }
      })
    )
    
    return NextResponse.json({
      success: true,
      data: categoriesWithCount
    })
  } catch (error) {
    console.error('Categories API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Kategoriler yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Yeni kategori ekle (Admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, parent_id, image_url } = body
    
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
    
    const category = await db.insert('categories', {
      name,
      slug,
      parent_id: parent_id || null,
      image_url: image_url || null,
      is_active: true,
      display_order: 0,
      created_at: new Date()
    })
    
    return NextResponse.json({
      success: true,
      data: category,
      message: 'Kategori eklendi'
    })
  } catch (error) {
    console.error('Create Category Error:', error)
    return NextResponse.json(
      { success: false, error: 'Kategori eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'

// GET /api/categories - Tüm kategorileri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parent_id')
    
    let sql = 'SELECT * FROM categories WHERE is_active = 1'
    const params: any[] = []
    
    if (parentId) {
      sql += ' AND parent_id = ?'
      params.push(parentId)
    }
    
    sql += ' ORDER BY display_order ASC, name ASC'
    
    const categories = await query(sql, params)
    
    // Her kategori için ürün sayısı
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat: any) => {
        const countResult = await query(
          'SELECT COUNT(*) as count FROM products WHERE category_id = ? AND is_active = 1',
          [cat.id]
        )
        return { ...cat, product_count: countResult[0]?.count || 0 }
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
    
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Kategori adı gerekli' },
        { status: 400 }
      )
    }
    
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
    
    // UUID oluştur
    const crypto = require('crypto')
    const id = crypto.randomUUID()
    
    // Direct SQL insert (UUID için)
    const { query } = await import('@/lib/db/mysql')
    await query(
      `INSERT INTO categories (id, name, slug, parent_id, image_url, is_active, display_order, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [id, name, slug, parent_id || null, image_url || null, true, 0]
    )
    
    // Eklenen kategoriyi getir
    const newCategory = await query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    )
    
    return NextResponse.json({
      success: true,
      data: newCategory[0],
      message: 'Kategori eklendi'
    })
  } catch (error: any) {
    console.error('Create Category Error:', error)
    
    // Slug duplicate hatası
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, error: 'Bu isimde bir kategori zaten var' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Kategori eklenirken hata oluştu: ' + error.message },
      { status: 500 }
    )
  }
}

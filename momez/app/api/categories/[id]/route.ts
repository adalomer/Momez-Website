import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'

// Kategori güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { name, slug, description } = body

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: 'Kategori adı ve slug gerekli' },
        { status: 400 }
      )
    }

    // Aynı slug'a sahip başka kategori var mı kontrol et
    const existing = await query(
      'SELECT id FROM categories WHERE slug = ? AND id != ?',
      [slug, id]
    )

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Bu slug kullanımda' },
        { status: 400 }
      )
    }

    // Kategoriyi güncelle
    await query(
      'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?',
      [name, slug, description || null, id]
    )

    return NextResponse.json({
      success: true,
      message: 'Kategori güncellendi',
    })
  } catch (error) {
    console.error('Category update error:', error)
    return NextResponse.json(
      { success: false, message: 'Kategori güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// Kategori sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Bu kategoriye ait ürün var mı kontrol et
    const products = await query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [id]
    )

    if (products[0].count > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Bu kategoriye ait ürünler var. Önce ürünleri silmelisiniz.' 
        },
        { status: 400 }
      )
    }

    // Kategoriyi sil
    await query('DELETE FROM categories WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Kategori silindi',
    })
  } catch (error) {
    console.error('Category delete error:', error)
    return NextResponse.json(
      { success: false, message: 'Kategori silinirken hata oluştu' },
      { status: 500 }
    )
  }
}

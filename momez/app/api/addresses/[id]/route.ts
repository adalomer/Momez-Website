import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db/mysql'
import { getUserFromToken } from '@/lib/auth'

// Adres güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Giriş yapmalısınız' },
        { status: 401 }
      )
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz token' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { title, full_name, phone, address, city, district, postal_code, is_default } = body

    // Adresin bu kullanıcıya ait olduğunu kontrol et
    const existingAddress = await query(
      'SELECT id FROM addresses WHERE id = ? AND user_id = ?',
      [id, user.id]
    )

    if (existingAddress.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Adres bulunamadı' },
        { status: 404 }
      )
    }

    // Eğer varsayılan adres yapılıyorsa, diğer adresleri güncelle
    if (is_default) {
      await query(
        'UPDATE addresses SET is_default = 0 WHERE user_id = ? AND id != ?',
        [user.id, id]
      )
    }

    await query(
      `UPDATE addresses 
      SET title = ?, full_name = ?, phone = ?, address = ?, city = ?, district = ?, postal_code = ?, is_default = ?
      WHERE id = ? AND user_id = ?`,
      [title, full_name, phone, address, city, district || null, postal_code || null, is_default ? 1 : 0, id, user.id]
    )

    return NextResponse.json({
      success: true,
      message: 'Adres güncellendi',
    })
  } catch (error) {
    console.error('Address update error:', error)
    return NextResponse.json(
      { success: false, message: 'Adres güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// Adres sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Giriş yapmalısınız' },
        { status: 401 }
      )
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz token' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Adresin bu kullanıcıya ait olduğunu kontrol et
    const existingAddress = await query(
      'SELECT id FROM addresses WHERE id = ? AND user_id = ?',
      [id, user.id]
    )

    if (existingAddress.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Adres bulunamadı' },
        { status: 404 }
      )
    }

    await query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, user.id])

    return NextResponse.json({
      success: true,
      message: 'Adres silindi',
    })
  } catch (error) {
    console.error('Address delete error:', error)
    return NextResponse.json(
      { success: false, message: 'Adres silinirken hata oluştu' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/mysql'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

// POST /api/auth/reset-password - Şifreyi sıfırla
export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json()
    
    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Tüm alanlar gerekli' },
        { status: 400 }
      )
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      )
    }
    
    // Kullanıcıyı bul
    const user = await db.findOne('users', { email: email.toLowerCase() })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz sıfırlama kodu' },
        { status: 400 }
      )
    }
    
    // Sıfırlama kodunu doğrula
    const resetRecords = await db.query(
      `SELECT * FROM password_resets 
       WHERE user_id = ? AND reset_code = ? AND expires_at > NOW()`,
      [user.id, code]
    )
    
    if (resetRecords.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz veya süresi dolmuş sıfırlama kodu' },
        { status: 400 }
      )
    }
    
    // Şifreyi hashle ve güncelle
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    await db.update(
      'users',
      { password_hash: hashedPassword },
      { id: user.id }
    )
    
    // Kullanılan tokenı sil
    await db.query(
      'DELETE FROM password_resets WHERE user_id = ?',
      [user.id]
    )
    
    return NextResponse.json({
      success: true,
      message: 'Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.'
    })
  } catch (error) {
    console.error('Reset Password Error:', error)
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}

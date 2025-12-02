import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/mysql'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

// POST /api/auth/forgot-password - Şifre sıfırlama token'ı oluştur
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'E-posta adresi gerekli' },
        { status: 400 }
      )
    }
    
    // Kullanıcıyı bul
    const user = await db.findOne('users', { email: email.toLowerCase() })
    
    // Güvenlik: Kullanıcı bulunamasa bile aynı mesajı döndür
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'E-posta adresinize şifre sıfırlama bağlantısı gönderildi.'
      })
    }
    
    // 6 haneli sıfırlama kodu oluştur
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Token oluştur (kod + user_id hash)
    const resetToken = crypto
      .createHash('sha256')
      .update(resetCode + user.id)
      .digest('hex')
    
    // Token'ı veritabanına kaydet (30 dakika geçerli)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 dakika
    
    // Eski tokenları sil
    await db.query(
      'DELETE FROM password_resets WHERE user_id = ?',
      [user.id]
    )
    
    // Yeni token kaydet
    await db.query(
      `INSERT INTO password_resets (id, user_id, token, reset_code, expires_at) 
       VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), user.id, resetToken, resetCode, expiresAt]
    )
    
    // Gerçek uygulamada burada e-posta gönderilir
    // Şimdilik geliştirme amaçlı kodu response'da döndürüyoruz
    console.log(`[DEV] Şifre sıfırlama kodu (${email}): ${resetCode}`)
    
    return NextResponse.json({
      success: true,
      message: 'E-posta adresinize şifre sıfırlama kodu gönderildi.',
      // DEV MODE: Gerçek uygulamada bu kaldırılmalı
      dev_code: process.env.NODE_ENV === 'development' ? resetCode : undefined
    })
  } catch (error) {
    console.error('Forgot Password Error:', error)
    return NextResponse.json(
      { success: false, error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}

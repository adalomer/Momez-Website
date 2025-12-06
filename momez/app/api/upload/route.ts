import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { getUserFromToken } from '@/lib/auth'
import crypto from 'crypto'

// Magic bytes for image validation
const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF
  'image/gif': [0x47, 0x49, 0x46, 0x38]
}

function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const expectedBytes = MAGIC_BYTES[mimeType]
  if (!expectedBytes) return false
  
  for (let i = 0; i < expectedBytes.length; i++) {
    if (buffer[i] !== expectedBytes[i]) return false
  }
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Admin yetki kontrolü - sadece admin dosya yükleyebilir
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapılmamış' },
        { status: 401 }
      )
    }
    
    const user = await getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Yetkisiz erişim' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Dosya bulunamadı' },
        { status: 400 }
      )
    }
    
    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Dosya boyutu 5MB\'dan küçük olmalı' },
        { status: 400 }
      )
    }
    
    // Dosya tipi kontrolü (MIME type)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Sadece resim dosyaları yüklenebilir' },
        { status: 400 }
      )
    }
    
    // Dosya içeriğini oku
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Magic bytes doğrulaması - gerçek dosya içeriğini kontrol et
    const mimeForValidation = file.type === 'image/jpg' ? 'image/jpeg' : file.type
    if (!validateMagicBytes(buffer, mimeForValidation)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz dosya içeriği. Dosya tipi doğrulanamadı.' },
        { status: 400 }
      )
    }
    
    // Güvenli dosya adı oluştur (random hash + extension)
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp']
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz dosya uzantısı' },
        { status: 400 }
      )
    }
    
    const randomHash = crypto.randomBytes(16).toString('hex')
    const timestamp = Date.now()
    const filename = `${timestamp}_${randomHash}.${fileExtension}`
    
    // Upload klasörü oluştur
    const uploadDir = join(process.cwd(), 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }
    
    // Dosyayı kaydet
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)
    
    console.log('File uploaded:', filepath)
    
    // URL oluştur
    const url = `/uploads/${filename}`
    
    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Upload Error:', error)
    return NextResponse.json(
      { success: false, error: 'Dosya yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

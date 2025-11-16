import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
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
    
    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Sadece resim dosyaları yüklenebilir' },
        { status: 400 }
      )
    }
    
    // Dosya adı oluştur
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const filename = `${timestamp}_${originalName}`
    
    // Upload klasörü oluştur
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }
    
    // Dosyayı kaydet
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)
    
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

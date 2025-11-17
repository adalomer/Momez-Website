import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from './db/mysql'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '7d'

export interface User {
  id: string  // UUID
  email: string
  full_name: string
  role: 'admin' | 'customer'
  phone?: string
  created_at: Date
}

export interface JWTPayload {
  userId: string  // UUID
  email: string
  role: string
}

// Şifre hash'leme
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Şifre doğrulama
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT token oluştur
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// JWT token doğrula
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

// Kullanıcı kaydı
export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  phone?: string
): Promise<{ user: User; token: string } | { error: string }> {
  try {
    // Email kontrolü
    const existing = await db.findOne('users', { email })
    if (existing) {
      return { error: 'Bu email zaten kayıtlı' }
    }

    // Şifreyi hash'le
    const hashedPassword = await hashPassword(password)

    // Kullanıcı oluştur
    const user = await db.insert<any>('users', {
      email,
      password_hash: hashedPassword,
      full_name: fullName,
      phone,
      role: 'customer',
      created_at: new Date()
    })

    if (!user) {
      return { error: 'Kullanıcı oluşturulamadı' }
    }

    // Token oluştur
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Şifreyi response'dan kaldır
    delete user.password_hash

    return { user, token }
  } catch (error) {
    console.error('Register error:', error)
    return { error: 'Kayıt sırasında hata oluştu' }
  }
}

// Kullanıcı girişi
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; token: string } | { error: string }> {
  try {
    // Kullanıcıyı bul
    const user = await db.findOne<any>('users', { email })
    if (!user) {
      return { error: 'Email veya şifre hatalı' }
    }

    // Şifreyi kontrol et
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return { error: 'Email veya şifre hatalı' }
    }

    // Token oluştur
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Şifreyi response'dan kaldır
    delete user.password_hash

    return { user, token }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Giriş sırasında hata oluştu' }
  }
}

// Token'dan kullanıcı bilgisi al
export async function getUserFromToken(
  token: string
): Promise<User | null> {
  const payload = verifyToken(token)
  if (!payload) return null

  const user = await db.findOne<any>('users', { id: payload.userId })
  if (!user) return null

  delete user.password_hash
  return user
}

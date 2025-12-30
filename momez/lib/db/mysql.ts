import mysql from 'mysql2/promise'

// Environment değişkenlerini kontrol et
const requiredEnvVars = ['DATABASE_HOST', 'DATABASE_NAME', 'DATABASE_USER', 'DATABASE_PASSWORD']
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} environment variable is not set`)
  }
}

// MySQL bağlantı havuzu oluştur
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  database: process.env.DATABASE_NAME || 'momez_db',
  user: process.env.DATABASE_USER || 'momez_user',
  password: process.env.DATABASE_PASSWORD, // Varsayılan değer kaldırıldı - güvenlik için
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Connection timeout
  connectTimeout: 10000,
})

// Bağlantı test fonksiyonu
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log('✅ MySQL bağlantısı başarılı')
    connection.release()
    return true
  } catch (error) {
    console.error('❌ MySQL bağlantı hatası:', error)
    return false
  }
}

// SQL injection koruması için tablo/kolon adı validasyonu
function validateIdentifier(identifier: string): boolean {
  // Sadece alfanumerik karakterler ve alt çizgiye izin ver
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)
}

// Query helper fonksiyonu
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params || [])
    return rows as T[]
  } catch (error) {
    console.error('Query error:', error)
    throw error
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection()
  await connection.beginTransaction()
  
  try {
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

// CRUD helper fonksiyonları
export const db = {
  // RAW QUERY
  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    return query<T>(sql, params)
  },
  
  // SELECT
  async findMany<T = any>(
    table: string,
    where?: Record<string, any>,
    options?: {
      orderBy?: string
      limit?: number
      offset?: number
    }
  ): Promise<T[]> {
    // SQL injection koruması
    if (!validateIdentifier(table)) {
      throw new Error(`Invalid table name: ${table}`)
    }
    
    let sql = `SELECT * FROM \`${table}\``
    const params: any[] = []
    
    if (where && Object.keys(where).length > 0) {
      const conditions: string[] = []
      for (const key of Object.keys(where)) {
        if (!validateIdentifier(key)) {
          throw new Error(`Invalid column name: ${key}`)
        }
        conditions.push(`\`${key}\` = ?`)
        params.push(where[key])
      }
      sql += ` WHERE ${conditions.join(' AND ')}`
    }
    
    if (options?.orderBy) {
      // ORDER BY için güvenli parsing
      const orderParts = options.orderBy.trim().split(/\s+/)
      const orderColumn = orderParts[0]
      const orderDirection = orderParts[1]?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
      
      if (!validateIdentifier(orderColumn)) {
        throw new Error(`Invalid orderBy column: ${orderColumn}`)
      }
      sql += ` ORDER BY \`${orderColumn}\` ${orderDirection}`
    }
    
    if (options?.limit) {
      // MySQL'de LIMIT ve OFFSET prepared statement'lerde doğrudan parametre olarak kullanılamaz
      // Sayısal değerler olduğu için güvenli string interpolation kullanıyoruz
      const limit = Math.max(1, Math.min(1000, options.limit)) // Max 1000
      sql += ` LIMIT ${limit}`
      if (options?.offset) {
        const offset = Math.max(0, options.offset)
        sql += ` OFFSET ${offset}`
      }
    }
    
    return query<T>(sql, params)
  },
  
  // SELECT ONE
  async findOne<T = any>(
    table: string,
    where: Record<string, any>
  ): Promise<T | null> {
    if (!validateIdentifier(table)) {
      throw new Error(`Invalid table name: ${table}`)
    }
    
    // WHERE koşullarını validate et
    for (const key of Object.keys(where)) {
      if (!validateIdentifier(key)) {
        throw new Error(`Invalid column name: ${key}`)
      }
    }
    
    const results = await this.findMany<T>(table, where, { limit: 1 })
    return results[0] || null
  },
  
  // INSERT
  async insert<T = any>(
    table: string,
    data: Record<string, any>
  ): Promise<T | null> {
    if (!validateIdentifier(table)) {
      throw new Error(`Invalid table name: ${table}`)
    }
    
    // Eğer id yoksa UUID oluştur
    if (!data.id) {
      data.id = crypto.randomUUID()
    }
    
    const keys = Object.keys(data)
    const values = Object.values(data)
    
    // Tüm kolon adlarını validate et
    for (const key of keys) {
      if (!validateIdentifier(key)) {
        throw new Error(`Invalid column name: ${key}`)
      }
    }
    
    const placeholders = keys.map(() => '?').join(', ')
    const columns = keys.map(k => `\`${k}\``).join(', ')
    
    const sql = `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`
    await pool.execute(sql, values)
    
    // Eklenen kaydı geri döndür
    return this.findOne(table, { id: data.id })
  },
  
  // UPDATE
  async update(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>
  ): Promise<number> {
    if (!validateIdentifier(table)) {
      throw new Error(`Invalid table name: ${table}`)
    }
    
    // SET kolonlarını validate et
    const setClause = Object.keys(data).map(key => {
      if (!validateIdentifier(key)) {
        throw new Error(`Invalid column name: ${key}`)
      }
      return `\`${key}\` = ?`
    }).join(', ')
    
    // WHERE kolonlarını validate et
    const whereClause = Object.keys(where).map(key => {
      if (!validateIdentifier(key)) {
        throw new Error(`Invalid column name: ${key}`)
      }
      return `\`${key}\` = ?`
    }).join(' AND ')
    
    const sql = `UPDATE \`${table}\` SET ${setClause} WHERE ${whereClause}`
    const params = [...Object.values(data), ...Object.values(where)]
    
    const [result] = await pool.execute(sql, params) as any
    return result.affectedRows
  },
  
  // DELETE
  async delete(
    table: string,
    where: Record<string, any>
  ): Promise<number> {
    if (!validateIdentifier(table)) {
      throw new Error(`Invalid table name: ${table}`)
    }
    
    // WHERE kolonlarını validate et
    const whereClause = Object.keys(where).map(key => {
      if (!validateIdentifier(key)) {
        throw new Error(`Invalid column name: ${key}`)
      }
      return `\`${key}\` = ?`
    }).join(' AND ')
    
    const sql = `DELETE FROM \`${table}\` WHERE ${whereClause}`
    
    const [result] = await pool.execute(sql, Object.values(where)) as any
    return result.affectedRows
  },
  
  // COUNT
  async count(
    table: string,
    where?: Record<string, any>
  ): Promise<number> {
    if (!validateIdentifier(table)) {
      throw new Error(`Invalid table name: ${table}`)
    }
    
    let sql = `SELECT COUNT(*) as count FROM \`${table}\``
    const params: any[] = []
    
    if (where && Object.keys(where).length > 0) {
      const conditions: string[] = []
      for (const key of Object.keys(where)) {
        if (!validateIdentifier(key)) {
          throw new Error(`Invalid column name: ${key}`)
        }
        conditions.push(`\`${key}\` = ?`)
        params.push(where[key])
      }
      sql += ` WHERE ${conditions.join(' AND ')}`
    }
    
    const results = await query<{ count: number }>(sql, params)
    return results[0]?.count || 0
  }
}

export default pool

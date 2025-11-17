import mysql from 'mysql2/promise'

// MySQL bağlantı havuzu oluştur
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  database: process.env.DATABASE_NAME || 'momez_db',
  user: process.env.DATABASE_USER || 'momez_user',
  password: process.env.DATABASE_PASSWORD || 'momez_password',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
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

// Query helper fonksiyonu
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params)
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
    let sql = `SELECT * FROM ${table}`
    const params: any[] = []
    
    if (where && Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map(key => `${key} = ?`)
      sql += ` WHERE ${conditions.join(' AND ')}`
      params.push(...Object.values(where))
    }
    
    if (options?.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`
    }
    
    if (options?.limit) {
      sql += ` LIMIT ${options.limit}`
      if (options?.offset) {
        sql += ` OFFSET ${options.offset}`
      }
    }
    
    return query<T>(sql, params)
  },
  
  // SELECT ONE
  async findOne<T = any>(
    table: string,
    where: Record<string, any>
  ): Promise<T | null> {
    const results = await this.findMany<T>(table, where, { limit: 1 })
    return results[0] || null
  },
  
  // INSERT
  async insert<T = any>(
    table: string,
    data: Record<string, any>
  ): Promise<T | null> {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map(() => '?').join(', ')
    
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`
    const [result] = await pool.execute(sql, values) as any
    
    // Eklenen kaydı geri döndür
    return this.findOne(table, { id: result.insertId })
  },
  
  // UPDATE
  async update(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>
  ): Promise<number> {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ')
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ')
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`
    const params = [...Object.values(data), ...Object.values(where)]
    
    const [result] = await pool.execute(sql, params) as any
    return result.affectedRows
  },
  
  // DELETE
  async delete(
    table: string,
    where: Record<string, any>
  ): Promise<number> {
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ')
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`
    
    const [result] = await pool.execute(sql, Object.values(where)) as any
    return result.affectedRows
  },
  
  // COUNT
  async count(
    table: string,
    where?: Record<string, any>
  ): Promise<number> {
    let sql = `SELECT COUNT(*) as count FROM ${table}`
    const params: any[] = []
    
    if (where && Object.keys(where).length > 0) {
      const conditions = Object.keys(where).map(key => `${key} = ?`)
      sql += ` WHERE ${conditions.join(' AND ')}`
      params.push(...Object.values(where))
    }
    
    const results = await query<{ count: number }>(sql, params)
    return results[0]?.count || 0
  }
}

export default pool

import { query } from '../lib/db/mysql'
import { randomUUID } from 'crypto'

const categories = [
  {
    name: 'Erkek Ayakkabı',
    slug: 'erkek-ayakkabi',
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
    description: 'Erkek ayakkabı modelleri'
  },
  {
    name: 'Kadın Ayakkabı',
    slug: 'kadin-ayakkabi',
    image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
    description: 'Kadın ayakkabı modelleri'
  },
  {
    name: 'Çocuk Ayakkabı',
    slug: 'cocuk-ayakkabi',
    image_url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&h=800&fit=crop',
    description: 'Çocuk ayakkabı modelleri'
  },
  {
    name: 'Spor Ayakkabı',
    slug: 'spor-ayakkabi',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    description: 'Spor ayakkabı modelleri'
  },
  {
    name: 'Sneaker',
    slug: 'sneaker',
    image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
    description: 'Sneaker ve günlük ayakkabılar'
  },
  {
    name: 'Bot & Postal',
    slug: 'bot-postal',
    image_url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=800&fit=crop',
    description: 'Bot ve postal modelleri'
  },
  {
    name: 'Klasik Ayakkabı',
    slug: 'klasik-ayakkabi',
    image_url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&h=800&fit=crop',
    description: 'Klasik ve resmi ayakkabılar'
  },
  {
    name: 'Sandalet & Terlik',
    slug: 'sandalet-terlik',
    image_url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&h=800&fit=crop',
    description: 'Sandalet ve terlik modelleri'
  },
  {
    name: 'Topuklu Ayakkabı',
    slug: 'topuklu-ayakkabi',
    image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
    description: 'Topuklu ayakkabı modelleri'
  },
  {
    name: 'Koşu Ayakkabısı',
    slug: 'kosu-ayakkabisi',
    image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=800&fit=crop',
    description: 'Koşu ve running ayakkabıları'
  }
]

async function addCategories() {
  console.log('🚀 Kategoriler ekleniyor...')
  
  try {
    for (const category of categories) {
      const id = randomUUID()
      
      // Önce kategori var mı kontrol et
      const existing = await query(
        'SELECT id FROM categories WHERE slug = ?',
        [category.slug]
      )
      
      if (existing && existing.length > 0) {
        console.log(`⏭️  "${category.name}" zaten mevcut, atlanıyor...`)
        continue
      }
      
      // Kategoriyi ekle
      await query(
        `INSERT INTO categories (id, name, slug, image_url, description, is_active, display_order, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [id, category.name, category.slug, category.image_url, category.description, 1, 0]
      )
      
      console.log(`✅ "${category.name}" eklendi`)
    }
    
    console.log('\n✨ Tüm kategoriler başarıyla eklendi!')
  } catch (error) {
    console.error('❌ Hata:', error)
    throw error
  }
}

// Script olarak çalıştır
if (require.main === module) {
  addCategories()
    .then(() => {
      console.log('✅ İşlem tamamlandı')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ İşlem başarısız:', error)
      process.exit(1)
    })
}

export { addCategories }

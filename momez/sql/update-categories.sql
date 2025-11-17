-- Eski kategorileri temizle ve yeni kategorileri ekle

-- Eski kategorileri sil
DELETE FROM categories;

-- Yeni kategorileri ekle (düzgün resimlerle)
INSERT INTO categories (id, name, slug, image_url, description, is_active, display_order, created_at, updated_at) VALUES
(UUID(), 'Erkek Ayakkabı', 'erkek-ayakkabi', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop', 'Erkek ayakkabı modelleri', 1, 1, NOW(), NOW()),
(UUID(), 'Kadın Ayakkabı', 'kadin-ayakkabi', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop', 'Kadın ayakkabı modelleri', 1, 2, NOW(), NOW()),
(UUID(), 'Çocuk Ayakkabı', 'cocuk-ayakkabi', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=800&fit=crop', 'Çocuk ayakkabı modelleri', 1, 3, NOW(), NOW()),
(UUID(), 'Spor Ayakkabı', 'spor-ayakkabi', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop', 'Spor ayakkabı modelleri', 1, 4, NOW(), NOW()),
(UUID(), 'Sneaker', 'sneaker', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop', 'Sneaker ve günlük ayakkabılar', 1, 5, NOW(), NOW()),
(UUID(), 'Bot & Postal', 'bot-postal', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=800&fit=crop', 'Bot ve postal modelleri', 1, 6, NOW(), NOW()),
(UUID(), 'Klasik Ayakkabı', 'klasik-ayakkabi', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&h=800&fit=crop', 'Klasik ve resmi ayakkabılar', 1, 7, NOW(), NOW()),
(UUID(), 'Sandalet & Terlik', 'sandalet-terlik', 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&h=800&fit=crop', 'Sandalet ve terlik modelleri', 1, 8, NOW(), NOW()),
(UUID(), 'Topuklu Ayakkabı', 'topuklu-ayakkabi', 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800&h=800&fit=crop', 'Topuklu ayakkabı modelleri', 1, 9, NOW(), NOW()),
(UUID(), 'Koşu Ayakkabısı', 'kosu-ayakkabisi', 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=800&fit=crop', 'Koşu ve running ayakkabıları', 1, 10, NOW(), NOW()),
(UUID(), 'Futbol Ayakkabısı', 'futbol-ayakkabisi', 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&h=800&fit=crop', 'Futbol kramponları', 1, 11, NOW(), NOW()),
(UUID(), 'Basketbol Ayakkabısı', 'basketbol-ayakkabisi', 'https://images.unsplash.com/photo-1515396800500-6c87091c3980?w=800&h=800&fit=crop', 'Basketbol ayakkabıları', 1, 12, NOW(), NOW());

SELECT 'Kategoriler güncellendi!' as result;
SELECT COUNT(*) as total_categories FROM categories;

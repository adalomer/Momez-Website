-- Eksik resimleri güncelle

-- Kadın Ayakkabı resmini güncelle
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop' WHERE slug = 'kadin' OR slug = 'kadin-ayakkabi';

-- Spor Ayakkabı resmini güncelle  
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop' WHERE slug = 'spor' OR slug = 'spor-ayakkabi';

-- Erkek Ayakkabı resmini güncelle
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop' WHERE slug = 'erkek' OR slug = 'erkek-ayakkabi';

-- Çocuk Ayakkabı resmini güncelle
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=800&fit=crop' WHERE slug = 'cocuk-ayakkabi';

SELECT 'Resimler güncellendi!' as result;
SELECT name, slug, SUBSTRING(image_url, 1, 60) as image FROM categories ORDER BY display_order;

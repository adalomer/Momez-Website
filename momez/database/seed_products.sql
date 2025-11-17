-- Önce mevcut ürün verilerini temizle (kullanıcılar hariç)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM favorites;
DELETE FROM product_images;
DELETE FROM product_stock;
DELETE FROM products;
DELETE FROM categories;

-- Kategorileri ekle
INSERT INTO categories (id, name, slug, description, image_url, parent_id, display_order, is_active) VALUES
('cat-erkek', 'Erkek Ayakkabı', 'erkek', 'Erkekler için şık ve rahat ayakkabı modelleri', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop', NULL, 1, 1),
('cat-kadin', 'Kadın Ayakkabı', 'kadin', 'Kadınlar için zarif ve modern ayakkabı koleksiyonu', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=600&fit=crop', NULL, 2, 1),
('cat-cocuk', 'Çocuk Ayakkabı', 'cocuk', 'Çocuklar için rahat ve dayanıklı ayakkabılar', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&h=600&fit=crop', NULL, 3, 1),
('cat-spor', 'Spor Ayakkabı', 'spor', 'Aktif yaşam için tasarlanmış spor ayakkabılar', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop', NULL, 4, 1);

-- Erkek Ayakkabı Ürünleri
INSERT INTO products (id, name, slug, description, price, discount_price, category_id, brand, is_featured, is_active) VALUES
('prod-001', 'Nike Air Max 90', 'nike-air-max-90', 'Klasik tasarım ve üstün konfor sunan Nike Air Max 90. Günlük kullanım için ideal.', 2499.99, 1999.99, 'cat-erkek', 'Nike', 1, 1),
('prod-002', 'Adidas Ultraboost 22', 'adidas-ultraboost-22', 'Koşu performansınızı artıran enerji geri dönüşümlü taban teknolojisi.', 2899.99, 2399.99, 'cat-erkek', 'Adidas', 1, 1),
('prod-003', 'Puma Suede Classic', 'puma-suede-classic', 'Zamansız stil ve konforu bir araya getiren süet deri ayakkabı.', 1799.99, NULL, 'cat-erkek', 'Puma', 0, 1),
('prod-004', 'New Balance 574', 'new-balance-574', 'Retro tasarım ve modern konfor. Her ortama uygun günlük ayakkabı.', 2199.99, 1899.99, 'cat-erkek', 'New Balance', 1, 1),
('prod-005', 'Converse Chuck Taylor', 'converse-chuck-taylor', 'İkonik tasarım ve rahat kullanım. Her tarza uyum sağlar.', 1499.99, NULL, 'cat-erkek', 'Converse', 0, 1);

-- Kadın Ayakkabı Ürünleri
INSERT INTO products (id, name, slug, description, price, discount_price, category_id, brand, is_featured, is_active) VALUES
('prod-006', 'Nike Air Force 1', 'nike-air-force-1-kadin', 'Kadınlar için özel tasarlanmış klasik beyaz spor ayakkabı.', 2299.99, 1899.99, 'cat-kadin', 'Nike', 1, 1),
('prod-007', 'Adidas Stan Smith', 'adidas-stan-smith-kadin', 'Minimalist tasarım ve sürdürülebilir malzemelerle üretilmiş zarif ayakkabı.', 2099.99, NULL, 'cat-kadin', 'Adidas', 0, 1),
('prod-008', 'Puma Carina Leather', 'puma-carina-leather', 'Şık deri detayları ve rahat tabanlı kadın spor ayakkabısı.', 1699.99, 1399.99, 'cat-kadin', 'Puma', 1, 1),
('prod-009', 'Vans Old Skool', 'vans-old-skool-kadin', 'Klasik yan şerit detaylı, her kombine uygun günlük ayakkabı.', 1599.99, NULL, 'cat-kadin', 'Vans', 0, 1),
('prod-010', 'Reebok Club C', 'reebok-club-c-kadin', 'Vintage tenis ayakkabısı esinlenmiş modern tasarım.', 1899.99, 1599.99, 'cat-kadin', 'Reebok', 1, 1);

-- Çocuk Ayakkabı Ürünleri
INSERT INTO products (id, name, slug, description, price, discount_price, category_id, brand, is_featured, is_active) VALUES
('prod-011', 'Nike Revolution 6', 'nike-revolution-6-cocuk', 'Çocuklar için rahat ve dayanıklı koşu ayakkabısı.', 999.99, 799.99, 'cat-cocuk', 'Nike', 1, 1),
('prod-012', 'Adidas Tensaur', 'adidas-tensaur-cocuk', 'Kolay giyilen bantlı tasarım, aktif çocuklar için ideal.', 899.99, NULL, 'cat-cocuk', 'Adidas', 0, 1),
('prod-013', 'Puma Smash V2', 'puma-smash-v2-cocuk', 'Klasik görünüm ve çocuk ayakları için konforlu taban.', 799.99, 649.99, 'cat-cocuk', 'Puma', 1, 1),
('prod-014', 'Converse All Star Kids', 'converse-all-star-kids', 'Çocuklar için renkli ve eğlenceli klasik model.', 699.99, NULL, 'cat-cocuk', 'Converse', 0, 1);

-- Spor Ayakkabı Ürünleri
INSERT INTO products (id, name, slug, description, price, discount_price, category_id, brand, is_featured, is_active) VALUES
('prod-015', 'Nike ZoomX Vaporfly', 'nike-zoomx-vaporfly', 'Profesyonel koşucular için karbon fiber plaka teknolojisi.', 3499.99, 2999.99, 'cat-spor', 'Nike', 1, 1),
('prod-016', 'Adidas Predator Edge', 'adidas-predator-edge', 'Futbol sahasında üstünlük için tasarlanmış halı saha ayakkabısı.', 2799.99, NULL, 'cat-spor', 'Adidas', 0, 1),
('prod-017', 'Puma Future Z', 'puma-future-z', 'Hız ve çeviklik için optimize edilmiş futbol ayakkabısı.', 2599.99, 2199.99, 'cat-spor', 'Puma', 1, 1),
('prod-018', 'Asics Gel-Kayano', 'asics-gel-kayano', 'Uzun mesafe koşuları için maksimum destek ve konfor.', 2999.99, NULL, 'cat-spor', 'Asics', 0, 1);

-- Ürün Görselleri
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary) VALUES
-- Nike Air Max 90
('img-001', 'prod-001', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop', 'Nike Air Max 90 - Önden Görünüm', 1, 1),
('img-002', 'prod-001', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop', 'Nike Air Max 90 - Yandan Görünüm', 2, 0),

-- Adidas Ultraboost 22
('img-003', 'prod-002', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop', 'Adidas Ultraboost 22 - Ana Görünüm', 1, 1),
('img-004', 'prod-002', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop', 'Adidas Ultraboost 22 - Detay', 2, 0),

-- Puma Suede Classic
('img-005', 'prod-003', 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&h=800&fit=crop', 'Puma Suede Classic', 1, 1),

-- New Balance 574
('img-006', 'prod-004', 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&h=800&fit=crop', 'New Balance 574', 1, 1),

-- Converse Chuck Taylor
('img-007', 'prod-005', 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=800&fit=crop', 'Converse Chuck Taylor', 1, 1),

-- Nike Air Force 1 Kadın
('img-008', 'prod-006', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop', 'Nike Air Force 1 Kadın', 1, 1),

-- Adidas Stan Smith Kadın
('img-009', 'prod-007', 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=800&h=800&fit=crop', 'Adidas Stan Smith', 1, 1),

-- Puma Carina Leather
('img-010', 'prod-008', 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=800&fit=crop', 'Puma Carina Leather', 1, 1),

-- Vans Old Skool Kadın
('img-011', 'prod-009', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop', 'Vans Old Skool', 1, 1),

-- Reebok Club C Kadın
('img-012', 'prod-010', 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&h=800&fit=crop', 'Reebok Club C', 1, 1),

-- Nike Revolution 6 Çocuk
('img-013', 'prod-011', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&h=800&fit=crop', 'Nike Revolution 6 Çocuk', 1, 1),

-- Adidas Tensaur Çocuk
('img-014', 'prod-012', 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&h=800&fit=crop', 'Adidas Tensaur', 1, 1),

-- Puma Smash V2 Çocuk
('img-015', 'prod-013', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=800&fit=crop', 'Puma Smash V2 Çocuk', 1, 1),

-- Converse All Star Kids
('img-016', 'prod-014', 'https://images.unsplash.com/photo-1628253747716-0c4f5c90fdbd?w=800&h=800&fit=crop', 'Converse All Star Kids', 1, 1),

-- Nike ZoomX Vaporfly
('img-017', 'prod-015', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=800&fit=crop', 'Nike ZoomX Vaporfly', 1, 1),

-- Adidas Predator Edge
('img-018', 'prod-016', 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&h=800&fit=crop', 'Adidas Predator Edge', 1, 1),

-- Puma Future Z
('img-019', 'prod-017', 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&h=800&fit=crop', 'Puma Future Z', 1, 1),

-- Asics Gel-Kayano
('img-020', 'prod-018', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=800&fit=crop', 'Asics Gel-Kayano', 1, 1);

-- Ürün Stokları (Beden bazlı)
INSERT INTO product_stock (id, product_id, size, quantity) VALUES
-- Nike Air Max 90
('stock-001', 'prod-001', '40', 15),
('stock-002', 'prod-001', '41', 20),
('stock-003', 'prod-001', '42', 18),
('stock-004', 'prod-001', '43', 12),
('stock-005', 'prod-001', '44', 10),

-- Adidas Ultraboost 22
('stock-006', 'prod-002', '40', 8),
('stock-007', 'prod-002', '41', 12),
('stock-008', 'prod-002', '42', 15),
('stock-009', 'prod-002', '43', 10),
('stock-010', 'prod-002', '44', 8),

-- Puma Suede Classic
('stock-011', 'prod-003', '40', 20),
('stock-012', 'prod-003', '41', 25),
('stock-013', 'prod-003', '42', 22),
('stock-014', 'prod-003', '43', 18),

-- New Balance 574
('stock-015', 'prod-004', '41', 15),
('stock-016', 'prod-004', '42', 20),
('stock-017', 'prod-004', '43', 12),
('stock-018', 'prod-004', '44', 10),

-- Converse Chuck Taylor
('stock-019', 'prod-005', '39', 18),
('stock-020', 'prod-005', '40', 22),
('stock-021', 'prod-005', '41', 20),
('stock-022', 'prod-005', '42', 15),

-- Nike Air Force 1 Kadın
('stock-023', 'prod-006', '36', 15),
('stock-024', 'prod-006', '37', 20),
('stock-025', 'prod-006', '38', 25),
('stock-026', 'prod-006', '39', 18),
('stock-027', 'prod-006', '40', 12),

-- Adidas Stan Smith Kadın
('stock-028', 'prod-007', '36', 12),
('stock-029', 'prod-007', '37', 18),
('stock-030', 'prod-007', '38', 20),
('stock-031', 'prod-007', '39', 15),

-- Puma Carina Leather
('stock-032', 'prod-008', '36', 18),
('stock-033', 'prod-008', '37', 22),
('stock-034', 'prod-008', '38', 20),
('stock-035', 'prod-008', '39', 15),

-- Vans Old Skool Kadın
('stock-036', 'prod-009', '37', 16),
('stock-037', 'prod-009', '38', 20),
('stock-038', 'prod-009', '39', 18),

-- Reebok Club C Kadın
('stock-039', 'prod-010', '36', 14),
('stock-040', 'prod-010', '37', 18),
('stock-041', 'prod-010', '38', 22),
('stock-042', 'prod-010', '39', 16),

-- Çocuk ve Spor ayakkabılar için stoklar
('stock-043', 'prod-011', '30', 20),
('stock-044', 'prod-011', '31', 18),
('stock-045', 'prod-011', '32', 15),
('stock-046', 'prod-011', '33', 12),

('stock-047', 'prod-012', '28', 15),
('stock-048', 'prod-012', '29', 18),
('stock-049', 'prod-012', '30', 20),
('stock-050', 'prod-012', '31', 15),

('stock-051', 'prod-013', '30', 18),
('stock-052', 'prod-013', '31', 20),
('stock-053', 'prod-013', '32', 16),

('stock-054', 'prod-014', '28', 12),
('stock-055', 'prod-014', '29', 15),
('stock-056', 'prod-014', '30', 18),

('stock-057', 'prod-015', '41', 10),
('stock-058', 'prod-015', '42', 12),
('stock-059', 'prod-015', '43', 8),

('stock-060', 'prod-016', '40', 15),
('stock-061', 'prod-016', '41', 18),
('stock-062', 'prod-016', '42', 15),
('stock-063', 'prod-016', '43', 12),

('stock-064', 'prod-017', '41', 14),
('stock-065', 'prod-017', '42', 16),
('stock-066', 'prod-017', '43', 12),

('stock-067', 'prod-018', '41', 10),
('stock-068', 'prod-018', '42', 12),
('stock-069', 'prod-018', '43', 10),
('stock-070', 'prod-018', '44', 8);

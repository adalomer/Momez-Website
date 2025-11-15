# 🚀 momez - Hızlı Başlangıç Kılavuzu

## ✅ Supabase Olmadan Lokal Test (5 dakika)

Projeyi Supabase kurmadan önce test etmek için:

### 1. Development Server'ı Başlatın

\`\`\`bash
cd /mnt/d/Ubuntu_Dosya/site/momez
npm run dev
\`\`\`

### 2. Tarayıcıda Açın

- **Ana Sayfa**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin (Supabase olmadan erişim engellenir)

⚠️ **Not**: Supabase yapılandırılmadığı için bazı özellikler çalışmayacaktır:
- Kullanıcı girişi
- Ürün veritabanı bağlantısı
- Sepet senkronizasyonu
- Admin panel erişimi

### 3. Şu Anki Durum

✅ **Çalışan Özellikler** (Supabase olmadan):
- Ana sayfa tasarımı
- Header ve Footer
- Responsive menü
- Kategori kartları
- Demo ürün kartları

❌ **Çalışmayan Özellikler**:
- Gerçek ürün verisi
- Sepet ve favoriler
- Kullanıcı hesapları
- Admin paneli

---

## 🔧 Supabase ile Tam Kurulum (30 dakika)

### Adım 1: Supabase Hesabı Oluşturun

1. [supabase.com](https://supabase.com) → "Start your project"
2. GitHub, Google veya Email ile kayıt olun

### Adım 2: Yeni Proje Oluşturun

1. Dashboard'da **"New Project"** tıklayın
2. Bilgileri doldurun:
   - **Name**: momez-ecommerce
   - **Database Password**: Güçlü bir şifre (kaydedin!)
   - **Region**: En yakın bölge
3. **"Create new project"** → 2-3 dakika bekleyin

### Adım 3: API Anahtarlarını Alın

1. Sol menüden **Settings** > **API**
2. Şu bilgileri kopyalayın:
   - **Project URL**: \`https://xxxxxxxx.supabase.co\`
   - **anon public key**: \`eyJhbGciOiJIUzI1...\`
   - **service_role key**: \`eyJhbGciOiJIUzI1...\` (GİZLİ!)

### Adım 4: Environment Variables Ayarlayın

\`.env.local\` dosyasını açın ve değiştirin:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1... # GİZLİ!

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=momez

# WhatsApp Configuration
NEXT_PUBLIC_WHATSAPP_NUMBER=+905551234567
\`\`\`

### Adım 5: Veritabanını Oluşturun

1. Supabase Dashboard → **SQL Editor**
2. "New query" tıklayın
3. \`supabase/migrations/001_initial_schema.sql\` dosyasını açın
4. Tüm içeriği kopyalayıp SQL Editor'e yapıştırın
5. **"Run"** butonuna tıklayın (veya Ctrl+Enter)

✅ Başarılı mesajı görmelisiniz!

### Adım 6: Tabloları Kontrol Edin

1. Sol menü → **Table Editor**
2. Şu tabloları görmelisiniz:
   - profiles
   - categories
   - products
   - product_stock
   - orders
   - order_items
   - addresses
   - shipping_rates
   - favorites
   - cart_items
   - campaigns
   - site_settings

### Adım 7: İlk Admin Kullanıcısı

#### A. Kullanıcı Kaydı
1. Development server'ı başlatın: \`npm run dev\`
2. Tarayıcıda: http://localhost:3000/auth/signup
3. Email ve şifre ile kayıt olun

#### B. Admin Rolü Atama
1. Supabase Dashboard → **Table Editor** → **profiles**
2. Az önce oluşan kullanıcıyı bulun
3. **role** sütununu **admin** yapın
4. Save

#### C. Admin Paneline Giriş
1. http://localhost:3000/admin
2. Admin dashboard açılacak! 🎉

---

## 📝 Demo Veri Ekleme (Opsiyonel)

### Kategoriler Ekleyin

Supabase SQL Editor'de:

\`\`\`sql
-- Kategoriler zaten migration'da eklendi, kontrol edin:
SELECT * FROM categories;
\`\`\`

### Örnek Ürün Ekleyin

\`\`\`sql
-- Kategori ID'sini alın
SELECT id FROM categories WHERE slug = 'erkek' LIMIT 1;

-- Ürün ekleyin (id'yi yukarıdan alın)
INSERT INTO products (
  name, slug, sku, description, price, 
  category_id, is_active, is_featured, images
) VALUES (
  'Air Runner Pro',
  'air-runner-pro',
  'ARP-001',
  'Hafif ve konforlu koşu ayakkabısı. Özel tasarım taban yapısı ile maksimum rahatlık.',
  1899.00,
  'KATEGORI_ID_BURAYA', -- Yukarıdan aldığınız ID
  true,
  true,
  ARRAY[
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800'
  ]
) RETURNING id;

-- Stok ekleyin (product_id'yi yukarıdan alın)
INSERT INTO product_stock (product_id, size, quantity) VALUES
  ('PRODUCT_ID_BURAYA', '39', 10),
  ('PRODUCT_ID_BURAYA', '40', 15),
  ('PRODUCT_ID_BURAYA', '41', 20),
  ('PRODUCT_ID_BURAYA', '42', 12),
  ('PRODUCT_ID_BURAYA', '43', 8);
\`\`\`

### Kargo Ücretleri

\`\`\`sql
-- Zaten migration'da eklendi, kontrol edin:
SELECT * FROM shipping_rates;
\`\`\`

---

## 🎯 Test Checklist

### Müşteri Tarafı
- [ ] Ana sayfa açılıyor
- [ ] Header menüsü çalışıyor
- [ ] Mobil menü açılıyor
- [ ] Footer linkleri var
- [ ] Kampanya kartları görünüyor

### Admin Tarafı
- [ ] Admin paneline giriş yapılabiliyor
- [ ] Dashboard istatistikleri görünüyor
- [ ] Sidebar menüsü çalışıyor
- [ ] Mobil sidebar açılıyor

---

## 🐛 Sorun Giderme

### Hata: "Invalid supabaseUrl"

**Sebep**: \`.env.local\` dosyasında Supabase URL'i ayarlanmamış

**Çözüm**:
1. \`.env.local\` dosyasını açın
2. \`NEXT_PUBLIC_SUPABASE_URL\` değerini gerçek URL ile değiştirin
3. Server'ı yeniden başlatın

### Hata: "Cannot apply unknown utility class"

**Sebep**: Tailwind CSS konfigürasyonu hatası

**Çözüm**:
\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

### Admin Paneline Giremiyorum

**Sebep**: Kullanıcı rolü admin değil

**Çözüm**:
1. Supabase Dashboard → Table Editor → profiles
2. Kullanıcınızı bulun
3. role → admin yapın

### Build Hatası

**Çözüm**:
\`\`\`bash
rm -rf node_modules .next
npm install
npm run build
\`\`\`

---

## 📚 Daha Fazla Bilgi

- **Detaylı Kurulum**: \`SETUP_GUIDE.md\`
- **Geliştirici Notları**: \`DEV_NOTES.md\`
- **Proje Durumu**: \`PROJECT_STATUS.md\`
- **Genel Bilgi**: \`README.md\`

---

## 🚀 Sonraki Adımlar

1. ✅ Lokal test tamamlandı
2. 🔧 Supabase kurulumu yapıldı
3. 👤 Admin kullanıcısı oluşturuldu
4. 📦 Demo veri eklendi
5. 🎨 **Şimdi özellik geliştirmeye başlayabilirsiniz!**

### Geliştirme Öncelikleri:
1. Ürün listesi ve detay sayfası
2. Sepet sistemi
3. Ödeme formu
4. Admin ürün yönetimi

---

**İyi Geliştirmeler!** 🎉

Herhangi bir sorun yaşarsanız, dokümantasyon dosyalarını kontrol edin veya Supabase Dashboard'da veritabanı durumunu inceleyin.

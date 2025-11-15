# momez E-Ticaret Sitesi Kurulum Rehberi

Bu rehber, **momez** e-ticaret sitesinin sıfırdan kurulumu ve yapılandırılması için adım adım talimatlar içerir.

## 📋 İçindekiler

1. [Ön Gereksinimler](#ön-gereksinimler)
2. [Supabase Kurulumu](#supabase-kurulumu)
3. [Proje Kurulumu](#proje-kurulumu)
4. [Veritabanı Yapılandırması](#veritabanı-yapılandırması)
5. [İlk Admin Kullanıcısı Oluşturma](#ilk-admin-kullanıcısı-oluşturma)
6. [WhatsApp Entegrasyonu](#whatsapp-entegrasyonu)
7. [Deployment](#deployment)

---

## 1. Ön Gereksinimler

Aşağıdaki araçların sisteminizde kurulu olması gerekir:

- **Node.js** 18 veya üzeri ([İndir](https://nodejs.org/))
- **npm** veya **yarn** package manager
- **Git** ([İndir](https://git-scm.com/))
- Modern bir web tarayıcı
- Bir text editör (VS Code önerilir)

---

## 2. Supabase Kurulumu

### 2.1. Supabase Hesabı Oluşturun

1. [supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub, Google veya email ile kayıt olun

### 2.2. Yeni Proje Oluşturun

1. Dashboard'da "New Project" butonuna tıklayın
2. Proje bilgilerini doldurun:
   - **Name**: momez-ecommerce (veya istediğiniz ad)
   - **Database Password**: Güçlü bir şifre oluşturun (kaydedin!)
   - **Region**: Size en yakın bölgeyi seçin
   - **Pricing Plan**: Free tier ile başlayabilirsiniz

3. "Create new project" butonuna tıklayın (2-3 dakika sürebilir)

### 2.3. API Anahtarlarını Alın

1. Proje oluşturulduktan sonra sol menüden **Settings** > **API** seçin
2. Aşağıdaki bilgileri not alın:
   - **Project URL**: `https://xxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1...`
   - **service_role key**: `eyJhbGciOiJIUzI1...` (Bu gizli tutulmalı!)

---

## 3. Proje Kurulumu

### 3.1. Projeyi Klonlayın veya İndirin

\`\`\`bash
# Git ile klonlama
git clone <repository-url>
cd momez

# Veya ZIP olarak indirip klasöre gidin
\`\`\`

### 3.2. Bağımlılıkları Kurun

\`\`\`bash
npm install
\`\`\`

### 3.3. Environment Variables Ayarlayın

1. \`.env.example\` dosyasını kopyalayıp \`.env.local\` olarak kaydedin:

\`\`\`bash
cp .env.example .env.local
\`\`\`

2. \`.env.local\` dosyasını açın ve Supabase bilgilerinizi girin:

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

---

## 4. Veritabanı Yapılandırması

### 4.1. SQL Migration'ı Çalıştırın

1. Supabase Dashboard'da **SQL Editor** sekmesine gidin
2. "New query" butonuna tıklayın
3. `supabase/migrations/001_initial_schema.sql` dosyasının içeriğini kopyalayın
4. SQL Editor'e yapıştırın
5. "Run" butonuna tıklayın (veya Ctrl/Cmd + Enter)

### 4.2. Tabloları Kontrol Edin

1. Sol menüden **Table Editor** sekmesine gidin
2. Aşağıdaki tabloların oluştuğunu doğrulayın:
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

### 4.3. Row Level Security (RLS) Kontrolü

1. Her tablonun yanında **RLS enabled** yazısını göreceksiniz
2. Bu, güvenlik politikalarının aktif olduğunu gösterir

---

## 5. İlk Admin Kullanıcısı Oluşturma

### 5.1. Kullanıcı Kaydı

1. Projeyi başlatın:
\`\`\`bash
npm run dev
\`\`\`

2. Tarayıcıda \`http://localhost:3000/auth/signup\` adresine gidin
3. Kayıt formunu doldurun (bu sizin admin hesabınız olacak)

### 5.2. Admin Rolü Atama

1. Supabase Dashboard'da **Table Editor** > **profiles** sekmesine gidin
2. Az önce oluşturduğunuz kullanıcıyı bulun
3. **role** sütununu **admin** olarak değiştirin
4. Save butonuna tıklayın

### 5.3. Admin Paneline Giriş

1. Tarayıcıda \`http://localhost:3000/admin\` adresine gidin
2. Admin paneli açılacaktır

---

## 6. Demo Verisi Ekleme (Opsiyonel)

### 6.1. Kategoriler

SQL Editor'de şu komutu çalıştırın:

\`\`\`sql
INSERT INTO public.categories (name, slug, description, is_active, display_order) VALUES
  ('Erkek Ayakkabı', 'erkek', 'Erkekler için ayakkabı koleksiyonu', true, 1),
  ('Kadın Ayakkabı', 'kadin', 'Kadınlar için ayakkabı koleksiyonu', true, 2),
  ('Spor Ayakkabı', 'spor', 'Spor ve günlük ayakkabılar', true, 3),
  ('Çocuk Ayakkabı', 'cocuk', 'Çocuklar için ayakkabı koleksiyonu', true, 4);
\`\`\`

### 6.2. Örnek Ürün

\`\`\`sql
-- Kategori ID'sini önce alın
SELECT id FROM categories WHERE slug = 'erkek' LIMIT 1;

-- Ürün ekleyin (kategori_id'yi yukarıdan aldığınız ID ile değiştirin)
INSERT INTO public.products (
  name, 
  slug, 
  sku, 
  description, 
  price, 
  category_id, 
  is_active, 
  is_featured,
  images
) VALUES (
  'AeroGlide Pro',
  'aeroglide-pro',
  'AGP-001',
  'Hafif ve konforlu koşu ayakkabısı',
  1899.00,
  'KATEGORI_ID_BURAYA', -- Yukarıdan aldığınız ID
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']
);

-- Stok ekleyin (product_id'yi yukarıdan alın)
INSERT INTO public.product_stock (product_id, size, quantity) VALUES
  ('PRODUCT_ID_BURAYA', '39', 10),
  ('PRODUCT_ID_BURAYA', '40', 15),
  ('PRODUCT_ID_BURAYA', '41', 20),
  ('PRODUCT_ID_BURAYA', '42', 12),
  ('PRODUCT_ID_BURAYA', '43', 8);
\`\`\`

### 6.3. Kargo Ücretleri

\`\`\`sql
INSERT INTO public.shipping_rates (city, rate, estimated_days) VALUES
  ('İstanbul', 25.00, 2),
  ('Ankara', 30.00, 2),
  ('İzmir', 35.00, 3),
  ('Antalya', 40.00, 3);
\`\`\`

---

## 7. WhatsApp Entegrasyonu

### 7.1. WhatsApp Business API (Profesyonel)

1. [Facebook Business Manager](https://business.facebook.com/) hesabı oluşturun
2. WhatsApp Business API başvurusu yapın
3. API credentials'ları alın
4. \`.env.local\` dosyasına ekleyin

### 7.2. Basit WhatsApp Entegrasyonu (Hızlı Başlangıç)

Şu an için WhatsApp web URL'leri kullanılıyor:

\`\`\`typescript
const message = \`Yeni sipariş: #\${orderNumber}\nMüşteri: \${customerName}\nTutar: ₺\${total}\`;
const whatsappUrl = \`https://wa.me/\${WHATSAPP_NUMBER}?text=\${encodeURIComponent(message)}\`;
window.open(whatsappUrl, '_blank');
\`\`\`

---

## 8. Deployment

### 8.1. Vercel ile Deploy (Önerilen)

1. [Vercel](https://vercel.com) hesabı oluşturun
2. "New Project" butonuna tıklayın
3. GitHub repository'nizi bağlayın
4. Environment Variables ekleyin:
   - \`NEXT_PUBLIC_SUPABASE_URL\`
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
   - \`SUPABASE_SERVICE_ROLE_KEY\`
   - \`NEXT_PUBLIC_SITE_URL\` (production URL)
   - \`NEXT_PUBLIC_WHATSAPP_NUMBER\`

5. "Deploy" butonuna tıklayın

### 8.2. Custom Domain Ekleme

1. Vercel Dashboard'da projenizi seçin
2. Settings > Domains sekmesine gidin
3. Domain adınızı ekleyin
4. DNS kayıtlarını günceleyin (Vercel talimatları gösterecektir)

---

## 9. Son Kontroller

### ✅ Checklist

- [ ] Supabase projesi oluşturuldu
- [ ] Tüm tablolar ve RLS policies aktif
- [ ] Environment variables doğru ayarlandı
- [ ] İlk admin kullanıcısı oluşturuldu
- [ ] Demo kategoriler ve ürünler eklendi
- [ ] Kargo ücretleri tanımlandı
- [ ] Site yerel olarak çalışıyor (\`npm run dev\`)
- [ ] Admin paneline giriş yapılabiliyor
- [ ] Ürünler ana sayfada görünüyor

---

## 🆘 Sorun Giderme

### Build Hataları

\`\`\`bash
# Node modules'ü temizle
rm -rf node_modules
rm package-lock.json
npm install
\`\`\`

### Supabase Bağlantı Hataları

1. \`.env.local\` dosyasını kontrol edin
2. Supabase URL ve keys doğru mu?
3. Supabase projesi aktif mi?

### RLS Policy Hataları

1. SQL migration tamamen çalıştırıldı mı?
2. Kullanıcı rolü doğru atandı mı?

---

## 📚 Ek Kaynaklar

- [Next.js Dokümantasyonu](https://nextjs.org/docs)
- [Supabase Dokümantasyonu](https://supabase.com/docs)
- [Tailwind CSS Dokümantasyonu](https://tailwindcss.com/docs)

---

**Tebrikler!** momez e-ticaret siteniz çalışır durumda 🎉

Herhangi bir sorunla karşılaşırsanız, lütfen destek ekibiyle iletişime geçin.

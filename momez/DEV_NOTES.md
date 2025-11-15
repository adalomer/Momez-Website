# momez E-Ticaret Projesi - Geliştirici Notları

## 🎯 Proje Durumu

### ✅ Tamamlanan Özellikler

#### 1. Temel Altyapı
- ✅ Next.js 14 (App Router) kurulumu
- ✅ TypeScript yapılandırması
- ✅ Tailwind CSS entegrasyonu
- ✅ Supabase client/server setup
- ✅ Authentication middleware
- ✅ Environment variables yapılandırması

#### 2. Veritabanı
- ✅ Tam veritabanı şeması (12 tablo)
- ✅ Row Level Security (RLS) policies
- ✅ Kullanıcı rolleri (customer, employee, admin)
- ✅ Otomatik sipariş numarası üretimi
- ✅ Stok yönetimi trigger'ları
- ✅ TypeScript type definitions

#### 3. Frontend Bileşenleri
- ✅ Responsive Header (mobil uyumlu)
- ✅ Footer (sosyal medya linkleri)
- ✅ Ana sayfa (hero, kategoriler, kampanyalar, ürünler)
- ✅ Admin Sidebar (mobil menü)
- ✅ Admin Dashboard (istatistikler, son siparişler, düşük stok)

#### 4. Sayfa Yapısı
- ✅ Public layout (müşteri sayfaları)
- ✅ Admin layout (yönetim paneli)
- ✅ Ana sayfa
- ✅ Admin dashboard

---

## 🔨 Devam Eden / Planlanan Özellikler

### A. Müşteri Tarafı Sayfalar

#### 1. Ürün Sayfaları
- [ ] **Kategori Sayfası** (`/kategori/[slug]`)
  - Filtreleme (fiyat, beden, renk, stok)
  - Sıralama (fiyat, popülerlik, yenilik)
  - Pagination
  - Grid/List view toggle

- [ ] **Ürün Detay Sayfası** (`/urun/[slug]`)
  - 5+ fotoğraf galeri
  - Beden seçimi (stok durumu ile)
  - Miktar seçimi
  - Sepete ekleme
  - Favorilere ekleme
  - Ürün açıklaması
  - Benzer ürünler

- [ ] **Arama Sayfası** (`/arama`)
  - Ürün adı, SKU arama
  - Filtreleme özellikleri
  - Arama geçmişi

#### 2. Sepet ve Ödeme
- [ ] **Sepet Sayfası** (`/sepet`)
  - Ürün listesi (resim, ad, beden, adet, fiyat)
  - Adet güncelleme
  - Ürün silme
  - Toplam hesaplama
  - Kargo ücreti hesaplama

- [ ] **Ödeme Sayfası** (`/odeme`)
  - Müşteri bilgileri formu
  - Adres seçimi/ekleme
  - Şehir seçimi (kargo ücreti)
  - Sipariş özeti
  - Kapıda ödeme onayı
  - Sipariş oluşturma

- [ ] **Sipariş Başarılı Sayfası** (`/siparis-basarili/[id]`)
  - Sipariş detayları
  - Takip numarası
  - WhatsApp bildirimi butonu

#### 3. Kullanıcı Hesap
- [ ] **Giriş/Kayıt** (`/auth/login`, `/auth/signup`)
  - Email/şifre ile kayıt
  - Email doğrulama
  - Şifre sıfırlama

- [ ] **Profil Sayfası** (`/hesabim`)
  - Kişisel bilgiler düzenleme
  - Şifre değiştirme
  - Avatar yükleme

- [ ] **Adreslerim** (`/hesabim/adresler`)
  - Adres listesi
  - Yeni adres ekleme
  - Varsayılan adres seçme
  - Adres düzenleme/silme

- [ ] **Siparişlerim** (`/hesabim/siparisler`)
  - Sipariş listesi
  - Sipariş detayı
  - Sipariş durumu
  - İptal talebi

- [ ] **Favorilerim** (`/favoriler`)
  - Favori ürün listesi
  - Favoriden kaldırma
  - Sepete ekleme

#### 4. Sipariş Takip
- [ ] **Sipariş Takip** (`/siparis-takip`)
  - Sipariş numarası ile sorgulama
  - Durum gösterimi (timeline)
  - Kargo takip numarası
  - Tahmini teslimat tarihi

#### 5. Kurumsal Sayfalar
- [ ] **Hakkımızda** (`/hakkimizda`)
- [ ] **İletişim** (`/iletisim`)
  - İletişim formu
  - WhatsApp butonu
  - Sosyal medya linkleri
- [ ] **Kargo ve Ödeme** (`/kargo-ve-odeme`)
- [ ] **İade ve Değişim** (`/iade-ve-degisim`)
- [ ] **Gizlilik Politikası** (`/gizlilik-politikasi`)
- [ ] **Kullanım Koşulları** (`/kullanim-kosullari`)

---

### B. Admin Panel Sayfaları

#### 1. Sipariş Yönetimi
- [ ] **Sipariş Listesi** (`/admin/siparisler`)
  - Tüm siparişler tablosu
  - Filtreleme (durum, tarih, müşteri)
  - Arama (sipariş no, müşteri adı)
  - Durum güncelleme (toplu/tekli)
  - Excel export

- [ ] **Sipariş Detay** (`/admin/siparisler/[id]`)
  - Sipariş bilgileri
  - Müşteri bilgileri
  - Ürün listesi
  - Durum geçmişi
  - Kargo bilgileri
  - Fatura yazdırma
  - İrsaliye yazdırma
  - WhatsApp mesajı gönderme

#### 2. Ürün Yönetimi
- [ ] **Ürün Listesi** (`/admin/urunler`)
  - Tüm ürünler tablosu
  - Filtreleme (kategori, durum)
  - Arama (ad, SKU)
  - Toplu işlemler (aktif/pasif, silme)
  - Hızlı düzenleme

- [ ] **Yeni Ürün** (`/admin/urunler/yeni`)
  - Ürün bilgileri formu
  - 5+ fotoğraf yükleme
  - Kategori seçimi
  - Renk seçimi
  - SEO ayarları

- [ ] **Ürün Düzenle** (`/admin/urunler/[id]`)
  - Tüm bilgileri güncelleme
  - Fotoğraf yönetimi
  - Durum değiştirme

#### 3. Stok Yönetimi
- [ ] **Stok Listesi** (`/admin/stok`)
  - Ürün bazlı stok görünümü
  - Beden bazlı stok
  - Düşük stok uyarıları
  - Excel import/export
  - Toplu stok güncelleme

- [ ] **Stok Geçmişi**
  - Stok hareketleri
  - Giriş/çıkış kayıtları
  - Sipariş bazlı stok düşüşü

#### 4. Müşteri Yönetimi
- [ ] **Müşteri Listesi** (`/admin/musteriler`)
  - Tüm müşteriler
  - Arama ve filtreleme
  - Sipariş sayısı
  - Toplam harcama
  - Son sipariş tarihi

- [ ] **Müşteri Detay** (`/admin/musteriler/[id]`)
  - Müşteri bilgileri
  - Sipariş geçmişi
  - Adresler
  - İletişim bilgileri
  - Notlar ekleme

#### 5. Kategori Yönetimi
- [ ] **Kategori Listesi** (`/admin/kategoriler`)
  - Tüm kategoriler
  - Sıralama (drag & drop)
  - Ekleme/düzenleme/silme
  - Alt kategori yönetimi

#### 6. Kampanya Yönetimi
- [ ] **Kampanya Listesi** (`/admin/kampanyalar`)
  - Aktif/pasif kampanyalar
  - Banner yükleme
  - Başlangıç/bitiş tarihi
  - İndirim oranı

#### 7. Kargo Yönetimi
- [ ] **Kargo Ücretleri** (`/admin/kargo`)
  - Şehir bazlı ücretler
  - Toplu güncelleme
  - Ücretsiz kargo limiti
  - Tahmini teslimat süreleri

#### 8. Raporlama
- [ ] **Satış Raporları** (`/admin/raporlar/satis`)
  - Günlük/haftalık/aylık satışlar
  - Grafikler (Chart.js)
  - Excel export
  - Karşılaştırmalar

- [ ] **Ürün Raporları** (`/admin/raporlar/urunler`)
  - En çok satanlar
  - En az satanlar
  - Kategori bazlı satışlar

- [ ] **Müşteri Raporları** (`/admin/raporlar/musteriler`)
  - Yeni müşteriler
  - Sadık müşteriler
  - Şehir bazlı dağılım

#### 9. Kullanıcı ve Rol Yönetimi
- [ ] **Kullanıcı Listesi** (`/admin/kullanicilar`)
  - Admin/çalışan/müşteri listesi
  - Rol atama
  - Yetki yönetimi
  - Hesap aktif/pasif

#### 10. Site Ayarları
- [ ] **Genel Ayarlar** (`/admin/ayarlar/genel`)
  - Site başlığı
  - Logo
  - Favicon
  - İletişim bilgileri
  - Sosyal medya

- [ ] **SEO Ayarları** (`/admin/ayarlar/seo`)
  - Meta tags
  - Sitemap
  - Robots.txt
  - Google Analytics
  - Facebook Pixel

- [ ] **Bildirim Ayarları** (`/admin/ayarlar/bildirimler`)
  - WhatsApp mesaj şablonları
  - Email şablonları
  - SMS ayarları

---

## 📊 State Management

### Zustand Stores (Oluşturulacak)

\`\`\`typescript
// stores/useCartStore.ts
- Cart items
- Add to cart
- Remove from cart
- Update quantity
- Clear cart
- Calculate total

// stores/useAuthStore.ts
- Current user
- User role
- Login/logout
- Session management

// stores/useFavoritesStore.ts
- Favorite items
- Add/remove favorites
- Sync with database

// stores/useNotificationStore.ts
- Toast notifications
- Success/error messages
\`\`\`

---

## 🔐 Authentication Flow

### Müşteri
1. Kayıt → Email doğrulama → Giriş
2. Profil oluşturulur (role: customer)
3. Sepet, favoriler erişimi

### Admin/Çalışan
1. Admin tarafından oluşturulur
2. Email ile davet
3. İlk girişte şifre belirleme
4. Yetki seviyesine göre panel erişimi

---

## 🎨 Tasarım Sistemi

### Renk Paleti
\`\`\`css
--primary: #ee2b2b (Kırmızı)
--primary-dark: #dc2626
--primary-light: #fca5a5

--bg-light: #ffffff
--bg-dark: #111111

--gray-50: #f8f9fa
--gray-100: #f1f3f5
--gray-200: #e9ecef
--gray-300: #dee2e6
--gray-400: #ced4da
--gray-500: #adb5bd
--gray-600: #6c757d
--gray-700: #495057
--gray-800: #343a40
--gray-900: #212529
\`\`\`

### Komponet Boyutları
- Button height: 40px (h-10), 48px (h-12)
- Input height: 40px (h-10)
- Border radius: 0.25rem, 0.5rem, 0.75rem
- Card padding: 24px (p-6)

---

## 📦 Paketler

### Mevcut
- next: 16.0.3
- react: 19.0.0
- typescript: 5.x
- tailwindcss: 4.x
- @supabase/supabase-js
- @supabase/ssr
- zustand
- react-hot-toast
- lucide-react
- date-fns

### Eklenecek
- [ ] chart.js / recharts (grafikler için)
- [ ] react-dropzone (fotoğraf yükleme)
- [ ] react-image-gallery (ürün fotoğrafları)
- [ ] xlsx (Excel export)
- [ ] react-to-print (fatura yazdırma)
- [ ] react-select (gelişmiş select)

---

## 🚀 Performans Optimizasyonları

### Image Optimization
- Next.js Image component kullan
- WebP format
- Lazy loading
- Placeholder blur

### Code Splitting
- Dynamic imports
- Route-based splitting
- Component lazy loading

### Caching
- SWR / React Query
- Supabase cache
- Static Generation where possible

---

## 📝 TODO Priority

### High Priority (1-2 Hafta)
1. ✅ Temel altyapı
2. ✅ Veritabanı şeması
3. ✅ Ana sayfa
4. ✅ Admin dashboard
5. [ ] Ürün listesi ve detay sayfası
6. [ ] Sepet ve ödeme
7. [ ] Sipariş yönetimi

### Medium Priority (2-4 Hafta)
8. [ ] Kullanıcı authentication
9. [ ] Favoriler
10. [ ] Admin ürün yönetimi
11. [ ] Stok yönetimi
12. [ ] Sipariş takip

### Low Priority (4-6 Hafta)
13. [ ] Kampanya yönetimi
14. [ ] Raporlama
15. [ ] WhatsApp entegrasyonu
16. [ ] SEO optimizasyonu
17. [ ] Email bildirimleri

---

## 🐛 Bilinen Sorunlar

- Yok (henüz)

---

## 📞 İletişim

Geliştirici notları ve sorular için:
- Email: dev@momez.com
- Slack: #momez-dev

---

**Son Güncelleme**: 15 Kasım 2025
**Versiyon**: 0.1.0 (Alpha)

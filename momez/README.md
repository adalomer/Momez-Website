# momez - E-Ticaret Platformu 🛍️

Modern, responsive ve kullanıcı dostu ayakkabı e-ticaret sitesi. Next.js 14 ve Supabase ile geliştirilmiştir.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e)

## ✨ Özellikler

### 🛒 Müşteri Özellikleri
- Modern ve responsive tasarım (Kırmızı-Beyaz tema)
- Kategori bazlı ürün listeleme (Erkek/Kadın/Spor/Çocuk)
- Ürün arama ve filtreleme
- Ürün detay sayfası (5+ fotoğraf, beden seçimi)
- Sepet yönetimi
- Favoriler sistemi
- Kullanıcı profil yönetimi
- Sipariş takip
- Kapıda ödeme

### 👨‍💼 Admin Panel
- Dashboard (istatistikler, grafikler)
- Sipariş yönetimi
- Ürün yönetimi (5+ fotoğraf, stok)
- Numara bazlı stok takibi
- Kategori yönetimi
- Kampanya yönetimi
- Kargo ücretleri yönetimi
- Kullanıcı ve rol yönetimi
- Raporlama

## 🚀 Hızlı Başlangıç

### Supabase Olmadan Test (Sadece Tasarım)

```bash
npm install
npm run dev
```

http://localhost:3000 adresine gidin.

⚠️ **Not**: Gerçek veri çalışmaz, sadece tasarım görünür.

### Tam Kurulum (Tüm Özellikler)

Detaylı kurulum için: **[QUICKSTART.md](./QUICKSTART.md)** ← Buraya tıklayın!

**Kısa Özet:**
1. Supabase hesabı oluşturun
2. Yeni proje oluşturun
3. SQL migration'ı çalıştırın
4. `.env.local` dosyasını yapılandırın
5. Admin kullanıcısı oluşturun

## 📁 Proje Yapısı

```
momez/
├── app/
│   ├── (public)/          # Müşteri sayfaları
│   │   ├── page.tsx       # Ana sayfa ✅
│   │   └── layout.tsx
│   ├── admin/             # Admin panel
│   │   ├── page.tsx       # Dashboard ✅
│   │   └── layout.tsx
│   └── layout.tsx         # Root layout
├── components/            # Paylaşılan componentler
│   ├── Header.tsx         ✅
│   ├── Footer.tsx         ✅
│   └── admin/
│       └── AdminSidebar.tsx ✅
├── lib/supabase/          # Supabase utilities
├── types/database.ts      # TypeScript types
└── supabase/migrations/   # SQL migration
```

## 🛠️ Teknoloji Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Veritabanı**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Dil**: TypeScript
- **Icons**: Lucide React
- **Bildirimler**: React Hot Toast

## 📚 Dokümantasyon

| Dosya | Açıklama |
|-------|----------|
| **[QUICKSTART.md](./QUICKSTART.md)** | 🚀 Hızlı başlangıç kılavuzu (ÖNERİLİR) |
| **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** | Detaylı kurulum talimatları |
| **[DEV_NOTES.md](./DEV_NOTES.md)** | Geliştirici notları ve TODO |
| **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** | Proje durumu ve özellikler |

## 🎨 Tasarım Sistemi

### Renkler
- **Primary**: #ee2b2b (Kırmızı)
- **Background Light**: #ffffff
- **Background Dark**: #111111

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 📊 Veritabanı

12 tablo içeren tam SQL şeması:
- profiles, categories, products, product_stock
- orders, order_items, addresses, shipping_rates
- favorites, cart_items, campaigns, site_settings

## 🔐 Güvenlik

- ✅ Row Level Security (RLS)
- ✅ Role-based access control
- ✅ Secure environment variables
- ✅ Authentication middleware
- ✅ SQL injection protection

## 📈 Durum

**v0.1.0-alpha** - Temel altyapı tamamlandı

✅ **Tamamlanan**:
- Temel altyapı ve tasarım
- Ana sayfa
- Admin dashboard
- Veritabanı şeması

🚧 **Devam Eden**:
- Ürün sayfaları
- Sepet sistemi
- Authentication

## 🐛 Sorun mu Var?

**"Invalid supabaseUrl" Hatası**:
→ `.env.local` dosyasını yapılandırın ([QUICKSTART.md](./QUICKSTART.md))

**Admin paneline giremiyorum**:
→ Supabase'de kullanıcı rolünü "admin" yapın

**Build hatası**:
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📞 İletişim

- **Email**: iletisim@momez.com
- **Tel**: +90 555 123 4567

## 📄 Lisans

Bu proje özel bir projedir.

---

**momez** - Premium Ayakkabı Mağazası 🎉

[Hızlı Başlangıç →](./QUICKSTART.md)

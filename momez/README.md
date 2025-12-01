# 🛒 Momez E-Ticaret Sitesi

Modern, full-stack e-ticaret platformu. Next.js, TypeScript, MySQL ve Docker ile geliştirilmiştir.

## 🚀 Hızlı Başlangıç

### Docker ile Kurulum

```bash
# 1. Docker'ı başlat
docker compose up -d

# 2. Tarayıcıda aç
http://localhost:3000
```

### Geliştirme Ortamı

```bash
# Dependencies yükle
npm install

# Geliştirme modunda çalıştır
npm run dev
```

## 📁 Proje Yapısı

```
momez/
├── app/                    # Next.js app router
├── components/             # React bileşenleri
├── lib/                    # Utility fonksiyonlar
├── database/               # MySQL init scripts
├── public/                 # Static dosyalar
├── types/                  # TypeScript type definitions
├── uploads/                # Yüklenen dosyalar
└── docker-compose.yml      # Docker yapılandırma
```

## 🛠️ Teknolojiler

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** MySQL 8.0
- **DevOps:** Docker, Docker Compose

## 📊 Özellikler

- ✅ Ürün yönetimi (CRUD)
- ✅ Kullanıcı sistemi (kayıt/giriş)
- ✅ Sepet ve sipariş yönetimi
- ✅ Admin paneli
- ✅ Kategori sistemi
- ✅ Resim yükleme
- ✅ Stok takibi
- ✅ Kampanya yönetimi

## 🐳 Docker Komutları

```bash
# Başlat
docker compose up -d

# Durdur
docker compose down

# Logları göster
docker compose logs -f

# Yeniden başlat
docker compose restart
```

## 💾 Backup & Restore

```bash
# Backup al
docker exec momez-mysql mysqldump -uroot -prootpassword momez_db > backup.sql

# Restore et
docker exec -i momez-mysql mysql -uroot -prootpassword momez_db < backup.sql
```

## 🌐 Erişim Bilgileri

| Servis | URL |
|--------|-----|
| Web Sitesi | http://localhost:3000 |
| phpMyAdmin | http://localhost:8080 |
| MySQL | localhost:3306 |

### Database Bilgileri
- **Database:** momez_db
- **User:** momez_user
- **Password:** momez_password

## 🔒 Güvenlik

⚠️ Production ortamında:
- JWT_SECRET değiştirin
- Database şifrelerini güncelleyin
- `.env` dosyası kullanın

## 🐛 Sorun Giderme

### MySQL başlamıyor
```bash
docker compose down -v
docker compose up -d
```

### Port 3000 kullanımda
```bash
lsof -i :3000
kill -9 <PID>
```

---

**🎉 İyi kodlamalar!**

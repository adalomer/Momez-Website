# 🚀 Momez E-Commerce - Docker Setup Guide

Bu proje Docker ile çalışacak şekilde yapılandırılmıştır. MySQL veritabanı ve Next.js uygulaması container'lar içinde çalışır.

## 📋 Gereksinimler

- Docker Desktop (Windows/Mac) veya Docker Engine (Linux)
- Docker Compose v2.0+
- En az 4GB RAM
- En az 10GB disk alanı

## 🎯 Hızlı Başlangıç

### 1. Paketleri Yükle
```bash
npm install
```

### 2. Environment Dosyasını Kopyala
```bash
cp .env.example .env.local
```

### 3. Docker Container'ları Başlat
```bash
# Arka planda çalıştır
npm run docker:up

# veya
docker-compose up -d
```

### 4. Servislerin Durumunu Kontrol Et
```bash
docker-compose ps
```

Tüm servisler "Up" durumunda olmalı:
- ✅ momez-mysql (Port: 3306)
- ✅ momez-app (Port: 3000)
- ✅ momez-phpmyadmin (Port: 8080)

## 🌐 Erişim URL'leri

| Servis | URL | Açıklama |
|--------|-----|----------|
| **Web Sitesi** | http://localhost:3000 | Ana uygulama |
| **Admin Panel** | http://localhost:3000/admin | Yönetim paneli |
| **phpMyAdmin** | http://localhost:8080 | Database yönetimi |

### phpMyAdmin Giriş Bilgileri
- **Server:** mysql
- **Username:** momez_user
- **Password:** momez_password
- **Database:** momez_db

## 🛠️ Geliştirme

### Local Development (Docker olmadan)
```bash
# MySQL'i Docker'da çalıştır ama Next.js'i local'de çalıştır
docker-compose up -d mysql phpmyadmin
npm run dev
```

### Container Loglarını İzleme
```bash
# Tüm loglar
docker-compose logs -f

# Sadece app logları
npm run docker:logs
```

### Container'ı Yeniden Başlat
```bash
npm run docker:restart

# veya
docker-compose restart app
```

### Container'ları Durdur
```bash
npm run docker:down

# veya
docker-compose down
```

### Container'ları ve Volume'leri Sil (DİKKAT: Veritabanı silinir!)
```bash
docker-compose down -v
```

## 📊 Database Yapısı

Veritabanı otomatik olarak `database/init.sql` dosyasından oluşturulur:

- ✅ 12 Tablo (users, products, orders, vb.)
- ✅ Foreign Key constraints
- ✅ Indexler
- ✅ Demo data (admin kullanıcı, kategoriler)
- ✅ Views (istatistikler, düşük stok)

### Admin Giriş Bilgileri
- **Email:** admin@momez.com
- **Şifre:** admin123

## 🔧 Özelleştirme

### Port Değiştirme
`docker-compose.yml` dosyasında port'ları değiştirebilirsiniz:

```yaml
services:
  app:
    ports:
      - "8000:3000"  # Host:Container
```

### MySQL Şifresi Değiştirme
1. `docker-compose.yml` içindeki MYSQL_PASSWORD'u değiştir
2. `.env.local` içindeki DATABASE_PASSWORD'u değiştir
3. Container'ları yeniden oluştur:
```bash
docker-compose down -v
docker-compose up -d
```

## 📦 Production Build

### Docker Image Oluştur
```bash
npm run docker:build

# veya
docker-compose build
```

### Production'da Çalıştır
```bash
docker-compose -f docker-compose.yml up -d
```

## 🐛 Sorun Giderme

### Container başlamıyor
```bash
# Logları kontrol et
docker-compose logs mysql
docker-compose logs app

# Container'ı sıfırla
docker-compose down
docker-compose up -d
```

### Port zaten kullanımda
```bash
# Port'u kullanan process'i bul (Windows)
netstat -ano | findstr :3000

# Port'u kullanan process'i bul (Linux/Mac)
lsof -i :3000

# Process'i durdur ve tekrar dene
```

### Database bağlantı hatası
```bash
# MySQL'in hazır olup olmadığını kontrol et
docker-compose exec mysql mysql -u momez_user -p momez_db

# Database'i yeniden oluştur
docker-compose down -v
docker-compose up -d
```

### Permission hataları (Linux)
```bash
# Docker kullanıcı grupuna ekle
sudo usermod -aG docker $USER
newgrp docker

# Yeniden başlat
sudo systemctl restart docker
```

## 📱 Platform Desteği

Bu Docker setup aşağıdaki platformlarda test edilmiştir:

- ✅ Windows 10/11 (Docker Desktop)
- ✅ macOS (Intel & Apple Silicon)
- ✅ Linux (Ubuntu, Debian, CentOS)
- ✅ WSL2 (Windows Subsystem for Linux)

## 🚀 Production Deployment

### 1. Cloud Hosting'e Deploy

#### DigitalOcean / Linode / Vultr
```bash
# 1. Sunucuya SSH bağlan
ssh root@your-server-ip

# 2. Docker yükle
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Projeyi kopyala
git clone your-repo-url
cd momez

# 4. Environment ayarla
cp .env.example .env.local
nano .env.local  # Düzenle

# 5. Çalıştır
docker-compose up -d
```

#### AWS / Google Cloud / Azure
- Container Registry kullan
- Load Balancer ekle
- Auto-scaling yapılandır
- Managed MySQL servisine geç (RDS, Cloud SQL, vb.)

### 2. Yedekleme (Backup)

```bash
# Database yedeği al
docker-compose exec mysql mysqldump -u momez_user -p momez_db > backup.sql

# Yedeği geri yükle
docker-compose exec -T mysql mysql -u momez_user -p momez_db < backup.sql
```

## 📖 API Dökümantasyonu

API endpoint'leri `/app/api` klasöründe bulunur:

- `GET /api/products` - Ürün listesi
- `GET /api/products/[slug]` - Ürün detay
- `POST /api/products` - Ürün ekle (Admin)
- `PUT /api/products/[slug]` - Ürün güncelle (Admin)
- `DELETE /api/products/[slug]` - Ürün sil (Admin)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📝 Notlar

- Production'da JWT_SECRET ve SESSION_SECRET değerlerini mutlaka değiştirin
- SSL/HTTPS kullanın (Let's Encrypt ücretsiz)
- Database yedeği almayı unutmayın
- Logları düzenli kontrol edin
- Container'ların health check'ini izleyin

## 📞 Destek

Sorularınız için:
- GitHub Issues
- Email: info@momez.com

---

Made with ❤️ by Momez Team

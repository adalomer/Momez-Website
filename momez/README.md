# 🛒 Momez E-Ticaret Sitesi

Modern, full-stack e-ticaret platformu. Next.js, TypeScript, MySQL ve Docker ile geliştirilmiştir.

## 🚀 Hızlı Başlangıç

### Yeni Kurulum

⚠️ **NOT:** SQL backup dosyaları güvenlik nedeniyle Git'e dahil edilmemiştir.

```bash
# 1. Projeyi klonla
git clone <repo-url>
cd momez

# 2. SQL Backup'ı al (seçenekler):
#    a) USB'den kopyala: cp /media/usb/backup.sql.gz backups/
#    b) Cloud'dan indir: rclone copy gdrive:backups/ backups/
#    c) Güvenli sunucudan: scp user@server:/path/backup.sql.gz backups/

# 3. Restore script'ini çalıştır
./git_data_package/RESTORE.sh

# 4. Docker'ı başlat
docker-compose up -d

# 5. SQL Restore (gerekirse)
./restore-backup.sh

# 6. Tarayıcıda aç
http://localhost:3000
```

### Alternatif: Boş Database ile Başlama
```bash
git clone <repo-url>
cd momez
docker-compose up -d
# database/init.sql otomatik çalışacak
```

### Geliştirme Ortamı
```bash
# Dependencies yükle
npm install

# Geliştirme modunda çalıştır
npm run dev

# veya Docker ile
docker-compose -f docker-compose.dev.yml up
```

## 📁 Proje Yapısı

```
momez/
├── app/                    # Next.js app router
├── components/             # React bileşenleri
├── lib/                    # Utility fonksiyonlar
├── database/               # MySQL data ve init scripts
├── git_data_package/       # Restore için backup'lar
├── backups/                # Otomatik backup'lar
├── uploads/                # Yüklenen dosyalar
├── docker-compose.yml      # Docker yapılandırma
└── scripts/                # Yardımcı scriptler
```

## 🛠️ Teknolojiler

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** MySQL 8.0
- **DevOps:** Docker, Docker Compose
- **Tools:** phpMyAdmin, ESLint, TypeScript

## 📊 Özellikler

- ✅ Ürün yönetimi (CRUD)
- ✅ Kullanıcı sistemi (kayıt/giriş)
- ✅ Sepet ve sipariş yönetimi
- ✅ Admin paneli
- ✅ Kategori sistemi
- ✅ Resim yükleme
- ✅ Stok takibi
- ✅ Kampanya yönetimi

## 🔧 Konfigürasyon

### Environment Variables
`.env` dosyası oluşturun:
```env
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_NAME=momez_db
DATABASE_USER=momez_user
DATABASE_PASSWORD=momez_password
JWT_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🐳 Docker Komutları

```bash
# Başlat
docker-compose up -d

# Durdur
docker-compose down

# Logları göster
docker-compose logs -f

# Yeniden başlat
docker-compose restart

# Temizlik (veri korunur)
docker-compose down
docker system prune -a
```

## 💾 Backup & Restore

### Backup Al
```bash
./auto-backup.sh
```

### Restore Et
```bash
./restore-backup.sh
```

### Otomatik Backup (Crontab)
```bash
crontab -e
# Ekle:
0 3 * * * cd /path/to/momez && ./auto-backup.sh
```

## 📚 Dokümantasyon

Detaylı dokümantasyon için:
- [Hızlı Başlangıç](./MYSQL_QUICK_START.md)
- [Veri Koruma Rehberi](./DATABASE_PROTECTION_GUIDE.md)
- [Farklı Cihaz Kurulumu](./FARKLÍ_CIHAZ_KURULUM.md)
- [Sistem Durumu](./SISTEM_DURUMU.md)

## 🌐 Erişim Bilgileri

- **Web Sitesi:** http://localhost:3000
- **phpMyAdmin:** http://localhost:8080
- **MySQL:** localhost:3306

### Database Login
```
Host: mysql
Database: momez_db
User: momez_user
Password: momez_password
```

## 🔒 Güvenlik

- ⚠️ Production'da `.env` dosyasını güncellemeyi unutmayın
- ⚠️ JWT_SECRET'i değiştirin
- ⚠️ Database şifrelerini güçlü yapın
- ⚠️ Private repository kullanın (hassas veriler var)

## 🐛 Sorun Giderme

### MySQL başlamıyor
```bash
sudo chown -R 999:999 database/mysql_data/
docker-compose restart mysql
```

### Port 3000 kullanımda
```bash
# Kullanılan port'u bul
sudo lsof -i :3000
# Process'i sonlandır
kill -9 <PID>
```

### Backup restore edilmiyor
```bash
# Root kullanıcısı ile dene
docker exec -i momez-mysql mysql -uroot -prootpassword momez_db < backups/latest.sql.gz
```

## 📝 Geliştirme

### Yeni Özellik Eklemek
1. Feature branch oluştur: `git checkout -b feature/yeni-ozellik`
2. Değişiklikleri yap
3. Test et: `npm run test`
4. Commit et: `git commit -m "feat: yeni özellik"`
5. Push et: `git push origin feature/yeni-ozellik`
6. Pull request aç

### Kod Standartları
- ESLint kullanılıyor
- TypeScript strict mode aktif
- Prettier ile format

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun
3. Commit edin
4. Push edin
5. Pull Request açın

## 📄 Lisans

Private Project

## 👤 İletişim

Sorularınız için: [your-email@example.com]

---

**🎉 Başarılı bir şekilde kuruldu! İyi kodlamalar!**

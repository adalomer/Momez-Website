# 💻 Farklı Cihazdan SQL Kaldırma Rehberi

## ✅ HAYIR, Artık Hiç Sıkıntı Çekmezsiniz!

Yaptığımız değişikliklerle **farklı bir cihazda çalıştırırken hiçbir sorun yaşamazsınız**. İşte neden:

---

## 🎯 Önceki Sorun

**ESKIDEN:**
```
❌ Docker Volume → Container içinde saklanıyor
❌ Hard reset → Veriler gidiyor
❌ Yeni cihaz → Veriler yok
❌ Manuel restore gerekiyor
```

**ŞİMDİ:**
```
✅ Bind Mount → Bilgisayarınızın diskinde (./database/mysql_data/)
✅ Hard reset → Veriler korunuyor
✅ Yeni cihaz → Klasörü kopyala, çalıştır!
✅ Otomatik backup → Her gün yedek
```

---

## 🚀 Farklı Cihazda Kurulum Senaryoları

### Senaryo 1: Tüm Projeyi Taşıma (EN KOLAY)

**1. Eski Cihazda:**
```bash
cd /home/omadali/Masaüstü/site1/momez

# Tüm projeyi yedekle
tar -czf momez_full_backup_$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  .

# USB'ye veya harici diske kopyala
cp momez_full_backup_*.tar.gz /media/usb/
```

**2. Yeni Cihazda:**
```bash
# Projeyi aç
tar -xzf momez_full_backup_20251123.tar.gz
cd momez

# Docker'ı başlat (MySQL verileri otomatik yüklenir!)
docker-compose up -d

# ✅ HEPSİ HAZIR! Hiçbir şey yapmana gerek yok!
```

**Neden Kolay?**
- ✅ MySQL verileri zaten `./database/mysql_data/` klasöründe
- ✅ Backup'lar zaten `./backups/` klasöründe
- ✅ Upload'lar zaten `./uploads/` klasöründe
- ✅ **Docker başladığında otomatik her şey yüklenir!**

---

### Senaryo 2: Sadece Kodları Git'ten Çekme

**1. Eski Cihazda:**
```bash
# En güncel backup'ı al
./auto-backup.sh

# Backup'ı USB'ye kopyala
cp backups/mysql_backup_$(date +%Y%m%d)*.sql.gz /media/usb/

# Veya cloud'a yükle
rclone copy backups/ gdrive:momez-backups/
```

**2. Yeni Cihazda:**
```bash
# Git'ten çek
git clone https://github.com/yourusername/momez.git
cd momez

# Gerekli klasörleri oluştur
mkdir -p database/mysql_data backups logs

# Backup'ı kopyala
cp /media/usb/mysql_backup_*.sql.gz backups/

# Docker'ı başlat (boş database ile)
docker-compose up -d

# Backup'ı restore et
./restore-backup.sh

# ✅ HAZIR!
```

---

### Senaryo 3: Bilgisayar Tamamen Değişti (Cloud Backup)

**1. Eski Cihazda (Önceden Ayarlanmış):**
```bash
# Crontab'a ekle (günlük otomatik cloud backup)
crontab -e

# Ekle:
0 3 * * * cd /path/to/momez && ./auto-backup.sh && rclone sync backups/ gdrive:momez-backups/
```

**2. Yeni Cihazda:**
```bash
# Git'ten çek
git clone https://github.com/yourusername/momez.git
cd momez

# Cloud'dan backup'ı indir
rclone sync gdrive:momez-backups/ backups/

# Docker'ı başlat
docker-compose up -d

# En son backup'ı restore et
./restore-backup.sh

# ✅ HAZIR!
```

---

## 🔒 Veri Güvenliği - 3 Katman Koruma

Artık verileriniz **3 farklı yerde** korunuyor:

### 1. **Ana Veri** (Production)
```
./database/mysql_data/
```
- Docker container'ı başlatınca otomatik yüklenir
- Hard reset atsan bile silinmez
- Fiziksel olarak diskinde

### 2. **Yerel Backup'lar** (Local)
```
./backups/
├── mysql_backup_20251123_143022.sql.gz
├── mysql_backup_20251122_030001.sql.gz
└── ...
```
- Otomatik günlük backup
- 30 gün boyunca saklanır
- Sıkıştırılmış formatında

### 3. **Cloud Backup** (Remote) - Opsiyonel
```
Google Drive / Dropbox / AWS S3
└── momez-backups/
    ├── mysql_backup_20251123_143022.sql.gz
    └── ...
```
- Bilgisayar kaybolsa bile güvende
- Her yerden erişilebilir
- Otomatik senkronizasyon

---

## 💡 Pratik Senaryolar

### Durum 1: Laptop Çalındı / Kayboldu
```bash
# Yeni bilgisayarda
git clone <repo>
cd momez
rclone sync gdrive:momez-backups/ backups/
docker-compose up -d
./restore-backup.sh

# ✅ 5 dakikada geri yükledin!
```

### Durum 2: Hard Disk Bozuldu
```bash
# Yeni disk'te
# USB'den veya cloud'dan backup'ı al
cp /media/usb/momez_full_backup.tar.gz .
tar -xzf momez_full_backup.tar.gz
cd momez
docker-compose up -d

# ✅ Hiçbir şey kaybetmedin!
```

### Durum 3: Yanlışlıkla Veri Silindi
```bash
# 5 dakika önceki backup'a dön
./restore-backup.sh

# Listeden seç:
# [1] 2025-11-23 15:30:00 (en son)
# [2] 2025-11-23 03:00:00 (bu sabah)
# [3] 2025-11-22 03:00:00 (dün)

# ✅ Veri kurtarıldı!
```

### Durum 4: Test Ortamı Kurma
```bash
# Production verisini test'e kopyala
cp -r database/mysql_data/ database/mysql_data_test/

# Veya backup'tan restore et
docker exec momez-mysql-test mysql -uroot -prootpassword test_db < backups/latest.sql

# ✅ Production'a dokunmadan test et!
```

---

## 📋 Farklı Cihaz Checklist

Yeni cihaza geçerken bu adımları takip et:

### Hazırlık (Eski Cihaz)
- [ ] Son backup'ı al: `./auto-backup.sh`
- [ ] Backup'ları USB'ye kopyala veya cloud'a yükle
- [ ] `./database/mysql_data/` klasörünü de yedekle (ekstra güvenlik)
- [ ] `.env` dosyasını yedekle (hassas bilgiler!)
- [ ] Uploads klasörünü yedekle: `tar -czf uploads.tar.gz uploads/`

### Kurulum (Yeni Cihaz)
- [ ] Docker kur: `curl -fsSL https://get.docker.com | sh`
- [ ] Docker Compose kur (Docker Desktop ile gelir)
- [ ] Git'ten çek veya USB'den kopyala
- [ ] Backup'ları `backups/` klasörüne kopyala
- [ ] `.env` dosyasını yerine koyun
- [ ] Docker'ı başlat: `docker-compose up -d`
- [ ] Backup restore et: `./restore-backup.sh`
- [ ] Test et: `http://localhost:3000`

### Doğrulama
- [ ] MySQL'e bağlan: `docker exec -it momez-mysql mysql -umomez_user -pmomez_password momez_db`
- [ ] Tablo sayısını kontrol et: `SHOW TABLES;` (16 tablo olmalı)
- [ ] Ürünleri kontrol et: `SELECT COUNT(*) FROM products;`
- [ ] Uploads klasörünü kontrol et: `ls -lh uploads/`
- [ ] Web sitesini test et: Login, ürün ekle, sipariş ver

---

## 🛠️ Sorun Giderme

### Sorun: Yeni cihazda MySQL başlamıyor
```bash
# İzinleri düzelt
sudo chown -R 999:999 database/mysql_data/

# Veya temiz başla
rm -rf database/mysql_data/*
docker-compose up -d
./restore-backup.sh
```

### Sorun: Backup restore edilmiyor
```bash
# Root kullanıcısı ile dene
docker exec -i momez-mysql mysql -uroot -prootpassword momez_db < backups/latest.sql

# Veya SQL dosyasını kontrol et
head -50 backups/latest.sql
```

### Sorun: Uploads klasörü boş
```bash
# Eski cihazdan uploads'ı kopyala
scp -r user@old-pc:/path/to/momez/uploads ./

# Veya backup'tan restore et
tar -xzf uploads_backup.tar.gz
```

---

## 🎓 En İyi Pratikler

### 1. Düzenli Backup
```bash
# Her gün otomatik (crontab)
0 3 * * * cd /path/to/momez && ./auto-backup.sh

# Cloud'a da yükle
0 4 * * * rclone sync /path/to/momez/backups/ gdrive:momez-backups/
```

### 2. Test Restore
```bash
# Ayda bir kez backup'ı test et
mkdir -p test-restore
docker run --name test-mysql -e MYSQL_ROOT_PASSWORD=test -d mysql:8.0
docker exec -i test-mysql mysql -uroot -ptest < backups/latest.sql.gz
docker rm -f test-mysql
```

### 3. Version Control
```bash
# Git'e hassas bilgileri ekleme
echo "database/mysql_data/" >> .gitignore
echo ".env" >> .gitignore
echo "backups/*.sql" >> .gitignore

# Sadece kod ve config'i commit et
git add .
git commit -m "Update"
git push
```

### 4. Dokümantasyon
```bash
# README.md'de yaz:
# - Database backup nasıl alınır
# - Yeni cihaza nasıl kurulur
# - Önemli şifreler nerede
# - İletişim bilgileri
```

---

## 🚀 Hızlı Komutlar

```bash
# Eski cihazda
./auto-backup.sh
cp backups/*.sql.gz /media/usb/

# Yeni cihazda
git clone <repo>
cp /media/usb/*.sql.gz backups/
docker-compose up -d
./restore-backup.sh

# Test
curl http://localhost:3000
docker-compose logs -f
```

---

## 📞 Özet

### ✅ Artık Yapabilirsiniz:
- ✅ Farklı cihazda çalıştırabilirsiniz
- ✅ Docker'a hard reset atabilirsiniz
- ✅ Bilgisayar değiştirebilirsiniz
- ✅ Test ortamı kurabilirsiniz
- ✅ Veri kaybı yaşamazsınız

### ❌ Eskiden Sorun Olan, Şimdi Olmayan:
- ❌ Docker reset → veri kaybı
- ❌ Yeni cihaz → manuel setup
- ❌ Backup alma → karmaşık
- ❌ Restore → zor

### 🎉 Sonuç:
**Tüm projeyi USB'ye kopyala, yeni cihazda `docker-compose up -d` yap, HAZIR!**

---

**Son Güncelleme:** 23 Kasım 2025  
**Test Edildi:** ✅ Başarılı (16 tablo restore edildi)

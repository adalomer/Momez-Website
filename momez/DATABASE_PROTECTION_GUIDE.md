# 🗄️ MySQL Veri Koruma ve Yedekleme Rehberi

## 📋 İçindekiler
1. [Sorun ve Çözüm](#sorun-ve-çözüm)
2. [Güvenli Docker Komutları](#güvenli-docker-komutları)
3. [Otomatik Backup](#otomatik-backup)
4. [Manuel Backup](#manuel-backup)
5. [Restore (Geri Yükleme)](#restore-geri-yükleme)
6. [Bilgisayar Değişikliği](#bilgisayar-değişikliği)

---

## 🚨 Sorun ve Çözüm

### Sorun
Docker container'larına hard reset attığınızda veya bilgisayar değiştirdiğinizde MySQL verileri kayboluyor.

### Çözüm
Docker Volume'leri **host dizinine bind mount** yaparak verileriniz artık bilgisayarınızın fiziksel diskinde saklanıyor:

```yaml
volumes:
  - ./database/mysql_data:/var/lib/mysql  # ← Veriler burada saklanıyor
```

**Avantajlar:**
- ✅ `docker-compose down -v` bile veriyi silmez
- ✅ Dosyalar bilgisayarınızda görünür
- ✅ Manuel backup alabilirsiniz (klasörü kopyalayın)
- ✅ Git'e dahil edilebilir (.gitignore'a eklerseniz güvenli)

---

## 🛡️ Güvenli Docker Komutları

### ✅ KULLAN - Volume'leri Korur
```bash
# Container'ları durdur ama verileri koru
docker-compose down

# Sadece yeniden başlat
docker-compose restart

# Belirli servisi yeniden başlat
docker-compose restart mysql

# Container'ları temizle ama volume'leri koru
docker-compose down
docker system prune -a  # Volume'lere dokunmaz
```

### ❌ KULLANMA - Volume'leri Siler
```bash
# UYARI: Volume'leri de siler!
docker-compose down -v

# UYARI: Tüm volume'leri siler!
docker volume prune
docker volume rm mysql_data
```

---

## 🔄 Otomatik Backup

### 1. Manuel Backup
```bash
# Tek seferlik backup al
./auto-backup.sh
```

**Çıktı:**
```
🔄 MySQL Backup Başlatılıyor...
📦 Backup alınıyor: mysql_backup_20251123_143022.sql
✓ Backup başarıyla alındı!
  📁 Dosya: ./backups/mysql_backup_20251123_143022.sql
  📊 Boyut: 2.5M
✓ Backup sıkıştırıldı: mysql_backup_20251123_143022.sql.gz
✓ Mevcut backup sayısı: 15
```

### 2. Günlük Otomatik Backup (Crontab)

**Her gün saat 03:00'te otomatik backup:**
```bash
# Crontab'ı düzenle
crontab -e

# Aşağıdaki satırı ekle (yolu projenize göre düzenleyin)
0 3 * * * cd /home/omadali/Masaüstü/site1/momez && ./auto-backup.sh >> logs/backup.log 2>&1
```

**Her 6 saatte bir backup:**
```bash
0 */6 * * * cd /home/omadali/Masaüstü/site1/momez && ./auto-backup.sh >> logs/backup.log 2>&1
```

**Her saat başı backup (yoğun kullanım için):**
```bash
0 * * * * cd /home/omadali/Masaüstü/site1/momez && ./auto-backup.sh >> logs/backup.log 2>&1
```

### 3. Backup Ayarları

`auto-backup.sh` dosyasında düzenleyebilirsiniz:

```bash
# Eski backupları temizleme (30 günden eski)
RETENTION_DAYS=30  # ← Bunu değiştirin (örn: 90 gün için)
```

---

## 💾 Manuel Backup

### Yöntem 1: Script ile (Önerilen)
```bash
./backup.sh
```

### Yöntem 2: Docker Exec ile
```bash
# Tek komutla backup
docker exec momez-mysql mysqldump \
  -umomez_user \
  -pmomez_password \
  momez_db > backup_$(date +%Y%m%d).sql
```

### Yöntem 3: Fiziksel Klasörü Kopyalama
```bash
# MySQL data klasörünü kopyala
sudo cp -r ./database/mysql_data ./database/mysql_data_backup_$(date +%Y%m%d)
```

---

## 🔙 Restore (Geri Yükleme)

### Yöntem 1: İnteraktif Script (Önerilen)
```bash
./restore-backup.sh
```

**Örnek Kullanım:**
```
═══════════════════════════════════════
   MySQL Backup Restore Tool
═══════════════════════════════════════

Mevcut backup dosyaları:

  [1] 2025-11-23 14:30:22 (2.5M)
  [2] 2025-11-22 14:30:15 (2.4M)
  [3] 2025-11-21 14:30:08 (2.3M)

Restore etmek istediğiniz backup numarasını girin (1-3): 1

⚠️  UYARI: Bu işlem mevcut veritabanını SİLECEK!
Devam etmek istediğinize emin misiniz? (evet/hayır): evet

🔄 Restore işlemi başlatılıyor...
✓ Restore başarıyla tamamlandı!
✓ Yüklenen tablo sayısı: 12
```

### Yöntem 2: Belirli Dosyayı Restore Et
```bash
./restore-backup.sh ./backups/mysql_backup_20251123_143022.sql.gz
```

### Yöntem 3: Manuel Restore
```bash
# .gz dosyasını aç ve restore et
gunzip -c ./backups/mysql_backup_20251123_143022.sql.gz | \
docker exec -i momez-mysql mysql \
  -umomez_user \
  -pmomez_password \
  momez_db
```

---

## 💻 Bilgisayar Değişikliği

### Yeni Bilgisayara Taşıma

**1. Eski Bilgisayarda:**
```bash
# Tüm projeyi yedekle (veri dahil)
cd /home/omadali/Masaüstü/site1/momez
tar -czf momez_full_backup.tar.gz .

# Veya sadece kritik dosyalar
tar -czf momez_data_backup.tar.gz \
  ./database/mysql_data \
  ./backups \
  ./uploads
```

**2. Yeni Bilgisayarda:**
```bash
# Projeyi kopyala
scp user@old-computer:/path/momez_full_backup.tar.gz .
tar -xzf momez_full_backup.tar.gz

# Docker'ı başlat
docker-compose up -d

# Veriler otomatik olarak yüklenir! ✅
```

### Alternatif: Sadece Database Taşıma

**1. Eski Bilgisayarda:**
```bash
./auto-backup.sh
# backup dosyasını USB'ye veya cloud'a kopyala
```

**2. Yeni Bilgisayarda:**
```bash
# Projeyi git'ten çek
git clone <repo-url>

# Docker'ı başlat (boş database ile)
docker-compose up -d

# Backup'ı yükle
./restore-backup.sh ./backups/mysql_backup_20251123_143022.sql.gz
```

---

## 📊 Veri Güvenliği Checklist

### Günlük
- [ ] Docker container'ları çalışıyor mu kontrol et
- [ ] Otomatik backup çalıştı mı kontrol et (logs klasörü)

### Haftalık
- [ ] Backup dosyalarını kontrol et (`ls -lh backups/`)
- [ ] Bir backup'ı test restore et (geliştirme ortamında)
- [ ] Disk alanı yeterli mi kontrol et

### Aylık
- [ ] Eski backupları temizle (manuel kontrol)
- [ ] Backup'ları harici diske kopyala
- [ ] Cloud backup'ı güncel mi kontrol et

---

## 🚀 Hızlı Komutlar

```bash
# Backup al
./auto-backup.sh

# Restore et
./restore-backup.sh

# Container durumunu kontrol et
docker-compose ps

# MySQL'e bağlan
docker exec -it momez-mysql mysql -umomez_user -pmomez_password momez_db

# Logları izle
docker-compose logs -f mysql

# Disk kullanımını kontrol et
du -sh ./database/mysql_data
du -sh ./backups

# Volume'leri listele
docker volume ls

# Container'ları güvenli yeniden başlat
docker-compose restart
```

---

## 🔧 Sorun Giderme

### Sorun: Backup alınamıyor
```bash
# Container çalışıyor mu?
docker ps | grep momez-mysql

# Yoksa başlat
docker-compose up -d mysql

# Logları kontrol et
docker-compose logs mysql
```

### Sorun: Restore çalışmıyor
```bash
# Backup dosyası bozuk olabilir
gunzip -t ./backups/mysql_backup_20251123_143022.sql.gz

# Manuel restore dene
gunzip -c ./backups/mysql_backup_20251123_143022.sql.gz | head -n 50
```

### Sorun: Disk doldu
```bash
# Eski backupları sil
find ./backups -name "*.sql.gz" -mtime +30 -delete

# Docker temizliği (volume'lere dokunmaz)
docker system prune -a
```

---

## 📁 Dosya Yapısı

```
site1/momez/
├── database/
│   ├── mysql_data/          # ← MySQL verileri burada (host dizini)
│   └── init.sql             # ← İlk kurulum SQL'i
├── backups/                 # ← Otomatik backup'lar burada
│   ├── mysql_backup_20251123_143022.sql.gz
│   ├── mysql_backup_20251122_030001.sql.gz
│   └── ...
├── auto-backup.sh           # ← Otomatik backup script
├── restore-backup.sh        # ← İnteraktif restore script
├── docker-compose.yml       # ← Güncellenmiş (bind mount)
└── logs/                    # ← Backup logları (opsiyonel)
```

---

## ⚙️ Gelişmiş Ayarlar

### 1. Cloud Backup (Google Drive, Dropbox)

**Rclone ile otomatik cloud sync:**
```bash
# Rclone kur
curl https://rclone.org/install.sh | sudo bash

# Cloud servisinizi yapılandırın
rclone config

# Crontab'a ekle (backup sonrası cloud'a yükle)
0 4 * * * cd /home/omadali/Masaüstü/site1/momez && ./auto-backup.sh && rclone sync backups/ gdrive:momez-backups/
```

### 2. Slack/Email Bildirimi

`auto-backup.sh` sonuna ekle:
```bash
# Slack webhook
curl -X POST -H 'Content-type: application/json' \
--data '{"text":"✅ Backup başarılı: '"$BACKUP_FILE"'"}' \
https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Email
echo "Backup tamamlandı: $BACKUP_FILE" | mail -s "MySQL Backup" your@email.com
```

---

## 📞 Yardım

Sorun yaşarsanız:
1. `docker-compose logs mysql` logları kontrol edin
2. `./backups` klasöründe backup var mı kontrol edin
3. `docker volume ls` volume'leri listeleyin
4. Bu dokümandaki "Sorun Giderme" bölümüne bakın

---

**Son Güncelleme:** 23 Kasım 2025
**Versiyon:** 2.0

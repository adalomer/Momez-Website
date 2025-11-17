# Momez Website - Backup & Restore Kılavuzu

## 🔐 Yedekleme (Backup)

### Otomatik Tam Yedekleme
Tüm verilerin yedeğini almak için:

```bash
./backup.sh
```

Bu komut şunları yedekler:
- 📊 **SQL Dump**: Veritabanı yapısı ve verileri (47KB)
- 💾 **MySQL Volume**: Tüm MySQL dosyaları (5.8MB)
- 🖼️ **Uploads**: Yüklenen resimler ve dosyalar (2.2MB)

### Manuel Yedekleme

#### Sadece SQL Dump
```bash
docker compose exec -T mysql mysqldump -u momez_user -pmomez_password --no-tablespaces momez_db > backups/manual_backup.sql
```

#### Sadece Uploads
```bash
docker compose exec -T app tar czf - /app/uploads > backups/uploads_manual.tar.gz
```

## 🔄 Geri Yükleme (Restore)

### Interaktif Geri Yükleme
```bash
./restore.sh
```
Script size mevcut backupları gösterecek ve hangisini geri yüklemek istediğinizi soracak.

### Manuel Geri Yükleme
Belirli bir SQL backupını geri yüklemek için:
```bash
docker compose exec -T mysql mysql -u momez_user -pmomez_password momez_db < backups/momez_db_backup_20251117_143156.sql
```

### MySQL Volume Geri Yükleme
```bash
# Container'ı durdur
docker compose stop mysql

# Volume'u temizle
docker volume rm momez_mysql_data

# Container'ı başlat
docker compose up -d mysql

# Backup'ı geri yükle
docker compose exec -T mysql tar xzf - -C / < backups/mysql_volume_backup_20251117_143156.tar.gz
```

### Uploads Geri Yükleme
```bash
docker compose exec -T app tar xzf - -C / < backups/uploads_backup_20251117_143156.tar.gz
```

## ⏰ Otomatik Yedekleme (Cron)

Günlük otomatik yedekleme için crontab'a ekleyin:

```bash
# Crontab'ı düzenle
crontab -e

# Her gece saat 02:00'de backup al
0 2 * * * cd /mnt/d/Ubuntu_Dosya/site/momez && ./backup.sh >> backups/backup.log 2>&1
```

## 📁 Backup Klasör Yapısı

```
backups/
├── momez_db_backup_20251117_143156.sql          # SQL dump
├── mysql_volume_backup_20251117_143156.tar.gz   # MySQL volume
├── uploads_backup_20251117_143156.tar.gz        # Upload dosyaları
└── backup.log                                    # Backup log
```

## 🧹 Eski Backupları Temizleme

Backup scripti otomatik olarak 30 günden eski backupları siler. Manuel temizleme için:

```bash
# 30 günden eski SQL backupları
find backups -name "*.sql" -type f -mtime +30 -delete

# 30 günden eski tar.gz dosyaları
find backups -name "*.tar.gz" -type f -mtime +30 -delete
```

## 🚨 Önemli Notlar

1. **Backup Öncesi**: Docker container'ların çalıştığından emin olun
   ```bash
   docker compose ps
   ```

2. **Disk Alanı**: Her backup yaklaşık 8MB yer kaplar

3. **Güvenlik**: Backup dosyaları hassas bilgiler içerir, güvenli bir yerde saklayın

4. **Test**: Restore işlemini önce test ortamında deneyin

5. **Versiyon**: Backup dosyalarının tarih damgası vardır (YYYYMMDD_HHMMSS)

## 📊 Backup Boyutları

| Dosya | Boyut | Açıklama |
|-------|-------|----------|
| SQL Dump | ~47KB | Veritabanı yapısı ve verileri |
| MySQL Volume | ~5.8MB | Tüm MySQL dosyaları |
| Uploads | ~2.2MB | Yüklenen resimler |
| **TOPLAM** | **~8MB** | Tam yedek seti |

## 🔗 İlgili Komutlar

```bash
# Backup al
./backup.sh

# Restore yap
./restore.sh

# Docker durumunu kontrol et
docker compose ps

# Docker logları
docker compose logs -f

# Backupları listele
ls -lht backups/

# Son 5 backupı göster
ls -t backups/*.sql | head -5
```

## 💡 İpuçları

- Önemli değişiklikler öncesi manuel backup alın
- Backup'ları farklı bir diske/buluta da yedekleyin
- Restore işleminden önce mevcut verinin backupını alın
- Production ortamında restore yapmadan önce test edin

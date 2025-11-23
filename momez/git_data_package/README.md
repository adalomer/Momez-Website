# 📦 Git Data Package

Bu klasör, projenin Git'e push edilmeyen ancak önemli olan verilerini içerir.

## 📁 İçerik

- `latest_backup.sql.gz` - En güncel MySQL backup
- `uploads_backup.tar.gz` - Yüklenen dosyalar (resimler, vb.)
- `mysql_data_backup.tar.gz` - MySQL data klasörü (opsiyonel)
- `RESTORE.sh` - Otomatik restore scripti

## 🚀 Yeni Cihazda Kurulum

### Hızlı Kurulum (Önerilen)
```bash
# 1. Git'ten çek
git clone <repo-url>
cd momez

# 2. Verileri restore et
./git_data_package/RESTORE.sh

# 3. Docker'ı başlat
docker-compose up -d

# 4. SQL'i restore et (gerekirse)
./restore-backup.sh

# ✅ HAZIR!
```

### Manuel Kurulum
```bash
# 1. Backups
cp git_data_package/latest_backup.sql.gz backups/

# 2. Uploads
tar -xzf git_data_package/uploads_backup.tar.gz

# 3. MySQL Data (varsa)
tar -xzf git_data_package/mysql_data_backup.tar.gz

# 4. Docker
docker-compose up -d
./restore-backup.sh
```

## ⚠️ Güvenlik Notu

Bu paket hassas veriler içerir:
- Veritabanı backup'ı (kullanıcı bilgileri, siparişler)
- Yüklenen dosyalar

**Private repository'de tutun!**

# 📦 Git Data Package

Bu klasör, projenin restore scriptlerini içerir.

⚠️ **ÖNEMLİ:** SQL backup dosyaları güvenlik nedeniyle Git'e dahil edilmemiştir.

## 📁 İçerik

- `RESTORE.sh` - Otomatik restore scripti
- `README.md` - Bu dosya

## 🔐 SQL Backup Nereden Alınır?

SQL backup dosyaları Git'e push edilmez (güvenlik nedeniyle). Backup'ı şu yollarla alabilirsiniz:

1. **USB/Harici Disk:** Backup'ı USB'den kopyalayın
2. **Cloud Storage:** Google Drive, Dropbox, vb.
3. **Özel Sunucu:** Güvenli bir sunucudan indirin
4. **Yeni Database:** Boş database ile başlayın

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

# 🚀 MySQL Veri Koruma - Hızlı Başlangıç

## ✨ Ne Değişti?

**SORUN:** Docker'a hard reset attığınızda MySQL verileriniz kayboluyor.

**ÇÖZÜM:** MySQL verileri artık bilgisayarınızın diskinde (`./database/mysql_data/`) saklanıyor!

---

## 🎯 Hemen Başla

### 1️⃣ Mevcut Sistemi Yeni Sisteme Geçir
```bash
./migrate-to-bind-mount.sh
```

Bu script:
- ✅ Mevcut verilerinizi yedekler
- ✅ Yeni güvenli sisteme geçiş yapar
- ✅ Container'ları yeniden başlatır
- ✅ Veriyi kontrol eder

### 2️⃣ Backup Al
```bash
./auto-backup.sh
```

Her gün otomatik backup için:
```bash
crontab -e
# Ekle:
0 3 * * * cd /home/omadali/Masaüstü/site1/momez && ./auto-backup.sh >> logs/backup.log 2>&1
```

### 3️⃣ Backup'ı Geri Yükle
```bash
./restore-backup.sh
```

---

## 🛡️ Artık Güvende!

### ✅ Güvenli Komutlar (Veriyi korur)
```bash
docker-compose down           # Container'ları durdur
docker-compose restart        # Yeniden başlat
docker-compose up -d          # Başlat
docker system prune -a        # Temizle (volume'lere dokunmaz)
```

### ❌ Dikkat! (Bu komutları kullanmayın)
```bash
docker-compose down -v        # ❌ Volume'leri siler
docker volume prune           # ❌ Tüm volume'leri siler
```

---

## 📁 Veri Nerede?

```
site1/momez/
├── database/
│   └── mysql_data/          ← MySQL verileri BURADA (silinmez!)
├── backups/                 ← Backup'lar burada
│   ├── mysql_backup_20251123_143022.sql.gz
│   └── ...
└── uploads/                 ← Yüklenen dosyalar
```

---

## 💻 Bilgisayar Değiştirirken

### Yöntem 1: Tüm Projeyi Taşı
```bash
# Eski PC'de
tar -czf momez_full.tar.gz site1/momez

# Yeni PC'de
tar -xzf momez_full.tar.gz
cd site1/momez
docker-compose up -d
# ✅ Tüm veriler otomatik yüklenir!
```

### Yöntem 2: Sadece Database
```bash
# Eski PC'de
./auto-backup.sh
# backup dosyasını USB'ye kopyala

# Yeni PC'de
git clone <repo>
docker-compose up -d
./restore-backup.sh
```

---

## 🆘 Acil Durum

### Veri Kaybettiyseniz
```bash
# En son backup'ı restore et
./restore-backup.sh

# Veya spesifik backup
./restore-backup.sh ./backups/mysql_backup_20251123_143022.sql.gz
```

### Container Başlamıyorsa
```bash
# Logları kontrol et
docker-compose logs mysql

# Yeniden başlat
docker-compose restart mysql

# Tamamen temizle ve baştan başla
docker-compose down
docker-compose up -d
```

---

## 📚 Detaylı Dokümantasyon

Daha fazla bilgi için: **[DATABASE_PROTECTION_GUIDE.md](./DATABASE_PROTECTION_GUIDE.md)**

---

## ⚡ Hızlı Komutlar

```bash
# Backup al
./auto-backup.sh

# Restore et
./restore-backup.sh

# Migration yap (ilk sefer için)
./migrate-to-bind-mount.sh

# MySQL'e bağlan
docker exec -it momez-mysql mysql -umomez_user -pmomez_password momez_db

# Container durumu
docker-compose ps

# Loglar
docker-compose logs -f mysql
```

---

## ✅ Kontrol Listesi

- [ ] Migration yaptım (`./migrate-to-bind-mount.sh`)
- [ ] İlk backup'ı aldım (`./auto-backup.sh`)
- [ ] Otomatik backup kurdum (crontab)
- [ ] Test restore yaptım (`./restore-backup.sh`)
- [ ] Veriler `./database/mysql_data/` klasöründe
- [ ] `.gitignore` güncellendi (hassas veriler git'e gitmiyor)

---

**🎉 Artık verileriniz güvende! Hard reset atın, bilgisayar değiştirin, hiçbir şey kaybetmezsiniz!**

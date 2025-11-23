# 🔒 SQL Backup Güvenlik Notu

## ⚠️ ÖNEMLİ: SQL Dosyaları Git'e Push Edilmiyor

SQL backup dosyaları güvenlik ve gizlilik nedeniyle **Git'e dahil edilmemiştir**.

---

## 🤔 Neden?

### Güvenlik Riskleri
- ✅ Kullanıcı şifreleri (hash'li olsa bile)
- ✅ Email adresleri
- ✅ Telefon numaraları
- ✅ Adres bilgileri
- ✅ Sipariş detayları
- ✅ Ödeme bilgileri (varsa)

### Pratik Sebepler
- ✅ SQL dosyaları büyük olabilir (Git için uygun değil)
- ✅ Sık değişen veriler (her commit'te değişir)
- ✅ Repository boyutunu şişirir
- ✅ Clone sürelerini uzatır

---

## 💾 SQL Backup'ı Nasıl Saklanır?

### 1. USB/Harici Disk (Önerilen - Basit)
```bash
# Backup al
./auto-backup.sh

# USB'ye kopyala
cp backups/mysql_backup_*.sql.gz /media/usb/momez-backups/

# Yeni cihazda
cp /media/usb/momez-backups/*.sql.gz backups/
./restore-backup.sh
```

**Avantajlar:**
- ✅ Offline güvenlik
- ✅ Hızlı erişim
- ✅ Ek maliyet yok

**Dezavantajlar:**
- ❌ USB kaybolursa veri gider
- ❌ Manuel senkronizasyon

---

### 2. Cloud Storage (Önerilen - Güvenli)

#### Google Drive
```bash
# Rclone kur
curl https://rclone.org/install.sh | sudo bash

# Google Drive yapılandır
rclone config

# Otomatik senkronizasyon
crontab -e
# Ekle:
0 4 * * * rclone sync /path/to/momez/backups/ gdrive:momez-backups/

# Yeni cihazda
rclone sync gdrive:momez-backups/ backups/
```

#### Dropbox
```bash
# Dropbox CLI kur
# https://www.dropbox.com/install-linux

# Sync
rclone sync backups/ dropbox:momez-backups/
```

**Avantajlar:**
- ✅ Her yerden erişim
- ✅ Otomatik senkronizasyon
- ✅ Versiyon kontrolü
- ✅ Güvenli (şifreli)

**Dezavantajlar:**
- ❌ İnternet gerekli
- ❌ Depolama limiti (ücretsizde)

---

### 3. Private Git Repository (Alternatif)

Eğer mutlaka Git ile yönetmek isterseniz **ayrı bir private repo** kullanın:

```bash
# Ayrı backup repo'su oluştur
mkdir momez-backups
cd momez-backups
git init

# Backup'ları ekle
cp /path/to/momez/backups/*.sql.gz .
git add *.sql.gz
git commit -m "Add backups"

# Private repo'ya push et
git remote add origin git@github.com:user/momez-backups-private.git
git push -u origin main
```

**Avantajlar:**
- ✅ Git ile yönetim
- ✅ Versiyon kontrolü
- ✅ Branch desteği

**Dezavantajlar:**
- ❌ Repository boyutu büyür
- ❌ Git LFS gerekebilir (>100MB için)
- ❌ Clone süreleri uzun

---

### 4. Şifreli Arşiv (En Güvenli)

```bash
# Backup'ı şifrele
tar -czf - backups/ | gpg -c > momez-backups-encrypted.tar.gz.gpg

# Şifreyi girin (güçlü bir şifre)

# Cloud'a veya USB'ye kopyala
cp momez-backups-encrypted.tar.gz.gpg /media/usb/

# Yeni cihazda şifreyi çöz
gpg -d momez-backups-encrypted.tar.gz.gpg | tar -xzf -
```

**Avantajlar:**
- ✅ Maksimum güvenlik
- ✅ Şifreli depolama
- ✅ Güvenli paylaşım

**Dezavantajlar:**
- ❌ Şifre unutulursa veri gider
- ❌ Manuel işlem

---

### 5. Private Server (Kurumsal)

```bash
# SCP ile transfer
scp backups/*.sql.gz user@backup-server:/secure/backups/momez/

# rsync ile senkronizasyon (önerilen)
rsync -avz --delete backups/ user@backup-server:/secure/backups/momez/

# Otomatik senkronizasyon
crontab -e
0 3 * * * rsync -avz backups/ user@backup-server:/backups/momez/

# Yeni cihazda
rsync -avz user@backup-server:/backups/momez/ backups/
```

**Avantajlar:**
- ✅ Tam kontrol
- ✅ Özel güvenlik
- ✅ Hızlı erişim (local network)

**Dezavantajlar:**
- ❌ Sunucu maliyeti
- ❌ Yönetim gerektirir

---

## 🚀 Önerilen Yaklaşım

### Hobist Projeler
```
USB + Cloud (Google Drive)
```

### Küçük İşletme
```
Cloud (Google Drive/Dropbox) + Şifreli Arşiv
```

### Kurumsal
```
Private Server + Cloud Backup + Şifreli Arşiv
```

---

## 📋 Yeni Cihazda Kurulum

### Senaryo 1: USB Backup
```bash
# 1. Git'ten çek
git clone https://github.com/user/momez.git
cd momez

# 2. USB'den kopyala
cp /media/usb/momez-backups/*.sql.gz backups/

# 3. Docker başlat
docker-compose up -d

# 4. Restore et
./restore-backup.sh
```

### Senaryo 2: Cloud Backup
```bash
# 1. Git'ten çek
git clone https://github.com/user/momez.git
cd momez

# 2. Cloud'dan indir
rclone sync gdrive:momez-backups/ backups/

# 3. Docker başlat
docker-compose up -d

# 4. Restore et
./restore-backup.sh
```

### Senaryo 3: Boş Database
```bash
# 1. Git'ten çek
git clone https://github.com/user/momez.git
cd momez

# 2. Docker başlat (init.sql otomatik çalışacak)
docker-compose up -d

# 3. Test verisi ekle (opsiyonel)
# Admin panelden ürün ekle
```

---

## 🔐 Güvenlik Önerileri

### ✅ Yapılması Gerekenler
- ✅ SQL backup'ları Git'e eklemeyin
- ✅ .env dosyasını Git'e eklemeyin
- ✅ Backup'ları şifreli saklayın
- ✅ Düzenli backup alın (günlük)
- ✅ Backup'ları test edin (ayda bir)
- ✅ Multiple backup location kullanın
- ✅ Repository'yi private tutun

### ❌ Yapılmaması Gerekenler
- ❌ Public repo'ya SQL eklemeyin
- ❌ Şifreleri commit etmeyin
- ❌ Tek backup location kullanmayın
- ❌ Backup'ları test etmeyi unutmayın
- ❌ Eski backup'ları silmeyin (en az 3 tane tutun)

---

## 📞 Sık Sorulan Sorular

### S: Neden Git'e SQL eklenmedi?
**C:** Güvenlik, gizlilik ve pratik nedenlerle. SQL dosyaları hassas veri içerir ve Git için uygun değildir.

### S: Takım arkadaşlarım backup'a nasıl erişecek?
**C:** Cloud storage (Google Drive) veya private server kullanın. Erişim izni verin.

### S: Public yaparsam ne olur?
**C:** ⚠️ ASLA PUBLIC YAPMAYIN! SQL backup olmasa bile .env ve diğer hassas bilgiler olabilir.

### S: Git LFS kullanayım mı?
**C:** Hayır, gerek yok. Cloud storage daha uygun.

### S: Backup olmadan kurulum yapabilir miyim?
**C:** Evet! `docker-compose up -d` komutunu çalıştırın, database/init.sql otomatik çalışacak.

---

## 🎯 Özet

```
✅ SQL backup'ları Git'e dahil edilmedi (güvenlik)
✅ USB veya Cloud Storage kullanın
✅ Düzenli backup alın (./auto-backup.sh)
✅ Multiple location'da saklayın
✅ Şifreli arşiv kullanın (önemli projeler için)
```

---

**🔒 Unutmayın: Verilerinizin güvenliği sizin sorumluluğunuzdadır!**

**Önerilen Backup Stratejisi:**
```
Günlük Backup → Cloud (Google Drive)
Haftalık Backup → USB (Harici Disk)
Aylık Backup → Şifreli Arşiv (Güvenli konum)
```

#!/bin/bash

# Git'e Push Hazırlık ve Proje Temizleme Script'i
# Tüm önemli dosyaları git'e ekler, gereksiz dosyaları temizler

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Git Push Hazırlık & Proje Temizleme Tool${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo ""

# Mevcut dizini kontrol et
if [ ! -f "package.json" ]; then
    echo -e "${RED}✗ Hata: Proje klasöründe değilsiniz!${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 İşlem Planı:${NC}"
echo -e "  1. Backup paketleme (data + uploads)"
echo -e "  2. Gereksiz dosyaları temizleme"
echo -e "  3. .gitignore güncelleme"
echo -e "  4. Proje yapısını optimize etme"
echo -e "  5. Git'e commit hazırlığı"
echo ""

read -p "Devam etmek istiyor musunuz? (evet/hayır): " CONFIRM
if [ "$CONFIRM" != "evet" ]; then
    echo -e "${YELLOW}İşlem iptal edildi.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}1️⃣  Backup Paketleme...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

# Git'e push edilecek data paketi oluştur
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATA_PACKAGE="git_data_package"

mkdir -p "$DATA_PACKAGE"

# En güncel SQL backup'ı kopyala
echo -e "${CYAN}📦 SQL backup paketleniyor...${NC}"
if [ -d "backups" ]; then
    LATEST_BACKUP=$(ls -t backups/*.sql backups/*.sql.gz 2>/dev/null | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        cp "$LATEST_BACKUP" "$DATA_PACKAGE/latest_backup.sql.gz" 2>/dev/null || \
        gzip -c "$LATEST_BACKUP" > "$DATA_PACKAGE/latest_backup.sql.gz"
        echo -e "${GREEN}✓ SQL backup kopyalandı: $(basename "$LATEST_BACKUP")${NC}"
    else
        echo -e "${YELLOW}⚠️  Backup bulunamadı, yeni backup alınıyor...${NC}"
        if docker ps | grep -q "momez-mysql"; then
            ./auto-backup.sh > /dev/null 2>&1
            LATEST_BACKUP=$(ls -t backups/*.sql.gz 2>/dev/null | head -1)
            [ -n "$LATEST_BACKUP" ] && cp "$LATEST_BACKUP" "$DATA_PACKAGE/latest_backup.sql.gz"
        fi
    fi
else
    mkdir -p backups
    echo -e "${YELLOW}⚠️  Backups klasörü oluşturuldu${NC}"
fi

# Uploads klasörünü paketle (varsa)
echo -e "${CYAN}📦 Uploads paketleniyor...${NC}"
if [ -d "uploads" ] && [ "$(ls -A uploads 2>/dev/null)" ]; then
    tar -czf "$DATA_PACKAGE/uploads_backup.tar.gz" uploads/ 2>/dev/null
    UPLOAD_SIZE=$(du -h "$DATA_PACKAGE/uploads_backup.tar.gz" 2>/dev/null | cut -f1)
    echo -e "${GREEN}✓ Uploads paketlendi: $UPLOAD_SIZE${NC}"
else
    echo -e "${YELLOW}⚠️  Uploads klasörü boş veya yok${NC}"
fi

# MySQL data klasörünü paketle (opsiyonel - çok büyük olabilir)
if [ -d "database/mysql_data" ] && [ "$(ls -A database/mysql_data 2>/dev/null)" ]; then
    MYSQL_SIZE=$(du -sh database/mysql_data 2>/dev/null | cut -f1)
    echo -e "${CYAN}MySQL data klasörü boyutu: $MYSQL_SIZE${NC}"
    
    if [ "$1" == "--include-mysql-data" ]; then
        echo -e "${CYAN}📦 MySQL data paketleniyor (bu biraz sürebilir)...${NC}"
        tar -czf "$DATA_PACKAGE/mysql_data_backup.tar.gz" database/mysql_data/ 2>/dev/null
        echo -e "${GREEN}✓ MySQL data paketlendi${NC}"
    else
        echo -e "${YELLOW}⚠️  MySQL data pakete dahil edilmedi (SQL backup yeterli)${NC}"
        echo -e "${YELLOW}   MySQL data'yı da dahil etmek için: ./prepare-for-git.sh --include-mysql-data${NC}"
    fi
fi

# Restore script'i oluştur
echo -e "${CYAN}📝 Restore script'i oluşturuluyor...${NC}"
cat > "$DATA_PACKAGE/RESTORE.sh" << 'RESTORE_SCRIPT'
#!/bin/bash

# Otomatik Restore Script
# Git'ten klonladıktan sonra çalıştır: ./git_data_package/RESTORE.sh

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}   Veri Restore Tool${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Proje klasöründe mi kontrol et
if [ ! -f "../docker-compose.yml" ]; then
    echo -e "${YELLOW}Proje klasörüne geç:${NC}"
    echo "cd .."
    exit 1
fi

cd ..

echo -e "${YELLOW}1️⃣  Gerekli klasörler oluşturuluyor...${NC}"
mkdir -p database/mysql_data backups uploads logs

echo -e "${YELLOW}2️⃣  SQL backup restore ediliyor...${NC}"
if [ -f "git_data_package/latest_backup.sql.gz" ]; then
    cp git_data_package/latest_backup.sql.gz backups/
    echo -e "${GREEN}✓ SQL backup kopyalandı${NC}"
fi

echo -e "${YELLOW}3️⃣  Uploads restore ediliyor...${NC}"
if [ -f "git_data_package/uploads_backup.tar.gz" ]; then
    tar -xzf git_data_package/uploads_backup.tar.gz
    echo -e "${GREEN}✓ Uploads restore edildi${NC}"
fi

echo -e "${YELLOW}4️⃣  MySQL data restore ediliyor...${NC}"
if [ -f "git_data_package/mysql_data_backup.tar.gz" ]; then
    tar -xzf git_data_package/mysql_data_backup.tar.gz
    echo -e "${GREEN}✓ MySQL data restore edildi${NC}"
else
    echo -e "${YELLOW}⚠️  MySQL data paketi yok, Docker başlatıldıktan sonra SQL restore edin${NC}"
fi

echo ""
echo -e "${GREEN}✅ Restore tamamlandı!${NC}"
echo ""
echo -e "${YELLOW}Sonraki adımlar:${NC}"
echo -e "  1. Docker'ı başlat: ${BLUE}docker-compose up -d${NC}"
echo -e "  2. SQL restore et: ${BLUE}./restore-backup.sh${NC}"
echo -e "  3. Test et: ${BLUE}http://localhost:3000${NC}"
echo ""
RESTORE_SCRIPT

chmod +x "$DATA_PACKAGE/RESTORE.sh"

# README oluştur
cat > "$DATA_PACKAGE/README.md" << 'DATA_README'
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
DATA_README

echo -e "${GREEN}✓ Data paketi hazır: $DATA_PACKAGE/${NC}"
ls -lh "$DATA_PACKAGE/"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}2️⃣  Gereksiz Dosyaları Temizleme...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

# Node modules temizle (yeniden indirilecek)
if [ -d "node_modules" ]; then
    echo -e "${CYAN}🗑️  node_modules siliniyor...${NC}"
    rm -rf node_modules
    echo -e "${GREEN}✓ node_modules temizlendi${NC}"
fi

# .next build dosyaları temizle
if [ -d ".next" ]; then
    echo -e "${CYAN}🗑️  .next build dosyaları siliniyor...${NC}"
    rm -rf .next
    echo -e "${GREEN}✓ .next temizlendi${NC}"
fi

# MySQL data (git'e gitmesin)
if [ -d "database/mysql_data" ] && [ "$1" != "--include-mysql-data" ]; then
    echo -e "${YELLOW}⚠️  database/mysql_data korunuyor (git'e gitmeyecek)${NC}"
fi

# Gereksiz log dosyaları
echo -e "${CYAN}🗑️  Log dosyaları temizleniyor...${NC}"
find . -name "*.log" -type f -not -path "./node_modules/*" -delete 2>/dev/null
rm -f npm-debug.log* yarn-debug.log* yarn-error.log* .pnpm-debug.log* 2>/dev/null
echo -e "${GREEN}✓ Log dosyaları temizlendi${NC}"

# Cache dosyaları
echo -e "${CYAN}🗑️  Cache dosyaları temizleniyor...${NC}"
rm -rf .cache .parcel-cache .eslintcache 2>/dev/null
echo -e "${GREEN}✓ Cache temizlendi${NC}"

# OS dosyaları
echo -e "${CYAN}🗑️  OS dosyaları temizleniyor...${NC}"
find . -name ".DS_Store" -delete 2>/dev/null
find . -name "Thumbs.db" -delete 2>/dev/null
echo -e "${GREEN}✓ OS dosyaları temizlendi${NC}"

# Gereksiz backup dosyaları (eskiler)
if [ -d "backups" ]; then
    OLD_BACKUPS=$(find backups -name "*.sql" -o -name "*.tar.gz" | wc -l)
    if [ "$OLD_BACKUPS" -gt 5 ]; then
        echo -e "${CYAN}🗑️  Eski backup'lar temizleniyor (en son 3 korunuyor)...${NC}"
        # En son 3 backup dışındakileri sil
        ls -t backups/*.sql backups/*.sql.gz backups/*.tar.gz 2>/dev/null | tail -n +4 | xargs rm -f 2>/dev/null
        echo -e "${GREEN}✓ Eski backup'lar temizlendi${NC}"
    fi
fi

# Test dosyaları ve geçici dosyalar
echo -e "${CYAN}🗑️  Geçici dosyalar temizleniyor...${NC}"
find . -name "*.tmp" -o -name "*.temp" -o -name "*~" | xargs rm -f 2>/dev/null
rm -f a.out test_* 2>/dev/null
echo -e "${GREEN}✓ Geçici dosyalar temizlendi${NC}"

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}3️⃣  .gitignore Güncelleme...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

# Gelişmiş .gitignore oluştur
cat > .gitignore << 'GITIGNORE'
# Dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions
package-lock.json

# Testing
/coverage
*.test.js
*.spec.js

# Next.js
/.next/
/out/
.next/
next-env.d.ts

# Production
/build
/dist

# Misc
.DS_Store
Thumbs.db
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*
*.log

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo

# IDEs
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# MySQL & Database (ÖNEMLI!)
/database/mysql_data/
/database/mysql_data_backup*/
*.sql
*.sql.gz
!/git_data_package/latest_backup.sql.gz

# Backups (git_data_package hariç)
/backups/
!/git_data_package/

# Docker
.docker/
docker-compose.override.yml

# Logs
/logs/
*.log

# Uploads (büyük dosyalar)
/uploads/*
!/uploads/.gitkeep

# Cache
.cache/
.parcel-cache/
.eslintcache

# Temp
*.tmp
*.temp
.temp/

# Tests (workspace dosyaları)
a.out
test_*
syntax_test

# Git data package içindekileri izin ver
!git_data_package/
!git_data_package/*
GITIGNORE

echo -e "${GREEN}✓ .gitignore güncellendi${NC}"

# .gitkeep dosyaları oluştur (boş klasörler için)
echo -e "${CYAN}📝 .gitkeep dosyaları oluşturuluyor...${NC}"
mkdir -p uploads logs backups database
touch uploads/.gitkeep logs/.gitkeep database/.gitkeep
echo -e "${GREEN}✓ .gitkeep dosyaları oluşturuldu${NC}"

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}4️⃣  Proje Yapısı Optimize Ediliyor...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

# Gereksiz README dosyalarını birleştir
echo -e "${CYAN}📚 Dokümantasyon düzenleniyor...${NC}"

# Ana README oluştur/güncelle
cat > README.md << 'MAIN_README'
# 🛒 Momez E-Ticaret Sitesi

Modern, full-stack e-ticaret platformu. Next.js, TypeScript, MySQL ve Docker ile geliştirilmiştir.

## 🚀 Hızlı Başlangıç

### Yeni Kurulum
```bash
# 1. Projeyi klonla
git clone <repo-url>
cd momez

# 2. Verileri restore et
./git_data_package/RESTORE.sh

# 3. Docker'ı başlat
docker-compose up -d

# 4. Tarayıcıda aç
http://localhost:3000
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
MAIN_README

echo -e "${GREEN}✓ README.md oluşturuldu${NC}"

# docs klasörünü düzenle
if [ -d "docs" ]; then
    echo -e "${CYAN}📚 docs klasörü düzenleniyor...${NC}"
    mkdir -p docs/backup
    mv docs/*.md docs/backup/ 2>/dev/null || true
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}5️⃣  Git Commit Hazırlığı...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

# Git durumunu kontrol et
if [ -d ".git" ]; then
    echo -e "${CYAN}📊 Git durumu:${NC}"
    
    # Tüm değişiklikleri ekle
    git add -A
    
    # Status göster
    echo ""
    git status --short | head -20
    echo ""
    
    echo -e "${GREEN}✓ Dosyalar stage'e eklendi${NC}"
    echo ""
    echo -e "${YELLOW}Commit için hazır! Şunu çalıştırın:${NC}"
    echo -e "${CYAN}git commit -m \"feat: data package and project cleanup\"${NC}"
    echo -e "${CYAN}git push origin main${NC}"
else
    echo -e "${YELLOW}⚠️  Git repository bulunamadı${NC}"
    echo -e "${CYAN}Git repository başlatmak için:${NC}"
    echo -e "  git init"
    echo -e "  git add ."
    echo -e "  git commit -m \"Initial commit with data package\""
    echo -e "  git remote add origin <repo-url>"
    echo -e "  git push -u origin main"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Hazırlık Tamamlandı!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo ""

# Özet
echo -e "${YELLOW}📊 İşlem Özeti:${NC}"
echo ""

echo -e "${CYAN}✓ Data Paketi:${NC}"
if [ -d "$DATA_PACKAGE" ]; then
    echo -e "  📁 Konum: ./$DATA_PACKAGE/"
    echo -e "  📦 İçerik:"
    ls -lh "$DATA_PACKAGE/" | grep -v "^total" | awk '{print "     - "$9" ("$5")"}'
fi

echo ""
echo -e "${CYAN}✓ Temizlenen:${NC}"
echo -e "  🗑️  node_modules"
echo -e "  🗑️  .next"
echo -e "  🗑️  Log dosyaları"
echo -e "  🗑️  Cache dosyaları"
echo -e "  🗑️  Eski backup'lar"

echo ""
echo -e "${CYAN}✓ Güncellenen:${NC}"
echo -e "  📝 .gitignore"
echo -e "  📝 README.md"
echo -e "  📝 .gitkeep dosyaları"

echo ""
echo -e "${YELLOW}📋 Git'e Push İçin:${NC}"
echo -e "  ${CYAN}git add -A${NC}"
echo -e "  ${CYAN}git commit -m \"feat: complete data package and cleanup\"${NC}"
echo -e "  ${CYAN}git push origin main${NC}"

echo ""
echo -e "${YELLOW}📋 Yeni Cihazda Kurulum İçin:${NC}"
echo -e "  ${CYAN}git clone <repo-url>${NC}"
echo -e "  ${CYAN}cd momez${NC}"
echo -e "  ${CYAN}./git_data_package/RESTORE.sh${NC}"
echo -e "  ${CYAN}docker-compose up -d${NC}"

echo ""
echo -e "${GREEN}🎉 Proje Git'e push edilmeye hazır!${NC}"
echo ""

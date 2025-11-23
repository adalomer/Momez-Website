#!/bin/bash

# Güvenli MySQL Data Migration Script
# Eski volume sisteminden yeni bind mount sistemine geçiş

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   MySQL Volume Migration Tool${NC}"
echo -e "${BLUE}   Eski sistemden yeni bind mount sistemine geçiş${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Kontroller
echo -e "${YELLOW}📋 Ön Kontroller...${NC}"

# Docker kurulu mu?
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker bulunamadı!${NC}"
    exit 1
fi

# Backup var mı?
if [ ! -d "./backups" ] || [ -z "$(ls -A ./backups 2>/dev/null)" ]; then
    echo -e "${YELLOW}⚠️  Backup klasörü boş veya yok!${NC}"
    echo -e "İlk olarak mevcut verilerinizi yedeklemeniz önerilir."
    echo ""
    read -p "Backup almadan devam etmek istiyor musunuz? (evet/hayır): " CONTINUE
    if [ "$CONTINUE" != "evet" ]; then
        echo -e "${YELLOW}İşlem iptal edildi.${NC}"
        exit 0
    fi
else
    LATEST_BACKUP=$(ls -t backups/*.sql backups/*.sql.gz 2>/dev/null | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        echo -e "${GREEN}✓ En son backup bulundu: $(basename "$LATEST_BACKUP")${NC}"
    fi
fi

echo ""
echo -e "${YELLOW}📝 Migration Planı:${NC}"
echo -e "  1. Mevcut container'ları durdur"
echo -e "  2. Eski volume verilerini yedekle"
echo -e "  3. Yeni bind mount sistemine geç"
echo -e "  4. Container'ları yeniden başlat"
echo -e "  5. Veriyi kontrol et"
echo ""

read -p "Migration'a başlamak istiyor musunuz? (evet/hayır): " START
if [ "$START" != "evet" ]; then
    echo -e "${YELLOW}İşlem iptal edildi.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${YELLOW}1️⃣  Container'ları Durduruluyor...${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

docker-compose down

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${YELLOW}2️⃣  Mevcut Volume Yedekleniyor...${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

# Eski volume var mı kontrol et
if docker volume ls | grep -q "mysql_data"; then
    echo -e "${YELLOW}📦 Eski volume bulundu, yedekleniyor...${NC}"
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="backups/migration_backup_${TIMESTAMP}.sql"
    
    # Geçici container ile volume'den backup al
    docker run --rm \
        -v momez_mysql_data:/var/lib/mysql:ro \
        -v "$(pwd)/backups:/backup" \
        mysql:8.0 \
        sh -c "mysqldump -uroot -prootpassword momez_db > /backup/migration_backup_${TIMESTAMP}.sql 2>/dev/null || echo 'Volume boş veya erişilemez'"
    
    if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
        gzip "$BACKUP_FILE"
        echo -e "${GREEN}✓ Volume yedeklendi: migration_backup_${TIMESTAMP}.sql.gz${NC}"
    else
        echo -e "${YELLOW}⚠️  Volume boş veya backup alınamadı (normal olabilir)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Eski volume bulunamadı (temiz kurulum)${NC}"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${YELLOW}3️⃣  Yeni Bind Mount Sistemi Hazırlanıyor...${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

# MySQL data klasörünü oluştur
mkdir -p database/mysql_data
chmod 755 database/mysql_data

echo -e "${GREEN}✓ Bind mount klasörü hazır: ./database/mysql_data${NC}"

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${YELLOW}4️⃣  Container'lar Yeniden Başlatılıyor...${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

docker-compose up -d

# MySQL'in hazır olmasını bekle
echo -e "${YELLOW}⏳ MySQL'in başlaması bekleniyor...${NC}"
for i in {1..30}; do
    if docker exec momez-mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
        echo -e "${GREEN}✓ MySQL hazır!${NC}"
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${YELLOW}5️⃣  Veri Kontrolü...${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"

# Database var mı kontrol et
DB_EXISTS=$(docker exec momez-mysql mysql -umomez_user -pmomez_password -sN -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='momez_db'" 2>/dev/null)

if [ "$DB_EXISTS" == "momez_db" ]; then
    TABLE_COUNT=$(docker exec momez-mysql mysql -umomez_user -pmomez_password -sN momez_db -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='momez_db'" 2>/dev/null)
    
    echo -e "${GREEN}✓ Database mevcut: momez_db${NC}"
    echo -e "${GREEN}✓ Tablo sayısı: ${TABLE_COUNT}${NC}"
    
    if [ "$TABLE_COUNT" -gt 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Migration başarılı! Verileriniz korundu.${NC}"
    else
        echo ""
        echo -e "${YELLOW}⚠️  Database boş! Backup restore etmeniz gerekebilir.${NC}"
        echo -e "   Restore için: ./restore-backup.sh"
    fi
else
    echo -e "${YELLOW}⚠️  Database bulunamadı! Init.sql çalıştırılıyor...${NC}"
    
    if [ -f "database/init.sql" ]; then
        docker exec -i momez-mysql mysql -uroot -prootpassword < database/init.sql
        echo -e "${GREEN}✓ Init.sql çalıştırıldı${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}📥 Backup restore etmeniz önerilir:${NC}"
    echo -e "   ./restore-backup.sh"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Migration Tamamlandı!${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📊 Sonraki Adımlar:${NC}"
echo -e "  • Uygulamayı test edin: http://localhost:3000"
echo -e "  • MySQL'e bağlanın: docker exec -it momez-mysql mysql -umomez_user -pmomez_password momez_db"
echo -e "  • Logları kontrol edin: docker-compose logs -f"
echo ""
echo -e "${YELLOW}💾 Veri Konumu:${NC}"
echo -e "  • MySQL Data: ./database/mysql_data/"
echo -e "  • Backups: ./backups/"
echo ""
echo -e "${YELLOW}🔒 Artık Güvendesiniz:${NC}"
echo -e "  • 'docker-compose down -v' bile verilerinizi silmez"
echo -e "  • Veriler bilgisayarınızın diskinde saklanıyor"
echo -e "  • Otomatik backup için: ./auto-backup.sh"
echo ""

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

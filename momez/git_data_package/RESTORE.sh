#!/bin/bash

# Otomatik Restore Script
# Git'ten klonladıktan sonra çalıştır: ./git_data_package/RESTORE.sh

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
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

echo -e "${YELLOW}2️⃣  SQL Backup Kontrolü...${NC}"
echo ""
echo -e "${BLUE}SQL backup dosyaları güvenlik nedeniyle Git'e dahil edilmemiştir.${NC}"
echo ""
echo -e "${YELLOW}Backup'ı nasıl yüklemek istersiniz?${NC}"
echo -e "  ${GREEN}1)${NC} USB/Harici diskten kopyala"
echo -e "  ${GREEN}2)${NC} Manuel olarak backups/ klasörüne koydum"
echo -e "  ${GREEN}3)${NC} Boş database ile başla (init.sql çalışacak)"
echo -e "  ${GREEN}4)${NC} Zaten backup var, restore et"
echo ""
read -p "Seçiminiz (1-4): " CHOICE

case $CHOICE in
    1)
        echo ""
        read -p "USB mount path'i girin (örn: /media/usb/): " USB_PATH
        if [ -d "$USB_PATH" ]; then
            BACKUP_FILE=$(find "$USB_PATH" -name "*.sql.gz" -o -name "*.sql" | head -1)
            if [ -n "$BACKUP_FILE" ]; then
                cp "$BACKUP_FILE" backups/
                echo -e "${GREEN}✓ Backup kopyalandı${NC}"
            else
                echo -e "${RED}✗ Backup dosyası bulunamadı${NC}"
            fi
        else
            echo -e "${RED}✗ USB path bulunamadı${NC}"
        fi
        ;;
    2)
        if [ "$(ls -A backups/*.sql* 2>/dev/null)" ]; then
            echo -e "${GREEN}✓ Backup dosyası bulundu${NC}"
        else
            echo -e "${RED}✗ backups/ klasöründe SQL dosyası yok${NC}"
            echo -e "${YELLOW}Lütfen backup dosyasını backups/ klasörüne kopyalayın${NC}"
        fi
        ;;
    3)
        echo -e "${YELLOW}⚠️  Boş database ile başlanacak${NC}"
        echo -e "Docker başlatıldıktan sonra database/init.sql otomatik çalışacak"
        ;;
    4)
        echo -e "${GREEN}✓ Mevcut backup kullanılacak${NC}"
        ;;
    *)
        echo -e "${RED}✗ Geçersiz seçim${NC}"
        exit 1
        ;;
esac

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

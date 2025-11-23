#!/bin/bash

# Proje Zipleme Script'i
# Kullanım: ./zip-project.sh [seçenek]

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PROJECT_NAME="momez"

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}   Proje Zipleme Tool${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Hangi şekilde ziplemek istediğini sor
echo -e "${YELLOW}Nasıl ziplemek istiyorsunuz?${NC}"
echo ""
echo -e "  ${GREEN}1)${NC} Hafif Paket (Kod + Ayarlar) ${CYAN}[~7MB]${NC}"
echo -e "     ├─ Kodlar (app, components, lib)"
echo -e "     ├─ Docker ayarları"
echo -e "     ├─ Dokümantasyon"
echo -e "     └─ Scripts"
echo -e "     ${YELLOW}Hariç: node_modules, .next, database, backups${NC}"
echo ""
echo -e "  ${GREEN}2)${NC} Orta Paket (+ Backups) ${CYAN}[~12MB]${NC}"
echo -e "     ├─ Hafif paket"
echo -e "     └─ SQL backup'lar"
echo ""
echo -e "  ${GREEN}3)${NC} Tam Paket (+ Database) ${CYAN}[~100MB+]${NC}"
echo -e "     ├─ Orta paket"
echo -e "     └─ MySQL data klasörü"
echo ""
echo -e "  ${GREEN}4)${NC} Her Şey (+ node_modules) ${CYAN}[~500MB+]${NC}"
echo -e "     └─ Tüm dosyalar (hiçbir şey hariç)"
echo ""
echo -e "  ${GREEN}5)${NC} Özel (Manuel seçim)"
echo ""

read -p "Seçiminiz (1-5): " CHOICE

case $CHOICE in
    1)
        # Hafif paket
        OUTPUT="../${PROJECT_NAME}_light_${TIMESTAMP}.tar.gz"
        echo -e "${CYAN}📦 Hafif paket oluşturuluyor...${NC}"
        
        tar -czf "$OUTPUT" \
            --exclude='node_modules' \
            --exclude='.next' \
            --exclude='database/mysql_data' \
            --exclude='backups' \
            --exclude='.git' \
            --exclude='*.log' \
            --exclude='.cache' \
            .
        
        SIZE=$(du -h "$OUTPUT" | cut -f1)
        echo -e "${GREEN}✓ Hafif paket oluşturuldu: ${SIZE}${NC}"
        ;;
        
    2)
        # Orta paket (+ backups)
        OUTPUT="../${PROJECT_NAME}_medium_${TIMESTAMP}.tar.gz"
        echo -e "${CYAN}📦 Orta paket oluşturuluyor...${NC}"
        
        tar -czf "$OUTPUT" \
            --exclude='node_modules' \
            --exclude='.next' \
            --exclude='database/mysql_data' \
            --exclude='.git' \
            --exclude='*.log' \
            .
        
        SIZE=$(du -h "$OUTPUT" | cut -f1)
        echo -e "${GREEN}✓ Orta paket oluşturuldu: ${SIZE}${NC}"
        ;;
        
    3)
        # Tam paket (+ database)
        OUTPUT="../${PROJECT_NAME}_full_${TIMESTAMP}.tar.gz"
        echo -e "${CYAN}📦 Tam paket oluşturuluyor (bu biraz sürebilir)...${NC}"
        
        tar -czf "$OUTPUT" \
            --exclude='node_modules' \
            --exclude='.next' \
            --exclude='.git' \
            --exclude='*.log' \
            .
        
        SIZE=$(du -h "$OUTPUT" | cut -f1)
        echo -e "${GREEN}✓ Tam paket oluşturuldu: ${SIZE}${NC}"
        ;;
        
    4)
        # Her şey
        OUTPUT="../${PROJECT_NAME}_complete_${TIMESTAMP}.tar.gz"
        echo -e "${CYAN}📦 Komple paket oluşturuluyor (uzun sürebilir)...${NC}"
        
        tar -czf "$OUTPUT" \
            --exclude='.git' \
            .
        
        SIZE=$(du -h "$OUTPUT" | cut -f1)
        echo -e "${GREEN}✓ Komple paket oluşturuldu: ${SIZE}${NC}"
        ;;
        
    5)
        # Özel
        OUTPUT="../${PROJECT_NAME}_custom_${TIMESTAMP}.tar.gz"
        echo -e "${CYAN}📝 Özel paket seçenekleri:${NC}"
        echo ""
        
        read -p "node_modules dahil edilsin mi? (e/h): " INC_NODE
        read -p ".next dahil edilsin mi? (e/h): " INC_NEXT
        read -p "database/mysql_data dahil edilsin mi? (e/h): " INC_DB
        read -p "backups dahil edilsin mi? (e/h): " INC_BACKUP
        
        EXCLUDE_ARGS="--exclude='.git'"
        [ "$INC_NODE" != "e" ] && EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude='node_modules'"
        [ "$INC_NEXT" != "e" ] && EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude='.next'"
        [ "$INC_DB" != "e" ] && EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude='database/mysql_data'"
        [ "$INC_BACKUP" != "e" ] && EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude='backups'"
        
        echo -e "${CYAN}📦 Özel paket oluşturuluyor...${NC}"
        eval "tar -czf '$OUTPUT' $EXCLUDE_ARGS ."
        
        SIZE=$(du -h "$OUTPUT" | cut -f1)
        echo -e "${GREEN}✓ Özel paket oluşturuldu: ${SIZE}${NC}"
        ;;
        
    *)
        echo -e "${RED}✗ Geçersiz seçim!${NC}"
        exit 1
        ;;
esac

# Sonuç bilgisi
echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Zipleme Tamamlandı!${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📁 Dosya Konumu:${NC}"
echo -e "   $(realpath "$OUTPUT")"
echo ""
echo -e "${YELLOW}📊 Dosya Boyutu:${NC}"
echo -e "   $SIZE"
echo ""
echo -e "${YELLOW}📦 İçerik:${NC}"
tar -tzf "$OUTPUT" | head -20
echo "   ..."
echo -e "   ${CYAN}(Toplam $(tar -tzf "$OUTPUT" | wc -l) dosya)${NC}"
echo ""
echo -e "${YELLOW}🚀 Nasıl Kullanılır:${NC}"
echo ""
echo -e "  ${GREEN}1. Dosyayı USB'ye kopyala:${NC}"
echo -e "     cp $(basename "$OUTPUT") /media/usb/"
echo ""
echo -e "  ${GREEN}2. Yeni cihazda aç:${NC}"
echo -e "     tar -xzf $(basename "$OUTPUT")"
echo -e "     cd $PROJECT_NAME"
echo ""
echo -e "  ${GREEN}3. Gerekirse restore et:${NC}"
echo -e "     docker-compose up -d"
echo -e "     ./restore-backup.sh"
echo ""

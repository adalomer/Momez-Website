#!/bin/bash

# MySQL Backup Restore Script
# Kullanım: ./restore-backup.sh [backup_file.sql.gz]

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BACKUP_DIR="./backups"
CONTAINER_NAME="momez-mysql"
DB_NAME="momez_db"
DB_USER="momez_user"
DB_PASSWORD="momez_password"

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}   MySQL Backup Restore Tool${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

# Container kontrolü
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}✗ Hata: MySQL container çalışmıyor!${NC}"
    echo "Container'ı başlatmak için: docker-compose up -d mysql"
    exit 1
fi

# Backup dosyası seçimi
if [ -z "$1" ]; then
    echo -e "${YELLOW}Mevcut backup dosyaları:${NC}"
    echo ""
    
    # Backup dosyalarını listele
    BACKUPS=($(ls -t "$BACKUP_DIR"/mysql_backup_*.sql.gz 2>/dev/null))
    
    if [ ${#BACKUPS[@]} -eq 0 ]; then
        echo -e "${RED}✗ Hiç backup dosyası bulunamadı!${NC}"
        exit 1
    fi
    
    # Numaralı liste göster
    for i in "${!BACKUPS[@]}"; do
        FILE="${BACKUPS[$i]}"
        SIZE=$(du -h "$FILE" | cut -f1)
        DATE=$(basename "$FILE" | sed 's/mysql_backup_\(.*\)\.sql\.gz/\1/')
        # Tarihi formatla: 20251117_115358 -> 2025-11-17 11:53:58
        FORMATTED_DATE=$(echo "$DATE" | sed 's/\([0-9]\{4\}\)\([0-9]\{2\}\)\([0-9]\{2\}\)_\([0-9]\{2\}\)\([0-9]\{2\}\)\([0-9]\{2\}\)/\1-\2-\3 \4:\5:\6/')
        echo -e "  ${GREEN}[$((i+1))]${NC} $FORMATTED_DATE (${SIZE})"
    done
    
    echo ""
    read -p "Restore etmek istediğiniz backup numarasını girin (1-${#BACKUPS[@]}): " CHOICE
    
    # Geçerli seçim kontrolü
    if ! [[ "$CHOICE" =~ ^[0-9]+$ ]] || [ "$CHOICE" -lt 1 ] || [ "$CHOICE" -gt "${#BACKUPS[@]}" ]; then
        echo -e "${RED}✗ Geçersiz seçim!${NC}"
        exit 1
    fi
    
    BACKUP_FILE="${BACKUPS[$((CHOICE-1))]}"
else
    BACKUP_FILE="$1"
    
    if [ ! -f "$BACKUP_FILE" ]; then
        echo -e "${RED}✗ Backup dosyası bulunamadı: $BACKUP_FILE${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${YELLOW}⚠️  UYARI: Bu işlem mevcut veritabanını SİLECEK ve yerine backup'ı yükleyecek!${NC}"
echo -e "${YELLOW}   Restore edilecek dosya: $(basename "$BACKUP_FILE")${NC}"
echo ""
read -p "Devam etmek istediğinize emin misiniz? (evet/hayır): " CONFIRM

if [ "$CONFIRM" != "evet" ]; then
    echo -e "${YELLOW}İşlem iptal edildi.${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}🔄 Restore işlemi başlatılıyor...${NC}"

# Geçici dizin oluştur
TEMP_FILE="/tmp/restore_$(date +%s).sql"

# Dosyayı açıp geçici dosyaya kopyala
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo -e "${YELLOW}📦 Backup dosyası açılıyor...${NC}"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
else
    cp "$BACKUP_FILE" "$TEMP_FILE"
fi

# Restore et
echo -e "${YELLOW}📥 Database restore ediliyor...${NC}"
docker exec -i "$CONTAINER_NAME" mysql \
    -u"$DB_USER" \
    -p"$DB_PASSWORD" \
    "$DB_NAME" < "$TEMP_FILE"

# Sonuç kontrolü
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Restore başarıyla tamamlandı!${NC}"
    
    # Tablo sayısını kontrol et
    TABLE_COUNT=$(docker exec "$CONTAINER_NAME" mysql \
        -u"$DB_USER" \
        -p"$DB_PASSWORD" \
        -sN "$DB_NAME" \
        -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_NAME'")
    
    echo -e "${GREEN}✓ Yüklenen tablo sayısı: ${TABLE_COUNT}${NC}"
else
    echo -e "${RED}✗ Restore işlemi başarısız oldu!${NC}"
    rm -f "$TEMP_FILE"
    exit 1
fi

# Temizlik
rm -f "$TEMP_FILE"
echo -e "${GREEN}✓ İşlem tamamlandı!${NC}"

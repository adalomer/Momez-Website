#!/bin/bash

# Otomatik MySQL Backup Script
# Kullanım: ./auto-backup.sh veya crontab ile otomatik çalıştır

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Konfigürasyon
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="mysql_backup_${TIMESTAMP}.sql"
CONTAINER_NAME="momez-mysql"
DB_NAME="momez_db"
DB_USER="momez_user"
DB_PASSWORD="momez_password"

# Eski backupları temizleme (30 günden eski)
RETENTION_DAYS=30

echo -e "${YELLOW}🔄 MySQL Backup Başlatılıyor...${NC}"

# Backup dizini kontrolü
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    echo -e "${GREEN}✓ Backup dizini oluşturuldu${NC}"
fi

# Container çalışıyor mu kontrol et
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}✗ Hata: MySQL container çalışmıyor!${NC}"
    echo "Container'ı başlatmak için: docker-compose up -d mysql"
    exit 1
fi

# Backup al
echo -e "${YELLOW}📦 Backup alınıyor: ${BACKUP_FILE}${NC}"
docker exec "$CONTAINER_NAME" mysqldump \
    -u"$DB_USER" \
    -p"$DB_PASSWORD" \
    "$DB_NAME" > "$BACKUP_DIR/$BACKUP_FILE"

# Başarı kontrolü
if [ $? -eq 0 ]; then
    # Dosya boyutunu göster
    SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✓ Backup başarıyla alındı!${NC}"
    echo -e "  📁 Dosya: $BACKUP_DIR/$BACKUP_FILE"
    echo -e "  📊 Boyut: $SIZE"
    
    # Sıkıştır (opsiyonel)
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    echo -e "${GREEN}✓ Backup sıkıştırıldı: ${BACKUP_FILE}.gz${NC}"
    
    # Eski backupları temizle
    echo -e "${YELLOW}🧹 Eski backuplar temizleniyor (${RETENTION_DAYS} günden eski)...${NC}"
    find "$BACKUP_DIR" -name "mysql_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
    
    REMAINING=$(ls -1 "$BACKUP_DIR"/mysql_backup_*.sql.gz 2>/dev/null | wc -l)
    echo -e "${GREEN}✓ Mevcut backup sayısı: ${REMAINING}${NC}"
else
    echo -e "${RED}✗ Backup alınamadı!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Backup işlemi tamamlandı!${NC}"

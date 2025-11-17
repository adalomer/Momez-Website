#!/bin/bash

# Momez Website Backup Script
# Bu script veritabanı, MySQL volume ve uploads klasörünün yedeğini alır

set -e

BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Backup klasörünü oluştur
mkdir -p $BACKUP_DIR

echo "=========================================="
echo "Momez Website Backup Başlatılıyor"
echo "Tarih: $TIMESTAMP"
echo "=========================================="

# 1. SQL Dump Backup
echo ""
echo "1️⃣  SQL veritabanı yedeği alınıyor..."
docker compose exec -T mysql mysqldump -u momez_user -pmomez_password --no-tablespaces momez_db > $BACKUP_DIR/momez_db_backup_$DATE.sql 2>/dev/null
SQL_SIZE=$(du -h $BACKUP_DIR/momez_db_backup_$DATE.sql | cut -f1)
echo "✅ SQL Backup tamamlandı: $SQL_SIZE"

# 2. MySQL Volume Backup
echo ""
echo "2️⃣  MySQL volume yedeği alınıyor..."
docker compose exec -T mysql tar czf - /var/lib/mysql 2>/dev/null > $BACKUP_DIR/mysql_volume_backup_$DATE.tar.gz
VOLUME_SIZE=$(du -h $BACKUP_DIR/mysql_volume_backup_$DATE.tar.gz | cut -f1)
echo "✅ MySQL Volume Backup tamamlandı: $VOLUME_SIZE"

# 3. Uploads Backup
echo ""
echo "3️⃣  Uploads klasörü yedeği alınıyor..."
docker compose exec -T app tar czf - /app/uploads 2>/dev/null > $BACKUP_DIR/uploads_backup_$DATE.tar.gz
UPLOADS_SIZE=$(du -h $BACKUP_DIR/uploads_backup_$DATE.tar.gz | cut -f1)
echo "✅ Uploads Backup tamamlandı: $UPLOADS_SIZE"

# 4. Eski backupları temizle (30 günden eski)
echo ""
echo "4️⃣  Eski backup dosyaları temizleniyor (30+ gün)..."
find $BACKUP_DIR -name "*.sql" -type f -mtime +30 -delete 2>/dev/null || true
find $BACKUP_DIR -name "*.tar.gz" -type f -mtime +30 -delete 2>/dev/null || true
echo "✅ Eski backuplar temizlendi"

# 5. Özet
echo ""
echo "=========================================="
echo "✨ Backup Tamamlandı!"
echo "=========================================="
echo "📁 Konum: $BACKUP_DIR/"
echo "📊 SQL Dump: $SQL_SIZE"
echo "💾 MySQL Volume: $VOLUME_SIZE"
echo "🖼️  Uploads: $UPLOADS_SIZE"
echo ""
echo "📋 Backup Dosyaları:"
ls -lh $BACKUP_DIR/*$DATE* | awk '{print "   " $9 " (" $5 ")"}'
echo ""
echo "=========================================="

# Toplam backup sayısı
TOTAL_BACKUPS=$(ls -1 $BACKUP_DIR/*.sql 2>/dev/null | wc -l)
echo "💾 Toplam backup seti: $TOTAL_BACKUPS"
echo "=========================================="

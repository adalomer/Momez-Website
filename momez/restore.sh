#!/bin/bash

# Momez Website Restore Script
# Bu script backupları geri yükler

set -e

BACKUP_DIR="backups"

echo "=========================================="
echo "Momez Website Restore (Geri Yükleme)"
echo "=========================================="

# Mevcut backupları listele
echo ""
echo "📋 Mevcut SQL Backupları:"
ls -lht $BACKUP_DIR/*.sql | head -10 | nl

echo ""
read -p "Hangi backup numarasını geri yüklemek istiyorsunuz? (1-10): " BACKUP_NUM

# Seçilen backupı al
SELECTED_BACKUP=$(ls -t $BACKUP_DIR/*.sql | sed -n "${BACKUP_NUM}p")

if [ -z "$SELECTED_BACKUP" ]; then
    echo "❌ Geçersiz seçim!"
    exit 1
fi

echo ""
echo "📦 Seçilen backup: $SELECTED_BACKUP"
echo ""
read -p "⚠️  Bu işlem mevcut verileri silecek. Devam etmek istiyor musunuz? (evet/hayir): " CONFIRM

if [ "$CONFIRM" != "evet" ]; then
    echo "❌ İşlem iptal edildi."
    exit 0
fi

echo ""
echo "🔄 Veritabanı geri yükleniyor..."
docker compose exec -T mysql mysql -u momez_user -pmomez_password momez_db < $SELECTED_BACKUP

echo ""
echo "=========================================="
echo "✅ Restore Tamamlandı!"
echo "=========================================="
echo "📁 Geri yüklenen backup: $SELECTED_BACKUP"
echo ""

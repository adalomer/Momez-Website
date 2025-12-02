#!/usr/bin/env bash
set -euo pipefail

# Otomatik yedekleme scripti
# Kullanım: proje kökünde `./scripts/backup_all.sh`

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$(cd "$(dirname "$0")/../backups" && pwd)"
mkdir -p "$BACKUP_DIR"

DB_CONTAINER_NAME="momez-mysql"
DB_NAME="momez_db"
DB_ROOT_USER="root"
DB_ROOT_PASS="rootpassword"

echo "[backup] Başlıyor: $TIMESTAMP"

# 1) MySQL dump (gzip ile sıkıştırılmış)
SQL_FILE="$BACKUP_DIR/${DB_NAME}_$TIMESTAMP.sql"
SQL_GZ="$SQL_FILE.gz"

echo "[backup] MySQL dump oluşturuluyor -> $SQL_GZ"
# docker exec içinde mysqldump çalıştırıp host'a yönlendiriyoruz
docker exec "$DB_CONTAINER_NAME" sh -c "exec mysqldump --single-transaction --quick --routines --triggers --events -u ${DB_ROOT_USER} -p${DB_ROOT_PASS} ${DB_NAME}" > "$SQL_FILE"
gzip -f "$SQL_FILE"

# 2) Uploads (named volume) yedeği
# Volume adını otomatik bul (adında 'uploads' geçen ilk volume)
VOLUME_NAME=$(docker volume ls --format '{{.Name}}' | grep uploads | head -n1 || true)

if [ -z "$VOLUME_NAME" ]; then
  echo "[backup] Uyarı: 'uploads' isimli bir docker volume bulunamadı. Manuel olarak kontrol edin."
else
  echo "[backup] Uploads volume bulundu: $VOLUME_NAME"
  UPLOADS_ARCHIVE="$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz"
  echo "[backup] Uploads arşivleniyor -> $UPLOADS_ARCHIVE"
  docker run --rm -v "$VOLUME_NAME":/data -v "$BACKUP_DIR":/backup alpine sh -c "cd /data && tar czf /backup/$(basename $UPLOADS_ARCHIVE) ."
fi

echo "[backup] Tamamlandı. Yedekler:"
ls -lh "$BACKUP_DIR" | sed -n '1,200p'

echo "[backup] Güvenlik notu: SQL dosyaları hassastır. Güvenli bir yere taşıyın ve erişimi sınırlayın."

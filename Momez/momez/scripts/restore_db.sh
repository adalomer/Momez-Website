#!/usr/bin/env bash
set -euo pipefail

# DB geri yükleme scripti
# Kullanım: proje kökünde `./scripts/restore_db.sh /path/to/momez_db_YYYYMMDD.sql.gz`

if [ "$#" -ne 1 ]; then
  echo "Kullanım: $0 /path/to/momez_db_YYYYMMDD.sql.gz"
  exit 1
fi

DUMP_GZ="$1"
if [ ! -f "$DUMP_GZ" ]; then
  echo "Dosya bulunamadı: $DUMP_GZ"
  exit 1
fi

DB_CONTAINER_NAME="momez-mysql"
DB_NAME="momez_db"
DB_ROOT_USER="root"
DB_ROOT_PASS="rootpassword"

# Gzip'i açıp doğrudan container içine import et
echo "[restore] Geri yükleme başlıyor: $DUMP_GZ"
cat "$DUMP_GZ" | gunzip | docker exec -i "$DB_CONTAINER_NAME" sh -c "mysql -u${DB_ROOT_USER} -p${DB_ROOT_PASS} ${DB_NAME}"

echo "[restore] Tamamlandı."

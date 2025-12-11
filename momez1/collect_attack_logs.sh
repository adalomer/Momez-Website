#!/bin/bash

# SALDIRI LOGLARI TOPLAMA SCRIPTI
# Momez.co Güvenlik Olayı

LOG_DIR="/root/security_logs_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$LOG_DIR"

echo "=========================================="
echo "SALDIRI LOGLARI TOPLANIYOR..."
echo "Dizin: $LOG_DIR"
echo "=========================================="
echo ""

# 1. SSH Saldırı Logları
echo "[1/10] SSH saldırı logları toplanıyor..."
journalctl -u ssh --since "30 days ago" > "$LOG_DIR/ssh_full.log"
journalctl -u ssh --since "30 days ago" | grep -i "failed\|invalid" > "$LOG_DIR/ssh_failed.log"
echo "✓ SSH logları kaydedildi"

# 2. Başarısız giriş istatistikleri
echo "[2/10] Saldırı istatistikleri hesaplanıyor..."
journalctl -u ssh --since "30 days ago" | grep -i "failed password" | \
  awk '{print $(NF-3)}' | sort | uniq -c | sort -rn > "$LOG_DIR/top_attackers.txt"
echo "✓ Saldırgan IP istatistikleri kaydedildi"

# 3. Sistem logları
echo "[3/10] Sistem logları toplanıyor..."
journalctl --since "30 days ago" -p err > "$LOG_DIR/system_errors.log"
echo "✓ Sistem hata logları kaydedildi"

# 4. Auth logları
echo "[4/10] Auth logları toplanıyor..."
cp /var/log/auth.log* "$LOG_DIR/" 2>/dev/null || echo "Auth log bulunamadı"
echo "✓ Auth logları kaydedildi"

# 5. Aktif süreçler
echo "[5/10] Mevcut süreçler kaydediliyor..."
ps aux --sort=-%cpu > "$LOG_DIR/processes.txt"
ps aux --sort=-%mem >> "$LOG_DIR/processes.txt"
echo "✓ Süreç listesi kaydedildi"

# 6. Network bağlantıları
echo "[6/10] Network bağlantıları kaydediliyor..."
ss -tunap > "$LOG_DIR/network_connections.txt"
netstat -tulpn > "$LOG_DIR/listening_ports.txt" 2>/dev/null || echo "netstat bulunamadı"
echo "✓ Network durumu kaydedildi"

# 7. Cron jobs
echo "[7/10] Zamanlanmış görevler kontrol ediliyor..."
crontab -l > "$LOG_DIR/crontab.txt" 2>&1
ls -laR /etc/cron* > "$LOG_DIR/cron_files.txt" 2>&1
echo "✓ Cron jobs kaydedildi"

# 8. Son değiştirilen dosyalar
echo "[8/10] Son değiştirilen dosyalar taranıyor..."
find /tmp /var/tmp /dev/shm -type f -mtime -7 > "$LOG_DIR/recent_temp_files.txt" 2>/dev/null
find /root -type f -mtime -7 > "$LOG_DIR/recent_root_files.txt" 2>/dev/null
echo "✓ Son dosyalar kaydedildi"

# 9. Sistemd servisleri
echo "[9/10] Çalışan servisler listeleniyor..."
systemctl list-units --type=service --state=running > "$LOG_DIR/running_services.txt"
systemctl list-units --type=service --state=failed > "$LOG_DIR/failed_services.txt"
echo "✓ Servis durumu kaydedildi"

# 10. Sistem bilgisi
echo "[10/10] Sistem bilgisi toplanıyor..."
uname -a > "$LOG_DIR/system_info.txt"
cat /etc/os-release >> "$LOG_DIR/system_info.txt"
uptime >> "$LOG_DIR/system_info.txt"
free -h >> "$LOG_DIR/system_info.txt"
df -h >> "$LOG_DIR/system_info.txt"
echo "✓ Sistem bilgisi kaydedildi"

# Özet rapor oluştur
cat > "$LOG_DIR/SUMMARY.txt" << EOF
========================================
MOMEZ.CO SALDIRI LOGLARI ÖZET RAPORU
========================================
Tarih: $(date)
Sunucu: $(hostname) ($(hostname -I))

TOPLANAN LOGLAR:
- ssh_full.log          : Tüm SSH logları (30 gün)
- ssh_failed.log        : Başarısız SSH girişleri
- top_attackers.txt     : En çok saldıran IP'ler
- system_errors.log     : Sistem hata logları
- auth.log*             : Authentication logları
- processes.txt         : Aktif süreçler listesi
- network_connections.txt : Network bağlantıları
- listening_ports.txt   : Dinleyen portlar
- crontab.txt           : Zamanlanmış görevler
- recent_temp_files.txt : Son 7 gün temp dosyalar
- recent_root_files.txt : Son 7 gün root dosyalar
- running_services.txt  : Çalışan servisler
- failed_services.txt   : Başarısız servisler
- system_info.txt       : Sistem bilgileri

========================================
EN ÇOK SALDIRAN IP'LER (İLK 10)
========================================
$(head -10 "$LOG_DIR/top_attackers.txt")

========================================
KULLANIM TALİMATLARI
========================================
1. Bu logları güvenli bir yerde saklayın
2. Gerekirse adli analiz için kullanılabilir
3. Saldırgan IP'leri ISP'lerine raporlayabilirsiniz
4. Logları arşivlemek için:
   tar -czf security_logs.tar.gz $(basename "$LOG_DIR")

========================================
EOF

echo ""
echo "=========================================="
echo "LOG TOPLAMA TAMAMLANDI!"
echo "=========================================="
echo ""
echo "Loglar şurada: $LOG_DIR"
echo ""
echo "Özet raporu görüntüle:"
echo "  cat $LOG_DIR/SUMMARY.txt"
echo ""
echo "Logları sıkıştır:"
echo "  tar -czf security_logs_$(date +%Y%m%d).tar.gz $(basename "$LOG_DIR")"
echo ""
echo "En çok saldıran IP'ler:"
head -10 "$LOG_DIR/top_attackers.txt"
echo ""

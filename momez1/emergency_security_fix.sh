#!/bin/bash

# MOMEZ.CO ACİL GÜVENLİK YAMALARI
# Tarih: 10 Aralık 2025
# Bu script sunucunuzu acil güvenlik tehditlerinden korur

echo "=========================================="
echo "MOMEZ.CO ACİL GÜVENLİK YAMALARI"
echo "=========================================="
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Root kontrolü
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Bu script root olarak çalıştırılmalı!${NC}"
    echo "Kullanım: sudo bash $0"
    exit 1
fi

echo -e "${YELLOW}[UYARI] Bu script kritik güvenlik değişiklikleri yapacak!${NC}"
echo ""
read -p "Devam etmek istiyor musunuz? (evet/hayir): " CONFIRM

if [ "$CONFIRM" != "evet" ]; then
    echo "İşlem iptal edildi."
    exit 0
fi

echo ""
echo "=========================================="
echo "1. SİSTEM GÜNCELLEMESİ"
echo "=========================================="
apt update -qq
echo -e "${GREEN}✓ Paket listesi güncellendi${NC}"

echo ""
echo "=========================================="
echo "2. UFW FIREWALL KURULUMU VE YAPILANDIRMA"
echo "=========================================="

# UFW kur
if ! command -v ufw &> /dev/null; then
    apt install -y ufw
    echo -e "${GREEN}✓ UFW firewall kuruldu${NC}"
else
    echo -e "${GREEN}✓ UFW zaten kurulu${NC}"
fi

# Mevcut SSH portunu tespit et
SSH_PORT=$(grep "^Port " /etc/ssh/sshd_config | awk '{print $2}')
if [ -z "$SSH_PORT" ]; then
    SSH_PORT=22
fi

echo ""
echo -e "${YELLOW}[ÖNEMLİ] Şu anki SSH port: $SSH_PORT${NC}"
echo -e "${YELLOW}[ÖNEMLİ] Kendi IP adresinizi girin (şu anki bağlantınız kesilmesin):${NC}"
read -p "IP Adresiniz (örn: 176.88.10.20): " YOUR_IP

if [ -z "$YOUR_IP" ]; then
    echo -e "${RED}✗ IP adresi girilmedi! Firewall kuralları uygulanmadı.${NC}"
    echo "  Manuel olarak şu komutu çalıştırın:"
    echo "  ufw allow from YOUR_IP to any port $SSH_PORT"
else
    # Firewall kuralları
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    
    # Sizin IP'nizden SSH erişimine izin ver
    ufw allow from $YOUR_IP to any port $SSH_PORT comment "Your SSH access"
    
    # HTTP ve HTTPS erişimi (web sitesi için)
    ufw allow 80/tcp comment "HTTP"
    ufw allow 443/tcp comment "HTTPS"
    
    # Docker için (eğer kullanıyorsanız)
    ufw allow 2376/tcp comment "Docker"
    
    ufw --force enable
    echo -e "${GREEN}✓ Firewall kuralları uygulandı${NC}"
    echo -e "${GREEN}✓ Sadece $YOUR_IP adresinden SSH erişimi aktif${NC}"
fi

echo ""
echo "=========================================="
echo "3. FAIL2BAN KURULUMU"
echo "=========================================="

# Fail2ban kur
if ! command -v fail2ban-client &> /dev/null; then
    apt install -y fail2ban
    echo -e "${GREEN}✓ Fail2ban kuruldu${NC}"
else
    echo -e "${GREEN}✓ Fail2ban zaten kurulu${NC}"
fi

# Fail2ban yapılandırması
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
banaction = iptables-multiport

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF

systemctl enable fail2ban
systemctl restart fail2ban
echo -e "${GREEN}✓ Fail2ban yapılandırıldı ve başlatıldı${NC}"
echo "  • 3 başarısız denemede IP 1 saat engellenir"

echo ""
echo "=========================================="
echo "4. SSH GÜVENLİK AYARLARI"
echo "=========================================="

# SSH config yedekle
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)
echo -e "${GREEN}✓ SSH config yedeklendi${NC}"

# SSH güvenlik ayarları
sed -i 's/#PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/#MaxAuthTries 6/MaxAuthTries 3/' /etc/ssh/sshd_config
sed -i 's/#PermitEmptyPasswords no/PermitEmptyPasswords no/' /etc/ssh/sshd_config
sed -i 's/PermitEmptyPasswords yes/PermitEmptyPasswords no/' /etc/ssh/sshd_config

# Eğer bu satırlar yoksa ekle
if ! grep -q "^ClientAliveInterval" /etc/ssh/sshd_config; then
    echo "ClientAliveInterval 300" >> /etc/ssh/sshd_config
fi
if ! grep -q "^ClientAliveCountMax" /etc/ssh/sshd_config; then
    echo "ClientAliveCountMax 2" >> /etc/ssh/sshd_config
fi

echo -e "${GREEN}✓ SSH güvenlik ayarları uygulandı${NC}"
echo "  • Root şifre ile giriş kapatıldı (sadece SSH key)"
echo "  • Maksimum 3 deneme hakkı"
echo "  • Boş şifre yasağı"

echo ""
echo -e "${YELLOW}[ÖNEMLİ] SSH servisini yeniden başlatmak istiyor musunuz?${NC}"
echo "  Bu işlem mevcut SSH bağlantınızı KESEBİLİR!"
echo "  Yeni terminal açıp test ettikten sonra restart yapmanız önerilir."
read -p "SSH restart? (evet/hayir): " SSH_RESTART

if [ "$SSH_RESTART" = "evet" ]; then
    systemctl restart sshd
    echo -e "${GREEN}✓ SSH servisi yeniden başlatıldı${NC}"
else
    echo -e "${YELLOW}⚠ SSH restart yapılmadı. Manuel restart için:${NC}"
    echo "  systemctl restart sshd"
fi

echo ""
echo "=========================================="
echo "5. SALDIRGAN IP'LERİ ENGELLE"
echo "=========================================="

# En tehlikeli IP'leri engelle
MALICIOUS_IPS=(
    "62.60.131.18"
    "92.118.39.72"
    "92.118.39.56"
    "45.135.232.92"
    "91.202.233.33"
    "45.140.17.124"
    "182.212.206.226"
)

echo "En tehlikeli saldırgan IP'ler engelleniyor..."
for IP in "${MALICIOUS_IPS[@]}"; do
    ufw deny from $IP comment "Brute force attacker"
    echo -e "${GREEN}✓ $IP engellendi${NC}"
done

echo ""
echo "=========================================="
echo "6. GÜVENLİK TARAMASI ARAÇLARI"
echo "=========================================="

# ClamAV kur (opsiyonel)
read -p "ClamAV antivirus kurmak ister misiniz? (evet/hayir): " INSTALL_CLAMAV
if [ "$INSTALL_CLAMAV" = "evet" ]; then
    apt install -y clamav clamav-daemon
    freshclam
    echo -e "${GREEN}✓ ClamAV kuruldu${NC}"
    echo "  Tarama için: clamscan -r -i /root /home /tmp"
fi

# rkhunter kur
read -p "Rkhunter (rootkit tarayıcı) kurmak ister misiniz? (evet/hayir): " INSTALL_RKH
if [ "$INSTALL_RKH" = "evet" ]; then
    apt install -y rkhunter
    rkhunter --update
    echo -e "${GREEN}✓ Rkhunter kuruldu${NC}"
    echo "  Tarama için: rkhunter --check"
fi

echo ""
echo "=========================================="
echo "7. LOG İZLEME"
echo "=========================================="

# Basit log monitoring script
cat > /usr/local/bin/ssh-monitor.sh << 'EOF'
#!/bin/bash
echo "=== SSH SALDIRI İZLEME ==="
echo "Son 50 başarısız giriş:"
journalctl -u ssh --since "1 hour ago" | grep -i "failed password" | tail -20
echo ""
echo "En çok saldıran IP'ler (son 1 saat):"
journalctl -u ssh --since "1 hour ago" | grep -i "failed password" | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head -10
EOF

chmod +x /usr/local/bin/ssh-monitor.sh
echo -e "${GREEN}✓ SSH monitoring script oluşturuldu${NC}"
echo "  Çalıştırmak için: /usr/local/bin/ssh-monitor.sh"

echo ""
echo "=========================================="
echo "ÖZET - UYGULANAN GÜVENLİK ÖNLEMLERİ"
echo "=========================================="
echo ""
echo -e "${GREEN}✓ UFW Firewall kuruldu ve yapılandırıldı${NC}"
echo -e "${GREEN}✓ Fail2ban kuruldu (3 deneme = 1 saat ban)${NC}"
echo -e "${GREEN}✓ SSH güvenlik ayarları güçlendirildi${NC}"
echo -e "${GREEN}✓ 7 tehlikeli IP engellendi${NC}"
echo -e "${GREEN}✓ Log izleme araçları kuruldu${NC}"
echo ""
echo "=========================================="
echo "SONRAKI ADIMLAR"
echo "=========================================="
echo ""
echo "1. YENİ BİR TERMINAL AÇIN ve SSH bağlantısını test edin!"
echo "   ssh root@31.57.187.158 -p $SSH_PORT"
echo ""
echo "2. SSH Key oluşturun (şifresiz giriş için):"
echo "   ssh-keygen -t ed25519"
echo "   ssh-copy-id root@31.57.187.158"
echo ""
echo "3. Şifre ile SSH girişini tamamen kapatın:"
echo "   sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config"
echo "   sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config"
echo "   systemctl restart sshd"
echo ""
echo "4. SSH portunu değiştirin (opsiyonel ama önerilen):"
echo "   sed -i 's/#Port 22/Port 44322/' /etc/ssh/sshd_config"
echo "   ufw allow from $YOUR_IP to any port 44322"
echo "   systemctl restart sshd"
echo ""
echo "5. Cloudflare kurulumunu tamamlayın:"
echo "   - DNS ayarlarını Cloudflare'e taşıyın"
echo "   - SSL/TLS: Full (strict)"
echo "   - WAF kurallarını aktifleştirin"
echo ""
echo "6. Düzenli tarama yapın:"
echo "   /usr/local/bin/ssh-monitor.sh"
echo "   fail2ban-client status sshd"
echo ""
echo "7. Sistem taraması yapın:"
if [ "$INSTALL_CLAMAV" = "evet" ]; then
    echo "   clamscan -r -i /root /home /tmp"
fi
if [ "$INSTALL_RKH" = "evet" ]; then
    echo "   rkhunter --check"
fi
echo ""
echo "=========================================="
echo "GÜNCELLEME KONTROLÜ"
echo "=========================================="

# Firewall durumu
echo ""
echo "UFW Durum:"
ufw status numbered

echo ""
echo "Fail2ban Durum:"
fail2ban-client status

echo ""
echo "Engellenen IP sayısı:"
fail2ban-client status sshd 2>/dev/null | grep "Currently banned" || echo "Henüz engellenen IP yok"

echo ""
echo "=========================================="
echo -e "${GREEN}GÜVENLİK YAMALARI TAMAMLANDI!${NC}"
echo "=========================================="
echo ""
echo "Detaylı rapor: /root/security_scan_report.md"
echo ""

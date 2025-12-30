#!/bin/bash

# SSH PORT DEĞİŞTİRME SCRIPTI
# Bu script SSH portunu güvenli bir şekilde değiştirir

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              SSH PORT DEĞİŞTİRME ARACI                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Root kontrolü
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Bu script root olarak çalıştırılmalı!${NC}"
    echo "Kullanım: sudo bash $0"
    exit 1
fi

# Mevcut SSH portunu tespit et
CURRENT_PORT=$(grep "^Port " /etc/ssh/sshd_config | awk '{print $2}')
if [ -z "$CURRENT_PORT" ]; then
    CURRENT_PORT=22
fi

echo -e "${BLUE}Mevcut SSH Port: ${CURRENT_PORT}${NC}"
echo ""

# Yeni port önerisi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}Önerilen Portlar (Güvenli ve yaygın olmayan):${NC}"
echo ""
echo "  22222  - Hatırlaması kolay, yaygın"
echo "  44322  - İyi seçim"
echo "  52022  - Güvenli"
echo "  10022  - İyi seçim"
echo "  2222   - Basit ama biraz yaygın"
echo "  9922   - İyi seçim"
echo ""
echo -e "${YELLOW}ÖNEMLİ NOTLAR:${NC}"
echo "• 1-1024 arası portlar sistem portlarıdır (kullanmayın)"
echo "• 22, 80, 443, 3306, 8080 gibi yaygın portlar kullanmayın"
echo "• 1024-65535 arası herhangi bir port kullanabilirsiniz"
echo "• Hatırlaması kolay bir port seçin"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Port girişi
while true; do
    read -p "Yeni SSH Port numarası (1024-65535): " NEW_PORT
    
    # Port numarası kontrolü
    if ! [[ "$NEW_PORT" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}✗ Hata: Sadece rakam girebilirsiniz!${NC}"
        continue
    fi
    
    if [ "$NEW_PORT" -lt 1024 ] || [ "$NEW_PORT" -gt 65535 ]; then
        echo -e "${RED}✗ Hata: Port 1024-65535 arasında olmalı!${NC}"
        continue
    fi
    
    if [ "$NEW_PORT" -eq 22 ]; then
        echo -e "${RED}✗ Hata: Port 22 güvensiz! Farklı bir port seçin.${NC}"
        continue
    fi
    
    # Port kullanımda mı kontrol et
    if ss -tulpn | grep -q ":$NEW_PORT "; then
        echo -e "${RED}✗ Hata: Port $NEW_PORT zaten kullanımda!${NC}"
        echo "Kullanımda olan portlar:"
        ss -tulpn | grep LISTEN | awk '{print $5}' | cut -d: -f2 | sort -n | uniq
        continue
    fi
    
    break
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Seçilen port: ${NEW_PORT}${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# IP adresini al
echo -e "${YELLOW}[ÖNEMLİ] Şu anki IP adresinizi girin (bağlantınız kopmayacak):${NC}"
read -p "IP Adresiniz (boş bırakırsanız tüm IP'lere izin verilir): " YOUR_IP

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "YAPILACAK DEĞİŞİKLİKLER:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. SSH config yedeklenecek"
echo "2. SSH port $CURRENT_PORT → $NEW_PORT değiştirilecek"
echo "3. Firewall (UFW) port $NEW_PORT açılacak"
if [ -n "$YOUR_IP" ]; then
    echo "4. Sadece $YOUR_IP adresine izin verilecek"
else
    echo "4. Tüm IP'lere izin verilecek (önerilmez!)"
fi
echo "5. Eski port $CURRENT_PORT kapatılacak"
echo "6. SSH servisi yeniden başlatılacak"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Devam etmek istiyor musunuz? (EVET/hayir): " CONFIRM

if [ "$CONFIRM" != "EVET" ]; then
    echo "İşlem iptal edildi."
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "İŞLEM BAŞLIYOR..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. SSH config yedekle
echo "[1/6] SSH config yedekleniyor..."
BACKUP_FILE="/etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)"
cp /etc/ssh/sshd_config "$BACKUP_FILE"
echo -e "${GREEN}✓ Yedek oluşturuldu: $BACKUP_FILE${NC}"
echo ""

# 2. SSH portunu değiştir
echo "[2/6] SSH port değiştiriliyor..."

# Port satırını bul ve değiştir
if grep -q "^Port " /etc/ssh/sshd_config; then
    # Port satırı varsa güncelle
    sed -i "s/^Port .*/Port $NEW_PORT/" /etc/ssh/sshd_config
else
    # Port satırı yoksa ekle (genelde #Port 22 şeklinde olur)
    if grep -q "^#Port " /etc/ssh/sshd_config; then
        sed -i "s/^#Port .*/Port $NEW_PORT/" /etc/ssh/sshd_config
    else
        # Hiç yoksa dosyanın başına ekle
        sed -i "1i Port $NEW_PORT" /etc/ssh/sshd_config
    fi
fi

echo -e "${GREEN}✓ SSH port $NEW_PORT olarak ayarlandı${NC}"
echo ""

# 3. UFW kurulu mu kontrol et
echo "[3/6] Firewall (UFW) yapılandırılıyor..."

if ! command -v ufw &> /dev/null; then
    echo "UFW kurulu değil, kuruluyor..."
    apt-get update -qq
    apt-get install -y ufw
fi

# UFW'yi etkinleştir (eğer değilse)
if ! ufw status | grep -q "Status: active"; then
    ufw --force enable
fi

# Yeni portu aç
if [ -n "$YOUR_IP" ]; then
    # Belirli IP için aç
    ufw allow from $YOUR_IP to any port $NEW_PORT proto tcp comment "SSH from your IP"
    echo -e "${GREEN}✓ Port $NEW_PORT sadece $YOUR_IP için açıldı${NC}"
else
    # Herkese aç (önerilmez ama seçenek olarak var)
    ufw allow $NEW_PORT/tcp comment "SSH"
    echo -e "${YELLOW}⚠ Port $NEW_PORT herkese açık (güvenlik riski!)${NC}"
fi
echo ""

# 4. SSH config syntax kontrolü
echo "[4/6] SSH config syntax kontrolü..."
if sshd -t -f /etc/ssh/sshd_config 2>&1; then
    echo -e "${GREEN}✓ SSH config geçerli${NC}"
else
    echo -e "${RED}✗ SSH config hatası! Değişiklikler geri alınıyor...${NC}"
    cp "$BACKUP_FILE" /etc/ssh/sshd_config
    echo "Orijinal config geri yüklendi."
    exit 1
fi
echo ""

# 5. Bilgilendirme mesajı
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}[ÖNEMLİ UYARI]${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "SSH servisi yeniden başlatılacak!"
echo "Mevcut bağlantınız KESİLMEYECEK (aktif oturumlar korunur)"
echo ""
echo "Yeni bağlantı için kullanacağınız komut:"
echo ""
echo -e "${GREEN}  ssh root@31.57.187.158 -p ${NEW_PORT}${NC}"
echo ""
echo "veya config dosyasına ekleyin (~/.ssh/config):"
echo ""
echo "  Host momez"
echo "      HostName 31.57.187.158"
echo "      User root"
echo "      Port $NEW_PORT"
echo ""
echo "Sonra sadece: ${GREEN}ssh momez${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "SSH servisini ŞİMDİ yeniden başlatmak istiyor musunuz? (evet/hayir): " RESTART_NOW

if [ "$RESTART_NOW" = "evet" ]; then
    echo ""
    echo "[5/6] SSH servisi yeniden başlatılıyor..."
    systemctl restart sshd
    
    if systemctl is-active --quiet sshd; then
        echo -e "${GREEN}✓ SSH servisi başarıyla yeniden başlatıldı${NC}"
        
        # Test bağlantısı
        echo ""
        echo "Yeni port test ediliyor..."
        sleep 2
        if ss -tulpn | grep -q ":$NEW_PORT "; then
            echo -e "${GREEN}✓ SSH yeni portta ($NEW_PORT) dinliyor!${NC}"
        else
            echo -e "${RED}✗ UYARI: SSH yeni portta dinlemiyor!${NC}"
            echo "Manuel kontrol: ss -tulpn | grep sshd"
        fi
    else
        echo -e "${RED}✗ SSH servisi başlatılamadı!${NC}"
        echo "Config geri yükleniyor..."
        cp "$BACKUP_FILE" /etc/ssh/sshd_config
        systemctl restart sshd
        exit 1
    fi
else
    echo ""
    echo -e "${YELLOW}SSH servisi yeniden başlatılmadı.${NC}"
    echo "Manuel restart için: ${GREEN}systemctl restart sshd${NC}"
fi

echo ""
echo "[6/6] Eski port kapatılıyor..."

# Eski portu kapat (dikkatli ol, yeni bağlantı test edildikten sonra)
if [ "$CURRENT_PORT" != "$NEW_PORT" ]; then
    echo ""
    echo -e "${YELLOW}[DİKKAT] Eski port ($CURRENT_PORT) henüz kapatılmadı!${NC}"
    echo ""
    echo "Önce YENİ BİR TERMINAL AÇIP bağlantıyı test edin:"
    echo -e "${GREEN}  ssh root@31.57.187.158 -p ${NEW_PORT}${NC}"
    echo ""
    echo "Bağlantı başarılı olursa, eski portu kapatmak için:"
    if [ -n "$YOUR_IP" ]; then
        echo -e "${GREEN}  ufw delete allow from $YOUR_IP to any port $CURRENT_PORT${NC}"
    else
        echo -e "${GREEN}  ufw delete allow $CURRENT_PORT/tcp${NC}"
    fi
    echo ""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}SSH PORT DEĞİŞİKLİĞİ TAMAMLANDI!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "ÖZET:"
echo "  • Eski Port: $CURRENT_PORT"
echo "  • Yeni Port: $NEW_PORT"
echo "  • Yedek: $BACKUP_FILE"
if [ -n "$YOUR_IP" ]; then
    echo "  • İzin verilen IP: $YOUR_IP"
else
    echo "  • İzin: Tüm IP'ler"
fi
echo ""
echo "BAĞLANTI KOMUTU:"
echo -e "${GREEN}  ssh root@31.57.187.158 -p ${NEW_PORT}${NC}"
echo ""
echo "SONRAKI ADIMLAR:"
echo "  1. YENİ BİR TERMINAL AÇIN"
echo "  2. Yukarıdaki komutla bağlanmayı test edin"
echo "  3. Bağlantı başarılı olunca eski portu kapatın"
echo "  4. Fail2ban'i yeni port için yapılandırın"
echo ""

# Fail2ban varsa güncelle
if command -v fail2ban-client &> /dev/null; then
    echo "Fail2ban bulundu, jail.local güncelleniyor..."
    
    # jail.local'de port'u güncelle
    if [ -f /etc/fail2ban/jail.local ]; then
        if grep -q "port = ssh" /etc/fail2ban/jail.local; then
            sed -i "s/port = ssh/port = $NEW_PORT/" /etc/fail2ban/jail.local
        fi
        
        # Fail2ban'i yeniden başlat
        systemctl restart fail2ban
        echo -e "${GREEN}✓ Fail2ban yeni port için güncellendi${NC}"
    fi
fi

echo ""
echo "TEST BAĞLANTISI ŞABLONU:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat > /root/ssh_test_connection.sh << TESTEOF
#!/bin/bash
# SSH Bağlantı Test Script'i

echo "Yeni SSH portuna bağlanma testi..."
echo "Port: $NEW_PORT"
echo ""
echo "Komut:"
echo "  ssh root@31.57.187.158 -p $NEW_PORT"
echo ""
echo "Eğer bağlantı başarılı olursa, ~/.ssh/config dosyanıza ekleyin:"
echo ""
echo "Host momez"
echo "    HostName 31.57.187.158"
echo "    User root"
echo "    Port $NEW_PORT"
echo "    IdentityFile ~/.ssh/id_ed25519"
echo ""
TESTEOF

chmod +x /root/ssh_test_connection.sh
echo "Test script'i oluşturuldu: ${GREEN}/root/ssh_test_connection.sh${NC}"
echo ""
echo "Çalıştırmak için: ${GREEN}bash /root/ssh_test_connection.sh${NC}"
echo ""

# UFW status göster
echo "Mevcut Firewall Durumu:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ufw status numbered | head -20
echo ""

echo -e "${GREEN}✓ İşlem başarıyla tamamlandı!${NC}"
echo ""

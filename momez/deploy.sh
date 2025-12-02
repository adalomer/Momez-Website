#!/bin/bash

# ==========================================
# Momez E-Commerce Deployment Script
# ==========================================

set -e

# Renkli output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}   Momez E-Commerce Deployment Script${NC}"
echo -e "${GREEN}===========================================${NC}"

# Domain adını al
if [ -z "$1" ]; then
    echo -e "${YELLOW}Kullanım: ./deploy.sh <domain-adı>${NC}"
    echo -e "Örnek: ./deploy.sh momez.com.tr"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-"admin@$DOMAIN"}

echo ""
echo -e "${YELLOW}Domain: $DOMAIN${NC}"
echo -e "${YELLOW}Email: $EMAIL${NC}"
echo ""

# .env dosyasını kontrol et
if [ ! -f ".env" ]; then
    echo -e "${RED}HATA: .env dosyası bulunamadı!${NC}"
    echo "Lütfen .env.example dosyasından .env oluşturun ve düzenleyin."
    exit 1
fi

# .env dosyasında domain'i güncelle
echo -e "${GREEN}[1/7] .env dosyası güncelleniyor...${NC}"
sed -i "s|DOMAIN=.*|DOMAIN=$DOMAIN|g" .env
sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=https://$DOMAIN|g" .env

# Nginx yapılandırmasını güncelle
echo -e "${GREEN}[2/7] Nginx yapılandırması güncelleniyor...${NC}"
sed -i "s|your-domain.com|$DOMAIN|g" nginx/momez.conf

# Nginx yapılandırmasını kopyala
sudo cp nginx/momez.conf /etc/nginx/sites-available/momez
sudo ln -sf /etc/nginx/sites-available/momez /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx'i test et
sudo nginx -t

# Firewall ayarları
echo -e "${GREEN}[3/7] Firewall ayarları yapılıyor...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# Docker container'ları durdur (varsa)
echo -e "${GREEN}[4/7] Mevcut container'lar durduruluyor...${NC}"
docker compose down 2>/dev/null || true

# Docker imajlarını oluştur
echo -e "${GREEN}[5/7] Docker imajları oluşturuluyor...${NC}"
docker compose build --no-cache

# Container'ları başlat
echo -e "${GREEN}[6/7] Container'lar başlatılıyor...${NC}"
docker compose up -d

# Container'ların hazır olmasını bekle
echo "Container'ların hazır olması bekleniyor..."
sleep 30

# Nginx'i yeniden başlat
sudo systemctl restart nginx

# SSL sertifikası al (Let's Encrypt)
echo -e "${GREEN}[7/7] SSL sertifikası alınıyor...${NC}"
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Certbot otomatik yenileme
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo ""
echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}   Deployment Tamamlandı!${NC}"
echo -e "${GREEN}===========================================${NC}"
echo ""
echo -e "Site adresi: ${GREEN}https://$DOMAIN${NC}"
echo ""
echo -e "${YELLOW}Önemli Notlar:${NC}"
echo "1. .env dosyasındaki GMAIL_USER ve GMAIL_APP_PASSWORD değerlerini güncelleyin"
echo "2. Admin paneline erişmek için: https://$DOMAIN/admin"
echo "3. Logları görmek için: docker compose logs -f"
echo "4. Container durumu: docker compose ps"
echo ""

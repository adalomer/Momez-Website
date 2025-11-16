#!/bin/bash

# Momez Docker Başlatma Script'i
# Bu script tüm servisleri kontrol eder ve başlatır

echo "🚀 Momez E-Commerce Docker Setup"
echo "================================"
echo ""

# Docker kontrolü
if ! command -v docker &> /dev/null; then
    echo "❌ Docker kurulu değil!"
    echo "Docker'ı yüklemek için: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker bulundu"

# Docker Compose kontrolü
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose kurulu değil!"
    exit 1
fi

echo "✅ Docker Compose bulundu"
echo ""

# .env.local kontrolü
if [ ! -f .env.local ]; then
    echo "📝 .env.local dosyası bulunamadı, oluşturuluyor..."
    cp .env.example .env.local
    echo "✅ .env.local oluşturuldu"
fi

echo ""
echo "🐳 Docker container'lar başlatılıyor..."
echo ""

# Container'ları başlat
docker-compose up -d

echo ""
echo "⏳ MySQL'in hazır olması bekleniyor..."
sleep 10

# Servis durumlarını kontrol et
echo ""
echo "📊 Servis Durumu:"
echo "===================="
docker-compose ps

echo ""
echo "✨ Kurulum tamamlandı!"
echo ""
echo "🌐 Erişim URL'leri:"
echo "  • Web Site: http://localhost:3000"
echo "  • Admin Panel: http://localhost:3000/admin"
echo "  • phpMyAdmin: http://localhost:8080"
echo ""
echo "🔐 Admin Giriş:"
echo "  • Email: admin@momez.com"
echo "  • Şifre: admin123"
echo ""
echo "🔐 phpMyAdmin Giriş:"
echo "  • Username: momez_user"
echo "  • Password: momez_password"
echo ""
echo "📝 Logları izlemek için: docker-compose logs -f"
echo "🛑 Durdurmak için: docker-compose down"
echo ""

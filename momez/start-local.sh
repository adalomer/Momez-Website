#!/bin/bash

# Momez - Local Development Starter (Docker olmadan)
# MySQL'i sistem servisinde çalıştırır

echo "🚀 Momez Local Development"
echo "=========================="
echo ""

# MySQL kontrol
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL kurulu değil!"
    echo ""
    echo "MySQL kurmak için:"
    echo "  sudo apt update"
    echo "  sudo apt install mysql-server"
    echo ""
    exit 1
fi

echo "✅ MySQL bulundu"

# MySQL servisini başlat
echo "🔄 MySQL servisi başlatılıyor..."
sudo service mysql start

# Database oluştur
echo "📊 Database kontrol ediliyor..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS momez_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

# Kullanıcı oluştur
echo "👤 Database kullanıcısı oluşturuluyor..."
sudo mysql -e "CREATE USER IF NOT EXISTS 'momez_user'@'localhost' IDENTIFIED BY 'momez_password';" 2>/dev/null
sudo mysql -e "GRANT ALL PRIVILEGES ON momez_db.* TO 'momez_user'@'localhost';" 2>/dev/null
sudo mysql -e "FLUSH PRIVILEGES;" 2>/dev/null

# Schema yükle
if [ -f "database/init.sql" ]; then
    echo "📥 Database schema yükleniyor..."
    mysql -u momez_user -pmomez_password momez_db < database/init.sql 2>/dev/null
    echo "✅ Schema yüklendi"
fi

echo ""
echo "✨ MySQL hazır!"
echo ""
echo "🌐 Next.js başlatılıyor..."
npm run dev


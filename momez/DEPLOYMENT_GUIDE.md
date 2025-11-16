# 🚀 Momez E-Commerce - Deployment Rehberi

## 📋 Gereksinimler

- Node.js 20+
- Docker & Docker Compose
- MySQL 8.0
- 4GB RAM
- 10GB Disk

---

## 🐳 Docker ile Deployment

### 1. Ortam Hazırlığı

```bash
# Projeyi klonla
git clone <repo-url>
cd momez

# Environment dosyasını ayarla
cp .env.example .env.local
nano .env.local  # Değerleri düzenle
```

### 2. Docker Container'ları Başlat

```bash
# Container'ları başlat
docker compose up -d

# Logları izle
docker compose logs -f app

# Durumu kontrol et
docker compose ps
```

### 3. Servis Erişim

| Servis | URL | Durum |
|--------|-----|-------|
| Web Sitesi | http://localhost:3000 | ✅ |
| Admin Panel | http://localhost:3000/admin | ✅ |
| phpMyAdmin | http://localhost:8080 | ✅ |
| MySQL | localhost:3306 | ✅ |

---

## 🖥️ Production Server

### DigitalOcean / Linode / Vultr

```bash
# 1. Sunucuya bağlan
ssh root@your-server-ip

# 2. Docker yükle
curl -fsSL https://get.docker.com | sh

# 3. Proje klasörü oluştur
mkdir -p /var/www/momez
cd /var/www/momez

# 4. Dosyaları yükle (FTP veya git)
git clone <repo-url> .

# 5. Environment ayarla
cp .env.example .env.local
nano .env.local

# 6. Başlat
docker compose up -d

# 7. Nginx reverse proxy (opsiyonel)
apt install nginx -y
nano /etc/nginx/sites-available/momez
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name momez.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Nginx'i etkinleştir
ln -s /etc/nginx/sites-available/momez /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# SSL ekle (Let's Encrypt)
apt install certbot python3-certbot-nginx -y
certbot --nginx -d momez.com -d www.momez.com
```

---

## ☁️ Cloud Platforms

### AWS (Elastic Beanstalk)

```bash
# 1. EB CLI yükle
pip install awsebcli

# 2. Proje başlat
eb init -p docker momez-app --region eu-central-1

# 3. Environment oluştur
eb create momez-production

# 4. Deploy et
eb deploy

# 5. Durumu kontrol et
eb status
eb logs
```

### Google Cloud Run

```bash
# 1. gcloud CLI yükle
curl https://sdk.cloud.google.com | bash

# 2. Proje oluştur
gcloud projects create momez-app

# 3. Build & Deploy
gcloud builds submit --tag gcr.io/momez-app/web
gcloud run deploy momez --image gcr.io/momez-app/web --platform managed
```

### Heroku

```bash
# 1. Heroku CLI yükle
curl https://cli-assets.heroku.com/install.sh | sh

# 2. Giriş yap
heroku login

# 3. App oluştur
heroku create momez-app

# 4. MySQL addon ekle
heroku addons:create cleardb:ignite

# 5. Deploy et
git push heroku main

# 6. Logları izle
heroku logs --tail
```

---

## 🔒 Güvenlik

### SSL/TLS

```bash
# Let's Encrypt (ücretsiz)
certbot certonly --standalone -d momez.com
```

### Firewall

```bash
# UFW kuralları
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

### Environment Variables

Production'da mutlaka değiştir:

```env
# GÜÇLÜ ŞİFRELER KULLAN!
JWT_SECRET=super-güçlü-random-key-buraya
SESSION_SECRET=başka-bir-güçlü-key
DATABASE_PASSWORD=çok-güçlü-mysql-şifresi

# Production ayarları
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://momez.com
```

---

## 💾 Yedekleme

### Database Yedekleme

```bash
# Yedek al
docker compose exec mysql mysqldump -u momez_user -p momez_db > backup_$(date +%Y%m%d).sql

# Geri yükle
docker compose exec -T mysql mysql -u momez_user -p momez_db < backup_20250117.sql

# Otomatik yedekleme (cron)
crontab -e
# Her gün 02:00'de yedek al
0 2 * * * cd /var/www/momez && docker compose exec mysql mysqldump -u momez_user -p momez_db > /backups/momez_$(date +\%Y\%m\%d).sql
```

### Dosya Yedekleme

```bash
# Uploads klasörünü yedekle
tar -czf uploads_backup.tar.gz public/uploads/

# AWS S3'e yedekle
aws s3 cp uploads_backup.tar.gz s3://momez-backups/
```

---

## 📊 Monitoring

### Docker Stats

```bash
# Resource kullanımı
docker stats momez-app momez-mysql

# Container logları
docker compose logs -f --tail=100 app
```

### PM2 (Node.js Process Manager)

```bash
# PM2 yükle
npm install -g pm2

# App'i çalıştır
pm2 start npm --name "momez" -- start

# Otomatik başlatma
pm2 startup
pm2 save

# Monitoring
pm2 monit
pm2 logs momez
```

---

## 🔄 Güncelleme

```bash
# 1. Yeni kodu çek
git pull origin main

# 2. Rebuild et
docker compose build app

# 3. Yeniden başlat (zero downtime)
docker compose up -d --no-deps --build app

# 4. Logları kontrol et
docker compose logs -f app
```

---

## 🆘 Sorun Giderme

### Container başlamıyor

```bash
# Logları incele
docker compose logs app

# Container'ı yeniden oluştur
docker compose down
docker compose up -d --build
```

### Port kullanımda

```bash
# Port'u kullanan process'i bul
lsof -i :3000
netstat -tulpn | grep :3000

# Process'i durdur
kill -9 <PID>
```

### Database bağlantı hatası

```bash
# MySQL'in çalıştığını kontrol et
docker compose exec mysql mysql -u momez_user -p -e "SELECT 1"

# Database'i yeniden başlat
docker compose restart mysql
```

### Disk doldu

```bash
# Docker temizliği
docker system prune -a --volumes

# Log temizliği
docker compose logs --tail=0 -f app > /dev/null

# Eski image'ları sil
docker image prune -a
```

---

## 📞 Destek

- **Email:** support@momez.com
- **GitHub:** github.com/momez/web
- **Docs:** docs.momez.com

---

**🎉 Başarılar! Herhangi bir sorunla karşılaşırsan dokümanlara bak veya destek ekibine ulaş.**

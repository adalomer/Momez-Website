@echo off
REM Momez Docker Başlatma Script'i (Windows)
REM Bu script tüm servisleri kontrol eder ve başlatır

echo ================================
echo Momez E-Commerce Docker Setup
echo ================================
echo.

REM Docker kontrolü
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [HATA] Docker kurulu degil!
    echo Docker'i yuklemek icin: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

echo [OK] Docker bulundu

REM Docker Compose kontrolü
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [HATA] Docker Compose kurulu degil!
    pause
    exit /b 1
)

echo [OK] Docker Compose bulundu
echo.

REM .env.local kontrolü
if not exist .env.local (
    echo .env.local dosyasi bulunamadi, olusturuluyor...
    copy .env.example .env.local
    echo [OK] .env.local olusturuldu
)

echo.
echo Docker container'lar baslatiliyor...
echo.

REM Container'ları başlat
docker-compose up -d

echo.
echo MySQL'in hazir olmasi bekleniyor...
timeout /t 10 /nobreak >nul

REM Servis durumlarını kontrol et
echo.
echo ====================
echo Servis Durumu:
echo ====================
docker-compose ps

echo.
echo Kurulum tamamlandi!
echo.
echo Erisim URL'leri:
echo   - Web Site: http://localhost:3000
echo   - Admin Panel: http://localhost:3000/admin
echo   - phpMyAdmin: http://localhost:8080
echo.
echo Admin Giris:
echo   - Email: admin@momez.com
echo   - Sifre: admin123
echo.
echo phpMyAdmin Giris:
echo   - Username: momez_user
echo   - Password: momez_password
echo.
echo Loglari izlemek icin: docker-compose logs -f
echo Durdurmak icin: docker-compose down
echo.
pause

#!/bin/bash
# Momez Site Health Monitor
# Bu script siteyi kontrol eder, sorun varsa container'ları yeniden başlatır
# Crontab: 0 */6 * * * /root/Momez-Website/momez/scripts/health_monitor.sh >> /var/log/momez_health.log 2>&1

set -e

COMPOSE_DIR="/root/Momez-Website/momez"
SITE_URL="https://momez.co"
LOG_PREFIX="[$(date '+%Y-%m-%d %H:%M:%S')]"

log() {
    echo "$LOG_PREFIX $1"
}

# Site kontrolü
check_site() {
    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 "$SITE_URL" 2>/dev/null || echo "000")
    echo "$response"
}

# Container durumu kontrolü
check_containers() {
    cd "$COMPOSE_DIR"
    docker compose ps 2>/dev/null | grep "(unhealthy)" | wc -l
}

# Ana kontrol
main() {
    log "=== Health Check Başlatılıyor ==="
    
    # 1. Site HTTP kontrolü
    HTTP_CODE=$(check_site)
    log "Site HTTP kodu: $HTTP_CODE"
    
    if [ "$HTTP_CODE" = "200" ]; then
        log "✅ Site normal çalışıyor"
        
        # 2. Container durumu kontrolü
        UNHEALTHY_COUNT=$(check_containers)
        if [ "$UNHEALTHY_COUNT" != "0" ]; then
            log "⚠️ Unhealthy container tespit edildi"
        else
            log "✅ Tüm container'lar healthy"
        fi
        
        log "=== Health Check Tamamlandı (OK) ==="
        exit 0
    fi
    
    # Site erişilemiyorsa veya hata dönüyorsa
    log "❌ Site erişilemedi veya hata döndü (HTTP: $HTTP_CODE)"
    log "🔄 Container'lar yeniden başlatılıyor..."
    
    cd "$COMPOSE_DIR"
    
    # Önce sadece restart dene
    docker compose restart app nginx
    sleep 30
    
    # Tekrar kontrol
    HTTP_CODE=$(check_site)
    log "Restart sonrası HTTP kodu: $HTTP_CODE"
    
    if [ "$HTTP_CODE" = "200" ]; then
        log "✅ Restart başarılı, site tekrar çalışıyor"
        log "=== Health Check Tamamlandı (Restart ile düzeldi) ==="
        exit 0
    fi
    
    # Restart işe yaramadıysa, rebuild yap
    log "❌ Restart yetmedi, rebuild yapılıyor..."
    
    docker compose down
    docker compose build --no-cache app
    docker compose up -d
    
    sleep 60
    
    # Son kontrol
    HTTP_CODE=$(check_site)
    log "Rebuild sonrası HTTP kodu: $HTTP_CODE"
    
    if [ "$HTTP_CODE" = "200" ]; then
        log "✅ Rebuild başarılı, site tekrar çalışıyor"
    else
        log "❌ HATA: Rebuild sonrası da site erişilemiyor!"
        log "❌ Manuel müdahale gerekebilir"
    fi
    
    log "=== Health Check Tamamlandı ==="
}

main

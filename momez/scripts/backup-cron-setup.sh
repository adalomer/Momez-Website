#!/bin/bash
# Momez Database Backup Cron Setup Script
# This script sets up automated database backups every 2 days at 3 AM

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/backup_all.sh"
LOG_DIR="$SCRIPT_DIR/../backups"

# Ensure backup script is executable
chmod +x "$BACKUP_SCRIPT"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Remove existing momez backup cron entries
crontab -l 2>/dev/null | grep -v "backup_all.sh" > /tmp/crontab.tmp || true

# Add new cron job: Run every 2 days at 3 AM
echo "0 3 */2 * * $BACKUP_SCRIPT >> $LOG_DIR/backup.log 2>&1" >> /tmp/crontab.tmp

# Install new crontab
crontab /tmp/crontab.tmp
rm /tmp/crontab.tmp

echo "✅ Cron job installed successfully!"
echo "📅 Backup will run every 2 days at 3:00 AM"
echo "📁 Backups stored in: $LOG_DIR"
echo ""
echo "To verify, run: crontab -l"
echo "To run a manual backup now: $BACKUP_SCRIPT"

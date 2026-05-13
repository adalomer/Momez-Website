#!/bin/sh
# Health check for momez-app container
# Detects if the Node.js server is running and responding to HTTP requests

set -e

# Check if node process is running
if ! pgrep -f "node server.js" > /dev/null; then
  echo "ERROR: Node.js process not running"
  exit 1
fi

# Check if server is responding
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")

if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "404" ]; then
  echo "OK: Server responding with HTTP $RESPONSE"
  exit 0
else
  echo "ERROR: Server not responding correctly (HTTP $RESPONSE)"
  exit 1
fi

#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="droplet"
REMOTE_PATH="/opt/lotesrb-api"
PM2_NAME="lotesrb-api"
PORT=3001
LOG_FILE="/var/log/lotesrb-api-deploy.log"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

# Verificar rama
CURRENT_BRANCH=$(git -C "$SCRIPT_DIR" rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "master" ]; then
  echo "ERROR: Debes estar en 'master' para deployar (actual: $CURRENT_BRANCH)"
  exit 1
fi

# Verificar sin cambios pendientes
if ! git -C "$SCRIPT_DIR" diff --quiet || ! git -C "$SCRIPT_DIR" diff --cached --quiet; then
  echo "ERROR: Hay cambios sin commitear. Haz commit o stash antes de deployar."
  exit 1
fi

log "=== Deploy lotes-rb-api iniciado ==="

# 1. Push a GitHub
log "[1/5] Push a origin/master..."
git -C "$SCRIPT_DIR" push origin master
log "      push OK"

# 2. Build local
log "[2/5] Build local (nest build)..."
cd "$SCRIPT_DIR"
npm run build
log "      build OK"

# 3. Backup del dist remoto + rsync
log "[3/5] rsync al droplet..."
ssh "$REMOTE_HOST" "
  if [ -d $REMOTE_PATH/dist ]; then
    rm -rf $REMOTE_PATH/dist.bak
    cp -r $REMOTE_PATH/dist $REMOTE_PATH/dist.bak
  fi
"
rsync -az --delete "$SCRIPT_DIR/dist/" "$REMOTE_HOST:$REMOTE_PATH/dist/"
rsync -az "$SCRIPT_DIR/package.json" "$SCRIPT_DIR/package-lock.json" "$REMOTE_HOST:$REMOTE_PATH/"
rsync -az --delete --exclude='seed.ts' "$SCRIPT_DIR/prisma/" "$REMOTE_HOST:$REMOTE_PATH/prisma/"
log "      rsync OK"

# 4. npm install + prisma migrate deploy
log "[4/5] npm install + prisma migrate deploy..."
ssh "$REMOTE_HOST" "cd $REMOTE_PATH && npm install --omit=dev && npx prisma migrate deploy"
log "      dependencias y migraciones OK"

# 5. pm2 restart
log "[5/5] pm2 restart $PM2_NAME..."
ssh "$REMOTE_HOST" "pm2 restart $PM2_NAME"

# Health check con reintentos
log "      Health check en puerto $PORT..."
for i in {1..6}; do
  sleep 5
  HTTP_CODE=$(ssh "$REMOTE_HOST" "curl -s -o /dev/null -w '%{http_code}' --connect-timeout 3 http://localhost:$PORT/ 2>/dev/null" || echo "000")
  if [ "$HTTP_CODE" != "000" ] && [ "$HTTP_CODE" != "" ]; then
    log "      HTTP $HTTP_CODE — servicio OK"
    COMMIT=$(git -C "$SCRIPT_DIR" rev-parse --short HEAD)
    ssh "$REMOTE_HOST" "echo \"$(date) Deploy OK — $COMMIT\" >> $LOG_FILE" 2>/dev/null || true
    log "=== Deploy completado ==="
    exit 0
  fi
  log "      Intento $i/6 — esperando..."
done

# Rollback automático
log "[ROLLBACK] Servicio no responde — restaurando dist.bak..."
ssh "$REMOTE_HOST" "
  if [ -d $REMOTE_PATH/dist.bak ]; then
    rm -rf $REMOTE_PATH/dist
    mv $REMOTE_PATH/dist.bak $REMOTE_PATH/dist
    pm2 restart $PM2_NAME
    echo \"$(date) Deploy FALLIDO — rollback automático\" >> $LOG_FILE
  fi
" 2>/dev/null || true
echo ""
echo "ERROR: Deploy fallido. Se restauró el dist anterior."
echo "Revisar logs: ssh droplet 'pm2 logs $PM2_NAME --lines 50'"
exit 1

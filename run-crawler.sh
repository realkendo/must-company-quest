#!/bin/bash

PROJECT_DIR="/mnt/c/Users/KENNETH/desktop/realkendo/ken/must-company-quest"
LOG_FILE="$PROJECT_DIR/logs/cron.log"

cd "$PROJECT_DIR" || exit 1

mkdir -p logs

# Keep only last 1000 lines of log
if [ -f "$LOG_FILE" ]; then
    tail -n 1000 "$LOG_FILE" > "$LOG_FILE.tmp"
    mv "$LOG_FILE.tmp" "$LOG_FILE"
fi

find data -type f -mtime +7 -delete

echo "==============================" >> "$LOG_FILE"
echo "Cron triggered at $(date)" >> "$LOG_FILE"

npm run dev:quest4 >> "$LOG_FILE" 2>&1

echo "Execution finished at $(date)" >> "$LOG_FILE"

# Must Company Quest -- Linux Automated Web Crawler

## Overview

This project implements a web crawler executed in a Linux environment
(WSL Ubuntu) and automated using cron.\
The system logs into a protected web portal, extracts structured data,
saves it as JSON, and runs automatically on a defined schedule.

------------------------------------------------------------------------

## Architecture

-   **Runtime:** Node.js (Linux - WSL Ubuntu)
-   **Language:** TypeScript
-   **Automation:** Linux cron
-   **Logging:** Persistent log file with rotation control
-   **Data Storage:** JSON files saved locally

Project Structure:

    must-company-quest/
    │
    ├── src/
    ├── data/              # Saved crawl results (JSON)
    ├── logs/              # Execution logs
    ├── run-crawler.sh     # Linux automation script
    ├── package.json
    └── README.md

------------------------------------------------------------------------

## Linux Environment Setup

### 1. Install WSL Ubuntu

Ubuntu was installed via Windows Subsystem for Linux.

### 2. Install Node.js in Linux

    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs

Verify installation:

    node -v
    npm -v

------------------------------------------------------------------------

## Running the Crawler Manually

    npm install
    npm run dev:quest4

This: - Fetches login page - Extracts CSRF token - Authenticates -
Retrieves protected data - Saves JSON output inside `/data`

------------------------------------------------------------------------

## Automation with Cron

### Cron Script (`run-crawler.sh`)

``` bash
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

# Remove data files older than 7 days
find data -type f -mtime +7 -delete

echo "==============================" >> "$LOG_FILE"
echo "Cron triggered at $(date)" >> "$LOG_FILE"

npm run dev:quest4 >> "$LOG_FILE" 2>&1

echo "Execution finished at $(date)" >> "$LOG_FILE"
```

Make executable:

    chmod +x run-crawler.sh

------------------------------------------------------------------------

### Cron Schedule

Edit cron:

    crontab -e

Scheduled to run daily at 9 AM:

    0 9 * * * /bin/bash /mnt/c/Users/KENNETH/desktop/realkendo/ken/must-company-quest/run-crawler.sh

Verify:

    crontab -l

------------------------------------------------------------------------

## Logging Strategy

-   All output is redirected to `logs/cron.log`
-   Log file automatically trimmed to last 1000 lines
-   Each execution records start and finish timestamps
-   Errors are captured using `2>&1` redirection

------------------------------------------------------------------------

## Data Retention Strategy

-   Crawl results saved as timestamped JSON files
-   Files older than 7 days are automatically deleted
-   Prevents uncontrolled disk growth

------------------------------------------------------------------------

## Proof of Automation

To demonstrate:

    node -v
    crontab -l
    cat logs/cron.log
    ls data/

This confirms: - Linux Node environment - Cron automation active -
Execution logs recorded - JSON files being generated

------------------------------------------------------------------------

## Summary

This implementation provides:

-   Linux-based web crawling
-   Secure login handling (CSRF + authentication)
-   Automated scheduled execution
-   Persistent logging
-   Controlled data retention
-   Production-style operational behavior

The system is fully automated, self-maintaining, and suitable for
deployment in a Linux production environment.

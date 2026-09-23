#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath "$0")")"

echo "[۱/۳] دریافت آخرین نسخه از GitHub..."
git pull --ff-only origin main

rm -f reset.html
PORT="${PORT:-4173}"
CACHE_BUSTER="$(date +%s)"

if command -v python3 >/dev/null 2>&1; then
  PYTHON=python3
elif command -v python >/dev/null 2>&1; then
  PYTHON=python
else
  echo "پایتون پیدا نشد. Python را نصب کنید و دوباره تلاش کنید."
  exit 1
fi

echo "[۲/۳] کش قدیمی با نسخه‌دار کردن آدرس دور زده می‌شود."
echo "[۳/۳] اجرای سرور روی http://localhost:${PORT}/?localserver=${CACHE_BUSTER}"
"$PYTHON" -m http.server "$PORT" --bind 0.0.0.0

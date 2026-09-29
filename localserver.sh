#!/usr/bin/env bash
set -e
cd "$(dirname "$(realpath "$0")")"

echo "[۱/۳] دریافت آخرین نسخه از GitHub..."
if [ -d .git ] && git remote get-url origin >/dev/null 2>&1; then
  BRANCH="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || echo main)"
  if ! git pull --ff-only origin "$BRANCH"; then
    echo "هشدار: دریافت خودکار انجام نشد؛ برنامه با همین نسخه موجود بالا می‌آید."
  fi
else
  echo "هشدار: مخزن Git پیکربندی نشده است؛ برنامه با همین نسخه موجود بالا می‌آید."
fi
PORT="${PORT:-4173}"
CACHE_BUSTER="$(date +%s)"
cd web

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

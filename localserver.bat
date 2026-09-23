@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul

echo ========================================
echo   Alum Metal Arak - Local Server
echo ========================================
echo.
echo [1/3] دریافت آخرین نسخه از GitHub...
git pull --ff-only origin main
if errorlevel 1 (
  echo.
  echo دریافت نسخه جدید ناموفق بود. اتصال اینترنت و وضعیت Git را بررسی کنید.
  pause
  exit /b 1
)

if exist reset.html del /q reset.html
set "PORT=4173"
set "CACHE_BUSTER=%RANDOM%"

where py >nul 2>&1
if not errorlevel 1 (
  set "PYTHON=py -3"
) else (
  where python >nul 2>&1
  if errorlevel 1 (
    echo پایتون پیدا نشد. Python را نصب کنید و دوباره تلاش کنید.
    pause
    exit /b 1
  )
  set "PYTHON=python"
)

echo [2/3] کش قدیمی با نسخه‌دار کردن آدرس دور زده می‌شود.
echo [3/3] اجرای سرور روی پورت %PORT%...
echo آدرس: http://localhost:%PORT%/?localserver=%CACHE_BUSTER%
echo برای توقف سرور Ctrl+C را بزنید.
start "" "http://localhost:%PORT%/?localserver=%CACHE_BUSTER%"
%PYTHON% -m http.server %PORT% --bind 0.0.0.0

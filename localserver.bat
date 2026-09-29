@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul

echo ========================================
echo   Alum Metal Arak - Local Server
echo ========================================
echo.
echo [1/3] دریافت آخرین نسخه از GitHub...
for /f "delims=" %%R in ('git remote get-url origin 2^>nul') do set "HAS_REMOTE=%%R"
if not defined HAS_REMOTE (
  echo هشدار: مخزن Git پیکربندی نشده است؛ برنامه با همین نسخه موجود بالا می‌آید.
) else (
  git pull --ff-only origin main
  if errorlevel 1 echo هشدار: دریافت خودکار انجام نشد؛ برنامه با همین نسخه موجود بالا می‌آید.
)

set "PORT=4173"
set "CACHE_BUSTER=%RANDOM%"
cd /d "%~dp0web"

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

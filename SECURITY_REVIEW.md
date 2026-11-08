# گزارش بررسی امنیتی (Security Review)

**تاریخ بررسی:** ۱۴۰۴/۰۸/۱۵  
**دامنه‌های مورد بررسی:**  
- `https://alummetal.com` (سایت وردپرس اصلی)  
- `https://app-alummetal.ir` (وب‌اپلیکیشن PWA)

> **یادداشت:** سایت اصلی وردپرس فاقد صفحه ورود عمومی قابل مشاهده است، اما همچنان نیاز به بررسی و تقویت امنیت دارد.

---

## ۱) بررسی امنیتی وب‌اپلیکیشن PWA (`app-alummetal.ir`)

این اپ به‌صورت کاملاً استاتیک (Static) و بدون بک‌اند عمل می‌کند. فایل‌های داده در قالب JSON بارگذاری می‌شوند که سطح حمله را به‌شدت کاهش می‌دهد.

### نقاط قوت

| مورد | وضعیت | توضیح |
|---|---|---|
| **ساختار استاتیک** | خوب | بدون PHP، دیتابیس یا پردازش سرور سمت‌کاربر، آسیب‌پذیری‌های رایج سمت‌سرور (SQLi, RCE) وجود ندارد |
| **عدم استفاده از توابع خطرناک** | خوب | در کد بررسی‌شده از `eval`, `innerHTML`, `document.write`, `new Function` استفاده نشده است |
| **لینک‌های خارجی امن** | خوب | لینک‌های `target="_blank"` از `rel="noopener"` بهره می‌برند |
| **سیستم نسخه‌بندی** | خوب | مکانیزم کش‌بستن با `?v=` و `version.json` برای اطمینان از به‌روزرسانی صحیح کاربران |
| **سرویس‌ورکر محدود** | خوب | `notify-sw.js` فقط برای کلیک روی نوتیفیکیشن نسخه جدید طراحی شده و کش فایل‌های اپ را انجام نمی‌دهد. مطابق با تصمیم مالک، نوتیفیکیشن‌ها خاموش هستند |
| **فایل‌های داده محلی** | خوب | تمامی اطلاعات در فایل‌های JSON محلی بارگذاری می‌شوند |

### نقاط ضعف و پیشنهادات بهبود

| ریسک | سطح خطر | توضیح | پیشنهاد رفع |
|---|---|---|---|
| **هدرهای امنیتی HTTP** | متوسط | فایل `.htaccess` فعلی فقط شامل هدرهای کش و فشرده‌سازی است. هدرهای امنیتی مانند CSP، HSTS، X-Content-Type-Options، Referrer-Policy و Permissions-Policy وجود ندارند. | افزودن هدرهای امنیتی به `.htaccess` (پیشنهاد در ادامه آمده) |
| **Content-Security-Policy (CSP)** | متوسط | عدم وجود CSP امکان سوءاستفاده در صورت وجود XSS (هرچند فعلاً دیده نشده) را افزایش می‌دهد. | تعریف CSP سخت‌گیرانه با `default-src 'self'` و فقط منابع مجاز |
| **Strict-Transport-Security (HSTS)** | متوسط | اگر سرور هدر HSTS را ارسال نکند، کاربران در اولین اتصال ممکن است در معرض حملات downgrade قرار بگیرند. | فعال‌سازی HSTS با `max-age` مناسب و در صورت امکان `includeSubDomains` |
| **X-Frame-Options / frame-ancestors** | پایین-متوسط | عدم محدودیت برای embedding می‌تواند در برخی سناریوها باعث Clickjacking شود. | افزودن `X-Frame-Options: SAMEORIGIN` یا `frame-ancestors 'self'` در CSP |
| **Referrer-Policy** | پایین | عدم تنظیم این هدر می‌تواند اطلاعات referrer را در صورت وجود لینک‌های خارجی افشا کند. | تنظیم `Referrer-Policy: strict-origin-when-cross-origin` |
| **Permissions-Policy** | پایین | دسترسی به ویژگی‌های مرورگر (camera, microphone, geolocation) به‌صورت پیش‌فرض محدود نشده است. | محدود کردن با `Permissions-Policy: camera=(), microphone=(), geolocation=()...` |

### پیشنهاد بهبود `.htaccess` برای `app-alummetal.ir`

```apache
# Security Headers
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
  # در صورت فعال بودن HTTPS و پشتیبانی سرور
  # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
  # CSP پیشنهادی - نیاز به بررسی در محیط واقعی
  # Header always set Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; manifest-src 'self'; worker-src 'self'"
</IfModule>

# جلوگیری از لیست شدن دایرکتوری‌ها
<IfModule mod_autoindex.c>
  Options -Indexes
</IfModule>
```

> **توضیح:** استفاده از `'unsafe-inline'` در CSP به دلیل اسکریپت‌ها و استایل‌های inline موجود در `index.html` فعلاً ضروری است. در نسخه‌های آتی بهتر است این موارد را به فایل‌های خارجی منتقل کنید.

---

## ۲) بررسی امنیتی سایت وردپرس (`alummetal.com`)

با توجه به اینکه صفحه ورود عمومی دیده نمی‌شود و سایت بیشتر محتوایی/شرکتی است، با این حال وردپرس بدون سخت‌گیری می‌تواند هدف قرار بگیرد.

### نقاط بررسی و پیشنهادات

| مورد | سطح خطر | وضعیت پیشنهادی | توضیح و راهکار |
|---|---|---|---|
| **هسته وردپرس** | بالا | الزامی | همیشه از آخرین نسخه پایدار وردپرس استفاده کنید. به‌روزرسانی‌های امنیتی فوری اعمال شوند. |
| **افزونه‌ها و قالب‌ها** | بالا | الزامی | غیرفعال و حذف افزونه‌ها/قالب‌های بلااستفاده. همه موارد فعال حتماً به‌روز باشند. قالب Enfold نیز باید آپدیت شده باشد. |
| **xmlrpc.php** | متوسط-بالا | توصیه می‌شود غیرفعال شود | `xmlrpc.php` می‌تواند برای brute-force و حملات DDoS مورد سوءاستفاده قرار گیرد. اگر واقعاً نیاز نیست، بهتر است غیرفعال شود. |
| **wp-login.php / wp-admin** | متوسط-بالا | الزامی تقویت شود | حتی اگر لینک مستقیم مخفی است، باید محافظت شود. پیشنهاد: محدودیت تلاش ورود، احراز هویت دو مرحله‌ای (2FA)، تغییر آدرس ورود در صورت امکان، یا محدودیت IP. |
| **فایل‌های اضافی** | متوسط | الزامی حذف/محدود | بررسی و حذف `readme.html`, `license.txt`, `wp-config-sample.php` و هر فایل پشتیبان (`.bak`, `.old`, `.zip`) از روت سایت. |
| **شمارش کاربران (User Enumeration)** | متوسط | الزامی مسدود شود | جلوگیری از دسترسی به `/?author=1`, `/?author=2` و جلوگیری از افشای نام کاربران از طریق REST API در صورت عدم نیاز. |
| **لیست دایرکتوری** | متوسط | الزامی غیرفعال شود | اطمینان از غیرفعال بودن Directory Listing در تمام پوشه‌ها. |
| **هدرهای امنیتی** | متوسط | الزامی افزودن | مشابه اپ، افزودن `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` و در صورت HTTPS فعال‌سازی HSTS. |
| **ویرایش فایل از پنل** | متوسط | الزامی غیرفعال شود | در `wp-config.php` اضافه شود: `define('DISALLOW_FILE_EDIT', true);` و در صورت نیاز توسعه، فقط موقت فعال گردد. |
| **پشتیبان‌گیری** | بالا | الزامی | داشتن پشتیبان‌گیری خودکار و منظم، با ذخیره‌سازی خارج از هاست (Off-site). |
| **امنیت فایل‌ها** | متوسط | الزامی بررسی شود | بررسی دسترسی فایل‌ها/پوشه‌ها (ترجیحاً 644 برای فایل‌ها و 755 برای پوشه‌ها). فایل `wp-config.php` باید با دسترسی محدودتر محافظت شود. |

### پیشنهادات برای `.htaccess` وردپرس

```apache
# امنیت اضافی وردپرس
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # مسدود کردن دسترسی به xmlrpc.php در صورت عدم نیاز
  # RewriteRule ^xmlrpc\.php$ - [F,L]
  
  # مسدود کردن دسترسی به فایل‌های حساس
  <Files wp-config.php>
    Order allow,deny
    Deny from all
  </Files>
  
  <Files readme.html>
    Order allow,deny
    Deny from all
  </Files>
  
  <Files license.txt>
    Order allow,deny
    Deny from all
  </Files>
</IfModule>

# هدرهای امنیتی
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# جلوگیری از لیست دایرکتوری
Options -Indexes
```

---

## ۳) توصیه‌های فوری و اولویت‌بندی

| اولویت | اقدام | دامنه |
|---|---|---|
| **خیلی بالا** | به‌روزرسانی هسته، قالب و افزونه‌های وردپرس | `alummetal.com` |
| **خیلی بالا** | فعال‌سازی محدودیت ورود + 2FA برای هر کاربری که دسترسی مدیریتی دارد | `alummetal.com` |
| **بالا** | افزودن هدرهای امنیتی (X-Content-Type-Options, X-Frame-Options, Referrer-Policy) | هر دو دامنه |
| **بالا** | غیرفعال یا محافظت کردن `xmlrpc.php` در صورت عدم استفاده | `alummetal.com` |
| **بالا** | افزودن `DISALLOW_FILE_EDIT` به `wp-config.php` | `alummetal.com` |
| **متوسط** | افزودن هدرهای امنیتی به `.htaccess` اپ PWA | `app-alummetal.ir` |
| **متوسط** | بررسی و حذف فایل‌های پشتیبان/اضافی از روت وردپرس | `alummetal.com` |
| **متوسط** | راه‌اندازی پشتیبان‌گیری خودکار خارج از هاست | `alummetal.com` |

---

## نتیجه‌گیری

- **اپ PWA:** طراحی تمیز و کم‌خطر است. اصلی‌ترین نکته بهبود هدرهای امنیتی HTTP است.
- **سایت وردپرس:** با توجه به عدم وجود صفحه ورود قابل مشاهده، سطح ریسک کمتر به نظر می‌رسد، اما باید با به‌روزرسانی‌های منظم، سخت‌گیری دسترسی‌ها و هدرهای امنیتی کاملاً تقویت شود.

**نکته نهایی:** بیشتر آسیب‌پذیری‌های وردپرس ناشی از افزونه‌های قدیمی یا تنظیمات نادرست است، نه خود هسته وردپرس. تمرکز بر به‌روزرسانی و حداقل‌گرایی (حذف موارد غیرضروری) مؤثرترین راهکار خواهد بود.

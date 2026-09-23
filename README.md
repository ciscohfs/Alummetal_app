# Alum Metal Arak

Persian-first mobile-style desktop application for Alum Metal Arak, built with Python and Kivy.

## Current features

- Persian-first RTL interface with Yekan font support
- English language toggle
- Dark and light themes
- Custom canvas-drawn menu icon and slide-out navigation drawer
- Home screen with modern glass-inspired service cards
- Aluminum weight calculator using dimensions in millimeters
- Daily aluminum price reference screen
- Product catalog for architectural profiles, industrial profiles, sheets and coils
- Alloys database with common alloy guidance
- Request-a-quote form with local validation and feedback
- Contact information and settings screens
- Responsive scrollable layouts designed for a 360–420 px mobile-style window

## Run on Windows or Linux

```bash
cd desktop
python -m pip install -r requirements.txt
python app.py
```

The desktop app keeps its Kivy files and `Yekan.ttf` in `desktop/`; shared web images are kept in `web/img/`.

## Project structure

- `desktop/app.py` — Kivy application bootstrap, navigation, localization, theme state and form/calculator logic
- `desktop/home.kv` — UI layout, reusable components and all application screens
- `desktop/Yekan.ttf` — Persian UI font
- `web/fonts/BYekan.ttf` — B Yekan web font used by the standalone web app
- `web/img/logo1.png` — Alum Metal logo
- `web/img/site-hero.png` — branded industrial hero banner adapted from the public website visual language
- `web/img/factory-banner.jpg` — factory banner reserved for the catalog/about experience
- `desktop/requirements.txt` — Python dependencies

## Notes

The displayed aluminum prices are reference values intended for the prototype. They should be connected to an approved data source before production use. The quote form currently validates and reports locally; a backend or email/WhatsApp integration can be added when the company workflow is selected.

## Status

The application is a functional multi-screen prototype ready for the next product-specific integrations and content updates.

## Web version

The repository also includes a standalone HTML/CSS/JavaScript web app in `web/index.html`, `web/styles.css` and `web/app.js`. It is mobile-first, RTL-aware, responsive on desktop, supports browser fullscreen, safe-area insets, reduced-motion preferences, local theme persistence, and installability as a Progressive Web App through `manifest.webmanifest` and `sw.js`.

Run it locally with:

```bash
cd web
python -m http.server 4173 --bind 0.0.0.0
```

Then open `http://localhost:4173`. For a real custom domain, upload the web files to any static host and point the domain DNS to that host. HTTPS is required by browsers for service-worker/PWA features outside localhost.

## اجرای سریع نسخهٔ وب

برای دریافت آخرین نسخه از GitHub، حذف فایل قدیمی `reset.html`، دور زدن کش و اجرای سرور محلی، فایل `localserver.bat` را در ویندوز اجرا کنید. این ابزار به‌صورت خودکار آدرس نسخه‌دار را در مرورگر باز می‌کند. در لینوکس یا macOS نیز از `./localserver.sh` استفاده کنید.

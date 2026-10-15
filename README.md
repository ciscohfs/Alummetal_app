# Alum Metal Arak

Persian-first mobile-style desktop application for Alum Metal Arak, built with Python and Kivy.

## Current features

- Persian-first RTL interface with B Yekan font support
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

The desktop app keeps its Kivy files and `BYekan.ttf` in `desktop/`; shared web images are kept in `web/img/`.

## Project structure

- `desktop/app.py` — Kivy application bootstrap, navigation, localization, theme state and form/calculator logic
- `desktop/home.kv` — UI layout, reusable components and all application screens
- `desktop/BYekan.ttf` — B Yekan Persian UI font (byte-identical to the web font)
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

The repository also includes a standalone HTML/CSS/JavaScript web app in `web/index.html`, `web/styles.css` and `web/app.js`. It is mobile-first and RTL-aware, and lays out as a single 480 px column on phones and as a full multi-column page on desktop screens (breakpoint at 700 px). It supports browser fullscreen, safe-area insets, reduced-motion preferences and local theme persistence. A `manifest.webmanifest` is provided so the app can be installed to the home screen. Offline caching through `sw.js` is intentionally disabled: `index.html` unregisters any other service worker and clears legacy caches on every load so the static app always serves the current files. The only service worker that survives is `notify-sw.js`, which draws the daily notifications, answers no fetch event and therefore caches nothing.

### Web app notes (current revision)

- Light theme is the default; dark mode stays available from the header button and the settings screen, and the `theme-color` meta follows the active theme.
- The navigation drawer opens from the right, matching the RTL layout and the hamburger button in the top bar. From 1024px up it is **locked open as a sidebar** (no hamburger, no scrim, body padded by its width) so desktop users never open or close it.
- The home hero banner was removed, and the factory strip is now a single centred «دریافت مشاوره تخصصی» button — its heading, paragraph and brand photo are gone, only the accent bar on the inline-start edge stays. The shortcut grid ("دسترسی سریع") holds six navy cards with line icons, ordered per the approved mockup: weight calculator, product catalogue, alloy encyclopedia, element-to-alloy, alloy comparison, use-case-to-alloy — three per row on desktop.
- **عنصر بده، آلیاژ بگیر** and **انتخاب آلیاژ بر اساس کاربرد** are separate screens, both listed in the drawer. Every alloy carries an AA-based composition range in `app.js` (`ALLOY_COMPOSITIONS`), matching is distance-based and scored, and each screen always returns ranked suggestions — from a single element value (e.g. `Si 0.45`) or from a single application chip. Results marked «محدوده تقریبی» use approximate ranges and must be confirmed against the mill certificate before a final decision.
- Section names follow the mockup: the alloy bank is now «دانشنامه آلیاژها» and the use-case finder is «انتخاب آلیاژ بر اساس کاربرد».
- Changed asset URLs carry a `?v=` query (`styles.css?v=18`, `app.js?v=18`, icons, manifest) so a returning visitor cannot end up with cached CSS/JS against new markup. Bump that number on every deploy that changes those files — including `img/icon-*.png`, because launcher icons and `apple-touch-icon` are cached aggressively. **The address bar stays clean**: those queries live only in the markup, navigation never writes a `#hash` or `?query`, and the one `?v=` the self-update flow adds to the document URL is stripped by the first lines of `app.js` as soon as the page is in, so the visitor only ever sees the bare domain.
- `web/.htaccess` (Apache/cPanel) sets `Cache-Control: no-cache` on HTML so `index.html` is always revalidated — without it a returning visitor can be held on an old shell and would never receive the update popup. Upload it next to `index.html`; it is wrapped in `<IfModule>` so it is harmless if `mod_headers`/`mod_deflate` are disabled.
- **Home opening line**: the three metric cards were replaced by the brand line «آلوم متال آراک — تخصص در آلیاژ، کیفیت در تولید» (`.brand-tagline`).
- **No request forms**: the web app has no quote/contact form anymore; every «تماس با ما» route points at the contact screen with the real phone, address and social links.
- **Daily notifications** (home banner + settings row): the app asks for `Notification` permission, then delivers **two random messages a day**. The two hours are drawn once per day and stored in `localStorage` (`alum-notify-state-v1`) so a reload never reshuffles them; messages come from the `NOTIFY_MESSAGES` pool in `app.js` and never repeat within the same day. Delivery is attempted on load, once a minute and whenever the tab becomes visible, so a slot that passed while the app was closed is caught up on the next visit. Notifications are shown through `notify-sw.js` (Android/iOS path) with the plain `Notification` constructor as the desktop fallback, and the toast always mirrors the message. Turning them off (or blocking them) is done from the settings row.
- **Self-update flow**: `web/version.json` is the single source of truth (`version`, `date`, `notes`). On every load the app fetches it with `cache: 'no-store'` and compares it with `localStorage.alum-app-version`. A newer version opens the update popup (once per session) and marks the settings row as «نسخهٔ جدید دارد»; pressing «به‌روزرسانی» clears Cache Storage, unregisters service workers, stores the new version and reloads the document with `?v=<version>` so `index.html` and its versioned CSS/JS are fetched again. To publish an update: change the app files, bump `?v=` in `index.html`, and raise `version` (plus `notes`) in `version.json`.
- Install-to-home-screen is always reachable: a dismissible banner on the home screen plus a permanent row in settings, with a step-by-step per-platform guide when the browser does not fire `beforeinstallprompt`. The two home banners (install, daily notifications) only appear while the visitor has not installed the app / enabled the notifications. Closing one hides it for the current visit only — it lives in `sessionStorage`, so the next visit asks again. An installation is different from a dismissal: once the browser reports it (`appinstalled`) or `getInstalledRelatedApps()` finds the app on the device (that is what `related_applications` in the manifest is for), the install banner stays away on later visits too.
- Brand assets: the app tiles (`img/icon-192.png`, `img/icon-512.png`, `img/apple-touch-icon.png`) are a brand-navy gradient with the logo inside the maskable safe zone; the browser tab keeps the small mark on white (`img/favicon.*`); the Bale/Eitaa/Rubika marks live in `img/social/`.

Run it locally with:

```bash
cd web
python -m http.server 4173 --bind 0.0.0.0
```

Then open `http://localhost:4173`. For a real custom domain, upload the web files to any static host and point the domain DNS to that host. HTTPS is required by browsers for the web app manifest (home-screen install) outside localhost.

## اجرای سریع نسخهٔ وب

برای دریافت آخرین نسخه از GitHub، دور زدن کش مرورگر و اجرای سرور محلی، فایل `localserver.bat` را در ویندوز اجرا کنید. این ابزار به‌صورت خودکار آدرس نسخه‌دار را در مرورگر باز می‌کند. در لینوکس یا macOS نیز از `./localserver.sh` استفاده کنید.

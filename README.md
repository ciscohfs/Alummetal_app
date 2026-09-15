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
python -m pip install -r requirements.txt
python app.py
```

The app uses `Yekan.ttf` and `logo1.png`; both files must remain beside `app.py` and `home.kv`.

## Project structure

- `app.py` — Kivy application bootstrap, navigation, localization, theme state and form/calculator logic
- `home.kv` — UI layout, reusable components and all application screens
- `Yekan.ttf` — Persian UI font
- `logo1.png` — Alum Metal logo
- `site-hero.png` — branded industrial hero banner adapted from the public website visual language
- `factory-banner.jpg` — factory banner reserved for the catalog/about experience
- `requirements.txt` — Python dependencies

## Notes

The displayed aluminum prices are reference values intended for the prototype. They should be connected to an approved data source before production use. The quote form currently validates and reports locally; a backend or email/WhatsApp integration can be added when the company workflow is selected.

## Status

The application is a functional multi-screen prototype ready for the next product-specific integrations and content updates.

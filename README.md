# Alum Metal Arak

Persian-first mobile app prototype for Alum Metal Arak, built with Python and Kivy.

## Features

- Persian interface with English language toggle
- Yekan font support
- Liquid Glass-inspired mobile home screen
- Aluminum weight calculator entry point
- Aluminum prices entry point
- Product catalog entry point
- Alloys database entry point

## Run on Windows

```powershell
python -m pip install -r requirements.txt
python app.py
```

The app uses `Yekan.ttf`, which should remain beside `app.py`.

## Project structure

- `app.py` — Kivy application bootstrap and Persian text shaping
- `home.kv` — Home screen UI
- `Yekan.ttf` — UI font
- `logo1.png` — Alum Metal logo
- `requirements.txt` — Python dependencies

## Status

This is the initial Home screen prototype. The service cards are ready to be connected to real app screens and APIs.

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const appShell = $('#appShell');
const drawer = $('#drawer');
const scrim = $('#scrim');
const toast = $('#toast');
let deferredInstallPrompt = null;
const BUILTIN_PRICES = {"updated_at": "2026-09-15", "currency_note": "واحدها مطابق منبع هستند؛ ریال و تومان را جدا نگه دارید.", "sources": [{"name": "پارس آلومینیوم — ورق", "url": "https://parsaluminum.com/%D9%82%DB%8C%D9%85%D8%AA-%D9%88%D8%B1%D9%82-%D8%A2%D9%84%D9%88%D9%85%DB%8C%D9%86%DB%8C%D9%88%D9%85.html", "updated_at": "۱۴۰۵/۰۶/۲۳", "items": [{"name": "ورق ۰/۳ تا ۰/۴ میلی‌متر — عمده", "price": "۷٬۵۰۰٬۰۰۰ ریال / کیلو"}, {"name": "ورق ۰/۳ تا ۰/۴ میلی‌متر — خرده", "price": "۷٬۵۵۰٬۰۰۰ ریال / کیلو"}, {"name": "ورق ۵ میلی‌متر — عمده", "price": "۷٬۷۰۰٬۰۰۰ ریال / کیلو"}, {"name": "ورق ۶ تا ۷ میلی‌متر — عمده", "price": "۷٬۷۴۰٬۰۰۰ ریال / کیلو"}, {"name": "ورق ۸ تا ۱۰۰ میلی‌متر — عمده", "price": "۹٬۵۰۰٬۰۰۰ ریال / کیلو"}]}, {"name": "مرکز آهن — آلومینیوم", "url": "https://www.markazeahan.com/product-category/aluminum", "updated_at": "۱۴۰۵/۰۶/۲۳", "items": [{"name": "پروفیل آلومینیوم", "price": "۷۵۰٬۰۰۰ تومان"}, {"name": "میلگرد آلومینیوم 6061", "price": "۷۷۰٬۰۰۰ تومان"}, {"name": "میلگرد آلومینیوم سری 7000", "price": "۶۴۰٬۰۰۰ تومان"}, {"name": "میلگرد آلومینیوم 7075", "price": "۷۶۰٬۰۰۰ تومان"}]}, {"name": "ایران ضایعات — ضایعات آلومینیوم", "url": "https://iranzayeat.com/prices/category/price-aluminium-scrap", "updated_at": "۱۴۰۴/۰۹/۱۲", "items": [{"name": "آلومینیوم نرم — خرده‌بار", "price": "۲۱۳٬۳۷۳ تومان / کیلو"}, {"name": "آلومینیوم نرم — عمده‌بار", "price": "۲۳۸٬۲۲۹ تومان / کیلو"}, {"name": "پروفیل شاخه — خرده‌بار", "price": "۲۲۶٬۰۸۹ تومان / کیلو"}, {"name": "پروفیل شاخه — عمده‌بار", "price": "۲۳۸٬۶۱۱ تومان / کیلو"}, {"name": "آلومینیوم ظرفی — عمده‌بار", "price": "۲۵۴٬۸۳۳ تومان / کیلو"}]}, {"name": "آلوم پرشین — بیلت", "url": "https://alumpersian.com/product-category/aluminium-billet", "updated_at": "۵ آذر ۱۴۰۴", "items": [{"name": "بیلت ۷ اینچ آلیاژ 6063 — سالکو", "price": "۳۴۳٬۰۰۰ تومان"}, {"name": "بیلت ۷ اینچ آلیاژ 6063 — آلومتک", "price": "۳۴۱٬۰۰۰ تومان"}, {"name": "بیلت ۶ اینچ آلیاژ 6063 — ایرالکو", "price": "۳۴۳٬۰۰۰ تومان"}, {"name": "بیلت DC آلیاژ 6063", "price": "۳۴۱٬۰۰۰ تومان"}]}]};
const BUILTIN_CATALOG = {"catalogs": [{"name": "قیمت مقاطع صنعتی", "type": "تصویر", "url": "http://alustry.ir/list%26price/Price-list-industrial-sections.jpg"}, {"name": "لیست گرد", "type": "تصویر", "url": "http://alustry.ir/list%26price/list-rod-aluminium.jpg"}, {"name": "فرمول محاسبه شمش آلومینیوم", "type": "تصویر", "url": "http://alummetal.com/price/Aluminum-ingot-calculation-formula.jpg"}, {"name": "کاتالوگ پروفیل آلومینیوم شیاردار", "type": "PDF", "url": "https://alummetal.com/download/sigma%20aluminium%20profiles.pdf"}, {"name": "لیست پروفیل شیاردار", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-sigma-Catalogue-alummetal.jpg"}, {"name": "کاتالوگ مقاطع صنعتی", "type": "PDF", "url": "https://alummetal.com/download/Industrial-Aluminum-Catalogue-alummetal.pdf"}, {"name": "گرد آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-round-Catalogue-alummetal.jpg"}, {"name": "لوله آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-pipe-Catalogue-alummetal.jpg"}, {"name": "تسمه و چهارپهلو ۱", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-strip%26square-Catalogue-alummetal-1.jpg"}, {"name": "تسمه و چهارپهلو ۲", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-strip%26square-Catalogue-alummetal-2.jpg"}, {"name": "شش‌پر آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-hexagon-Catalogue-alummetal.jpg"}, {"name": "پروفیل آلومینیوم شیاردار", "type": "تصویر", "url": "https://alummetal.com/wp-content/uploads/2026/07/Screenshot-from-2026-07-02-09-50-07.png"}, {"name": "لوله عمومی", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-pipe-General-Catalogue-alummetal.jpg"}, {"name": "نبشی آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-angle-Catalogue-alummetal.jpg"}, {"name": "قوطی آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-Channel-Catalogue-alummetal.jpg"}, {"name": "گرده‌ماهی آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-baseboards-Catalogue-alummetal.jpg"}, {"name": "ورق آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-sheet-Catalogue-alummetal.jpg"}, {"name": "مبنای محاسبه قیمت شمش", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-base-price.jpg"}, {"name": "آنالیز شمش آلیاژی", "type": "تصویر", "url": "https://alummetal.com/download/Aluminum-alloy-ingots.jpg"}, {"name": "پروفیل نصیرزاده", "type": "PDF", "url": "https://alummetal.com/download/aluminum-profile.pdf"}, {"name": "پروفیل قوطی کابینت", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-profile-cabinet.jpg"}], "price_pages": [{"name": "قیمت ورق آلومینیوم", "url": "https://alummetal.com/aluminum-sheet-price/"}, {"name": "قیمت شمش و بیلت", "url": "https://alummetal.com/aluminum-ingots-billets-price/"}, {"name": "قیمت گرد آلومینیوم", "url": "https://alummetal.com/aluminum-round-price/"}, {"name": "قیمت چهارپهلو آلومینیوم", "url": "https://alummetal.com/aluminum-square-bar-price/"}, {"name": "قیمت لوله آلومینیوم", "url": "https://alummetal.com/aluminum-pipe-price/"}, {"name": "قیمت پروفیل مستطیلی", "url": "https://alummetal.com/aluminum-rectangle-tube-profile-price/"}, {"name": "قیمت نبشی آلومینیوم", "url": "https://alummetal.com/aluminum-products-aluminum-angle/"}]};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function openDrawer() {
  drawer.classList.add('open');
  scrim.classList.add('show');
  drawer.setAttribute('aria-hidden', 'false');
  $('#menuToggle').setAttribute('aria-expanded', 'true');
}
function closeDrawer() {
  drawer.classList.remove('open');
  scrim.classList.remove('show');
  drawer.setAttribute('aria-hidden', 'true');
  $('#menuToggle').setAttribute('aria-expanded', 'false');
}
function navigate(route) {
  const target = document.getElementById(route) || $('#home');
  $$('[data-screen]').forEach((screen) => screen.classList.toggle('active', screen === target));
  $$('[data-route]').forEach((link) => link.classList.toggle('active', link.dataset.route === route));
  if (window.location.hash !== `#${route}`) history.replaceState(null, '', `#${route}`);
  closeDrawer();
  $('#mainContent').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$$('[data-route]').forEach((element) => element.addEventListener('click', (event) => {
  event.preventDefault();
  navigate(element.dataset.route);
}));
$('#menuToggle').addEventListener('click', openDrawer);
$('#drawerClose').addEventListener('click', closeDrawer);
 scrim.addEventListener('click', closeDrawer);
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDrawer(); });

function setTheme(light) {
  document.body.classList.toggle('light', light);
  localStorage.setItem('alum-theme', light ? 'light' : 'dark');
  $('#themeStatus').textContent = light ? 'روشن' : 'فعال';
}
const savedTheme = localStorage.getItem('alum-theme');
setTheme(savedTheme === 'light');
$('#themeToggle').addEventListener('click', () => setTheme(!document.body.classList.contains('light')));
$('#settingsTheme').addEventListener('click', () => setTheme(!document.body.classList.contains('light')));
$('#languageToggle').addEventListener('click', () => showToast('نسخه انگلیسی در بروزرسانی بعدی فعال می‌شود'));

$('#fullscreenToggle').addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch { showToast('حالت تمام صفحه در این مرورگر در دسترس نیست'); }
});
document.addEventListener('fullscreenchange', () => {
  $('#fullscreenToggle').textContent = document.fullscreenElement ? '×' : '⛶';
});

let calculatorData = null;
const shapeSelect = $('#shapeSelect');
const alloySelect = $('#alloySelect');
const shapeLabels = {sheet:['طول','عرض','ضخامت'],round:['طول','قطر','—'],square:['طول','عرض','ارتفاع'],flat:['طول','عرض','ضخامت'],tube:['طول','قطر خارجی','ضخامت'],hex:['طول','ضلع','—']};
function refreshShapeLabels() {
  const labels = shapeLabels[shapeSelect.value] || shapeLabels.sheet;
  ['fieldOneLabel','fieldTwoLabel','fieldThreeLabel'].forEach((id, index) => { $(`#${id}`).textContent = `${labels[index]} (میلی‌متر)`; });
  $('#fieldThreeLabel').parentElement.style.display = labels[2] === '—' ? 'none' : 'grid';
}
async function loadCalculator() {
  try {
    const response = await fetch('calculator.json?v=6', { cache: 'default' });
    calculatorData = await response.json();
    shapeSelect.innerHTML = calculatorData.shapes.map((shape) => `<option value="${shape.id}">${shape.name}</option>`).join('');
    alloySelect.innerHTML = calculatorData.alloys.map((alloy) => `<option value="${alloy.id}">${alloy.name}</option>`).join('');
    refreshShapeLabels();
  } catch { showToast('داده‌های محاسبه‌گر دریافت نشد'); }
}
shapeSelect.addEventListener('change', refreshShapeLabels);
$('#calculateButton').addEventListener('click', () => {
  const length = Number($('#lengthInput').value), first = Number($('#widthInput').value), second = Number($('#thicknessInput').value), quantity = Number($('#quantityInput').value || 1);
  const result = $('#weightResult');
  const requiresThird = ['sheet','square','flat','tube'].includes(shapeSelect.value);
  if (![length, first, quantity].every((value) => value > 0) || (requiresThird && second <= 0)) { result.textContent = 'لطفاً همه ابعاد لازم را با عدد مثبت وارد کنید.'; return; }
  const density = calculatorData?.alloys.find((alloy) => alloy.id === alloySelect.value)?.density || 2.70;
  let volume;
  if (shapeSelect.value === 'round') volume = Math.PI * (first / 2) ** 2 * length;
  else if (shapeSelect.value === 'tube') volume = Math.PI * (((first / 2) ** 2) - ((first / 2 - second) ** 2)) * length;
  else if (shapeSelect.value === 'hex') volume = (3 * Math.sqrt(3) / 2) * (first ** 2) * length;
  else volume = length * first * second;
  const weight = (volume * density * quantity) / 1000000;
  result.textContent = `وزن تقریبی: ${weight.toFixed(3)} کیلوگرم — چگالی ${density} g/cm³`;
});
loadCalculator();

$('#quoteForm').addEventListener('submit', (event) => {
  event.preventDefault();
  $('#quoteResult').textContent = 'درخواست شما ثبت موقت شد؛ کارشناسان با شما تماس می‌گیرند.';
  event.target.reset();
});

async function loadPrices() {
  const container = $('#priceSources');
  const updated = $('#pricesUpdated');
  if (!container) return;
  try {
    const response = await fetch('prices.json?v=5', { cache: 'default' });
    if (!response.ok) throw new Error('prices unavailable');
    const data = await response.json();
    container.innerHTML = data.sources.map((source) => `<article class="price-source glass-card"><div class="source-head"><div><p class="eyebrow">SOURCE</p><h3>${source.name}</h3></div><a href="${source.url}" target="_blank" rel="noreferrer">مشاهده منبع ↗</a></div><div class="source-items">${source.items.map((item) => `<div class="source-item"><span>${item.name}</span><strong>${item.price}</strong></div>`).join('')}</div><small>آخرین بروزرسانی منبع: ${source.updated_at}</small></article>`).join('');
    updated.textContent = `فایل قیمت‌ها: ${data.updated_at} — برای دریافت قیمت جدید، فایل prices.json را روی هاست جایگزین کنید.`;
    const homeNote = $('#homePriceNote');
    if (homeNote) homeNote.textContent = `${data.sources.length} منبع فعال، آخرین دریافت ${data.updated_at}`;
  } catch {
    const data = BUILTIN_PRICES;
    container.innerHTML = data.sources.map((source) => `<article class="price-source glass-card"><div class="source-head"><div><p class="eyebrow">SOURCE</p><h3>${source.name}</h3></div><a href="${source.url}" target="_blank" rel="noreferrer">مشاهده منبع ↗</a></div><div class="source-items">${source.items.map((item) => `<div class="source-item"><span>${item.name}</span><strong>${item.price}</strong></div>`).join('')}</div><small>آخرین بروزرسانی منبع: ${source.updated_at}</small></article>`).join('');
    updated.textContent = `نمایش نسخه ذخیره‌شده قیمت‌ها — ${data.updated_at}`;
  }
}
loadPrices();

async function loadCatalog() {
  const list = $('#catalogList');
  if (!list) return;
  let data;
  try {
    const response = await fetch('catalog.json?v=5', { cache: 'default' });
    if (!response.ok) throw new Error('catalog unavailable');
    data = await response.json();
  } catch {
    data = BUILTIN_CATALOG;
  }
  const render = (kind) => {
    const entries = kind === 'catalogs' ? data.catalogs : data.price_pages;
    list.innerHTML = entries.map((entry) => `<a class="catalog-item glass-card" href="${entry.url}" target="_blank" rel="noreferrer" data-preview-url="${entry.url}" data-preview-title="${entry.name}"><span class="catalog-icon">${kind === 'catalogs' ? '▦' : '◉'}</span><span><strong>${entry.name}</strong><small>${entry.type || 'صفحه قیمت'} · پیش‌نمایش داخل اپ</small></span><b>↗</b></a>`).join('');
    $$('[data-preview-url]').forEach((item) => item.addEventListener('click', (event) => {
      event.preventDefault();
      openPreview(item.dataset.previewUrl, item.dataset.previewTitle);
    }));
  };
  render('catalogs');
  $$('[data-catalog-tab]').forEach((tab) => tab.addEventListener('click', () => {
    $$('[data-catalog-tab]').forEach((item) => item.classList.toggle('active', item === tab));
    render(tab.dataset.catalogTab);
  }));
}
loadCatalog();

const previewDialog = $('#previewDialog');
function openPreview(url, title) {
  $('#previewTitle').textContent = title;
  const isPdf = url.toLowerCase().includes('.pdf');
  const isImage = /\.(jpg|jpeg|png|webp)(\?|$)/i.test(url);
  $('#previewBody').innerHTML = isImage ? `<img class="preview-image" src="${url}" alt="${title}" /><a class="preview-external" href="${url}" target="_blank" rel="noreferrer">باز کردن فایل اصلی ↗</a>` : `<iframe class="preview-frame" src="${url}" title="${title}" loading="lazy"></iframe><a class="preview-external" href="${url}" target="_blank" rel="noreferrer">باز کردن صفحه یا PDF اصلی ↗</a>`;
  previewDialog.showModal();
}
$('#previewClose').addEventListener('click', () => previewDialog.close());
previewDialog.addEventListener('click', (event) => { if (event.target === previewDialog) previewDialog.close(); });

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  $('#installButton').hidden = false;
});
$('#installButton').addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  $('#installButton').hidden = true;
});

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
const initialRoute = window.location.hash.slice(1) || 'home';
navigate(initialRoute);

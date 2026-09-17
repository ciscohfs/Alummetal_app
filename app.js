const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const appShell = $('#appShell');
const drawer = $('#drawer');
const scrim = $('#scrim');
const toast = $('#toast');
let deferredInstallPrompt = null;
const BUILTIN_PRICES = {"updated_at": "2026-09-15", "currency_note": "واحدها مطابق منبع هستند؛ ریال و تومان را جدا نگه دارید.", "sources": [{"name": "پارس آلومینیوم — ورق", "url": "https://parsaluminum.com/%D9%82%DB%8C%D9%85%D8%AA-%D9%88%D8%B1%D9%82-%D8%A2%D9%84%D9%88%D9%85%DB%8C%D9%86%DB%8C%D9%88%D9%85.html", "updated_at": "۱۴۰۵/۰۶/۲۳", "items": [{"name": "ورق ۰/۳ تا ۰/۴ میلی‌متر — عمده", "price": "۷٬۵۰۰٬۰۰۰ ریال / کیلو"}, {"name": "ورق ۰/۳ تا ۰/۴ میلی‌متر — خرده", "price": "۷٬۵۵۰٬۰۰۰ ریال / کیلو"}, {"name": "ورق ۵ میلی‌متر — عمده", "price": "۷٬۷۰۰٬۰۰۰ ریال / کیلو"}, {"name": "ورق ۶ تا ۷ میلی‌متر — عمده", "price": "۷٬۷۴۰٬۰۰۰ ریال / کیلو"}, {"name": "ورق ۸ تا ۱۰۰ میلی‌متر — عمده", "price": "۹٬۵۰۰٬۰۰۰ ریال / کیلو"}]}, {"name": "مرکز آهن — آلومینیوم", "url": "https://www.markazeahan.com/product-category/aluminum", "updated_at": "۱۴۰۵/۰۶/۲۳", "items": [{"name": "پروفیل آلومینیوم", "price": "۷۵۰٬۰۰۰ تومان"}, {"name": "میلگرد آلومینیوم 6061", "price": "۷۷۰٬۰۰۰ تومان"}, {"name": "میلگرد آلومینیوم سری 7000", "price": "۶۴۰٬۰۰۰ تومان"}, {"name": "میلگرد آلومینیوم 7075", "price": "۷۶۰٬۰۰۰ تومان"}]}, {"name": "ایران ضایعات — ضایعات آلومینیوم", "url": "https://iranzayeat.com/prices/category/price-aluminium-scrap", "updated_at": "۱۴۰۴/۰۹/۱۲", "items": [{"name": "آلومینیوم نرم — خرده‌بار", "price": "۲۱۳٬۳۷۳ تومان / کیلو"}, {"name": "آلومینیوم نرم — عمده‌بار", "price": "۲۳۸٬۲۲۹ تومان / کیلو"}, {"name": "پروفیل شاخه — خرده‌بار", "price": "۲۲۶٬۰۸۹ تومان / کیلو"}, {"name": "پروفیل شاخه — عمده‌بار", "price": "۲۳۸٬۶۱۱ تومان / کیلو"}, {"name": "آلومینیوم ظرفی — عمده‌بار", "price": "۲۵۴٬۸۳۳ تومان / کیلو"}]}, {"name": "آلوم پرشین — بیلت", "url": "https://alumpersian.com/product-category/aluminium-billet", "updated_at": "۵ آذر ۱۴۰۴", "items": [{"name": "بیلت ۷ اینچ آلیاژ 6063 — سالکو", "price": "۳۴۳٬۰۰۰ تومان"}, {"name": "بیلت ۷ اینچ آلیاژ 6063 — آلومتک", "price": "۳۴۱٬۰۰۰ تومان"}, {"name": "بیلت ۶ اینچ آلیاژ 6063 — ایرالکو", "price": "۳۴۳٬۰۰۰ تومان"}, {"name": "بیلت DC آلیاژ 6063", "price": "۳۴۱٬۰۰۰ تومان"}]}]};
const BUILTIN_CATALOG = {"catalogs": [{"name": "قیمت مقاطع صنعتی", "type": "تصویر", "url": "http://alustry.ir/list%26price/Price-list-industrial-sections.jpg"}, {"name": "لیست گرد", "type": "تصویر", "url": "http://alustry.ir/list%26price/list-rod-aluminium.jpg"}, {"name": "فرمول محاسبه شمش آلومینیوم", "type": "تصویر", "url": "http://alummetal.com/price/Aluminum-ingot-calculation-formula.jpg"}, {"name": "کاتالوگ پروفیل آلومینیوم شیاردار", "type": "PDF", "url": "https://alummetal.com/download/sigma%20aluminium%20profiles.pdf"}, {"name": "لیست پروفیل شیاردار", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-sigma-Catalogue-alummetal.jpg"}, {"name": "کاتالوگ مقاطع صنعتی", "type": "PDF", "url": "https://alummetal.com/download/Industrial-Aluminum-Catalogue-alummetal.pdf"}, {"name": "گرد آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-round-Catalogue-alummetal.jpg"}, {"name": "لوله آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-pipe-Catalogue-alummetal.jpg"}, {"name": "تسمه و چهارپهلو ۱", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-strip%26square-Catalogue-alummetal-1.jpg"}, {"name": "تسمه و چهارپهلو ۲", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-strip%26square-Catalogue-alummetal-2.jpg"}, {"name": "شش‌پر آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-hexagon-Catalogue-alummetal.jpg"}, {"name": "پروفیل آلومینیوم شیاردار", "type": "تصویر", "url": "https://alummetal.com/wp-content/uploads/2026/07/Screenshot-from-2026-07-02-09-50-07.png"}, {"name": "لوله عمومی", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-pipe-General-Catalogue-alummetal.jpg"}, {"name": "نبشی آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-angle-Catalogue-alummetal.jpg"}, {"name": "قوطی آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-Channel-Catalogue-alummetal.jpg"}, {"name": "گرده‌ماهی آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-baseboards-Catalogue-alummetal.jpg"}, {"name": "ورق آلومینیوم", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-sheet-Catalogue-alummetal.jpg"}, {"name": "مبنای محاسبه قیمت شمش", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-base-price.jpg"}, {"name": "آنالیز شمش آلیاژی", "type": "تصویر", "url": "https://alummetal.com/download/Aluminum-alloy-ingots.jpg"}, {"name": "پروفیل نصیرزاده", "type": "PDF", "url": "https://alummetal.com/download/aluminum-profile.pdf"}, {"name": "پروفیل قوطی کابینت", "type": "تصویر", "url": "https://alummetal.com/download/Aluminium-profile-cabinet.jpg"}], "price_pages": [{"name": "قیمت ورق آلومینیوم", "url": "https://alummetal.com/aluminum-sheet-price/"}, {"name": "قیمت شمش و بیلت", "url": "https://alummetal.com/aluminum-ingots-billets-price/"}, {"name": "قیمت گرد آلومینیوم", "url": "https://alummetal.com/aluminum-round-price/"}, {"name": "قیمت چهارپهلو آلومینیوم", "url": "https://alummetal.com/aluminum-square-bar-price/"}, {"name": "قیمت لوله آلومینیوم", "url": "https://alummetal.com/aluminum-pipe-price/"}, {"name": "قیمت پروفیل مستطیلی", "url": "https://alummetal.com/aluminum-rectangle-tube-profile-price/"}, {"name": "قیمت نبشی آلومینیوم", "url": "https://alummetal.com/aluminum-products-aluminum-angle/"}]};
const BUILTIN_CALCULATOR = {"alloys":[{"id":"6063","name":"6063 — پروفیل و اکستروژن","density":2.69},{"id":"6061","name":"6061 — صنعتی و سازه‌ای","density":2.7},{"id":"6060","name":"6060 — مقاطع عمومی","density":2.7},{"id":"6005","name":"6005 — مقاطع صنعتی","density":2.7},{"id":"6082","name":"6082 — سازه‌ای با استحکام بالاتر","density":2.71},{"id":"5052","name":"5052 — ورق و محیط مرطوب","density":2.68},{"id":"5083","name":"5083 — ورق صنعتی و دریایی","density":2.66},{"id":"2024","name":"2024 — سری 2000","density":2.78},{"id":"7075","name":"7075 — استحکام بالا","density":2.81},{"id":"7000","name":"سری 7000 — مقاطع آلیاژی","density":2.81},{"id":"1050","name":"1050 — ورق عمومی","density":2.71}],"shapes":[{"id":"sheet","name":"ورق / صفحه","fields":["طول","عرض","ضخامت"]},{"id":"round","name":"گرد","fields":["طول","قطر","-"]},{"id":"square","name":"چهارپهلو","fields":["طول","عرض","ارتفاع"]},{"id":"flat","name":"تسمه","fields":["طول","عرض","ضخامت"]},{"id":"tube","name":"لوله","fields":["طول","قطر خارجی","ضخامت"]},{"id":"hex","name":"شش‌پر","fields":["طول","ضلع","-"]}]};
const BUILTIN_ALLOYS = {"alloys":[{"code":"1050","series":"1000","family":"آلومینیوم خالص","density":2.71,"title":"رسانایی و شکل‌پذیری بالا","use":"ورق عمومی، ظروف، بسته‌بندی و قطعات الکتریکی"},{"code":"1100","series":"1000","family":"آلومینیوم خالص","density":2.71,"title":"فرم‌پذیری عالی","use":"مبدل حرارتی، ظروف و کاربردهای عمومی"},{"code":"2011","series":"2000","family":"آلومینیوم-مس","density":2.83,"title":"ماشین‌کاری بسیار خوب","use":"قطعات تراش‌کاری‌شده و اتصالات دقیق"},{"code":"2024","series":"2000","family":"آلومینیوم-مس","density":2.78,"title":"استحکام بالا نسبت به وزن","use":"قطعات هوافضا و سازه‌های مهندسی"},{"code":"3003","series":"3000","family":"آلومینیوم-منگنز","density":2.73,"title":"مقاومت خوردگی و فرم‌پذیری خوب","use":"ظروف، مخازن، مبدل حرارتی و ورق‌کاری"},{"code":"3105","series":"3000","family":"آلومینیوم-منگنز","density":2.72,"title":"شکل‌پذیری و مقاومت خوردگی","use":"درب و پنجره، نما و ورق‌های ساختمانی"},{"code":"4032","series":"4000","family":"آلومینیوم-سیلیسیم","density":2.68,"title":"مقاومت دمایی و سایش","use":"قطعات موتور و کاربردهای خودرویی"},{"code":"4043","series":"4000","family":"آلومینیوم-سیلیسیم","density":2.69,"title":"سیالیت و قابلیت جوشکاری","use":"فیلر جوشکاری و قطعات ریختگی"},{"code":"5052","series":"5000","family":"آلومینیوم-منیزیم","density":2.68,"title":"مقاومت خوردگی عالی","use":"ورق‌کاری، مخزن سوخت و محیط مرطوب"},{"code":"5083","series":"5000","family":"آلومینیوم-منیزیم","density":2.66,"title":"استحکام و مقاومت دریایی","use":"سازه‌های دریایی، مخازن و صنایع سنگین"},{"code":"5086","series":"5000","family":"آلومینیوم-منیزیم","density":2.66,"title":"جوشکاری و خوردگی مناسب","use":"کشتی‌سازی و سازه‌های دریایی"},{"code":"5754","series":"5000","family":"آلومینیوم-منیزیم","density":2.67,"title":"فرم‌پذیری و مقاومت خوردگی","use":"خودرو، ورق‌کاری و صنایع شیمیایی"},{"code":"6060","series":"6000","family":"آلومینیوم-منیزیم-سیلیسیم","density":2.7,"title":"اکستروژن و سطح مناسب","use":"پروفیل و مقاطع عمومی"},{"code":"6061","series":"6000","family":"آلومینیوم-منیزیم-سیلیسیم","density":2.7,"title":"تعادل استحکام و ماشین‌کاری","use":"قطعات صنعتی، سازه، فریم و تجهیزات"},{"code":"6063","series":"6000","family":"آلومینیوم-منیزیم-سیلیسیم","density":2.69,"title":"اکستروژن عالی و کیفیت سطح","use":"پروفیل ساختمانی، دکوراتیو و هیت‌سینک"},{"code":"6005","series":"6000","family":"آلومینیوم-منیزیم-سیلیسیم","density":2.7,"title":"استحکام مناسب در اکستروژن","use":"مقاطع صنعتی و سازه‌های سبک"},{"code":"6082","series":"6000","family":"آلومینیوم-منیزیم-سیلیسیم","density":2.71,"title":"استحکام بالاتر و جوشکاری خوب","use":"سازه‌ها، ماشین‌سازی و قطعات صنعتی"},{"code":"6101","series":"6000","family":"آلومینیوم-منیزیم-سیلیسیم","density":2.7,"title":"رسانایی الکتریکی بالا","use":"شینه و تجهیزات انتقال برق"},{"code":"7075","series":"7000","family":"آلومینیوم-روی","density":2.81,"title":"استحکام بسیار بالا","use":"هوافضا، قطعات مهندسی و تجهیزات ورزشی"},{"code":"7050","series":"7000","family":"آلومینیوم-روی","density":2.83,"title":"مقاومت بالا در مقاطع ضخیم","use":"هوافضا و قطعات سنگین مهندسی"},{"code":"7005","series":"7000","family":"آلومینیوم-روی","density":2.78,"title":"استحکام و قابلیت جوشکاری","use":"دوچرخه و سازه‌های سبک مقاوم"},{"code":"8011","series":"8000","family":"آلومینیوم با عناصر دیگر","density":2.71,"title":"سبک و شکل‌پذیر","use":"فویل، بسته‌بندی و ورق‌های عمومی"},{"code":"8090","series":"8000","family":"آلومینیوم-لیتیوم","density":2.55,"title":"وزن پایین و استحکام مناسب","use":"کاربردهای تخصصی هوافضا"}]};

const fetchWithTimeout = (url, ms = 1400) => {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), ms);
  return fetch(url, { cache: 'default', signal: controller.signal }).finally(() => window.clearTimeout(timer));
};

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
function renderCalculator(data) {
  calculatorData = data;
  shapeSelect.innerHTML = data.shapes.map((shape) => `<option value="${shape.id}">${shape.name}</option>`).join('');
  alloySelect.innerHTML = data.alloys.map((alloy) => `<option value="${alloy.id}">${alloy.name}</option>`).join('');
  refreshShapeLabels();
}
async function loadCalculator() {
  renderCalculator(BUILTIN_CALCULATOR);
  try {
    const response = await fetchWithTimeout('calculator.json?v=7');
    if (response.ok) renderCalculator(await response.json());
  } catch { /* keep the instant built-in calculator */ }
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
  result.textContent = `وزن تقریبی: ${weight.toFixed(3)} کیلوگرم — چگالی ${density} گرم بر سانتی‌متر مکعب`;
});
loadCalculator();

$('#quoteForm').addEventListener('submit', (event) => {
  event.preventDefault();
  $('#quoteResult').textContent = 'درخواست شما ثبت موقت شد؛ کارشناسان با شما تماس می‌گیرند.';
  event.target.reset();
});

function renderPrices(data, offline = false) {
  const container = $('#priceSources');
  const updated = $('#pricesUpdated');
  if (!container) return;

  container.innerHTML = data.sources.map((source) => `<article class="price-source glass-card"><div class="source-head"><div><p class="eyebrow">SOURCE</p><h3>${source.name}</h3></div><a href="${source.url}" target="_blank" rel="noreferrer">مشاهده منبع ↗</a></div><div class="source-items">${source.items.map((item) => `<div class="source-item"><span>${item.name}</span><strong>${item.price}</strong></div>`).join('')}</div><small>آخرین بروزرسانی منبع: ${source.updated_at}</small></article>`).join('');
  updated.textContent = `فایل قیمت‌ها: ${data.updated_at} — برای دریافت قیمت جدید، فایل prices.json را روی هاست جایگزین کنید.`;
  const homeNote = $('#homePriceNote');
  if (homeNote) homeNote.textContent = `${data.sources.length} منبع فعال، آخرین دریافت ${data.updated_at}`;
  if (offline) updated.textContent = `نمایش نسخه ذخیره‌شده قیمت‌ها — ${data.updated_at}`;
}
renderPrices(BUILTIN_PRICES, true);
async function loadPrices() {
  try { const response = await fetchWithTimeout('prices.json?v=6'); if (response.ok) renderPrices(await response.json()); } catch { /* instant fallback is already visible */ }
}

loadPrices();

async function loadCatalog() {
  const list = $('#catalogList');
  if (!list) return;
  let data = BUILTIN_CATALOG;
  const renderCatalog = (kind) => {
    const entries = kind === 'catalogs' ? data.catalogs : data.price_pages;
    list.innerHTML = entries.map((entry) => `<a class="catalog-item glass-card" href="${entry.url}" target="_blank" rel="noreferrer" data-preview-url="${entry.url}" data-preview-title="${entry.name}"><span class="catalog-icon">${kind === 'catalogs' ? '▦' : '◉'}</span><span><strong>${entry.name}</strong><small>${entry.type || 'صفحه قیمت'} · پیش‌نمایش داخل اپ</small></span><b>↗</b></a>`).join('');
    $$('[data-preview-url]').forEach((item) => item.addEventListener('click', (event) => { event.preventDefault(); openPreview(item.dataset.previewUrl, item.dataset.previewTitle); }));
  };
  renderCatalog('catalogs');
  $$('[data-catalog-tab]').forEach((tab) => tab.addEventListener('click', () => { $$('[data-catalog-tab]').forEach((item) => item.classList.toggle('active', item === tab)); renderCatalog(tab.dataset.catalogTab); }));
  try {
    const response = await fetchWithTimeout('catalog.json?v=6');
    if (!response.ok) throw new Error('catalog unavailable');
    data = await response.json();
    renderCatalog('catalogs');
  } catch { /* instant fallback is already visible */ }
}
loadCatalog();

let alloyData = BUILTIN_ALLOYS;
let selectedSeries = 'all';
const selectedAlloys = new Set();
const selectedElements = new Set();
const seriesLabel = {1000:'سری ۱۰۰۰ — آلومینیوم خالص',2000:'سری ۲۰۰۰ — آلومینیوم-مس',3000:'سری ۳۰۰۰ — آلومینیوم-منگنز',4000:'سری ۴۰۰۰ — آلومینیوم-سیلیسیم',5000:'سری ۵۰۰۰ — آلومینیوم-منیزیم',6000:'سری ۶۰۰۰ — آلومینیوم-منیزیم-سیلیسیم',7000:'سری ۷۰۰۰ — آلومینیوم-روی',8000:'سری ۸۰۰۰ — آلیاژهای ویژه'};
function alloyExplanation(alloy) {
  const guidance = alloy.series === '1000' ? 'برای رسانایی، فرم‌دهی و کاربردهای عمومی مناسب است.' : alloy.series === '2000' ? 'برای استحکام بالا و قطعات ماشین‌کاری‌شده انتخاب می‌شود؛ مقاومت خوردگی آن معمولاً به پوشش یا نگهداری مناسب نیاز دارد.' : alloy.series === '3000' ? 'تعادل خوبی بین فرم‌پذیری، مقاومت خوردگی و استحکام متوسط ایجاد می‌کند.' : alloy.series === '4000' ? 'وجود سیلیسیم به بهبود سیالیت، مقاومت حرارتی یا عملکرد جوشکاری کمک می‌کند.' : alloy.series === '5000' ? 'برای محیط‌های مرطوب و دریایی مناسب است و معمولاً جوش‌پذیری خوبی دارد.' : alloy.series === '6000' ? 'انتخاب متعادل برای پروفیل و سازه است؛ اکستروژن، ماشین‌کاری و عملیات حرارتی در آن مهم است.' : alloy.series === '7000' ? 'بیشترین تمرکز آن روی استحکام است و برای قطعات سبک و پربار مهندسی به‌کار می‌رود.' : 'برای کاربردهای تخصصی مانند فویل، بسته‌بندی یا هوافضا استفاده می‌شود.';
  return `${alloy.family} با تمرکز بر ${alloy.title}. ${guidance} کاربردهای رایج: ${alloy.use}.`;
}
function updateCompareUI() {
  const count = selectedAlloys.size;
  $('#compareCount').textContent = count ? `${count} آلیاژ انتخاب شده${count < 2 ? ' — یک مورد دیگر انتخاب کنید' : ''}` : 'حداقل دو آلیاژ را از فهرست انتخاب کنید.';
  $('#compareButton').disabled = count < 2;
}
function renderComparison() {
  const chosen = alloyData.alloys.filter((alloy) => selectedAlloys.has(alloy.code));
  $('#comparisonTable').innerHTML = `<div class="comparison-row comparison-labels"><span>شاخص</span>${chosen.map((a) => `<strong>${a.code}</strong>`).join('')}</div>${[['خانواده','family'],['سری','series'],['چگالی','density'],['تمرکز عملکردی','title'],['کاربرد اصلی','use']].map(([label,key]) => `<div class="comparison-row"><span>${label}</span>${chosen.map((a) => `<div>${key === 'density' ? `${a[key]} g/cm³` : a[key]}</div>`).join('')}</div>`).join('')}<div class="comparison-note">${chosen.map((a) => `<p><b>${a.code}:</b> ${alloyExplanation(a)}</p>`).join('')}</div>`;
  $('#comparePanel').hidden = false;
  $('#comparePanel').scrollIntoView({behavior:'smooth', block:'nearest'});
}
function updateElementResult() {
  const result = $('#elementResult');
  if (!selectedElements.size) { result.textContent = 'مقدار حداقل یک عنصر را وارد کن تا پیشنهاد مناسب نمایش داده شود.'; return; }
  const amounts = [...selectedElements].map((element) => `${element} ${document.querySelector(`[data-element=\"${element}\"]`).value}%`).join('، '); const candidates = alloyData.alloys.filter((alloy) => [...selectedElements].some((element) => alloy.family.includes(element))).slice(0, 6);
  result.innerHTML = candidates.length ? `<strong>ترکیب واردشده: ${amounts}</strong><span class="result-caption">پیشنهادهای نزدیک:</span> ${candidates.map((a) => `<button type="button" class="element-match" data-code="${a.code}">${a.code} — ${a.family}</button>`).join('')}<small>این پیشنهاد بر اساس خانواده آلیاژی است؛ برای انتخاب نهایی، کاربرد و استاندارد محصول را هم بررسی کنید.</small>` : 'ترکیب واردشده در داده فعلی پیدا نشد؛ از جست‌وجوی بانک آلیاژها استفاده کنید.';
  $$('.element-match').forEach((button) => button.addEventListener('click', () => { $('#alloySearch').value = button.dataset.code; renderAlloys(); $('#alloyList').scrollIntoView({behavior:'smooth', block:'nearest'}); }));
}
function renderAlloys() {
  const list = $('#alloyList');
  if (!list) return;
  const query = ($('#alloySearch').value || '').trim().toLowerCase();
  const items = alloyData.alloys.filter((alloy) => {
    const matchesSeries = selectedSeries === 'all' || alloy.series === selectedSeries;
    const haystack = `${alloy.code} ${alloy.series} ${alloy.family} ${alloy.title} ${alloy.use}`.toLowerCase();
    return matchesSeries && (!query || haystack.includes(query));
  });
  $('#alloySummary').textContent = `${items.length} آلیاژ پیدا شد — چگالی‌ها تقریبی هستند.`;
  list.innerHTML = items.length ? items.map((alloy) => `<article class="alloy-row glass-card"><strong>${alloy.code}</strong><div class="alloy-main"><div class="alloy-title"><h3>${alloy.title}</h3><span>${seriesLabel[alloy.series] || 'آلیاژ آلومینیوم'}</span></div><p>${alloyExplanation(alloy)}</p><small>چگالی تقریبی: ${alloy.density} گرم بر سانتی‌متر مکعب · ${alloy.use}</small></div><button class="add-compare" type="button" data-add-compare="${alloy.code}">افزودن به مقایسه</button></article>`).join('') : '<div class="result-box">آلیاژی با این جست‌وجو پیدا نشد.</div>';
  $$('[data-add-compare]').forEach((button) => button.addEventListener('click', () => { const code = button.dataset.addCompare; const slots = ['#compareOne','#compareTwo','#compareThree']; const target = slots.find((selector) => !$(selector).value); if (!target) { showToast('سه آلیاژ انتخاب شده است؛ برای تغییر، یکی از انتخاب‌ها را عوض کن.'); return; } $(target).value = code; $(target).dispatchEvent(new Event('change')); showToast(`${code} به مقایسه اضافه شد`); }));
  updateCompareUI();
}
refreshCompareOptions();
renderAlloys();
async function loadAlloys() {
  try {
    const response = await fetchWithTimeout('alloys.json?v=2');
    if (response.ok) alloyData = await response.json();
  } catch { /* use built-in alloy data */ }
  refreshCompareOptions();
  renderAlloys();
}
$('#alloySearch')?.addEventListener('input', renderAlloys);
$$('[data-element]').forEach((input) => input.addEventListener('input', () => { const element = input.dataset.element; const amount = Number(input.value || 0); if (amount > 0) selectedElements.add(element); else selectedElements.delete(element); updateElementResult(); }));
function refreshCompareOptions() { const options = alloyData.alloys.map((a) => `<option value="${a.code}">${a.code} — ${a.title}</option>`).join(''); ['#compareOne','#compareTwo','#compareThree'].forEach((selector) => { const select = $(selector); const value = select.value; select.innerHTML = `<option value="">${selector === '#compareThree' ? 'بدون انتخاب' : 'انتخاب آلیاژ'}</option>${options}`; select.value = value; select.addEventListener('change', () => { selectedAlloys.clear(); ['#compareOne','#compareTwo','#compareThree'].forEach((item) => { if ($(item).value) selectedAlloys.add($(item).value); }); updateCompareUI(); }); }); }
function updateCompareUI() { const count = selectedAlloys.size; $('#compareButton').disabled = count < 2; $('#compareCount').textContent = count ? `${count} آلیاژ آمادهٔ مقایسه است.` : 'دو یا سه آلیاژ را انتخاب کن.'; }
$('#compareButton').addEventListener('click', renderComparison);
$('#clearCompare').addEventListener('click', () => { selectedAlloys.clear(); ['#compareOne','#compareTwo','#compareThree'].forEach((s) => { if ($(s)) $(s).value = ''; }); $('#comparePanel').hidden = true; updateCompareUI(); });
$$('[data-series]').forEach((button) => button.addEventListener('click', () => {
  selectedSeries = button.dataset.series;
  $$('[data-series]').forEach((item) => item.classList.toggle('active', item === button));
  renderAlloys();
}));
loadAlloys();

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

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const appShell = $('#appShell');
const drawer = $('#drawer');
const scrim = $('#scrim');
const toast = $('#toast');
let deferredInstallPrompt = null;

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

$('#calculateButton').addEventListener('click', () => {
  const length = Number($('#lengthInput').value);
  const width = Number($('#widthInput').value);
  const thickness = Number($('#thicknessInput').value);
  const quantity = Number($('#quantityInput').value || 1);
  const result = $('#weightResult');
  if (![length, width, thickness, quantity].every((value) => value > 0)) {
    result.textContent = 'لطفاً همه ابعاد را با عدد مثبت وارد کنید.';
    return;
  }
  const weight = (length * width * thickness * quantity * 2.7) / 1000000;
  result.textContent = `وزن تقریبی: ${weight.toFixed(3)} کیلوگرم`;
});

$('#quoteForm').addEventListener('submit', (event) => {
  event.preventDefault();
  $('#quoteResult').textContent = 'درخواست شما ثبت موقت شد؛ کارشناسان با شما تماس می‌گیرند.';
  event.target.reset();
});

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

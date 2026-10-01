// Interaction smoke tests — exercise a few key flows end-to-end.
'use strict';
const { JSDOM, VirtualConsole } = require('jsdom');
const http = require('http');

const PORT = 8765;
const BASE = `http://127.0.0.1:${PORT}`;

function fetchText(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (r) => {
      const chunks = [];
      r.on('data', (c) => chunks.push(c));
      r.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      r.on('error', reject);
    }).on('error', reject);
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function boot() {
  const indexHtml = await fetchText(BASE + '/');
  const cleanHtml = indexHtml.replace(/<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>/g, '');
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => {
    const m = e.message || String(e);
    if (/scrollTo|matchMedia|HTMLCanvas|WebGL|IntersectionObserver|getBoundingClientRect/.test(m)) return;
    errors.push('jsdom: ' + m);
  });
  const dom = new JSDOM(cleanHtml, {
    url: BASE + '/',
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc,
  });
  for (let i = 0; i < 40 && !dom.window.Static; i++) await sleep(100);
  if (!dom.window.Static && !dom.window.Store) {
    // Pages and Store should both exist after boot
    for (let i = 0; i < 40 && !dom.window.Store; i++) await sleep(100);
  }
  return { dom, errors };
}

function assert(label, cond, info) {
  if (cond) console.log('OK  ', label);
  else { console.log('FAIL', label, info || ''); process.exitCode = 1; }
}

(async () => {
  const { dom, errors } = await boot();
  const { window } = dom;

  // Wait until Pages and Store are present
  for (let i = 0; i < 40 && !(window.Pages && window.Store); i++) await sleep(100);
  if (!window.Pages || !window.Store) {
    console.log('FAIL boot — Pages=' + !!window.Pages + ' Store=' + !!window.Store);
    process.exit(1);
  }

  // 1. Add to cart from product page
  window.Store.clearCart();
  window.location.hash = '#/product/vanilla-bean';
  await sleep(60);
  window.Router.handle();
  await sleep(60);
  const addBtn = window.document.querySelector('[data-action="add-to-cart"]');
  assert('product: add-to-cart button present', !!addBtn);
  if (addBtn) addBtn.click();
  await sleep(40);
  assert('cart count after add = 1', window.Store.cartCount() === 1, 'got ' + window.Store.cartCount());
  assert('cart subtotal = 12.00', window.Store.cartSubtotal() === 12);

  // 2. Cart page shows the line
  window.location.hash = '#/cart';
  window.Router.handle();
  await sleep(80);
  const appHTML = window.document.getElementById('app').innerHTML;
  const hasLines = appHTML.includes('cart-line');
  console.log('    cart.app_html.snippet=', appHTML.slice(0, 200));
  const lines = window.document.querySelectorAll('.cart-line');
  assert('cart page: 1 line shown', lines.length === 1, 'got ' + lines.length + ' hasLines=' + hasLines);
  const incBtn = window.document.querySelector('[data-action="inc"]');
  if (incBtn) incBtn.click();
  await sleep(40);
  assert('cart qty+1: count = 2', window.Store.cartCount() === 2);
  const removeBtn = window.document.querySelector('[data-action="remove"]');
  if (removeBtn) removeBtn.click();
  await sleep(40);
  assert('cart remove: count = 0', window.Store.cartCount() === 0);

  // 3. Checkout validation rejects bad card
  window.Store.addToCart('p001', 'Pint', 1);
  window.location.hash = '#/checkout';
  window.Router.handle();
  await sleep(60);
  const form = window.document.querySelector('[data-action="checkout"]');
  assert('checkout: form present', !!form);
  if (form) {
    const setVal = (name, v) => {
      const i = form.querySelector(`[name="${name}"]`);
      if (i) i.value = v;
    };
    setVal('email', 'test@example.com');
    setVal('name', 'Test User');
    setVal('address', '1 Test St');
    setVal('city', 'Portland');
    setVal('state', 'OR');
    setVal('zip', '97214');
    setVal('card', '1234 5678 9012 3456'); // invalid Luhn
    setVal('exp', '04/29');
    setVal('cvv', '123');
    form.dispatchEvent(new window.Event('submit', { cancelable: true, bubbles: true }));
  }
  await sleep(40);
  const errVisible = window.document.querySelector('[data-bind="err-card"]').textContent;
  assert('checkout: invalid card shows error', /invalid/i.test(errVisible), 'got "' + errVisible + '"');
  assert('cart still has 1 item after bad submit', window.Store.cartCount() === 1);

  // Fix card and submit
  const form2 = window.document.querySelector('[data-action="checkout"]');
  if (form2) {
    const cardInput = form2.querySelector('[name="card"]');
    if (cardInput) cardInput.value = '4242 4242 4242 4242';
    form2.dispatchEvent(new window.Event('submit', { cancelable: true, bubbles: true }));
  }
  await sleep(80);
  // Should redirect to #/order/...
  assert('checkout: order placed → hash starts with #/order/', window.location.hash.startsWith('#/order/'), 'got ' + window.location.hash);
  assert('cart cleared after order', window.Store.cartCount() === 0);
  assert('orders length = 1', window.Store.state.orders.length === 1);

  // 4. Login flow
  window.location.hash = '#/login';
  window.Router.handle();
  await sleep(60);
  const loginForm = window.document.querySelector('[data-action="login"]');
  assert('login: form present', !!loginForm);
  if (loginForm) {
    const e = loginForm.querySelector('[name="email"]');
    const p = loginForm.querySelector('[name="pass"]');
    if (e) e.value = 'mira@example.com';
    if (p) p.value = 'secret123';
    loginForm.dispatchEvent(new window.Event('submit', { cancelable: true, bubbles: true }));
  }
  await sleep(80);
  assert('login: account set', !!window.Store.state.account && window.Store.state.account.email === 'mira@example.com');

  // 5. Search overlay opens via Store
  window.Store.setSearchOpen(true);
  await sleep(40);
  const overlay = window.document.querySelector('.search-overlay');
  assert('search: overlay opens', !!overlay);
  if (overlay) {
    const input = overlay.querySelector('input[type="search"]');
    assert('search: input present', !!input);
    if (input) {
      input.value = 'vanilla';
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
      await sleep(40);
      const results = overlay.querySelectorAll('.search-result');
      assert('search: vanilla yields >=1 result', results.length >= 1, 'got ' + results.length);
    }
    window.Store.setSearchOpen(false);
  }

  // 6. Navigation: home → shop → product via header link
  window.location.hash = '#/';
  window.Router.handle();
  await sleep(40);
  const navShop = Array.from(window.document.querySelectorAll('.nav__link')).find((a) => a.textContent === 'Shop');
  assert('header: Shop nav link present', !!navShop);

  console.log('\nJS errors during interactions:', errors.length);
  for (const e of errors.slice(0, 6)) console.log('  -', e);
  dom.window.close();
  if (errors.length) process.exitCode = 1;
})();
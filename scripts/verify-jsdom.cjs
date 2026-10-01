// Headless DOM verification — JSDOM auto-loads <script src> tags via
// resources:'usable'. Strips remote Google Fonts links to avoid network.
// Exercises every route via location.hash changes and asserts the page
// mounts with expected structure and zero JS errors.
'use strict';
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');
const fs = require('fs');
const http = require('http');

const PORT = 8765;
const BASE = `http://127.0.0.1:${PORT}`;

const ROUTES = [
  { name: 'home',          hash: '#/' },
  { name: 'shop',          hash: '#/shop' },
  { name: 'shop-seasonal', hash: '#/shop?family=seasonal' },
  { name: 'shop-vegan',    hash: '#/shop?dietary=vegan' },
  { name: 'product',       hash: '#/product/vanilla-bean' },
  { name: 'cart-empty',    hash: '#/cart' },
  { name: 'cart-filled',   hash: '#/cart',     pre: (w) => { w.Store.clearCart(); w.Store.addToCart('p001', 'Pint', 2); w.Store.addToCart('p005', 'Quart', 1); } },
  { name: 'checkout',      hash: '#/checkout', pre: (w) => { w.Store.clearCart(); w.Store.addToCart('p001', 'Pint', 1); } },
  { name: 'login',         hash: '#/login' },
  { name: 'signup',        hash: '#/signup' },
  { name: 'recover',       hash: '#/recover' },
  { name: 'about',         hash: '#/about' },
  { name: 'sustainability',hash: '#/sustainability' },
  { name: 'faq',           hash: '#/faq' },
  { name: 'contact',       hash: '#/contact' },
  { name: 'locations',     hash: '#/locations' },
  { name: 'blog',          hash: '#/blog' },
  { name: 'blog-post',     hash: '#/blog/why-small-batch' },
  { name: 'privacy',       hash: '#/privacy' },
  { name: 'terms',         hash: '#/terms' },
  { name: 'not-found',     hash: '#/not-found-path' },
  { name: 'account',       hash: '#/account',  pre: (w) => { w.localStorage.setItem('fc:account', JSON.stringify({name:'Mira Hollis', email:'mira@example.com'})); w.localStorage.setItem('fc:orders', JSON.stringify([{id:'FC-TEST01',date:'2026-09-12',ship:{method:'standard',name:'Mira Hollis',address:'2418 SE Hawthorne',city:'Portland',state:'OR',zip:'97214',email:'mira@example.com'},items:[{name:'Vanilla Bean',size:'Pint',qty:1,price:12}],totals:{subtotal:12,ship:9.95,tax:0.99,total:22.94},status:'confirmed'}])); } },
];

function fetchText(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (r) => {
      if (r.statusCode !== 200) return reject(new Error('HTTP ' + r.statusCode));
      const chunks = [];
      r.on('data', (c) => chunks.push(c));
      r.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      r.on('error', reject);
    }).on('error', reject);
  });
}

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitForServer(url, attempts = 50) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await new Promise((res, rej) => {
        http.get(url, (r) => { r.resume(); res(r.statusCode); }).on('error', rej);
      });
      if (res === 200) return true;
    } catch (_) {}
    await sleep(200);
  }
  return false;
}

(async () => {
  if (!(await waitForServer(BASE + '/'))) { console.error('Server did not come up.'); process.exit(1); }

  const indexHtml = await fetchText(BASE + '/');
  const cleanHtml = indexHtml
    .replace(/<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>/g, '')
    .replace(/<link[^>]*rel="preconnect"[^>]*>/g, '');

  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => {
    const msg = e.message || String(e);
    // Filter non-fatal stub warnings
    if (/scrollTo|HTMLCanvasElement|WebGLRenderingContext|matchMedia|IntersectionObserver/.test(msg)) return;
    errors.push('jsdom: ' + msg);
  });
  vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));

  const dom = new JSDOM(cleanHtml, {
    url: BASE + '/',
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc,
  });
  const { window } = dom;

  // Wait for app boot — Pages is registered by app.js after all pages load.
  for (let i = 0; i < 40; i++) {
    if (window.Pages) break;
    await sleep(100);
  }
  if (!window.Pages) { console.error('Pages not registered after 4s'); process.exit(1); }

  const results = [];
  for (const route of ROUTES) {
    const before = errors.length;
    try {
      // Clear app first so we can detect a re-render
      const app0 = window.document.getElementById('app');
      if (app0) app0.innerHTML = '<p style="display:none">cleared</p>';
      if (route.pre) {
        try { route.pre(window); } catch (e) { errors.push('pre[' + route.name + ']: ' + e.message); }
      }
      // Use hash to '#__reset' first then to the target so hashchange fires reliably
      window.location.hash = '#__reset';
      await sleep(20);
      window.location.hash = route.hash;
      // Force handle in case hashchange event didn't fire
      await sleep(30);
      try { window.Router && window.Router.handle && window.Router.handle(); } catch (e) { errors.push('handle[' + route.name + ']: ' + e.message); }
      await sleep(80);

      const app = window.document.getElementById('app');
      const appText = (app && app.textContent || '').replace(/\s+/g, ' ').trim();
      const hasHeader = !!window.document.querySelector('.site-header');
      const hasFooter = !!window.document.querySelector('.site-footer');
      const buttons = window.document.querySelectorAll('.btn, button').length;
      const svgs = window.document.querySelectorAll('svg').length;
      const links = window.document.querySelectorAll('a[href]').length;
      const forms = window.document.querySelectorAll('form').length;
      const newErrors = errors.slice(before);
      const ok = appText.length > 30 && hasHeader && hasFooter && newErrors.length === 0;
      results.push({ route: route.name, ok, appChars: appText.length, hasHeader, hasFooter, counts: { buttons, svgs, links, forms }, errors: newErrors.slice(0, 3) });
    } catch (e) {
      results.push({ route: route.name, ok: false, errors: [String(e.message || e)] });
    }
  }

  let passed = 0, failed = 0;
  for (const r of results) {
    if (r.ok) { passed++; }
    else { failed++; console.log('FAIL', r.route, JSON.stringify({ ok: r.ok, errors: r.errors, appChars: r.appChars, counts: r.counts })); }
  }
  console.log('TOTAL', results.length, 'PASSED', passed, 'FAILED', failed);
  fs.mkdirSync(path.join(__dirname, '..', 'screens'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, '..', 'screens', 'jsdom-report.json'), JSON.stringify({ results, allErrors: errors.slice(0, 12) }, null, 2));
  process.exit(failed === 0 ? 0 : 1);
})();
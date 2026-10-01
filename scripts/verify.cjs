// Playwright visual verification — load every page at three widths, screenshot, sanity-check.
'use strict';
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://127.0.0.1:8765';
const OUT = path.join(__dirname, 'screens');
fs.mkdirSync(OUT, { recursive: true });

const ROUTES = [
  { name: 'home',         hash: '#/' },
  { name: 'shop',         hash: '#/shop' },
  { name: 'shop-seasonal',hash: '#/shop?family=seasonal' },
  { name: 'product',      hash: '#/product/vanilla-bean' },
  { name: 'cart-empty',   hash: '#/cart',        setup: (page) => page.evaluate(() => { localStorage.removeItem('fc:cart'); }) },
  { name: 'cart-filled',  hash: '#/cart',        setup: (page) => page.evaluate(() => { localStorage.setItem('fc:cart', JSON.stringify([{productId:'p001',size:'Pint',qty:2},{productId:'p005',size:'Quart',qty:1}])); }) },
  { name: 'checkout',     hash: '#/checkout',    setup: (page) => page.evaluate(() => { localStorage.setItem('fc:cart', JSON.stringify([{productId:'p001',size:'Pint',qty:1}])); }) },
  { name: 'login',        hash: '#/login' },
  { name: 'signup',       hash: '#/signup' },
  { name: 'recover',      hash: '#/recover' },
  { name: 'about',        hash: '#/about' },
  { name: 'sustainability',hash: '#/sustainability' },
  { name: 'faq',          hash: '#/faq' },
  { name: 'contact',      hash: '#/contact' },
  { name: 'locations',    hash: '#/locations' },
  { name: 'blog',         hash: '#/blog' },
  { name: 'blog-post',    hash: '#/blog/why-small-batch' },
  { name: 'privacy',      hash: '#/privacy' },
  { name: 'terms',        hash: '#/terms' },
  { name: 'not-found',    hash: '#/garbage-path' },
  { name: 'account',      hash: '#/account',     setup: (page) => page.evaluate(() => { localStorage.setItem('fc:account', JSON.stringify({name:'Mira Hollis', email:'mira@example.com'})); localStorage.setItem('fc:orders', JSON.stringify([{id:'FC-TEST01',date:'2026-09-12',ship:{method:'standard',name:'Mira Hollis',address:'2418 SE Hawthorne',city:'Portland',state:'OR',zip:'97214',email:'mira@example.com'},items:[{name:'Vanilla Bean',size:'Pint',qty:1,price:12},{name:'Dark Chocolate',size:'Pint',qty:1,price:13}],totals:{subtotal:25,ship:9.95,tax:2.06,total:37.01},status:'confirmed'}])); }) },
];

const WIDTHS = [
  { key: 'mobile',  width: 375,  height: 800 },
  { key: 'tablet',  width: 768,  height: 1024 },
  { key: 'desktop', width: 1440, height: 900 },
];

(async () => {
  const browser = await chromium.launch();
  const results = [];

  for (const route of ROUTES) {
    for (const w of WIDTHS) {
      const ctx = await browser.newContext({ viewport: { width: w.width, height: w.height }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push('console.error: ' + msg.text());
      });
      const url = BASE + '/' + (route.hash ? route.hash.replace(/^#/, '#') : '');
      try {
        await page.goto(BASE + '/', { waitUntil: 'networkidle' });
        if (route.setup) await route.setup(page);
        await page.goto(BASE + '/' + (route.hash || ''), { waitUntil: 'networkidle' });
        // Wait for app content
        await page.waitForSelector('main#app > *', { timeout: 5000 });
        const appText = await page.locator('main#app').innerText();
        const ok = appText.trim().length > 0 && !appText.match(/^[\s\n]*$/);
        const headerVisible = await page.locator('.site-header').isVisible();
        const footerVisible = await page.locator('.site-footer').isVisible();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
        const ss = path.join(OUT, `${route.name}-${w.key}.png`);
        await page.screenshot({ path: ss, fullPage: true });
        results.push({
          route: route.name, w: w.key,
          url, ok, headerVisible, footerVisible, overflow,
          appChars: appText.length,
          errors: errors.slice(0, 4),
          ss,
        });
      } catch (e) {
        results.push({ route: route.name, w: w.key, url, ok: false, errors: [String(e.message || e)] });
      }
      await ctx.close();
    }
  }

  await browser.close();

  // Summary
  let passed = 0, failed = 0;
  for (const r of results) {
    if (r.ok && !r.overflow && r.errors.length === 0) { passed++; }
    else { failed++; console.log('FAIL', r.route, r.w, JSON.stringify({ ok: r.ok, overflow: r.overflow, errors: r.errors, appChars: r.appChars })); }
  }
  console.log('TOTAL', results.length, 'PASSED', passed, 'FAILED', failed);
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(results, null, 2));
  process.exit(failed === 0 ? 0 : 1);
})();
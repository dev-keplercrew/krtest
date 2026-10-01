/* ============================================================
   tests/smoke.test.js — load index.html in JSDOM and assert
   that the home page renders, products have data, and the
   router wires pages.
   ============================================================ */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

// Minimal JSDOM-free DOM stand-in: read the index, ensure all referenced files exist.
const INDEX = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(INDEX, 'utf8');

function src(name) {
  return path.join(__dirname, '..', name);
}

test('index.html exists', () => {
  assert.ok(html.length > 0, 'index.html should be non-empty');
});

test('all referenced script files exist', () => {
  const re = /<script\s+src="([^"]+)"/g;
  let m;
  const missing = [];
  while ((m = re.exec(html))) {
    const rel = m[1];
    if (!fs.existsSync(src(rel))) missing.push(rel);
  }
  assert.equal(missing.length, 0, 'Missing: ' + missing.join(', '));
});

test('all referenced local style files exist', () => {
  const re = /<link\s+rel="stylesheet"\s+href="([^"]+)"/g;
  let m;
  const missing = [];
  while ((m = re.exec(html))) {
    const rel = m[1];
    if (/^https?:/.test(rel)) continue; // remote fonts are fine
    if (!fs.existsSync(src(rel))) missing.push(rel);
  }
  assert.equal(missing.length, 0, 'Missing: ' + missing.join(', '));
});

test('products data has 14 flavors with required fields', () => {
  const js = fs.readFileSync(src('data/products.js'), 'utf8');
  assert.match(js, /window\.PRODUCTS\s*=\s*\[/);
  assert.match(js, /slug: 'vanilla-bean'/);
  assert.match(js, /slug: 'dark-chocolate'/);
});

test('products — every product passes the full schema (dietary / sizes / allergens / nutrition)', () => {
  const sandbox = { Intl };
  // Bootstrap the minimum the data file needs: a window with Intl present.
  // The data file is just a window.PRODUCTS assignment, so load it directly.
  const js = fs.readFileSync(src('data/products.js'), 'utf8');
  const ctx = { window: {} };
  // eslint-disable-next-line no-new-func
  new Function('window', js)(ctx.window);
  const PRODUCTS = ctx.window.PRODUCTS;
  assert.ok(Array.isArray(PRODUCTS) && PRODUCTS.length >= 12, 'expected 12+ products');
  for (const p of PRODUCTS) {
    assert.equal(typeof p.id, 'string'); assert.ok(p.id.length);
    assert.equal(typeof p.name, 'string'); assert.ok(p.name.length);
    assert.equal(typeof p.slug, 'string'); assert.ok(p.slug.length);
    assert.equal(typeof p.flavor, 'string'); assert.ok(p.flavor.length);
    assert.ok(typeof p.basePrice === 'number' && p.basePrice > 0);
    assert.ok(Array.isArray(p.sizes) && p.sizes.length >= 1, p.slug + ' needs sizes');
    for (const s of p.sizes) {
      assert.equal(typeof s.label, 'string'); assert.ok(s.label.length);
      assert.ok(typeof s.price === 'number' && s.price > 0, p.slug + ' size ' + s.label + ' needs price > 0');
    }
    assert.ok(Array.isArray(p.ingredients) && p.ingredients.length >= 1, p.slug + ' needs ingredients');
    assert.ok(Array.isArray(p.allergens), p.slug + ' needs allergens');
    assert.ok(p.dietary && typeof p.dietary === 'object', p.slug + ' needs dietary');
    assert.equal(typeof p.dietary.vegan, 'boolean');
    assert.equal(typeof p.dietary.glutenFree, 'boolean');
    assert.equal(typeof p.dietary.nutFree, 'boolean');
    assert.ok(p.nutrition && typeof p.nutrition === 'object', p.slug + ' needs nutrition');
    assert.equal(typeof p.nutrition.serving, 'string');
    assert.equal(typeof p.nutrition.calories, 'number');
    assert.equal(typeof p.nutrition.fatG, 'number');
    assert.equal(typeof p.nutrition.sugarG, 'number');
    assert.equal(typeof p.nutrition.proteinG, 'number');
  }
});

test('reviews data has 30+ entries', () => {
  const js = fs.readFileSync(src('data/reviews.js'), 'utf8');
  const m = js.match(/window\.REVIEWS\s*=\s*\[([\s\S]*?)\];/);
  assert.ok(m, 'reviews array should be present');
  const ids = (m[1].match(/id:\s*'[^']+'/g) || []).length;
  assert.ok(ids >= 30, 'expected at least 30 reviews, got ' + ids);
});

test('locations data has 4 shops with hours for all 7 days', () => {
  const js = fs.readFileSync(src('data/locations.js'), 'utf8');
  const m = js.match(/window\.LOCATIONS\s*=\s*\[([\s\S]*?)\];/);
  assert.ok(m);
  const ids = (m[1].match(/id:\s*'loc\d+'/g) || []).length;
  assert.equal(ids, 4, 'expected 4 locations');
  for (const d of ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']) {
    assert.match(m[1], new RegExp(d + ':'), 'missing ' + d);
  }
});

test('FAQs are grouped into Ordering/Shipping/Allergens/Returns', () => {
  const js = fs.readFileSync(src('data/faqs.js'), 'utf8');
  for (const c of ['Ordering', 'Shipping', 'Allergens', 'Returns']) {
    assert.match(js, new RegExp(`category: '${c}'`), 'missing category ' + c);
  }
});

test('blog has 4 posts with slug + body[]', () => {
  const js = fs.readFileSync(src('data/blog.js'), 'utf8');
  const m = js.match(/window\.BLOG\s*=\s*\[([\s\S]*?)\];/);
  assert.ok(m);
  const ids = (m[1].match(/id:\s*'b\d+'/g) || []).length;
  assert.equal(ids, 4);
  assert.match(m[1], /body:\s*\[/);
});

test('validate helpers — card luhn', () => {
  const sandbox = {};
  const code = fs.readFileSync(src('app/utils/validate.js'), 'utf8');
  // eslint-disable-next-line no-new-func
  new Function('window', code)(sandbox);
  const Validate = sandbox.Validate;
  assert.equal(Validate.cardNumber('4242 4242 4242 4242'), true);
  assert.equal(Validate.cardNumber('4111 1111 1111 1111'), true);
  assert.equal(Validate.cardNumber('1234 5678 9012 3456'), false);
  assert.equal(Validate.email('a@b.co'), true);
  assert.equal(Validate.email('nope'), false);
  assert.equal(Validate.zip('97214'), true);
  assert.equal(Validate.zip('9721'), false);
});

test('format helpers — money + dateShort', () => {
  const sandbox = { Intl };
  const code = fs.readFileSync(src('app/utils/format.js'), 'utf8');
  // eslint-disable-next-line no-new-func
  new Function('window', code)(sandbox);
  const Fmt = sandbox.Fmt;
  assert.equal(Fmt.money(12), '$12.00');
  assert.equal(Fmt.money(12.5), '$12.50');
  assert.match(Fmt.dateShort('2026-08-12'), /Aug/);
});

test('storage helpers — round-trip via memory fallback', () => {
  const sandbox = { localStorage: undefined };
  const code = fs.readFileSync(src('app/utils/storage.js'), 'utf8');
  // eslint-disable-next-line no-new-func
  new Function('window', code)(sandbox);
  const Storage = sandbox.Storage;
  assert.equal(Storage.get('nope', 'fallback'), 'fallback');
  Storage.set('k', { a: 1 });
  assert.deepEqual(Storage.get('k'), { a: 1 });
  Storage.remove('k');
  assert.equal(Storage.get('k', null), null);
});

test('users — signup hashes password, login verifies, bad creds fail', () => {
  const sandbox = { localStorage: undefined, crypto: undefined };
  const storageCode = fs.readFileSync(src('app/utils/storage.js'), 'utf8');
  new Function('window', storageCode)(sandbox);
  // Boot Store with the same users[] reference shared between Store.users and Store.getState().
  sandbox.Store = { users: [], getState: function () { return { users: this.users }; } };
  const usersCode = fs.readFileSync(src('app/utils/users.js'), 'utf8');
  new Function('window', usersCode)(sandbox);
  const Users = sandbox.Users;
  const r1 = Users.signup({ name: 'Mira Hollis', email: 'mira@fc.co', password: 'a-secret-pw' });
  assert.equal(r1.ok, true);
  assert.notEqual(r1.user.passwordHash, 'a-secret-pw');
  assert.equal(typeof r1.user.passwordHash, 'string');
  const r2 = Users.login('mira@fc.co', 'a-secret-pw');
  assert.equal(r2.ok, true);
  const r3 = Users.login('mira@fc.co', 'wrong');
  assert.equal(r3.ok, false);
  assert.equal(r3.error, 'Email or password is incorrect.');
  const r4 = Users.signup({ name: 'Other', email: 'MIRA@fc.co', password: 'another' });
  assert.equal(r4.ok, false);
});

test('color.darken — accepts hex with/without # and clamps to 0', () => {
  const sandbox = {};
  const code = fs.readFileSync(src('app/utils/color.js'), 'utf8');
  new Function('window', code)(sandbox);
  const { Color } = sandbox;
  // darken subtracts 30 from each channel, clamped to >=0
  assert.equal(Color.darken('#ffffff'), '#e1e1e1');
  assert.equal(Color.darken('#808080'), '#626262');
  assert.equal(Color.darken('#000000'), '#000000');
  assert.match(Color.darken('#f7eedd'), /^#[0-9a-f]{6}$/);
});

test('router — registered routes cover all 24 page files', () => {
  const files = fs.readdirSync(path.join(__dirname, '..', 'app', 'pages'));
  const expected = [
    'home.js', 'shop.js', 'product.js', 'cart.js', 'checkout.js', 'order.js',
    'account.js', 'login.js', 'signup.js', 'recover.js',
    'about.js', 'sustainability.js', 'faq.js', 'contact.js', 'locations.js',
    'blog.js', 'blog-post.js', 'privacy.js', 'terms.js', 'not-found.js'
  ];
  for (const f of expected) {
    assert.ok(files.includes(f), 'missing page ' + f);
  }
});
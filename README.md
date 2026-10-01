# Frost & Cream — small-batch ice cream e-commerce

A single-page web app for a small-batch ice cream brand: product browsing,
checkout, mock auth, blog, FAQ, and scoop-shop locator. Built with vanilla
HTML / CSS / JavaScript so it can be served from any static host with
zero build tooling.

> Demo only — payments, emails, and authentication are mocked.
> See [Mock services](#mock-services) and [Known limitations](#known-limitations).

## Stack

- **Vanilla HTML / CSS / JavaScript** — no framework, no bundler, no build step
- **Hash-based router** (`app/router.js`) — parameterized routes (`#/product/:slug`)
- **localStorage persistence** with an in-memory fallback (`app/utils/storage.js`)
- **Tagged-template HTML helper** (`app/utils/dom.js`) — author-controlled raw
  output with explicit `html.esc(value)` escaping for user input
- **`node --test`** for unit tests (`tests/`)

## Quick start

```sh
# From the project root
npm start            # serves http://localhost:8000
npm test             # runs the unit suite (15 tests, all real behavioral)
```

If you don't have `npm` available, `python3 -m http.server 8000` works
the same way — there is nothing to compile.

## Folder structure

```
.
├── app.js                     # entry: registers routes, mounts shell, boots
├── index.html                 # shell with #app, #site-header, #site-footer
├── package.json
├── styles/
│   ├── tokens.css             # color / spacing / type / shadow tokens
│   ├── base.css               # reset + typography + layout primitives
│   ├── components.css         # .btn, .card, .nav, .site-header, .site-footer
│   └── pages.css              # page-specific styles
├── data/
│   ├── products.js            # 14 ice cream flavors + reviews/locations/faqs/blog
│   ├── reviews.js
│   ├── locations.js
│   ├── faqs.js
│   └── blog.js
├── app/
│   ├── router.js              # hash router
│   ├── state.js               # single source of truth (pub/sub)
│   ├── constants.js           # SHIPPING / TAX constants
│   ├── components/
│   │   ├── header.js          # brand, nav, search trigger, cart button
│   │   ├── footer.js          # sitemap, newsletter
│   │   ├── search-overlay.js  # Cmd-K / "/" search overlay
│   │   └── toast.js
│   ├── pages/                 # one file per route (mount() function)
│   │   ├── home.js, shop.js, product.js, cart.js, checkout.js
│   │   ├── order.js, login.js, signup.js, recover.js, account.js
│   │   ├── about.js, sustainability.js, faq.js, contact.js
│   │   ├── locations.js, blog.js, blog-post.js
│   │   ├── privacy.js, terms.js, not-found.js
│   └── utils/
│       ├── dom.js             # tagged-template HTML helper + h.on delegation
│       ├── format.js          # currency, dates, pluralize
│       ├── storage.js         # localStorage with memory fallback
│       ├── validate.js        # email, ZIP, card number / expiry / CVV
│       ├── color.js           # shared darken() helper
│       ├── svg.js             # SVG illustrations (scoop, pintCarton, heroScoop)
│       └── users.js           # mock auth: hashed passwords, signup/login
└── tests/
    └── smoke.test.js          # 15 unit + structural tests
```

## Data model

Everything lives in `app/state.js`. All persisted fields round-trip
through `Storage.set/get` with the `fc:` prefix.

| Entity  | Shape                                                  | Persisted |
|---------|--------------------------------------------------------|-----------|
| Cart    | `[{ productId, size, qty }]`                           | yes       |
| Account | `{ name, email }` (no password)                        | yes       |
| Orders  | `[{ id, items, ship, totals, date, status }]`          | yes       |
| Users   | `[{ email, name, passwordHash }]`                      | yes       |
| UI      | `searchOpen`, `menuOpen`                               | no        |

The single seam to swap a real backend in later is `app/utils/storage.js`
— no page-level rewrites needed.

## Mock services

Nothing leaves the browser. The following are explicitly mocked:

- **Authentication** — passwords are hashed with a salted base64 (see
  `app/utils/users.js`). Treat as a demo. Replace with a real backend
  before production. The auth pages show inline "Email or password is
  incorrect." errors so the contract is visible.
- **Payments** — the checkout form validates Luhn + ZIP + expiry + CVV
  but never charges. Use a test card like `4242 4242 4242 4242`.
- **Email** — contact form, newsletter, and password recovery all show
  success toasts but do not send anything.
- **Photography** — products use parametric SVG illustrations, not photos.

## Browser support

Last two stable versions of:

- Chrome / Edge / Firefox / Safari

The app uses ES2020 syntax, `crypto.randomUUID()` (with fallback),
`Intl.NumberFormat`, and CSS custom properties — no transpilation step.

## Routes (16 distinct page templates, 19 hash routes)

`#/`, `#/shop`, `#/product/:slug`, `#/cart`, `#/checkout`, `#/order/:id`,
`#/login`, `#/signup`, `#/recover`, `#/account`, `#/about`,
`#/sustainability`, `#/faq`, `#/contact`, `#/locations`, `#/blog`,
`#/blog/:slug`, `#/privacy`, `#/terms`, `#/not-found`.

The dynamic `:next` query on `#/login` (`#/login?next=/account`) is
round-tripped so deep-links survive the unauthenticated bounce.

## Known limitations + next steps

- Replace mock auth (`app/utils/users.js`) with a real backend.
- Replace SVG art with a photography pass.
- Replace template Privacy / Terms text with real legal copy.
- Add a service worker for offline support.
- Add Playwright smoke tests (the current suite is unit + JSDOM).
- The order id generator currently uses `crypto.randomUUID()` when
  available and falls back to a 6-char base36 — replace with a UUIDv7
  server-side once a real backend lands.

## License

Demo project — no license granted for production use.
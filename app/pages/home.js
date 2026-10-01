/* ============================================================
   Home — editorial hero, featured flavors, story, locations, journal.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function featured() {
    return global.PRODUCTS.filter((p) => p.isBestseller || p.isNew).slice(0, 4);
  }

  function render() {
    const feats = featured();
    const bestsellers = global.PRODUCTS.filter((p) => p.isBestseller);
    const seasonal = global.PRODUCTS.filter((p) => p.family === 'seasonal');
    const vegan = global.PRODUCTS.filter((p) => p.dietary.vegan);
    const posts = global.BLOG.slice(0, 3);
    const cities = global.LOCATIONS;

    return html`
      <!-- HERO -->
      <section class="hero">
        <div class="container hero__grid">
          <div class="hero__copy">
            <span class="eyebrow">A small-batch ice cream shop · est. 2018</span>
            <h1 class="hero__title">Ice cream that<br/>still tastes like<br/><em>the first 72 hours</em>.</h1>
            <p class="hero__lede">We churn in 12-quart batches from a single copper machine. We list every ingredient on the pint. We run out by Saturday. We would not have it any other way.</p>
            <div class="hero__ctas">
              <a class="btn btn--primary btn--lg" href="#/shop" data-route>Shop the menu</a>
              <a class="btn btn--ghost btn--lg" href="#/locations" data-route>Find a scoop shop</a>
            </div>
            <dl class="hero__stats" aria-label="By the numbers">
              <div><dt>12<span class="quarts">qt</span></dt><dd>per batch, max</dd></div>
              <div><dt>38</dt><dd>vanilla farmers</dd></div>
              <div><dt>4</dt><dd>scoop shops</dd></div>
              <div><dt>0</dt><dd>artificial flavors</dd></div>
            </dl>
          </div>
          <figure class="hero__art" aria-hidden="true">
            ${SVG.heroScoop()}
          </figure>
        </div>
      </section>

      <!-- FEATURED -->
      <section class="section">
        <div class="container">
          <div class="section__head">
            <div>
              <span class="eyebrow">This week on the menu</span>
              <h2>Four flavors we are <em>proud</em> of right now.</h2>
            </div>
            <a class="btn btn--ghost btn--sm" href="#/shop" data-route>See all 14 flavors →</a>
          </div>
          <div class="grid grid--4 product-grid">
            ${feats.map((p) => productCard(p)).join('')}
          </div>
        </div>
      </section>

      <!-- STORY -->
      <section class="section section--alt story">
        <div class="container story__grid">
          <div class="story__media" aria-hidden="true">
            <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg">
              <rect width="480" height="360" rx="22" fill="#221814"/>
              <rect x="0" y="0" width="480" height="360" rx="22" fill="url(#story)"/>
              <defs>
                <linearGradient id="story" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stop-color="#4a2e1f"/>
                  <stop offset="100%" stop-color="#9b3a2a"/>
                </linearGradient>
              </defs>
              <g transform="translate(40 60)">
                <rect width="400" height="240" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(251,246,236,0.18)"/>
                <text x="20" y="46" font-family="Fraunces, Georgia, serif" font-size="22" fill="#f7eedd" font-weight="600">— Mira Hollis, founder</text>
                <text x="20" y="100" font-family="Fraunces, Georgia, serif" font-size="34" fill="#fbf6ec" font-weight="500">“We engineer for the first</text>
                <text x="20" y="142" font-family="Fraunces, Georgia, serif" font-size="34" fill="#fbf6ec" font-weight="500">72 hours after churn.”</text>
                <text x="20" y="190" font-family="Inter, sans-serif" font-size="14" fill="#ede2cc">The rest of the industry engineers</text>
                <text x="20" y="210" font-family="Inter, sans-serif" font-size="14" fill="#ede2cc">for the freezer case. We chose</text>
                <text x="20" y="230" font-family="Inter, sans-serif" font-size="14" fill="#ede2cc">differently.</text>
              </g>
            </svg>
          </div>
          <div class="story__copy">
            <span class="eyebrow">Our process</span>
            <h2>We chose <em>smaller</em>.</h2>
            <p>Mass ice cream is engineered to survive weeks in a freezer case. We engineer for the first 72 hours after churn — when the vanilla is loudest, the mint is brightest, the chocolate is deepest.</p>
            <p>The trade-off: we make less. We sell less. We can only ship what we made this week. We would rather run out of a flavor on Saturday than serve a tired pint on Monday.</p>
            <a class="btn btn--primary" href="#/about" data-route>Read our story</a>
          </div>
        </div>
      </section>

      <!-- BEST SELLERS / SEASONAL / VEGAN: a magazine 3-up -->
      <section class="section">
        <div class="container">
          <div class="section__head">
            <div>
              <span class="eyebrow">Curated</span>
              <h2>The week's shelves.</h2>
            </div>
          </div>
          <div class="grid grid--3 magazine">
            <article class="card magazine__card">
              <span class="eyebrow eyebrow--mint">Bestsellers</span>
              <h3>What people re-order</h3>
              <ul class="magazine__list">
                ${bestsellers.slice(0, 4).map((p) => magazineRow(p)).join('')}
              </ul>
              <a class="btn btn--ghost btn--sm" href="#/shop" data-route>Shop bestsellers</a>
            </article>
            <article class="card magazine__card magazine__card--feature" style="background:var(--color-cream-deep)">
              <span class="eyebrow" style="color:var(--color-berry)">Right now</span>
              <h3>Seasonal · Autumn</h3>
              <p>Roasted pumpkin, mace, and ginger. Cane sugar peppermint with house-made bark. Both back on the menu.</p>
              <ul class="magazine__list">
                ${seasonal.map((p) => magazineRow(p)).join('')}
              </ul>
              <a class="btn btn--primary btn--sm" href="#/shop?family=seasonal" data-route>Shop seasonal</a>
            </article>
            <article class="card magazine__card">
              <span class="eyebrow eyebrow--berry-deep">Dairy-free</span>
              <h3>For our vegan friends</h3>
              <ul class="magazine__list">
                ${vegan.map((p) => magazineRow(p)).join('')}
              </ul>
              <a class="btn btn--ghost btn--sm" href="#/shop?dietary=vegan" data-route>Shop vegan</a>
            </article>
          </div>
        </div>
      </section>

      <!-- LOCATIONS -->
      <section class="section section--alt">
        <div class="container">
          <div class="section__head">
            <div>
              <span class="eyebrow">Scoop shops</span>
              <h2>Four cities, one freezer.</h2>
              <p class="muted" style="max-width:60ch">Each shop scoops the same 14-flavor lineup, plus one local feature. Walk in, or order ahead.</p>
            </div>
            <a class="btn btn--ghost btn--sm" href="#/locations" data-route>All locations →</a>
          </div>
          <div class="grid grid--4 locations-grid">
            ${cities.map((l) => html`
              <a class="card location-card" href="#/locations" data-route>
                <div class="location-card__pin" aria-hidden="true">${locationPin(l)}</div>
                <h3>${l.name.replace('Frost & Cream — ', '')}</h3>
                <p class="muted tiny">${l.address}</p>
                <p class="muted tiny">${l.city}, ${l.state} ${l.zip}</p>
                <p class="tiny" style="margin-top:.5rem;color:var(--color-ink)">${l.notes}</p>
              </a>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- JOURNAL -->
      <section class="section">
        <div class="container">
          <div class="section__head">
            <div>
              <span class="eyebrow">From the journal</span>
              <h2>On craft, sourcing, and small things.</h2>
            </div>
            <a class="btn btn--ghost btn--sm" href="#/blog" data-route>Read all →</a>
          </div>
          <div class="grid grid--3">
            ${posts.map((p) => blogCard(p)).join('')}
          </div>
        </div>
      </section>

      <!-- NEWSLETTER BAND -->
      <section class="newsletter-band">
        <div class="container newsletter-band__inner">
          <div>
            <span class="eyebrow">The dispatch</span>
            <h2 style="margin-bottom:.25rem">A monthly letter. <em>No noise.</em></h2>
            <p class="muted">New flavors, sourcing notes, the occasional opinion. Unsubscribe in one click.</p>
          </div>
          <form class="newsletter-band__form" data-action="newsletter">
            <label class="visually-hidden" for="home-news-email">Email</label>
            <input id="home-news-email" class="input" type="email" required placeholder="email@yours.com"/>
            <button class="btn btn--primary" type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    `;
  }

  function productCard(p) {
    return html`
      <a class="product-card" href="#/product/${p.slug}" data-route aria-label="${p.name}, ${Fmt.money(p.basePrice)}">
        <div class="product-card__media" style="background:${tintBg(p)}">
          ${SVG.pintCarton({ color: p.swatch, shade: Color.darken(p.swatch), name: p.name })}
        </div>
        <div class="product-card__badges">
          ${p.isNew ? html`<span class="badge badge--berry">New</span>` : ''}
          ${p.isBestseller ? html`<span class="badge badge--cream">Bestseller</span>` : ''}
          ${p.dietary.vegan ? html`<span class="badge badge--mint">Vegan</span>` : ''}
        </div>
        <h3 class="product-card__title">${p.name}</h3>
        <p class="muted tiny" style="min-height:2.4em">${p.short}</p>
        <div class="product-card__row">
          <span class="product-card__price">From ${Fmt.money(p.basePrice)}</span>
          <span class="muted tiny">${p.family}</span>
        </div>
      </a>
    `;
  }

  function magazineRow(p) {
    return html`
      <li>
        <a href="#/product/${p.slug}" data-route class="magazine__row">
          <span class="magazine__swatch" style="background:${p.swatch}"></span>
          <span class="magazine__name">${p.name}</span>
          <span class="muted tiny">${Fmt.money(p.basePrice)}</span>
        </a>
      </li>
    `;
  }

  function blogCard(p) {
    return html`
      <a class="blog-card" href="#/blog/${p.slug}" data-route>
        <div class="blog-card__art" aria-hidden="true">
          <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgrad-${p.id}" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stop-color="${blogPalette(p).a}"/>
                <stop offset="100%" stop-color="${blogPalette(p).b}"/>
              </linearGradient>
            </defs>
            <rect width="320" height="200" rx="14" fill="url(#bgrad-${p.id})"/>
            <text x="20" y="180" font-family="Fraunces, Georgia, serif" font-size="42" font-weight="700" fill="${blogPalette(p).ink}" fill-opacity="0.18">${p.title.split(' ').slice(0, 2).join(' ')}</text>
          </svg>
        </div>
        <div class="blog-card__body">
          <span class="eyebrow">${p.tags[0]} · ${Fmt.dateShort(p.date)}</span>
          <h3>${p.title}</h3>
          <p class="muted">${p.excerpt}</p>
          <span class="muted tiny">— ${p.author}</span>
        </div>
      </a>
    `;
  }

  function locationPin() {
    return `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect width="120" height="120" rx="16" fill="var(--color-cream-soft)"/>
  <path d="M60 22c-15 0-26 11-26 25 0 18 26 41 26 41s26-23 26-41c0-14-11-25-26-25z" fill="var(--color-berry)"/>
  <circle cx="60" cy="48" r="9" fill="var(--color-cream)"/>
</svg>`;
  }

  // Helpers
  function tintBg(p) {
    const c = p.swatch;
    return `linear-gradient(180deg, ${c}33, ${c}11)`;
  }
  function blogPalette(p) {
    const map = {
      b001: { a: '#f7eedd', b: '#e07a5f', ink: '#9b3a2a' },
      b002: { a: '#efd9a8', b: '#9b3a2a', ink: '#4a2e1f' },
      b003: { a: '#a8c4b3', b: '#6f9e8a', ink: '#221814' },
      b004: { a: '#ede2cc', b: '#d9a441', ink: '#9b3a2a' },
    };
    return map[p.id] || { a: '#f7eedd', b: '#e07a5f', ink: '#9b3a2a' };
  }

  function mount(params) {
    const el = document.getElementById('app');
    el.innerHTML = render();
    el.querySelector('[data-action="newsletter"]').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = el.querySelector('#home-news-email');
      if (!Validate.email(input.value.trim())) { Toast.show('That email looks off.', 'error'); return; }
      Toast.show('Thanks. We will be in touch.', 'success');
      input.value = '';
    });
    return () => {};
  }

  global.Pages = global.Pages || {};
  global.Pages.home = mount;
})(window);
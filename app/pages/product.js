/* ============================================================
   Product detail — pint hero, size selector, add-to-cart, reviews.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render(params) {
    const product = global.PRODUCTS.find((p) => p.slug === params.slug);
    if (!product) {
      location.hash = '#/not-found';
      return '';
    }
    const reviews = global.REVIEWS.filter((r) => r.productId === product.id);
    const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;
    const defaultSize = product.sizes[0];
    const related = global.PRODUCTS.filter((p) => p.family === product.family && p.id !== product.id).slice(0, 3);

    return html`
      <section class="product-detail">
        <div class="container product-detail__grid">
          <div class="product-detail__art" style="background:linear-gradient(180deg, ${product.swatch}33, ${product.swatch}11)">
            ${SVG.pintCarton({ color: product.swatch, shade: Color.darken(product.swatch), name: product.name })}
          </div>
          <div class="product-detail__copy">
            <span class="eyebrow">${product.family.charAt(0).toUpperCase() + product.family.slice(1)} · ${product.flavor}</span>
            <h1>${product.name}</h1>
            <p class="product-detail__lede">${product.description}</p>

            <div class="product-detail__meta">
              ${stars(avg, reviews.length)}
              <span class="muted tiny">${reviews.length} review${reviews.length === 1 ? '' : 's'}</span>
            </div>

            <fieldset class="product-detail__sizes">
              <legend class="label">Size</legend>
              ${product.sizes.map((s, i) => html`
                <label class="size-radio ${i === 0 ? 'size-radio--active' : ''}">
                  <input type="radio" name="size" value="${s.label}" ${i === 0 ? 'checked' : ''} data-action="size"/>
                  <span class="size-radio__label">${s.label}</span>
                  <span class="size-radio__price">${Fmt.money(s.price)}</span>
                </label>
              `).join('')}
            </fieldset>

            <div class="product-detail__buy">
              <div class="qty" role="group" aria-label="Quantity">
                <button type="button" data-action="qty-dec" aria-label="Decrease quantity">−</button>
                <input class="qty__input" type="text" inputmode="numeric" value="1" data-action="qty" aria-label="Quantity"/>
                <button type="button" data-action="qty-inc" aria-label="Increase quantity">+</button>
              </div>
              <button class="btn btn--primary btn--lg btn--block-mobile" type="button" data-action="add-to-cart">
                Add to cart — <span data-bind="price">${Fmt.money(defaultSize.price)}</span>
              </button>
            </div>

            <ul class="product-detail__badges tag-list">
              ${product.dietary.vegan ? html`<li><span class="tag tag--mint">Vegan</span></li>` : ''}
              ${product.dietary.glutenFree ? html`<li><span class="tag tag--ink">Gluten-free</span></li>` : ''}
              ${product.dietary.nutFree ? html`<li><span class="tag tag--ink">Nut-free</span></li>` : ''}
              ${product.allergens.length ? html`<li><span class="tag">Contains ${product.allergens.join(', ')}</span></li>` : ''}
              <li><span class="tag tag--cream">${product.stock} pints in stock</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container product-spec">
          <article>
            <span class="eyebrow">Ingredients</span>
            <p>${product.ingredients.map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join(', ')}.</p>
          </article>
          <article>
            <span class="eyebrow">Nutrition · per ${product.nutrition.serving}</span>
            <dl class="nutrition">
              <div><dt>${product.nutrition.calories}</dt><dd>calories</dd></div>
              <div><dt>${product.nutrition.fatG}<span class="quarts">g</span></dt><dd>fat</dd></div>
              <div><dt>${product.nutrition.sugarG}<span class="quarts">g</span></dt><dd>sugar</dd></div>
              <div><dt>${product.nutrition.proteinG}<span class="quarts">g</span></dt><dd>protein</dd></div>
            </dl>
          </article>
          <article>
            <span class="eyebrow">How it's shipped</span>
            <p>Pints ship in a dry-ice mailer (free over $75). Quart and gallon require Express. Plan to bring the package inside within an hour of delivery.</p>
          </article>
        </div>
      </section>

      <section class="section section--alt">
        <div class="container">
          <div class="section__head">
            <div>
              <span class="eyebrow">Reviews</span>
              <h2>What people are saying</h2>
            </div>
          </div>
          ${reviews.length === 0
            ? html`<p class="muted">No reviews yet — be the first.</p>`
            : html`<div class="grid grid--2">${reviews.slice(0, 4).map(reviewCard).join('')}</div>`}
        </div>
      </section>

      ${related.length ? html`
        <section class="section">
          <div class="container">
            <div class="section__head">
              <div>
                <span class="eyebrow">If you like ${product.name}</span>
                <h2>Three more from the same family.</h2>
              </div>
            </div>
            <div class="grid grid--3">${related.map(relatedCard).join('')}</div>
          </div>
        </section>
      ` : ''}
    `;
  }

  function stars(avg, n) {
    const full = Math.round(avg);
    return html`
      <span class="stars" aria-label="${avg.toFixed(1)} out of 5, ${n} reviews">
        ${[1,2,3,4,5].map((i) => html`<span aria-hidden="true" class="${i <= full ? 'stars__on' : 'stars__off'}">★</span>`).join('')}
      </span>`;
  }

  function reviewCard(r) {
    return html`
      <article class="card review-card">
        <div class="review-card__head">
          ${stars(r.rating, 0)}
          <span class="muted tiny">${Fmt.dateShort(r.date)}</span>
        </div>
        <p>“${r.body}”</p>
        <p class="muted tiny" style="margin-top:.5rem">— ${r.author}</p>
      </article>
    `;
  }

  function relatedCard(p) {
    return html`
      <a class="product-card" href="#/product/${p.slug}" data-route>
        <div class="product-card__media" style="background:linear-gradient(180deg, ${p.swatch}33, ${p.swatch}11)">
          ${SVG.pintCarton({ color: p.swatch, shade: Color.darken(p.swatch), name: p.name })}
        </div>
        <h3 class="product-card__title">${p.name}</h3>
        <p class="muted tiny">From ${Fmt.money(p.basePrice)}</p>
      </a>
    `;
  }

  function mount(params) {
    const el = document.getElementById('app');
    const product = global.PRODUCTS.find((p) => p.slug === params.slug);
    if (!product) return () => {};
    el.innerHTML = render(params);

    let qty = 1;
    let size = product.sizes[0].label;
    const updatePrice = () => {
      const s = product.sizes.find((x) => x.label === size) || product.sizes[0];
      el.querySelector('[data-bind="price"]').textContent = Fmt.money(s.price * qty);
    };

    el.querySelectorAll('[data-action="size"]').forEach((r) => {
      r.addEventListener('change', (e) => {
        size = e.target.value;
        el.querySelectorAll('.size-radio').forEach((n) => n.classList.toggle('size-radio--active', n.querySelector('input').value === size));
        updatePrice();
      });
    });
    el.querySelector('[data-action="qty-dec"]').addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      el.querySelector('[data-action="qty"]').value = qty;
      updatePrice();
    });
    el.querySelector('[data-action="qty-inc"]').addEventListener('click', () => {
      qty = Math.min(10, qty + 1);
      el.querySelector('[data-action="qty"]').value = qty;
      updatePrice();
    });
    el.querySelector('[data-action="qty"]').addEventListener('change', (e) => {
      const n = parseInt(e.target.value, 10);
      qty = Math.min(10, Math.max(1, isNaN(n) ? 1 : n));
      e.target.value = qty;
      updatePrice();
    });
    el.querySelector('[data-action="add-to-cart"]').addEventListener('click', () => {
      Store.addToCart(product.id, size, qty);
      Toast.show(`${qty} × ${product.name} (${size}) added to cart.`, 'success');
    });
    return () => {};
  }

  global.Pages.product = mount;
})(window);
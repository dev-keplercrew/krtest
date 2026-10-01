/* ============================================================
   Shop — flavor grid with filters (family, dietary) and sort.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  const FAMILIES = ['classic', 'fruit', 'nut', 'seasonal'];
  const DIETARY = [
    { key: 'vegan',     label: 'Vegan' },
    { key: 'glutenFree', label: 'Gluten-free' },
    { key: 'nutFree',   label: 'Nut-free' },
  ];
  const SORTS = [
    { key: 'curated',   label: 'Curated' },
    { key: 'priceAsc',  label: 'Price · low to high' },
    { key: 'priceDesc', label: 'Price · high to low' },
    { key: 'name',      label: 'A — Z' },
  ];

  function render(params) {
    const family = params.family || '';
    const dietary = params.dietary || '';
    const sort = params.sort || 'curated';

    const filtered = global.PRODUCTS.filter((p) => {
      if (family && p.family !== family) return false;
      if (dietary && !p.dietary[dietary]) return false;
      return true;
    });
    const sorted = filtered.slice().sort((a, b) => {
      switch (sort) {
        case 'priceAsc':  return a.basePrice - b.basePrice;
        case 'priceDesc': return b.basePrice - a.basePrice;
        case 'name':      return a.name.localeCompare(b.name);
        default:
          return (b.isBestseller - a.isBestseller) || (b.isNew - a.isNew) || a.name.localeCompare(b.name);
      }
    });

    const heading = family
      ? `Seasonal · ${family.charAt(0).toUpperCase() + family.slice(1)}`
      : dietary
      ? `Flavors · ${DIETARY.find((d) => d.key === dietary)?.label}`
      : 'The full menu';
    const sub = family
      ? 'A short list, by season.'
      : dietary
      ? `Every ${DIETARY.find((d) => d.key === dietary)?.label.toLowerCase()} flavor we make.`
      : 'Fourteen flavors. All small-batch. All named.';

    return html`
      <header class="page-head">
        <div class="container">
          <span class="eyebrow">Shop</span>
          <h1>${heading}</h1>
          <p class="muted" style="max-width:60ch">${sub}</p>
        </div>
      </header>

      <section class="section--tight">
        <div class="container shop-toolbar">
          <div class="shop-filters">
            <a class="tag ${!family && !dietary ? 'tag--active' : ''}" href="#/shop" data-route>All</a>
            ${FAMILIES.map((f) => html`
              <a class="tag ${family === f ? 'tag--active' : ''}" href="#/shop?family=${f}" data-route>${f.charAt(0).toUpperCase() + f.slice(1)}</a>
            `).join('')}
            ${DIETARY.map((d) => html`
              <a class="tag ${dietary === d.key ? 'tag--active' : ''}" href="#/shop?dietary=${d.key}" data-route>${d.label}</a>
            `).join('')}
          </div>
          <label class="shop-sort">
            <span class="visually-hidden">Sort</span>
            <select class="select" data-action="sort" aria-label="Sort">
              ${SORTS.map((s) => html`<option value="${s.key}" ${sort === s.key ? 'selected' : ''}>${s.label}</option>`).join('')}
            </select>
          </label>
        </div>
      </section>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container">
          ${sorted.length === 0
            ? html`<div class="empty"><h2>No flavors match those filters.</h2><p class="muted">Try clearing them — most of our flavors are gluten-free and nut-free.</p><a class="btn btn--primary" href="#/shop" data-route>Show all flavors</a></div>`
            : html`<div class="grid grid--3 shop-grid">${sorted.map(productCard).join('')}</div>`}
        </div>
      </section>
    `;
  }

  function productCard(p) {
    return html`
      <a class="product-card" href="#/product/${p.slug}" data-route aria-label="${p.name}, from ${Fmt.money(p.basePrice)}">
        <div class="product-card__media" style="background:linear-gradient(180deg, ${p.swatch}33, ${p.swatch}11)">
          ${SVG.pintCarton({ color: p.swatch, shade: Color.darken(p.swatch), name: p.name })}
        </div>
        <div class="product-card__badges">
          ${p.isNew ? html`<span class="badge badge--berry">New</span>` : ''}
          ${p.isBestseller ? html`<span class="badge badge--cream">Bestseller</span>` : ''}
          ${p.dietary.vegan ? html`<span class="badge badge--mint">Vegan</span>` : ''}
          ${p.dietary.glutenFree ? html`<span class="badge badge--ink">GF</span>` : ''}
        </div>
        <h3 class="product-card__title">${p.name}</h3>
        <p class="muted tiny" style="min-height:2.4em">${p.short}</p>
        <div class="product-card__row">
          <span class="product-card__price">From ${Fmt.money(p.basePrice)}</span>
          <span class="muted tiny">${p.stock} in stock</span>
        </div>
      </a>
    `;
  }

  function mount(params) {
    const el = document.getElementById('app');
    el.innerHTML = render(params);
    el.querySelector('[data-action="sort"]').addEventListener('change', (e) => {
      const u = new URL('http://x' + (location.hash.startsWith('#') ? location.hash.slice(1) : location.hash));
      u.searchParams.set('sort', e.target.value);
      Router.go('#' + u.pathname + u.search);
    });
    return () => {};
  }

  global.Pages.shop = mount;
})(window);
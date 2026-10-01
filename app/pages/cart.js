/* ============================================================
   Cart — line items, qty edit, totals, checkout link.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;
  const { SHIPPING } = global.AppConstants;

  function render(state) {
    const cart = state.cart;
    if (cart.length === 0) {
      return html`
        <header class="page-head"><div class="container">
          <span class="eyebrow">Cart</span>
          <h1>Your cart is empty.</h1>
          <p class="muted" style="max-width:54ch">That's ok — everything we make is in the shop. Pick a pint to get started.</p>
          <a class="btn btn--primary btn--lg" href="#/shop" data-route>Shop the menu</a>
        </div></header>
      `;
    }
    const lines = Store.lineItems();
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
    const ship = subtotal >= SHIPPING.FREE_OVER ? 0 : SHIPPING.STANDARD;
    const total = subtotal + ship;

    return html`
      <header class="page-head"><div class="container">
        <span class="eyebrow">Cart</span>
        <h1>${cart.length} ${cart.length === 1 ? 'item' : 'items'}, ready to ship.</h1>
      </div></header>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container cart-grid">
          <div class="cart-lines">
            ${lines.map(lineRow)}
          </div>
          <aside class="cart-summary card">
            <h3>Summary</h3>
            <dl class="cart-summary__rows">
              <div><dt>Subtotal</dt><dd>${Fmt.money(subtotal)}</dd></div>
              <div><dt>Shipping (Standard)</dt><dd>${ship === 0 ? 'Free' : Fmt.money(ship)}</dd></div>
              ${subtotal < SHIPPING.FREE_OVER
                ? html`<p class="muted tiny" style="margin:.5rem 0 0">Add ${Fmt.money(SHIPPING.FREE_OVER - subtotal)} for free shipping.</p>`
                : html`<p class="tiny" style="margin:.5rem 0 0;color:var(--color-success);font-weight:600">You qualified for free shipping.</p>`}
            </dl>
            <div class="cart-summary__total">
              <span>Total</span>
              <strong>${Fmt.money(total)}</strong>
            </div>
            <a class="btn btn--primary btn--lg btn--block" href="#/checkout" data-route>Checkout</a>
            <a class="btn btn--quiet btn--block" href="#/shop" data-route>Continue shopping</a>
          </aside>
        </div>
      </section>
    `;
  }

  function lineRow(l) {
    const p = l.product;
    return html`
      <article class="cart-line">
        <a class="cart-line__media" href="#/product/${p.slug}" data-route aria-hidden="true" style="background:linear-gradient(180deg, ${p.swatch}33, ${p.swatch}11)">
          ${SVG.pintCarton({ color: p.swatch, shade: p.swatch, name: p.name })}
        </a>
        <div class="cart-line__copy">
          <a href="#/product/${p.slug}" data-route><h3>${l.name}</h3></a>
          <p class="muted tiny">${l.size.label} · ${Fmt.money(l.price)}</p>
        </div>
        <div class="qty" role="group" aria-label="Quantity for ${l.name}">
          <button type="button" data-action="dec" data-pid="${p.id}" data-size="${l.size}">−</button>
          <input class="qty__input" type="text" inputmode="numeric" value="${l.qty}" data-action="set" data-pid="${p.id}" data-size="${l.size}" aria-label="Quantity"/>
          <button type="button" data-action="inc" data-pid="${p.id}" data-size="${l.size}">+</button>
        </div>
        <div class="cart-line__total">${Fmt.money(l.lineTotal)}</div>
        <button class="cart-line__remove" type="button" data-action="remove" data-pid="${p.id}" data-size="${l.size}" aria-label="Remove ${l.name}">×</button>
      </article>
    `;
  }

  function mount(params) {
    const el = document.getElementById('app');
    const refresh = () => { el.innerHTML = render(Store.getState()); bind(el); };
    const unsubscribe = Store.subscribe(refresh);
    refresh();
    return unsubscribe;
  }

  function bind(el) {
    el.querySelectorAll('[data-action="dec"]').forEach((b) => b.addEventListener('click', () => {
      const pid = b.dataset.pid, size = b.dataset.size;
      const line = Store.getState().cart.find((i) => i.productId === pid && i.size === size);
      if (line) Store.setCartQty(pid, size, line.qty - 1);
    }));
    el.querySelectorAll('[data-action="inc"]').forEach((b) => b.addEventListener('click', () => {
      const pid = b.dataset.pid, size = b.dataset.size;
      const line = Store.getState().cart.find((i) => i.productId === pid && i.size === size);
      if (line) Store.setCartQty(pid, size, Math.min(10, line.qty + 1));
    }));
    el.querySelectorAll('[data-action="set"]').forEach((i) => i.addEventListener('change', (e) => {
      const n = parseInt(e.target.value, 10);
      Store.setCartQty(e.target.dataset.pid, e.target.dataset.size, isNaN(n) ? 1 : Math.min(10, Math.max(1, n)));
    }));
    el.querySelectorAll('[data-action="remove"]').forEach((b) => b.addEventListener('click', () => {
      Store.removeFromCart(b.dataset.pid, b.dataset.size);
      Toast.show('Removed.', 'default');
    }));
  }

  global.Pages.cart = mount;
})(window);
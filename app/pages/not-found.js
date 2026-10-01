/* ============================================================
   Not found — 404.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render() {
    return html`
      <section class="not-found">
        <div class="container text-center">
          <span class="eyebrow">404</span>
          <h1>That scoop is <em>out of stock</em>.</h1>
          <p class="muted" style="max-width:48ch;margin:0 auto 1.5rem">The page you wanted is not here. It may have rotated off the menu, or the link may be off. Try the shop, or head home.</p>
          <div style="display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap">
            <a class="btn btn--primary" href="#/shop" data-route>Shop the menu</a>
            <a class="btn btn--ghost" href="#/" data-route>Back home</a>
          </div>
        </div>
      </section>
    `;
  }

  function mount() {
    document.getElementById('app').innerHTML = render();
    return () => {};
  }

  global.Pages.notFound = mount;
})(window);
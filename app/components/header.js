/* ============================================================
   Header — sticky, translucent, brand mark, nav, search, cart.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function view(state) {
    const cartN = Store.cartCount();
    const navLinks = [
      { href: '#/shop', label: 'Shop' },
      { href: '#/about', label: 'About' },
      { href: '#/sustainability', label: 'Sustainability' },
      { href: '#/blog', label: 'Journal' },
      { href: '#/locations', label: 'Scoop shops' },
      { href: '#/faq', label: 'Help' },
    ];
    return html`
      <div class="container site-header__inner">
        <a class="brand" href="#/" aria-label="Frost & Cream home">
          <span class="brand__mark">F&amp;C</span>
          <span class="brand__name">Frost &amp; Cream</span>
        </a>
        <nav class="nav" data-open="${state.menuOpen ? 'true' : 'false'}" aria-label="Primary">
          ${navLinks.map((l) => html`<a class="nav__link" href="${l.href}" data-route>${l.label}</a>`)}
        </nav>
        <div class="header-actions">
          <button class="btn btn--quiet btn--sm" type="button" data-action="open-search" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <span class="visually-hidden">Search</span>
          </button>
          ${state.account
            ? html`<a class="btn btn--quiet btn--sm" href="#/account" data-route>Hi, ${state.account.name.split(' ')[0]}</a>`
            : html`<a class="btn btn--quiet btn--sm" href="#/login" data-route>Sign in</a>`}
          <button class="cart-button" type="button" data-action="open-cart" aria-label="Cart, ${cartN} item${cartN === 1 ? '' : 's'}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 12.3a2 2 0 0 0 2 1.7h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9" cy="21" r="1.4"/><circle cx="18" cy="21" r="1.4"/></svg>
            <span class="cart-button__count" aria-hidden="true">${cartN}</span>
          </button>
          <button class="menu-toggle" type="button" data-action="toggle-menu" aria-label="Menu" aria-expanded="${state.menuOpen ? 'true' : 'false'}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  function mount() {
    const root = document.getElementById('site-header');
    const refresh = () => { root.innerHTML = html`<header class="site-header">${view(Store.getState())}</header>`; };
    refresh();
    // Event delegation on the persistent root: buttons are re-rendered inside
    // root.innerHTML on every Store emit, so binding directly to the button
    // nodes leaks. Delegating through closest('[data-action]') keeps a single
    // click handler bound to root for the lifetime of the page.
    global.h.on(root, 'click', '[data-action]', (e, node) => {
      const action = node.dataset.action;
      if (action === 'open-cart') location.hash = '#/cart';
      else if (action === 'open-search') Store.setSearchOpen(true);
      else if (action === 'toggle-menu') Store.setMenuOpen(!Store.getState().menuOpen);
    });
    Store.subscribe(refresh);
  }

  global.HeaderCmp = { mount };
})(window);
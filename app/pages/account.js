/* ============================================================
   Account — dashboard: profile, orders.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render(state) {
    if (!state.account) { location.hash = '#/login'; return ''; }
    const orders = state.orders;
    return html`
      <header class="page-head"><div class="container">
        <span class="eyebrow">Your account</span>
        <h1>Hi, ${state.account.name.split(' ')[0]}.</h1>
        <p class="muted">Signed in as <strong>${state.account.email}</strong>.</p>
      </div></header>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container account-grid">
          <aside class="card account-side">
            <h3>Profile</h3>
            <p><strong>${state.account.name}</strong><br/>${state.account.email}</p>
            <button class="btn btn--quiet btn--block" type="button" data-action="logout">Sign out</button>
          </aside>
          <div class="account-main">
            <div class="section__head"><h2>Your orders</h2></div>
            ${orders.length === 0
              ? html`<div class="card empty-card">
                  <p>You haven't placed an order yet.</p>
                  <a class="btn btn--primary" href="#/shop" data-route>Find your first pint</a>
                </div>`
              : html`<ul class="order-list">${orders.map(orderRow).join('')}</ul>`}
          </div>
        </div>
      </section>
    `;
  }

  function orderRow(o) {
    return html`
      <li class="card order-row">
        <div>
          <div class="muted tiny">${Fmt.dateShort(o.date)} · ${o.ship.method}</div>
          <h3 style="margin:.25rem 0">Order ${o.id}</h3>
          <p class="muted tiny">${o.items.length} ${o.items.length === 1 ? 'item' : 'items'} · ${Fmt.money(o.totals.total)}</p>
        </div>
        <a class="btn btn--ghost btn--sm" href="#/order/${o.id}" data-route>View</a>
      </li>
    `;
  }

  function mount() {
    const el = document.getElementById('app');
    if (!Store.getState().account) { location.hash = '#/login?next=/account'; return () => {}; }
    const refresh = () => { el.innerHTML = render(Store.getState()); bind(el); };
    const unsubscribe = Store.subscribe(refresh);
    refresh();
    return unsubscribe;
  }

  function bind(el) {
    el.querySelector('[data-action="logout"]')?.addEventListener('click', () => {
      Store.logout();
      Toast.show('Signed out.', 'default');
      Router.go('#/');
    });
  }

  global.Pages.account = mount;
})(window);
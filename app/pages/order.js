/* ============================================================
   Order confirmation — receipt, shipping details, share.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render(params) {
    const order = Store.getOrder(params.id);
    if (!order) { location.hash = '#/not-found'; return ''; }
    return html`
      <header class="page-head order-head">
        <div class="container">
          <span class="eyebrow">Order confirmed</span>
          <h1>Thank you, ${order.ship.name.split(' ')[0]}.</h1>
          <p class="muted">A receipt is on its way to <strong>${order.ship.email}</strong>.</p>
          <div class="order-head__meta">
            <div><span class="muted tiny">Order</span><strong>${order.id}</strong></div>
            <div><span class="muted tiny">Placed</span><strong>${Fmt.dateShort(order.date)}</strong></div>
            <div><span class="muted tiny">Status</span><strong style="color:var(--color-success)">Confirmed</strong></div>
          </div>
        </div>
      </header>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container order-grid">
          <article class="card">
            <h3>What you ordered</h3>
            <ul class="checkout-summary__lines">
              ${order.items.map((it) => html`
                <li>
                  <span>${it.qty} × ${it.name} <span class="muted">(${it.size})</span></span>
                  <strong>${Fmt.money(it.price * it.qty)}</strong>
                </li>
              `).join('')}
            </ul>
            <dl class="cart-summary__rows">
              <div><dt>Subtotal</dt><dd>${Fmt.money(order.totals.subtotal)}</dd></div>
              <div><dt>Shipping (${order.ship.method})</dt><dd>${order.totals.ship === 0 ? 'Free' : Fmt.money(order.totals.ship)}</dd></div>
              <div><dt>Tax</dt><dd>${Fmt.money(order.totals.tax)}</dd></div>
            </dl>
            <div class="cart-summary__total">
              <span>Total charged</span>
              <strong>${Fmt.money(order.totals.total)}</strong>
            </div>
          </article>
          <article class="card">
            <h3>Shipping to</h3>
            <p>${order.ship.name}<br/>${order.ship.address}<br/>${order.ship.city}, ${order.ship.state} ${order.ship.zip}</p>
            <h3 style="margin-top:1.5rem">What happens next</h3>
            <ol class="next-steps">
              <li><strong>Today.</strong> Your pints are pulled from the freezer and packed into a dry-ice mailer.</li>
              <li><strong>Tomorrow.</strong> We hand the package to the carrier. You will get a tracking link by email.</li>
              <li><strong>2–4 business days.</strong> The mailer arrives. Bring it inside within an hour.</li>
            </ol>
            <a class="btn btn--ghost btn--block" href="#/shop" data-route>Keep shopping</a>
          </article>
        </div>
      </section>
    `;
  }

  function mount(params) {
    const el = document.getElementById('app');
    el.innerHTML = render(params);
    return () => {};
  }

  global.Pages.order = mount;
})(window);
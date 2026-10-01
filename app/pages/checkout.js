/* ============================================================
   Checkout — contact, shipping, payment, mock submit.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;
  const { SHIPPING, TAX } = global.AppConstants;

  function render(state) {
    const cart = state.cart;
    if (cart.length === 0) {
      location.hash = '#/cart';
      return '';
    }
    const lines = Store.lineItems();
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
    const ship = subtotal >= SHIPPING.FREE_OVER ? 0 : SHIPPING.STANDARD;
    const tax = +(subtotal * TAX.RATE).toFixed(2);
    const total = subtotal + ship + tax;

    return html`
      <header class="page-head"><div class="container">
        <span class="eyebrow">Checkout</span>
        <h1>Almost yours.</h1>
      </div></header>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container checkout-grid">
          <form class="checkout-form stack-lg" data-action="checkout" novalidate>
            <fieldset class="card checkout__group">
              <legend><h3>Contact</h3></legend>
              <div class="field">
                <label class="label" for="ck-email">Email</label>
                <input id="ck-email" class="input" name="email" type="email" required autocomplete="email"/>
                <div class="field__error" data-bind="err-email"></div>
              </div>
              <div class="field">
                <label class="label" for="ck-name">Full name</label>
                <input id="ck-name" class="input" name="name" type="text" required autocomplete="name"/>
                <div class="field__error" data-bind="err-name"></div>
              </div>
            </fieldset>

            <fieldset class="card checkout__group">
              <legend><h3>Ship to</h3></legend>
              <div class="grid grid--2" style="gap:1rem">
                <div class="field"><label class="label" for="ck-addr">Address</label><input id="ck-addr" class="input" name="address" required autocomplete="street-address"/><div class="field__error" data-bind="err-address"></div></div>
                <div class="field"><label class="label" for="ck-apt">Apt / Suite <span class="muted">(optional)</span></label><input id="ck-apt" class="input" name="apt"/></div>
              </div>
              <div class="grid grid--3" style="gap:1rem">
                <div class="field"><label class="label" for="ck-city">City</label><input id="ck-city" class="input" name="city" required autocomplete="address-level2"/><div class="field__error" data-bind="err-city"></div></div>
                <div class="field"><label class="label" for="ck-state">State</label><input id="ck-state" class="input" name="state" required autocomplete="address-level1"/><div class="field__error" data-bind="err-state"></div></div>
                <div class="field"><label class="label" for="ck-zip">ZIP</label><input id="ck-zip" class="input" name="zip" required autocomplete="postal-code"/><div class="field__error" data-bind="err-zip"></div></div>
              </div>
            </fieldset>

            <fieldset class="card checkout__group">
              <legend><h3>Shipping method</h3></legend>
              <label class="ship-option ship-option--active"><input type="radio" name="ship" value="standard" checked data-action="ship"/> Standard (2–4 business days) <strong>${subtotal >= SHIPPING.FREE_OVER ? 'Free' : Fmt.money(SHIPPING.STANDARD)}</strong></label>
              <label class="ship-option"><input type="radio" name="ship" value="express" data-action="ship"/> Express (1–2 business days) <strong>${Fmt.money(SHIPPING.EXPRESS)}</strong></label>
            </fieldset>

            <fieldset class="card checkout__group">
              <legend><h3>Payment</h3></legend>
              <div class="alert alert--info tiny" style="margin-bottom:1rem">This is a demo — no real charge will be made. Use a test card like <code>4242 4242 4242 4242</code>.</div>
              <div class="field"><label class="label" for="ck-card">Card number</label><input id="ck-card" class="input" name="card" inputmode="numeric" placeholder="4242 4242 4242 4242" required autocomplete="cc-number"/><div class="field__error" data-bind="err-card"></div></div>
              <div class="grid grid--2" style="gap:1rem">
                <div class="field"><label class="label" for="ck-exp">Expiry (MM/YY)</label><input id="ck-exp" class="input" name="exp" placeholder="04/29" required autocomplete="cc-exp"/><div class="field__error" data-bind="err-exp"></div></div>
                <div class="field"><label class="label" for="ck-cvv">CVV</label><input id="ck-cvv" class="input" name="cvv" inputmode="numeric" placeholder="123" required autocomplete="cc-csc"/><div class="field__error" data-bind="err-cvv"></div></div>
              </div>
            </fieldset>

            <button class="btn btn--primary btn--lg btn--block" type="submit" data-action="place-order">Place order — <span data-bind="total">${Fmt.money(total)}</span></button>
          </form>

          <aside class="card checkout-summary">
            <h3>Order summary</h3>
            <ul class="checkout-summary__lines">
              ${lines.map((l) => html`
                <li>
                  <span>${l.qty} × ${l.name} <span class="muted">(${l.size.label})</span></span>
                  <strong>${Fmt.money(l.lineTotal)}</strong>
                </li>
              `).join('')}
            </ul>
            <dl class="cart-summary__rows">
              <div><dt>Subtotal</dt><dd>${Fmt.money(subtotal)}</dd></div>
              <div><dt>Shipping</dt><dd data-bind="ship">${ship === 0 ? 'Free' : Fmt.money(ship)}</dd></div>
              <div><dt>Tax (est.)</dt><dd>${Fmt.money(tax)}</dd></div>
            </dl>
            <div class="cart-summary__total">
              <span>Total</span>
              <strong data-bind="grand">${Fmt.money(total)}</strong>
            </div>
          </aside>
        </div>
      </section>
    `;
  }

  function mount(params) {
    const el = document.getElementById('app');
    if (Store.getState().cart.length === 0) { location.hash = '#/cart'; return () => {}; }
    el.innerHTML = render(Store.getState());
    bind(el);
    return () => {};
  }

  function bind(el) {
    const recalc = () => {
      const lines = Store.lineItems();
      const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
      const shipMethod = el.querySelector('input[name="ship"]:checked').value;
      const ship = shipMethod === 'express' ? SHIPPING.EXPRESS : (subtotal >= SHIPPING.FREE_OVER ? 0 : SHIPPING.STANDARD);
      const tax = +(subtotal * TAX.RATE).toFixed(2);
      const total = subtotal + ship + tax;
      el.querySelector('[data-bind="ship"]').textContent = ship === 0 ? 'Free' : Fmt.money(ship);
      el.querySelector('[data-bind="grand"]').textContent = Fmt.money(total);
      el.querySelector('[data-bind="total"]').textContent = Fmt.money(total);
      el.querySelectorAll('.ship-option').forEach((n) => n.classList.toggle('ship-option--active', n.querySelector('input').checked));
    };
    el.querySelectorAll('[data-action="ship"]').forEach((r) => r.addEventListener('change', recalc));
    el.querySelector('[data-action="checkout"]').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.currentTarget;
      const data = Object.fromEntries(new FormData(f).entries());
      const errs = validate(data);
      el.querySelectorAll('.field__error').forEach((n) => n.textContent = '');
      if (Object.keys(errs).length) {
        Object.entries(errs).forEach(([k, v]) => {
          const node = el.querySelector(`[data-bind="err-${k}"]`);
          if (node) node.textContent = v;
        });
        Toast.show('Please fix the highlighted fields.', 'error');
        return;
      }
      const lines = Store.lineItems();
      const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
      const shipMethod = data.ship;
      const ship = shipMethod === 'express' ? SHIPPING.EXPRESS : (subtotal >= SHIPPING.FREE_OVER ? 0 : SHIPPING.STANDARD);
      const tax = +(subtotal * TAX.RATE).toFixed(2);
      // Demo-grade id. Use the full UUID (122 bits of entropy, collision-safe
      // up to ~2^61 orders) when crypto.randomUUID is available; fall back to
      // 12 chars of base36 (~62 bits) for older browsers. A real backend
      // should mint UUIDv7 server-side.
      const rawId = (global.crypto && global.crypto.randomUUID)
        ? global.crypto.randomUUID().replace(/-/g, '')
        : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      const order = {
        id: 'FC-' + rawId.slice(0, 12).toUpperCase(),
        items: lines.map((l) => ({ productId: l.productId, size: l.size, qty: l.qty, name: l.name, price: l.price })),
        ship: { method: shipMethod, cost: ship, name: data.name, address: data.address + (data.apt ? ', ' + data.apt : ''), city: data.city, state: data.state, zip: data.zip, email: data.email },
        totals: { subtotal, ship, tax, total: subtotal + ship + tax },
        date: new Date().toISOString(),
        status: 'confirmed',
      };
      Store.placeOrder(order);
      Router.go('#/order/' + order.id);
    });
  }

  function validate(d) {
    const e = {};
    if (!Validate.email(d.email)) e.email = 'Enter a valid email.';
    if (!Validate.required(d.name)) e.name = 'Required.';
    if (!Validate.required(d.address)) e.address = 'Required.';
    if (!Validate.required(d.city)) e.city = 'Required.';
    if (!Validate.required(d.state)) e.state = 'Required.';
    if (!Validate.zip(d.zip)) e.zip = 'Enter a 5-digit ZIP.';
    if (!Validate.cardNumber(d.card)) e.card = 'Invalid card number.';
    if (!Validate.cardExpiry(d.exp)) e.exp = 'Invalid expiry.';
    if (!Validate.cvv(d.cvv)) e.cvv = 'Invalid CVV.';
    return e;
  }

  global.Pages.checkout = mount;
})(window);
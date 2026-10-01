/* ============================================================
   Contact — form + channels.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render() {
    return html`
      <header class="page-head"><div class="container">
        <span class="eyebrow">Contact</span>
        <h1>How can we help?</h1>
        <p class="muted" style="max-width:54ch">We answer email within one business day. For urgent scoop-shop questions, call the shop directly.</p>
      </div></header>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container contact-grid">
          <form class="card stack" data-action="contact" novalidate>
            <div class="grid grid--2" style="gap:1rem">
              <div class="field"><label class="label" for="ct-name">Name</label><input id="ct-name" class="input" name="name" required/><div class="field__error" data-bind="err-name"></div></div>
              <div class="field"><label class="label" for="ct-email">Email</label><input id="ct-email" class="input" name="email" type="email" required/><div class="field__error" data-bind="err-email"></div></div>
            </div>
            <div class="field"><label class="label" for="ct-topic">What's it about?</label>
              <select id="ct-topic" class="select" name="topic">
                <option>An order I placed</option>
                <option>A scoop shop visit</option>
                <option>Wholesale / partnership</option>
                <option>Press</option>
                <option>Something else</option>
              </select>
            </div>
            <div class="field"><label class="label" for="ct-msg">Message</label><textarea id="ct-msg" class="textarea" name="message" rows="6" required></textarea><div class="field__error" data-bind="err-message"></div></div>
            <button class="btn btn--primary btn--block" type="submit">Send</button>
          </form>

          <aside class="contact-side stack-lg">
            <div class="card">
              <h3>Email</h3>
              <p><a href="mailto:hello@frostandcream.example">hello@frostandcream.example</a></p>
              <p class="muted tiny">For order questions, include your order number (FC-XXXXXX).</p>
            </div>
            <div class="card">
              <h3>Scoop shops</h3>
              <p>Each shop has its own phone line. <a href="#/locations" data-route>See all locations →</a></p>
            </div>
            <div class="card">
              <h3>Wholesale</h3>
              <p>Restaurants, hotels, and grocers — <a href="mailto:wholesale@frostandcream.example">wholesale@frostandcream.example</a>.</p>
            </div>
          </aside>
        </div>
      </section>
    `;
  }

  function mount() {
    const el = document.getElementById('app');
    el.innerHTML = render();
    el.querySelector('[data-action="contact"]').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      el.querySelectorAll('.field__error').forEach((n) => n.textContent = '');
      const errs = {};
      if (!Validate.required(data.name)) errs.name = 'Required.';
      if (!Validate.email(data.email)) errs.email = 'Enter a valid email.';
      if (!Validate.required(data.message)) errs.message = 'Required.';
      if (Object.keys(errs).length) {
        Object.entries(errs).forEach(([k, v]) => el.querySelector(`[data-bind="err-${k}"]`).textContent = v);
        return;
      }
      Toast.show('Sent. We will be in touch within a business day.', 'success');
      e.currentTarget.reset();
    });
    return () => {};
  }

  global.Pages.contact = mount;
})(window);
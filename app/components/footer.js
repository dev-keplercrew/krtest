/* ============================================================
   Footer — newsletter, four-column links, legal row.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function mount() {
    const root = document.getElementById('site-footer');
    root.innerHTML = html`
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <a class="brand" href="#/">
                <span class="brand__mark">F&amp;C</span>
                <span class="brand__name">Frost &amp; Cream</span>
              </a>
              <p class="footer-tagline">
                Small-batch, hand-crafted ice cream. Local dairy, seasonal fruit, ingredients we can name.
              </p>
              <form class="footer-newsletter" data-action="newsletter">
                <label class="visually-hidden" for="footer-email">Email</label>
                <input id="footer-email" class="input" type="email" placeholder="email@yours.com" required/>
                <button class="btn btn--primary btn--sm" type="submit">Join</button>
              </form>
            </div>
            <div>
              <h4>Shop</h4>
              <ul class="stack-sm" style="list-style:none;padding:0;margin:0;">
                <li><a href="#/shop" data-route>All flavors</a></li>
                <li><a href="#/shop?dietary=vegan" data-route>Vegan</a></li>
                <li><a href="#/shop?dietary=glutenFree" data-route>Gluten-free</a></li>
                <li><a href="#/shop?family=seasonal" data-route>Seasonal</a></li>
                <li><a href="#/shop?family=nut" data-route>Nut flavors</a></li>
              </ul>
            </div>
            <div>
              <h4>About</h4>
              <ul class="stack-sm" style="list-style:none;padding:0;margin:0;">
                <li><a href="#/about" data-route>Our story</a></li>
                <li><a href="#/sustainability" data-route>Sustainability</a></li>
                <li><a href="#/locations" data-route>Scoop shops</a></li>
                <li><a href="#/blog" data-route>Journal</a></li>
                <li><a href="#/contact" data-route>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4>Help</h4>
              <ul class="stack-sm" style="list-style:none;padding:0;margin:0;">
                <li><a href="#/faq" data-route>FAQs</a></li>
                <li><a href="#/account" data-route>Account</a></li>
                <li><a href="#/recover" data-route>Reset password</a></li>
                <li><a href="#/privacy" data-route>Privacy</a></li>
                <li><a href="#/terms" data-route>Terms</a></li>
              </ul>
            </div>
            <div>
              <h4>Scoop shops</h4>
              <ul class="stack-sm" style="list-style:none;padding:0;margin:0;">
                ${global.LOCATIONS.map((l) => html`<li><a href="#/locations" data-route>${l.city}, ${l.state}</a></li>`)}
              </ul>
            </div>
          </div>
          <div class="footer-meta">
            <span>© 2026 Frost &amp; Cream Co.</span>
            <span>Made by hand, in Portland.</span>
          </div>
        </div>
      </footer>
    `;
    root.querySelector('[data-action="newsletter"]').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = root.querySelector('#footer-email').value.trim();
      if (!Validate.email(email)) { Toast.show('That email looks off.', 'error'); return; }
      Toast.show('Thanks. We will be in touch.', 'success');
      root.querySelector('#footer-email').value = '';
    });
  }

  global.FooterCmp = { mount };
})(window);
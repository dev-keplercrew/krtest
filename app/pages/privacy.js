/* ============================================================
   Privacy — short, readable legal copy.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render() {
    return html`
      <header class="page-head"><div class="container">
        <span class="eyebrow">Legal</span>
        <h1>Privacy</h1>
        <p class="muted tiny">Effective October 1, 2026</p>
      </div></header>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container container--narrow legal stack-lg">
          <p class="lead">We collect the minimum we need to run a small-batch ice cream shop: your name, email, shipping address, and order history. We use them to ship pints, send receipts, and tell you about new flavors. You can ask us to delete any of it, any time.</p>

          <h2>What we collect</h2>
          <ul>
            <li><strong>Account info.</strong> If you create an account: name, email, password (hashed).</li>
            <li><strong>Order info.</strong> Shipping and billing address, items, totals, payment method type (we never store full card numbers).</li>
            <li><strong>Newsletter.</strong> If you subscribe, your email. Unsubscribe in one click.</li>
            <li><strong>Site analytics.</strong> Anonymized page views, no third-party tracking cookies.</li>
          </ul>

          <h2>What we do not do</h2>
          <ul>
            <li>We do not sell your data.</li>
            <li>We do not share it with advertisers.</li>
            <li>We do not run third-party tracking scripts on the shop or blog.</li>
          </ul>

          <h2>Your rights</h2>
          <p>You can request a copy of your data, or its deletion, by emailing <a href="mailto:privacy@frostandcream.example">privacy@frostandcream.example</a>. We respond within five business days.</p>

          <h2>Questions</h2>
          <p>Read something you do not understand? <a href="#/contact" data-route>Send us a note</a> — we will rewrite it.</p>
        </div>
      </section>
    `;
  }

  function mount() {
    document.getElementById('app').innerHTML = render();
    return () => {};
  }

  global.Pages.privacy = mount;
})(window);
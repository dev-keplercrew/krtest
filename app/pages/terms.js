/* ============================================================
   Terms — short, readable legal copy.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render() {
    return html`
      <header class="page-head"><div class="container">
        <span class="eyebrow">Legal</span>
        <h1>Terms of sale</h1>
        <p class="muted tiny">Effective October 1, 2026</p>
      </div></header>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container container--narrow legal stack-lg">
          <p class="lead">These terms cover purchases from frostandcream.example. By placing an order, you agree to them.</p>

          <h2>Orders</h2>
          <p>Orders can be modified within 30 minutes of placement. After that, contact us and we will do our best to help. Once an order ships, it cannot be changed.</p>

          <h2>Shipping</h2>
          <p>Pints ship in a dry-ice mailer. Plan to bring the package inside within an hour of delivery. Quart and gallon orders ship Express. We ship to the 48 contiguous US states.</p>

          <h2>Returns</h2>
          <p>Ice cream is perishable. If your order arrives damaged or thawed, contact us within 24 hours with a photo and we will refund or replace it — your choice.</p>

          <h2>Pricing</h2>
          <p>Prices are in USD and include the listed product only. Shipping and tax are calculated at checkout. We reserve the right to correct pricing errors; if a typo puts a pint at $1.20, we will let you know before charging.</p>

          <h2>Allergens</h2>
          <p>Each product page lists allergens and dietary flags. Our facility processes milk, egg, wheat, and tree nuts.</p>

          <h2>Questions</h2>
          <p>Something you do not understand? <a href="#/contact" data-route>Send us a note.</a></p>
        </div>
      </section>
    `;
  }

  function mount() {
    document.getElementById('app').innerHTML = render();
    return () => {};
  }

  global.Pages.terms = mount;
})(window);
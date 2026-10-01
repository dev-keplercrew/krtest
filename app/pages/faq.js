/* ============================================================
   FAQ — grouped accordion.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render() {
    const groups = ['Ordering', 'Shipping', 'Allergens', 'Returns'];
    return html`
      <header class="page-head"><div class="container">
        <span class="eyebrow">Help</span>
        <h1>Frequently asked questions.</h1>
        <p class="muted">Could not find it? <a href="#/contact" data-route>Send us a note.</a></p>
      </div></header>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container container--narrow">
          ${groups.map((g) => html`
            <section class="faq-group">
              <h2 class="faq-group__title">${g}</h2>
              ${global.FAQS.filter((f) => f.category === g).map((f) => faqItem(f)).join('')}
            </section>
          `).join('')}
        </div>
      </section>
    `;
  }

  function faqItem(f) {
    return html`
      <details class="faq-item" id="${f.id}">
        <summary><h3>${f.q}</h3><span class="faq-item__chev" aria-hidden="true">+</span></summary>
        <p>${f.a}</p>
      </details>
    `;
  }

  function mount() {
    const el = document.getElementById('app');
    el.innerHTML = render();
    el.querySelectorAll('.faq-item').forEach((d) => {
      d.addEventListener('toggle', () => {
        const chev = d.querySelector('.faq-item__chev');
        if (chev) chev.textContent = d.open ? '−' : '+';
      });
    });
    return () => {};
  }

  global.Pages.faq = mount;
})(window);
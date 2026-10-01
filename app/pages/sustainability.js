/* ============================================================
   Sustainability — sourcing, packaging, energy.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render() {
    return html`
      <header class="page-head page-head--hero">
        <div class="container">
          <span class="eyebrow">Sustainability</span>
          <h1>Honest about <em>where we are</em>, working on where we are not.</h1>
          <p class="muted" style="max-width:62ch">We are not a zero-impact company. We are a small-batch ice cream company that uses dairy, ships in insulated mailers, and runs four scoop shops. Here is what we have done, and what we are still working on.</p>
        </div>
      </header>

      <section class="section--tight">
        <div class="container stack-lg">
          <article>
            <span class="eyebrow">Sourcing</span>
            <h2>Pay the farmer, name the place.</h2>
            <p>We pay above-market for almost everything we use. We work directly with cooperatives where we can — 38 vanilla farmers in Madagascar, a single-estate cacao supplier in the Dominican Republic, Bronte pistachios from Sicily. We publish the names of our suppliers on the back of every quart. If we cannot name the source, we will not use it.</p>
          </article>
          <article>
            <span class="eyebrow">Packaging</span>
            <h2>Recyclable mailer, recyclable pint, recyclable lid.</h2>
            <p>Our insulated mailer is molded from recycled paper fiber with a plant-based liner — fully curbside-recyclable. Our dry-ice pellets sublimate as gas, no residue. The pint itself is #5 polypropylene (accepted in 92% of US curbside programs); the lid is #1 PET.</p>
            <p>We are still looking for a compostable pint that survives transit. Until we find one, recyclable is the best we can offer. We will keep looking.</p>
          </article>
          <article>
            <span class="eyebrow">Energy</span>
            <h2>Cold storage is hard. We are still measuring it.</h2>
            <p>Our churn room is on a 100% renewable tariff through our local utility. Our scoop shops use HFC-free commercial freezers. We are still measuring the full footprint of our shipping program and will publish it once we have a full year of data.</p>
          </article>
        </div>
      </section>

      <section class="section section--alt">
        <div class="container container--narrow">
          <span class="eyebrow">The honest list</span>
          <h2>Where we are still working.</h2>
          <ul class="sustain-list">
            <li><strong>Compostable pint.</strong> We have tested three. None has survived the full transit chain. We will keep testing.</li>
            <li><strong>Spoon.</strong> Our current wooden spoon is compostable. We are looking at a domestically produced option to cut shipping.</li>
            <li><strong>Cold-chain energy.</strong> We are metering every freezer in the company this year and will publish the totals.</li>
            <li><strong>Dairy alternatives.</strong> We are expanding the vegan line. Two flavors a year is not enough.</li>
          </ul>
        </div>
      </section>
    `;
  }

  function mount() {
    document.getElementById('app').innerHTML = render();
    return () => {};
  }

  global.Pages.sustainability = mount;
})(window);
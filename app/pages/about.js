/* ============================================================
   About — origin story, founders, values.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render() {
    return html`
      <header class="page-head page-head--hero">
        <div class="container">
          <span class="eyebrow">Our story</span>
          <h1>We started in a <em>12-quart</em> machine.</h1>
          <p class="muted" style="max-width:62ch">Frost & Cream began in 2018 in a converted Portland garage, with one batch freezer, three flavors, and a list of farmers we wanted to work with. Eight years later, the machine is bigger but the batch size is not.</p>
        </div>
      </header>

      <section class="section--tight">
        <div class="container container--narrow stack-lg">
          <p class="lead">Mira Hollis spent six years running pastry programs at two Portland restaurants before she got tired of writing menus. She bought a used batch freezer, rented kitchen time at night, and started churning ice cream that tasted the way she remembered ice cream tasting.</p>
          <p>Devon Park, who runs our sourcing program, joined a year later. He had spent a decade on the wholesale side of specialty coffee and wanted to apply that rigor to a different kind of ingredient.</p>
          <p>Today we have four scoop shops, a small shipping program, and a team of eleven. We still list every ingredient on the pint. We still run out by Saturday.</p>
        </div>
      </section>

      <section class="section section--alt">
        <div class="container">
          <div class="section__head"><div><span class="eyebrow">What we believe</span><h2>Four principles, written down so we don't forget them.</h2></div></div>
          <div class="grid grid--2">
            <article class="card value-card">
              <span class="value-card__num">01</span>
              <h3>Batch size matters.</h3>
              <p>A 12-quart batch is more than a process choice. It changes how every scoop tastes. We engineer for the first 72 hours after churn.</p>
            </article>
            <article class="card value-card">
              <span class="value-card__num">02</span>
              <h3>Name the ingredients.</h3>
              <p>Every pint lists what is in it. "Natural flavor" is not on the list. Neither is "vanilla flavoring." If we cannot name it, we do not use it.</p>
            </article>
            <article class="card value-card">
              <span class="value-card__num">03</span>
              <h3>Pay the farmer.</h3>
              <p>We pay above-market for almost everything we use. Vanilla from a cooperative in Madagascar, cacao from a single estate, pistachios from Bronte.</p>
            </article>
            <article class="card value-card">
              <span class="value-card__num">04</span>
              <h3>Make less, more honestly.</h3>
              <p>We make 12-quart batches. We sell out. We could make more. We chose not to.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container container--narrow text-center">
          <span class="eyebrow">Press &amp; partnerships</span>
          <h2>Working on a story? Let's talk.</h2>
          <p class="muted">We answer thoughtful, specific pitches quickly. Send the brief to <a href="mailto:press@frostandcream.example">press@frostandcream.example</a>.</p>
        </div>
      </section>
    `;
  }

  function mount() {
    document.getElementById('app').innerHTML = render();
    return () => {};
  }

  global.Pages.about = mount;
})(window);
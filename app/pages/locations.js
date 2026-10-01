/* ============================================================
   Locations — list of scoop shops with hours.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;
  const DAYS = [['mon','Mon'], ['tue','Tue'], ['wed','Wed'], ['thu','Thu'], ['fri','Fri'], ['sat','Sat'], ['sun','Sun']];

  function render() {
    return html`
      <header class="page-head"><div class="container">
        <span class="eyebrow">Scoop shops</span>
        <h1>Four shops, one freezer.</h1>
        <p class="muted" style="max-width:62ch">All four shops scoop the same 14-flavor lineup. Each shop has one local feature you will not find anywhere else.</p>
      </div></header>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container location-list">
          ${global.LOCATIONS.map((l) => locationCard(l)).join('')}
        </div>
      </section>
    `;
  }

  function locationCard(l) {
    return html`
      <article class="card location-card location-card--detail">
        <div class="location-card__map" aria-hidden="true">
          <svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="240" height="200" rx="14" fill="#ede2cc"/>
            <g stroke="#c9b896" stroke-width="0.7" fill="none">
              ${Array.from({length: 10}, (_, i) => html`<path d="M0 ${20*i} H240"/>`).join('')}
              ${Array.from({length: 12}, (_, i) => html`<path d="M${20*i} 0 V200"/>`).join('')}
            </g>
            <path d="M40 160 Q70 120 120 110 Q170 100 200 60" stroke="#c8553d" stroke-width="2.4" fill="none"/>
            <circle cx="120" cy="110" r="9" fill="#c8553d"/>
            <circle cx="120" cy="110" r="3" fill="#fbf6ec"/>
          </svg>
        </div>
        <div class="location-card__body">
          <h2>${l.name.replace('Frost & Cream — ', 'Frost &amp; Cream · ')}</h2>
          <p class="muted">${l.address}, ${l.city}, ${l.state} ${l.zip}<br/><a href="tel:${l.phone.replace(/[^\d]/g,'')}">${l.phone}</a></p>
          <p>${l.notes}</p>
          <table class="hours">
            <tbody>
              ${DAYS.map(([k, label]) => html`<tr><th scope="row">${label}</th><td>${l.hours[k]}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </article>
    `;
  }

  function mount() {
    document.getElementById('app').innerHTML = render();
    return () => {};
  }

  global.Pages.locations = mount;
})(window);
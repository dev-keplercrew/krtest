/* ============================================================
   Blog — list of posts.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render() {
    return html`
      <header class="page-head page-head--hero">
        <div class="container">
          <span class="eyebrow">Journal</span>
          <h1>On craft, sourcing, and small things.</h1>
          <p class="muted" style="max-width:62ch">Notes from the kitchen, the road, and the freezer.</p>
        </div>
      </header>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container">
          <div class="grid grid--2 blog-list">
            ${global.BLOG.map((p) => blogCard(p, true)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function blogCard(p, big) {
    return html`
      <a class="blog-card ${big ? 'blog-card--big' : ''}" href="#/blog/${p.slug}" data-route>
        <div class="blog-card__art" aria-hidden="true">
          <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bgrad-${p.id}" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stop-color="${pal(p).a}"/>
                <stop offset="100%" stop-color="${pal(p).b}"/>
              </linearGradient>
            </defs>
            <rect width="320" height="200" rx="14" fill="url(#bgrad-${p.id})"/>
            <text x="20" y="180" font-family="Fraunces, Georgia, serif" font-size="42" font-weight="700" fill="${pal(p).ink}" fill-opacity="0.22">${p.title.split(' ').slice(0, 2).join(' ')}</text>
          </svg>
        </div>
        <div class="blog-card__body">
          <span class="eyebrow">${p.tags.join(' · ')} · ${Fmt.dateShort(p.date)}</span>
          <h3>${p.title}</h3>
          <p class="muted">${p.excerpt}</p>
          <span class="muted tiny">— ${p.author}</span>
        </div>
      </a>
    `;
  }

  function pal(p) {
    const map = {
      b001: { a: '#f7eedd', b: '#e07a5f', ink: '#9b3a2a' },
      b002: { a: '#efd9a8', b: '#9b3a2a', ink: '#4a2e1f' },
      b003: { a: '#a8c4b3', b: '#6f9e8a', ink: '#221814' },
      b004: { a: '#ede2cc', b: '#d9a441', ink: '#9b3a2a' },
    };
    return map[p.id] || { a: '#f7eedd', b: '#e07a5f', ink: '#9b3a2a' };
  }

  function mount() {
    document.getElementById('app').innerHTML = render();
    return () => {};
  }

  global.Pages.blog = mount;
})(window);
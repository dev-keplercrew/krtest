/* ============================================================
   Blog post — long-form, editorial.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render(params) {
    const post = global.BLOG.find((b) => b.slug === params.slug);
    if (!post) { location.hash = '#/not-found'; return ''; }
    const others = global.BLOG.filter((b) => b.slug !== post.slug).slice(0, 2);
    return html`
      <article class="blog-post">
        <header class="blog-post__head">
          <div class="container container--narrow">
            <span class="eyebrow">${post.tags.join(' · ')}</span>
            <h1>${post.title}</h1>
            <p class="muted">By <strong>${post.author}</strong> · ${Fmt.dateLong(post.date)}</p>
          </div>
        </header>
        <figure class="blog-post__hero" aria-hidden="true">
          <svg viewBox="0 0 1200 360" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ph-${post.id}" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stop-color="${pal(post).a}"/>
                <stop offset="100%" stop-color="${pal(post).b}"/>
              </linearGradient>
            </defs>
            <rect width="1200" height="360" fill="url(#ph-${post.id})"/>
            <text x="80" y="320" font-family="Fraunces, Georgia, serif" font-size="120" font-weight="700" fill="${pal(post).ink}" fill-opacity="0.18">${post.title.split(' ').slice(0, 2).join(' ')}</text>
          </svg>
        </figure>
        <div class="container container--narrow blog-post__body stack-lg">
          ${post.body.map((p) => html`<p class="lead-soft">${p}</p>`).join('')}
          <hr/>
          <p class="muted tiny">Filed under ${post.tags.map((t) => html`<a href="#/blog" data-route>${t}</a>`).join(', ')}.</p>
        </div>
      </article>

      ${others.length ? html`
        <section class="section section--alt">
          <div class="container">
            <div class="section__head"><div><span class="eyebrow">Keep reading</span><h2>More from the journal.</h2></div></div>
            <div class="grid grid--2">
              ${others.map((o) => html`
                <a class="card blog-row" href="#/blog/${o.slug}" data-route>
                  <span class="eyebrow">${o.tags[0]} · ${Fmt.dateShort(o.date)}</span>
                  <h3>${o.title}</h3>
                  <p class="muted">${o.excerpt}</p>
                  <span class="muted tiny">— ${o.author}</span>
                </a>
              `).join('')}
            </div>
          </div>
        </section>
      ` : ''}
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

  function mount(params) {
    document.getElementById('app').innerHTML = render(params);
    return () => {};
  }

  global.Pages.blogPost = mount;
})(window);
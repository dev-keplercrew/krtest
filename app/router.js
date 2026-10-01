/* ============================================================
   Router — hash-based, parameterized segments, mounted pages.
   ============================================================ */
(function (global) {
  'use strict';

  const routes = [];
  let mountEl = null;
  let teardownCurrent = () => {};

  function register(pattern, handler) {
    // pattern: '#/product/:slug' → :slug captured
    const keys = [];
    const re = new RegExp('^' + pattern.replace(/:[a-zA-Z_]+/g, (m) => {
      keys.push(m.slice(1));
      return '([^/?#]+)';
    }) + '$');
    routes.push({ re, keys, handler, raw: pattern });
  }

  function parse(hash) {
    const h = (hash || '').replace(/^#/, '') || '/';
    const [path, search] = h.split('?');
    const params = {};
    if (search) {
      new URLSearchParams(search).forEach((v, k) => { params[k] = v; });
    }
    return { path: '#' + path, params };
  }

  function go(hash) {
    if (location.hash === hash) {
      // Force re-render on identical hash (e.g. product click on product page)
      handle();
    } else {
      location.hash = hash;
    }
  }

  function resolve() {
    const { path, params } = parse(location.hash);
    for (const r of routes) {
      const m = path.match(r.re);
      if (m) {
        const matched = {};
        r.keys.forEach((k, i) => { matched[k] = decodeURIComponent(m[i + 1]); });
        return { handler: r.handler, params: { ...matched, ...params } };
      }
    }
    return null;
  }

  async function handle() {
    const resolved = resolve() || routes.find((r) => r.raw === '#/not-found');
    if (!resolved) return;
    teardownCurrent();
    mountEl.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    let cleanup = () => {};
    try {
      cleanup = resolved.handler(resolved.params);
    } catch (err) {
      // Surface render errors loudly but never break subsequent navigation —
      // teardownCurrent must be reset before the next handle() runs.
      console.error('[router] page render failed:', err);
      if (mountEl) {
        mountEl.innerHTML = `
          <section class="section--tight">
            <div class="container container--narrow">
              <header class="page-head">
                <span class="eyebrow">Something went wrong</span>
                <h1>That page did not load.</h1>
                <p class="muted">We logged the error. Try the <a href="#/" data-route>home page</a> or one of the links below.</p>
              </header>
            </div>
          </section>`;
      }
    }
    teardownCurrent = typeof cleanup === 'function' ? cleanup : () => {};
    // Update active nav
    document.querySelectorAll('.nav__link[data-route]').forEach((a) => {
      const h = a.getAttribute('href');
      a.setAttribute('aria-current', h === location.hash ? 'page' : 'false');
    });
  }

  function init() {
    mountEl = document.getElementById('app');
    window.addEventListener('hashchange', handle);
    handle();
  }

  global.Router = { register, init, go, handle };
})(window);
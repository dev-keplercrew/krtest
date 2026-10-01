/* ============================================================
   Search overlay — keyboard-first, indexes products + blog + FAQs.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function indexItems() {
    const out = [];
    global.PRODUCTS.forEach((p) => out.push({ kind: 'Flavor', title: p.name, sub: p.short, href: '#/product/' + p.slug, q: [p.name, p.short, p.flavor].join(' ') }));
    global.BLOG.forEach((b) => out.push({ kind: 'Journal', title: b.title, sub: 'by ' + b.author, href: '#/blog/' + b.slug, q: [b.title, b.excerpt, b.author].join(' ') }));
    global.LOCATIONS.forEach((l) => out.push({ kind: 'Scoop shop', title: l.name, sub: l.city + ', ' + l.state, href: '#/locations', q: [l.name, l.city, l.notes].join(' ') }));
    global.FAQS.forEach((f) => out.push({ kind: 'Help', title: f.q, sub: f.a.slice(0, 80), href: '#/faq#' + f.id, q: f.q + ' ' + f.a }));
    return out;
  }

  function render(query) {
    const items = indexItems();
    const q = (query || '').toLowerCase().trim();
    const results = q
      ? items.filter((i) => i.q.toLowerCase().includes(q)).slice(0, 10)
      : items.slice(0, 8);
    return html`
      <div class="search-overlay" role="dialog" aria-modal="true" aria-label="Search" data-action="close-overlay-bg">
        <div class="search-panel" role="document">
          <div style="display:flex;align-items:center;gap:.5rem;padding:0 1.25rem;">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input id="search-input" type="search" placeholder="Search flavors, journal, scoop shops, FAQs…" autofocus value="${html.esc(query || '')}" aria-label="Search query"/>
            <button class="btn btn--quiet btn--sm" type="button" data-action="close-overlay" aria-label="Close">Esc</button>
          </div>
          <div class="search-results" role="listbox">
            ${results.length === 0
              ? html`<div class="search-result search-empty">No matches. Try a flavor or a city.</div>`
              : results.map((r, i) => html`
                <a class="search-result" role="option" href="${r.href}" data-action="pick">
                  <span class="badge badge--cream" style="min-width:88px;justify-content:center">${r.kind}</span>
                  <div style="flex:1;min-width:0">
                    <div class="search-result__title">${r.title}</div>
                    <div class="search-result__sub">${r.sub}</div>
                  </div>
                </a>
              `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  let inputEl = null, lastQuery = '', inputTimer = 0;

  function mount() {
    const root = document.getElementById('search-root');
    // Event delegation on the persistent root: close-overlay action nodes are
    // re-rendered inside root.innerHTML on every Store emit, so binding
    // directly to them leaks or duplicates listeners. Delegating through
    // h.on(root, ...) keeps a single click handler bound for the lifetime of
    // the page — symmetric with HeaderCmp.mount() in app/components/header.js.
    global.h.on(root, 'click', '[data-action="close-overlay"], [data-action="close-overlay-bg"]', (e, node) => {
      Store.setSearchOpen(false);
    });
    const unsubscribe = Store.subscribe(() => {
      const open = Store.getState().searchOpen;
      if (open) {
        root.innerHTML = render(lastQuery);
        inputEl = root.querySelector('#search-input');
        // Re-bind the input listener (DOM was rebuilt) and re-assert focus so
        // typing fast does not lose focus after each re-render.
        if (inputEl) {
          inputEl.addEventListener('input', onInput);
          if (document.activeElement !== inputEl) inputEl.focus();
        }
      } else if (root.firstChild) {
        root.innerHTML = '';
        inputEl = null;
        lastQuery = '';
        if (inputTimer) { clearTimeout(inputTimer); inputTimer = 0; }
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && Store.getState().searchOpen) Store.setSearchOpen(false);
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !Store.getState().searchOpen && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        e.preventDefault();
        Store.setSearchOpen(true);
      }
    });
    return unsubscribe;
  }

  function onInput(e) {
    lastQuery = e.target.value;
    if (inputTimer) clearTimeout(inputTimer);
    // Debounce so we only re-render after typing pauses; each re-render still
    // re-asserts focus via the subscribe path above.
    inputTimer = setTimeout(() => {
      const root = document.getElementById('search-root');
      if (!root) return;
      root.innerHTML = render(lastQuery);
      const next = root.querySelector('#search-input');
      if (next) {
        next.addEventListener('input', onInput);
        next.focus();
      }
    }, 60);
  }

  global.SearchCmp = { mount };
})(window);
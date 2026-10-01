/* ============================================================
   DOM — tagged-template HTML escaper + small query helpers
   ============================================================ */
(function (global) {
  'use strict';

  const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC_MAP[c]);
  }
  function escapeAttr(s) { return escapeHtml(s); }

  /**
   * Tagged-template HTML helper.
   *   html`<a href="${url}">${text}</a>` — plain-string values are emitted
   *   as-is (this is a tagged template, the author controls all output).
   *   Use html.esc(value) to force escaping — needed for any value that
   *   came from user input (forms, query strings, search inputs).
   *
   *   The result of html(...) is itself marked as raw so it composes
   *   cleanly into another html(...) template.
   */
  function html(strings, ...values) {
    let out = '';
    for (let i = 0; i < strings.length; i++) {
      out += strings[i];
      if (i < values.length) {
        const v = values[i];
        if (v == null || v === false) { out += ''; continue; }
        if (Array.isArray(v)) { out += v.map(asOut).join(''); continue; }
        out += asOut(v);
      }
    }
    return markRaw(out);
  }
  function asOut(v) {
    if (v && v.__raw === true) return String(v);
    if (v && v.__raw === false) return String(v).replace(/^__raw:false\s/, '');
    return String(v);
  }
  function markRaw(s) {
    const o = new String(s);
    o.__raw = true;
    return o;
  }
  html.raw = markRaw;
  html.esc = (s) => { const o = new String(escapeHtml(s)); o.__raw = true; return o; };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function on(target, type, sel, handler) {
    if (typeof sel === 'function') { handler = sel; sel = null; }
    const listener = (e) => {
      if (!sel) return handler(e);
      const node = e.target.closest(sel);
      if (node && (target === document || target.contains(node))) handler(e, node);
    };
    target.addEventListener(type, listener);
    return () => target.removeEventListener(type, listener);
  }

  function setText(el, txt) { if (el) el.textContent = txt == null ? '' : txt; }

  global.h = { html, $: $, $$: $$, on, setText, escapeHtml };
})(window);
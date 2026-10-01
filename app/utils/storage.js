/* ============================================================
   Storage — typed wrappers around localStorage with safe fallbacks
   ============================================================ */
(function (global) {
  'use strict';
  const PREFIX = 'fc:';
  const memory = new Map();

  function safe() {
    try {
      const k = '__t__';
      global.localStorage.setItem(k, k);
      global.localStorage.removeItem(k);
      return true;
    } catch (_) {
      return false;
    }
  }
  const HAS = safe();

  function get(key, fallback) {
    const raw = HAS ? global.localStorage.getItem(PREFIX + key) : memory.get(PREFIX + key);
    if (raw == null) return fallback;
    try { return JSON.parse(raw); } catch (_) { return fallback; }
  }
  function set(key, value) {
    const raw = JSON.stringify(value);
    if (HAS) global.localStorage.setItem(PREFIX + key, raw);
    else memory.set(PREFIX + key, raw);
  }
  function remove(key) {
    if (HAS) global.localStorage.removeItem(PREFIX + key);
    else memory.delete(PREFIX + key);
  }

  global.Storage = { get, set, remove };
})(window);
/* ============================================================
   Format — currency, date, numbers
   ============================================================ */
(function (global) {
  'use strict';

  const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  /**
   * Format a number as USD currency (e.g. "$12.50").
   * Gracefully returns "" for non-number, NaN, or nullish values so a buggy
   * upstream pipeline never throws into the UI. If you need to surface a
   * problem to the user, check for the empty string in the caller.
   */
  function money(n) {
    if (typeof n !== 'number' || Number.isNaN(n)) return '';
    return USD.format(n);
  }

  function dateShort(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function dateLong(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  function pluralize(n, singular, plural) {
    return n === 1 ? singular : (plural || singular + 's');
  }

  global.Fmt = { money, dateShort, dateLong, pluralize };
})(window);
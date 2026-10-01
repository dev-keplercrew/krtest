/* ============================================================
   Validate — light, dependency-free form helpers
   ============================================================ */
(function (global) {
  'use strict';

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const ZIP = /^[0-9]{5}(-[0-9]{4})?$/;

  function email(v) { return EMAIL.test(String(v || '').trim()); }
  function zip(v) { return ZIP.test(String(v || '').trim()); }
  function required(v) { return String(v || '').trim().length > 0; }
  function minLength(v, n) { return String(v || '').length >= n; }
  function match(v, other) { return String(v || '') === String(other || ''); }

  function cardNumber(v) {
    const digits = String(v || '').replace(/\D+/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    let sum = 0, alt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = digits.charCodeAt(i) - 48;
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }

  function cardExpiry(v) {
    const m = String(v || '').match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (!m) return false;
    const mo = parseInt(m[1], 10), yr = 2000 + parseInt(m[2], 10);
    if (mo < 1 || mo > 12) return false;
    const end = new Date(yr, mo, 0, 23, 59, 59);
    return end >= new Date();
  }

  function cvv(v) { return /^[0-9]{3,4}$/.test(String(v || '').trim()); }

  global.Validate = { email, zip, required, minLength, match, cardNumber, cardExpiry, cvv };
})(window);
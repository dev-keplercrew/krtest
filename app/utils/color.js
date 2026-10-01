/* ============================================================
   Color — shared color helpers (darken, etc.)
   ============================================================ */
(function (global) {
  'use strict';

  /**
   * Darken a hex color by subtracting a fixed amount from each channel.
   * Accepts "#rrggbb" or "rrggbb". Returns "#rrggbb".
   */
  function darken(hex, amount) {
    const step = typeof amount === 'number' ? amount : 30;
    let c = String(hex == null ? '' : hex).replace('#', '');
    if (c.length === 3) {
      c = c.split('').map((ch) => ch + ch).join('');
    }
    const n = parseInt(c, 16);
    if (Number.isNaN(n)) return hex;
    const r = Math.max(0, ((n >> 16) & 255) - step);
    const g = Math.max(0, ((n >> 8) & 255) - step);
    const b = Math.max(0, (n & 255) - step);
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  global.Color = { darken };
})(window);
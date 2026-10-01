/* ============================================================
   Constants — single source of truth for shipping/tax/etc.
   ============================================================ */
(function (global) {
  'use strict';

  const SHIPPING = {
    FREE_OVER: 75,
    STANDARD: 9.95,
    EXPRESS: 19.95,
  };

  const TAX = {
    RATE: 0.0825,
  };

  global.AppConstants = { SHIPPING, TAX };
})(window);
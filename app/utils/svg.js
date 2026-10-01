/* ============================================================
   SVG illustrations — inline, brand-aligned, deterministic.
   Each function returns an SVG string; swatch colors are the
   product accent. No external assets, no stock photography.
   ============================================================ */
(function (global) {
  'use strict';

  // A "scoop" illustration: a tilted cone with a single rounded scoop on top.
  function scoop(opts) {
    const { color = '#e07a5f', shade = '#c8553d', accent = '#fff' } = opts || {};
    return `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="g-${color.replace('#','')}" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="${color}"/>
      <stop offset="100%" stop-color="${shade}"/>
    </linearGradient>
  </defs>
  <ellipse cx="100" cy="172" rx="62" ry="10" fill="rgba(74,46,31,0.12)"/>
  <path d="M50 110 L100 196 L150 110 Z" fill="#d9a441" stroke="#9b3a2a" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M50 110 L150 110" stroke="#9b3a2a" stroke-width="1.5"/>
  <g stroke="#9b3a2a" stroke-opacity="0.35" stroke-width="1" fill="none">
    <path d="M62 112 L92 192"/><path d="M76 112 L108 192"/><path d="M100 112 L124 192"/><path d="M124 112 L132 180"/><path d="M138 112 L116 188"/>
  </g>
  <ellipse cx="100" cy="92" rx="56" ry="44" fill="url(#g-${color.replace('#','')})" stroke="${shade}" stroke-width="1.2"/>
  <path d="M68 76 q14 -18 32 -10 q18 6 30 -4 q-2 18 -16 26 q-18 12 -36 4 q-14 -6 -10 -16z" fill="${accent}" fill-opacity="0.45" stroke="${shade}" stroke-opacity="0.25" stroke-width="0.8"/>
  <circle cx="84" cy="80" r="2.4" fill="${accent}" fill-opacity="0.6"/>
  <circle cx="118" cy="76" r="2.0" fill="${accent}" fill-opacity="0.6"/>
</svg>`;
  }

  // Pint carton silhouette with a colored band — used for product cards & detail hero.
  function pintCarton(opts) {
    const { color = '#e07a5f', shade = '#c8553d', name = '' } = opts || {};
    const initial = (name || 'F').charAt(0).toUpperCase();
    return `
<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <ellipse cx="100" cy="226" rx="62" ry="6" fill="rgba(74,46,31,0.10)"/>
  <path d="M52 60 L52 220 Q52 226 60 226 L140 226 Q148 226 148 220 L148 60 Z" fill="#fbf6ec" stroke="#221814" stroke-width="1.6"/>
  <rect x="52" y="60" width="96" height="34" fill="${color}" stroke="#221814" stroke-width="1.6"/>
  <rect x="52" y="94" width="96" height="2" fill="${shade}"/>
  <rect x="56" y="106" width="88" height="1.5" fill="#221814" fill-opacity="0.3"/>
  <text x="100" y="86" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="700" font-size="22" fill="${shade}" letter-spacing="0.04em">${initial}</text>
  <text x="100" y="140" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="600" font-size="13" fill="#221814">${global.h.escapeHtml(name)}</text>
  <text x="100" y="156" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#5a4a3f" letter-spacing="0.18em">SMALL BATCH</text>
  <line x1="68" y1="172" x2="132" y2="172" stroke="#221814" stroke-opacity="0.4"/>
  <text x="100" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#5a4a3f">PINT · 16 FL OZ</text>
  <text x="100" y="204" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#5a4a3f">473 ML</text>
</svg>`;
  }

  // Mark — used in brand spot.
  function brandMark(color) {
    const c = color || '#c8553d';
    return `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <rect width="64" height="64" rx="14" fill="#f7eedd"/>
  <path d="M16 28 q0 -12 16 -12 q16 0 16 12 q0 14 -16 26 q-16 -12 -16 -26z" fill="${c}"/>
  <circle cx="44" cy="20" r="4" fill="#fff" fill-opacity="0.85"/>
</svg>`;
  }

  // A small batch scoop illustration for the homepage hero.
  function heroScoop() {
    return `
<svg viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="hero-bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#fbf6ec"/>
      <stop offset="100%" stop-color="#ede2cc"/>
    </radialGradient>
    <linearGradient id="hero-vanilla" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#f7eedd"/>
      <stop offset="100%" stop-color="#d9a441"/>
    </linearGradient>
    <linearGradient id="hero-berry" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#e07a5f"/>
      <stop offset="100%" stop-color="#9b3a2a"/>
    </linearGradient>
    <linearGradient id="hero-choc" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#6b4426"/>
      <stop offset="100%" stop-color="#221814"/>
    </linearGradient>
    <linearGradient id="hero-mint" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#a8c4b3"/>
      <stop offset="100%" stop-color="#6f9e8a"/>
    </linearGradient>
  </defs>
  <circle cx="240" cy="240" r="220" fill="url(#hero-bg)"/>
  <g opacity="0.6">
    <circle cx="90" cy="120" r="3" fill="#9b3a2a"/>
    <circle cx="380" cy="180" r="2.4" fill="#6f9e8a"/>
    <circle cx="120" cy="380" r="2.8" fill="#d9a441"/>
    <circle cx="380" cy="360" r="3" fill="#c8553d"/>
    <circle cx="60" cy="260" r="2" fill="#6b4426"/>
    <circle cx="420" cy="280" r="2.2" fill="#a8c4b3"/>
  </g>
  <g transform="translate(140 130) rotate(-6)">
    <ellipse cx="100" cy="180" rx="70" ry="10" fill="rgba(34,24,20,0.12)"/>
    <path d="M40 110 L100 200 L160 110 Z" fill="#d9a441" stroke="#9b3a2a" stroke-width="2"/>
    <g stroke="#9b3a2a" stroke-opacity="0.35" stroke-width="1.4" fill="none">
      <path d="M58 114 L96 196"/><path d="M76 114 L108 196"/><path d="M100 114 L116 192"/><path d="M118 114 L132 188"/><path d="M138 114 L108 196"/>
    </g>
    <ellipse cx="100" cy="92" rx="60" ry="48" fill="url(#hero-vanilla)" stroke="#9b3a2a" stroke-width="1.6"/>
    <path d="M68 78 q14 -16 30 -10 q18 6 30 -2 q-2 16 -16 24 q-18 10 -34 4 q-14 -6 -10 -16z" fill="#fff" fill-opacity="0.45"/>
    <circle cx="84" cy="84" r="3" fill="#9b3a2a" fill-opacity="0.5"/>
    <circle cx="118" cy="80" r="2.4" fill="#9b3a2a" fill-opacity="0.5"/>
  </g>
  <g transform="translate(230 180) rotate(8)">
    <ellipse cx="60" cy="140" rx="56" ry="8" fill="rgba(34,24,20,0.12)"/>
    <path d="M14 84 L60 160 L106 84 Z" fill="#d9a441" stroke="#9b3a2a" stroke-width="2"/>
    <ellipse cx="60" cy="68" rx="48" ry="38" fill="url(#hero-berry)" stroke="#9b3a2a" stroke-width="1.4"/>
    <path d="M40 56 q12 -12 24 -6 q12 4 22 -2 q-2 14 -14 18 q-14 8 -28 4 q-10 -6 -4 -14z" fill="#fff" fill-opacity="0.35"/>
  </g>
  <g transform="translate(60 240) rotate(-12)">
    <ellipse cx="50" cy="120" rx="48" ry="6" fill="rgba(34,24,20,0.12)"/>
    <path d="M10 72 L50 136 L90 72 Z" fill="#d9a441" stroke="#9b3a2a" stroke-width="1.6"/>
    <ellipse cx="50" cy="58" rx="42" ry="32" fill="url(#hero-choc)" stroke="#221814" stroke-width="1.4"/>
    <g fill="#fff" fill-opacity="0.6">
      <rect x="38" y="46" width="8" height="6" rx="1.6" transform="rotate(20 42 49)"/>
      <rect x="50" y="58" width="9" height="6" rx="1.6" transform="rotate(-12 54 61)"/>
      <rect x="58" y="42" width="6" height="5" rx="1.4" transform="rotate(38 61 44)"/>
    </g>
  </g>
  <g transform="translate(290 270) rotate(14)">
    <ellipse cx="48" cy="108" rx="42" ry="6" fill="rgba(34,24,20,0.12)"/>
    <path d="M12 66 L48 124 L84 66 Z" fill="#d9a441" stroke="#9b3a2a" stroke-width="1.4"/>
    <ellipse cx="48" cy="54" rx="36" ry="28" fill="url(#hero-mint)" stroke="#6f9e8a" stroke-width="1.2"/>
    <g fill="#221814" fill-opacity="0.85">
      <rect x="34" y="46" width="7" height="5" rx="1.4" transform="rotate(20 37 48)"/>
      <rect x="46" y="58" width="6" height="4" rx="1.2" transform="rotate(-30 49 60)"/>
      <rect x="54" y="44" width="5" height="4" rx="1.2" transform="rotate(35 56 46)"/>
    </g>
  </g>
</svg>`;
  }

  global.SVG = { scoop, pintCarton, brandMark, heroScoop };
})(window);
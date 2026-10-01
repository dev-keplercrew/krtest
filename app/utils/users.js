/* ============================================================
   Users — mock authentication with hashed passwords.
   Demo only — replace with a real backend before production.
   ============================================================ */
(function (global) {
  'use strict';

  // Demo-grade hash. Salted base64 of the password. NEVER store plaintext
  // passwords. Anyone with the salt can reproduce, so this is NOT
  // production-grade. A real backend must use bcrypt/argon2 server-side;
  // SubtleCrypto.digest in the main thread is async-only, so we keep a
  // single synchronous path here for the demo.
  function hash(password) {
    if (!password) return '';
    const salted = 'fc:v1:' + String(password);
    return btoa(unescape(encodeURIComponent(salted)));
  }

  function findByEmail(email) {
    const list = (global.Store && global.Store.getState && global.Store.getState().users) || [];
    const lc = String(email || '').toLowerCase().trim();
    return list.find((u) => u.email.toLowerCase() === lc) || null;
  }

  function signup({ name, email, password }) {
    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').toLowerCase().trim();
    if (!cleanName || !cleanEmail || !password) return { ok: false, error: 'All fields are required.' };
    if (findByEmail(cleanEmail)) return { ok: false, error: 'An account with that email already exists.' };
    const user = { name: cleanName, email: cleanEmail, passwordHash: hash(password) };
    global.Store.users.push(user);
    global.Storage.set('users', global.Store.getState().users);
    return { ok: true, user };
  }

  function login(email, password) {
    const u = findByEmail(email);
    if (!u) return { ok: false, error: 'Email or password is incorrect.' };
    if (u.passwordHash !== hash(password)) return { ok: false, error: 'Email or password is incorrect.' };
    return { ok: true, user: u };
  }

  global.Users = { hash, signup, login, findByEmail };
})(window);
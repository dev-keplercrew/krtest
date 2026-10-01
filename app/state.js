/* ============================================================
   State — single source of truth, pub/sub.
   Persisted: cart, account. In-memory: search-open, mobile-menu-open.
   ============================================================ */
(function (global) {
  'use strict';

  const listeners = new Set();
  function cloneCart(arr) { return Array.isArray(arr) ? arr.map((i) => ({ productId: i.productId, size: i.size, qty: i.qty })) : []; }
  function cloneOrders(arr) { return Array.isArray(arr) ? arr.slice() : []; }
  function cloneAccount(a) { return a && typeof a === 'object' ? { name: a.name, email: a.email } : null; }
  function cloneUsers(arr) { return Array.isArray(arr) ? arr.map((u) => ({ email: u.email, name: u.name, passwordHash: u.passwordHash })) : []; }
  const initial = {
    cart: cloneCart(Storage.get('cart', [])),       // [{ productId, size, qty }]
    account: cloneAccount(Storage.get('account', null)), // { name, email } or null
    orders: cloneOrders(Storage.get('orders', [])), // [{ id, items, totals, date, status }]
    searchOpen: false,
    menuOpen: false,
    users: cloneUsers(Storage.get('users', [])),
  };

  const state = initial;

  function emit() { listeners.forEach((fn) => { try { fn(state); } catch (_) {} }); }
  function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
  function getState() { return state; }

  /* ---- Cart ---- */
  function cartCount() { return state.cart.reduce((n, i) => n + i.qty, 0); }
  function cartSubtotal() {
    return state.cart.reduce((sum, i) => {
      const p = global.PRODUCTS.find((x) => x.id === i.productId);
      if (!p) return sum;
      const size = p.sizes.find((s) => s.label === i.size) || p.sizes[0];
      return sum + size.price * i.qty;
    }, 0);
  }
  /**
   * Resolve cart lines against the product catalog so every consumer
   * (cart, checkout, order summary, etc.) renders the same shape and any
   * future pricing change only touches the Store.
   */
  function lineItems() {
    return state.cart.map((i) => {
      const p = global.PRODUCTS.find((x) => x.id === i.productId);
      const size = (p && p.sizes.find((s) => s.label === i.size)) || (p && p.sizes[0]);
      const price = size ? size.price : 0;
      return {
        productId: i.productId,
        size: i.size,
        qty: (i.qty || 0),
        name: p ? p.name : 'Unknown product',
        slug: p ? p.slug : '',
        price,
        product: p || null,
        size,
        lineTotal: price * (i.qty || 0),
      };
    });
  }
  function addToCart(productId, size, qty) {
    const existing = state.cart.find((i) => i.productId === productId && i.size === size);
    if (existing) existing.qty += qty;
    else state.cart.push({ productId, size, qty });
    Storage.set('cart', state.cart);
    emit();
  }
  function setCartQty(productId, size, qty) {
    const item = state.cart.find((i) => i.productId === productId && i.size === size);
    if (!item) return;
    if (qty <= 0) state.cart = state.cart.filter((i) => !(i.productId === productId && i.size === size));
    else item.qty = qty;
    Storage.set('cart', state.cart);
    emit();
  }
  function removeFromCart(productId, size) {
    state.cart = state.cart.filter((i) => !(i.productId === productId && i.size === size));
    Storage.set('cart', state.cart);
    emit();
  }
  function clearCart() {
    state.cart = [];
    Storage.set('cart', state.cart);
    emit();
  }

  /* ---- Account ---- */
  function login(name, email) {
    state.account = { name, email };
    Storage.set('account', state.account);
    emit();
  }
  function logout() {
    state.account = null;
    Storage.remove('account');
    emit();
  }

  /* ---- Orders ---- */
  function placeOrder(order) {
    state.orders.unshift(order);
    Storage.set('orders', state.orders);
    clearCart();
    return order;
  }
  function getOrder(id) {
    return state.orders.find((o) => o.id === id) || null;
  }

  /* ---- UI ---- */
  function setSearchOpen(open) { state.searchOpen = !!open; emit(); }
  function setMenuOpen(open) { state.menuOpen = !!open; emit(); }

  global.Store = {
    state, subscribe, getState, emit,
    cartCount, cartSubtotal, lineItems, addToCart, setCartQty, removeFromCart, clearCart,
    login, logout, placeOrder, getOrder,
    setSearchOpen, setMenuOpen,
    users: state.users,
  };
})(window);
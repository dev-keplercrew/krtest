/* ============================================================
   Entry — boots shell + router.
   ============================================================ */
(function (global) {
  'use strict';

  function boot() {
    // Register routes
    Router.register('#/',                       Pages.home);
    Router.register('#/shop',                   Pages.shop);
    Router.register('#/product/:slug',          Pages.product);
    Router.register('#/cart',                   Pages.cart);
    Router.register('#/checkout',               Pages.checkout);
    Router.register('#/order/:id',             Pages.order);
    Router.register('#/account',                Pages.account);
    Router.register('#/login',                  Pages.login);
    Router.register('#/signup',                 Pages.signup);
    Router.register('#/recover',                Pages.recover);
    Router.register('#/about',                  Pages.about);
    Router.register('#/sustainability',        Pages.sustainability);
    Router.register('#/faq',                    Pages.faq);
    Router.register('#/contact',                Pages.contact);
    Router.register('#/locations',              Pages.locations);
    Router.register('#/blog',                   Pages.blog);
    Router.register('#/blog/:slug',              Pages.blogPost);
    Router.register('#/privacy',                Pages.privacy);
    Router.register('#/terms',                  Pages.terms);
    Router.register('#/not-found',              Pages.notFound);

    // Mount shell
    HeaderCmp.mount();
    FooterCmp.mount();
    SearchCmp.mount();
    Router.init();

    // Default route
    if (!location.hash) location.hash = '#/';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
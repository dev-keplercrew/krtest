/* ============================================================
   Login — mock auth.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render() {
    return html`
      <header class="page-head"><div class="container">
        <span class="eyebrow">Sign in</span>
        <h1>Welcome back.</h1>
        <p class="muted">Track orders, save flavors, and check out faster.</p>
      </div></header>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container container--narrow">
          <form class="card auth-card stack" data-action="login" novalidate>
            <div class="field">
              <label class="label" for="lg-email">Email</label>
              <input id="lg-email" class="input" name="email" type="email" required autocomplete="email"/>
              <div class="field__error" data-bind="err-email"></div>
            </div>
            <div class="field">
              <label class="label" for="lg-pass">Password</label>
              <input id="lg-pass" class="input" name="pass" type="password" required autocomplete="current-password"/>
              <div class="field__error" data-bind="err-pass"></div>
            </div>
            <button class="btn btn--primary btn--block" type="submit">Sign in</button>
            <div class="divider">or</div>
            <p class="muted" style="text-align:center">No account? <a href="#/signup" data-route>Create one</a></p>
            <p class="muted tiny" style="text-align:center"><a href="#/recover" data-route>Forgot your password?</a></p>
          </form>
        </div>
      </section>
    `;
  }

  function mount(params) {
    const el = document.getElementById('app');
    const nextParam = (params && params.next) || '';
    el.innerHTML = render();
    el.querySelector('[data-action="login"]').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      el.querySelectorAll('.field__error').forEach((n) => n.textContent = '');
      const errs = {};
      if (!Validate.email(data.email)) errs.email = 'Enter a valid email.';
      if (!Validate.minLength(data.pass, 6)) errs.pass = 'At least 6 characters.';
      if (Object.keys(errs).length) {
        Object.entries(errs).forEach(([k, v]) => el.querySelector(`[data-bind="err-${k}"]`).textContent = v);
        return;
      }
      const result = Users.login(data.email, data.pass);
      if (!result.ok) {
        const errTarget = el.querySelector('[data-bind="err-pass"]');
        if (errTarget) errTarget.textContent = result.error;
        Toast.show(result.error, 'error');
        return;
      }
      Store.login(result.user.name, result.user.email);
      Toast.show(`Welcome back, ${result.user.name.split(' ')[0]}.`, 'success');
      Router.go(safeNext(nextParam));
    });
    return () => {};
  }

  function safeNext(nextParam) {
    if (!nextParam || typeof nextParam !== 'string') return '#/account';
    if (!/^#\//.test(nextParam)) return '#/account';
    return nextParam;
  }

  global.Pages.login = mount;
})(window);
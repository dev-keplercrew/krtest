/* ============================================================
   Signup — mock account creation.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render() {
    return html`
      <header class="page-head"><div class="container">
        <span class="eyebrow">Create account</span>
        <h1>Join the small batch.</h1>
        <p class="muted">Save flavors, get a heads-up on seasonal drops, check out faster.</p>
      </div></header>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container container--narrow">
          <form class="card auth-card stack" data-action="signup" novalidate>
            <div class="field">
              <label class="label" for="su-name">Full name</label>
              <input id="su-name" class="input" name="name" required autocomplete="name"/>
              <div class="field__error" data-bind="err-name"></div>
            </div>
            <div class="field">
              <label class="label" for="su-email">Email</label>
              <input id="su-email" class="input" name="email" type="email" required autocomplete="email"/>
              <div class="field__error" data-bind="err-email"></div>
            </div>
            <div class="field">
              <label class="label" for="su-pass">Password</label>
              <input id="su-pass" class="input" name="pass" type="password" required autocomplete="new-password"/>
              <div class="field__hint">At least 8 characters.</div>
              <div class="field__error" data-bind="err-pass"></div>
            </div>
            <button class="btn btn--primary btn--block" type="submit">Create account</button>
            <p class="muted tiny" style="text-align:center">Already have an account? <a href="#/login" data-route>Sign in</a></p>
          </form>
        </div>
      </section>
    `;
  }

  function mount() {
    const el = document.getElementById('app');
    el.innerHTML = render();
    el.querySelector('[data-action="signup"]').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      el.querySelectorAll('.field__error').forEach((n) => n.textContent = '');
      const errs = {};
      if (!Validate.required(data.name)) errs.name = 'Required.';
      if (!Validate.email(data.email)) errs.email = 'Enter a valid email.';
      if (!Validate.minLength(data.pass, 8)) errs.pass = 'At least 8 characters.';
      if (Object.keys(errs).length) {
        Object.entries(errs).forEach(([k, v]) => el.querySelector(`[data-bind="err-${k}"]`).textContent = v);
        return;
      }
      const result = Users.signup({ name: data.name, email: data.email, password: data.pass });
      if (!result.ok) {
        const target = el.querySelector('[data-bind="err-email"]');
        if (target) target.textContent = result.error;
        Toast.show(result.error, 'error');
        return;
      }
      Store.login(result.user.name, result.user.email);
      Toast.show(`Welcome, ${result.user.name.split(' ')[0]}.`, 'success');
      Router.go('#/account');
    });
    return () => {};
  }

  global.Pages.signup = mount;
})(window);
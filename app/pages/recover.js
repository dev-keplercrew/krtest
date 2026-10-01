/* ============================================================
   Recover — mock password reset.
   ============================================================ */
(function (global) {
  'use strict';
  const { html } = global.h;

  function render() {
    return html`
      <header class="page-head"><div class="container">
        <span class="eyebrow">Reset password</span>
        <h1>Forgot your password?</h1>
        <p class="muted" style="max-width:54ch">Enter the email on your account. We will send you a reset link if it matches a real account.</p>
      </div></header>

      <section class="section--tight" style="padding-bottom:5rem">
        <div class="container container--narrow">
          <form class="card auth-card stack" data-action="recover" novalidate>
            <div class="field">
              <label class="label" for="rec-email">Email</label>
              <input id="rec-email" class="input" name="email" type="email" required autocomplete="email"/>
              <div class="field__error" data-bind="err-email"></div>
            </div>
            <button class="btn btn--primary btn--block" type="submit">Send reset link</button>
            <p class="muted tiny" style="text-align:center">Remembered it? <a href="#/login" data-route>Sign in</a></p>
          </form>
        </div>
      </section>
    `;
  }

  function mount() {
    const el = document.getElementById('app');
    el.innerHTML = render();
    el.querySelector('[data-action="recover"]').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      el.querySelectorAll('.field__error').forEach((n) => n.textContent = '');
      if (!Validate.email(data.email)) { el.querySelector('[data-bind="err-email"]').textContent = 'Enter a valid email.'; return; }
      Toast.show('If that email is on file, a reset link is on its way.', 'success');
      setTimeout(() => Router.go('#/login'), 600);
    });
    return () => {};
  }

  global.Pages.recover = mount;
})(window);
class LoginPage {
  constructor(page) {
    this.page = page;
  }

  get email() {
    return this.page.locator('[data-test="email"]');
  }

  get password() {
    return this.page.locator('[data-test="password"]');
  }

  get submit() {
    return this.page.locator('[data-test="login-submit"]');
  }

  get errorAlert() {
    return this.page.locator('[data-test="login-error"]');
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}

module.exports = { LoginPage };

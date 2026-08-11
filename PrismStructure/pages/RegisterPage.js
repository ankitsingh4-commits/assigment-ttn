class RegisterPage {
  constructor(page) {
    this.page = page;
  }

  get firstName() {
    return this.page.locator('[data-test="first-name"]');
  }

  get lastName() {
    return this.page.locator('[data-test="last-name"]');
  }

  get email() {
    return this.page.locator('[data-test="email"]');
  }

  get password() {
    return this.page.locator('[data-test="password"]');
  }

  get registerButton() {
    return this.page.locator('[data-test="register-submit"]');
  }

  async register(firstName, lastName, email, password) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.email.fill(email);
    await this.password.fill(password);
    await this.registerButton.click();
  }
}

module.exports = { RegisterPage };

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  get emailInput() {
    return this.page.getByLabel('Email address *');
  }

  get passwordInput() {
    return this.page.getByLabel('Password *', { exact: true });
  }

  get submitButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }

  get errorAlert() {
    return this.page.getByRole('alert');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

module.exports = { LoginPage };

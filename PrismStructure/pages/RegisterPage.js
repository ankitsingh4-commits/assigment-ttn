class RegisterPage {
  constructor(page) {
    this.page = page;
  }

  get firstNameInput() {
    return this.page.getByLabel('First name');
  }

  get lastNameInput() {
    return this.page.getByLabel('Last name');
  }

  get emailInput() {
    return this.page.getByLabel('Email');
  }

  get passwordInput() {
    return this.page.getByLabel('Password');
  }

  get registerButton() {
    return this.page.getByRole('button', { name: 'Register' });
  }

  async register(firstName, lastName, email, password) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.registerButton.click();
  }
}

module.exports = { RegisterPage };

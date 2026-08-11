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

  get dobInput() {
    return this.page.getByLabel('Date of Birth *');
  }

  get countrySelect() {
    return this.page.getByLabel('Country');
  }

  get postalCodeInput() {
    return this.page.getByLabel('Postal code');
  }

  get houseNumberInput() {
    return this.page.getByLabel('House number');
  }

  get streetInput() {
    return this.page.getByLabel('Street');
  }

  get cityInput() {
    return this.page.getByLabel('City');
  }

  get stateInput() {
    return this.page.getByLabel('State');
  }

  get phoneInput() {
    return this.page.getByLabel('Phone');
  }

  get emailInput() {
    return this.page.getByLabel('Email address');
  }

  get passwordInput() {
    return this.page.getByLabel('Password', { exact: true });
  }

  get registerButton() {
    return this.page.getByRole('button', { name: 'Register' });
  }

  async register(user) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.dobInput.fill(user.dob);
    await this.countrySelect.selectOption(user.country);
    await this.postalCodeInput.fill(user.postalCode);
    await this.houseNumberInput.fill(user.houseNumber);
    await this.streetInput.fill(user.street);
    await this.cityInput.fill(user.city);
    await this.stateInput.fill(user.state);
    await this.phoneInput.fill(user.phone);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.registerButton.click();
  }
}

module.exports = { RegisterPage };

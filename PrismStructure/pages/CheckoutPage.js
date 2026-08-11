class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  get street() {
    return this.page.locator('[data-test="street"]');
  }

  get city() {
    return this.page.locator('[data-test="city"]');
  }

  get state() {
    return this.page.locator('[data-test="state"]');
  }

  get country() {
    return this.page.locator('[data-test="country"]');
  }

  get postalCode() {
    return this.page.locator('[data-test="postal_code"]');
  }

  get proceedButton() {
    return this.page.locator('[data-test="proceed-2"]');
  }

  get paymentMethod() {
    return this.page.locator('[data-test="payment-method"]');
  }

  get finishButton() {
    return this.page.locator('[data-test="finish"]');
  }

  get orderComplete() {
    return this.page.getByText('Thanks for your order');
  }

  async fillBillingAddress(data) {
    await this.street.fill(data.street);
    await this.city.fill(data.city);
    await this.state.fill(data.state);
    const countryField = this.country;
    if ((await countryField.evaluate((el) => el.tagName)) === 'SELECT') {
      await countryField.selectOption(data.country);
    } else {
      await countryField.fill(data.country);
    }
    await this.postalCode.fill(data.postalCode);
    await this.proceedButton.click();
  }

  async selectCashOnDelivery() {
    await this.paymentMethod.selectOption('cash-on-delivery');
  }

  async confirmPaymentTwice() {
    await this.finishButton.click();
    await this.finishButton.click();
  }
}

module.exports = { CheckoutPage };

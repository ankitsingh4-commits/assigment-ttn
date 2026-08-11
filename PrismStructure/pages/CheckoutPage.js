const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  get proceedToCheckoutButton() {
    return this.page.getByRole('button', { name: 'Proceed to checkout' });
  }

  get country() {
    return this.page.locator('[data-test="country"]');
  }

  get postalCode() {
    return this.page.getByLabel('Postal code');
  }

  get houseNumber() {
    return this.page.getByLabel('House number');
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

  async continueCheckoutWizard() {
    if (await this.proceedToCheckoutButton.isVisible()) {
      await this.proceedToCheckoutButton.click();
    }
  }

  async clickVisibleProceed() {
    const count = await this.proceedButton.count();
    for (let i = 0; i < count; i++) {
      const button = this.proceedButton.nth(i);
      if (await button.isVisible()) {
        await button.click();
        return;
      }
    }
    throw new Error('No visible proceed button found on checkout wizard');
  }

  async fillBillingAddress(data) {
    if (await this.country.isVisible()) {
      await this.country.selectOption(data.country);
    }

    if (await this.postalCode.isVisible()) {
      await this.postalCode.fill(data.postalCode);
    }

    if (await this.houseNumber.isVisible()) {
      await this.houseNumber.fill(data.houseNumber);
    }

    if (await this.street.isVisible()) {
      await this.street.fill(data.street);
    }

    if (await this.city.isVisible()) {
      await this.city.fill(data.city);
    }

    if (await this.state.isVisible()) {
      await this.state.fill(data.state);
    }

    await this.clickVisibleProceed();
  }

  async goToPaymentStep() {
    await this.page.getByText('Payment', { exact: true }).click();
  }

  async advanceFromSignInStep() {
    const signInHeading = this.page.getByRole('heading', { name: 'Sign in' });
    if (await signInHeading.isVisible()) {
      await this.clickVisibleProceed();
    }
  }

  async selectCashOnDelivery() {
    await this.goToPaymentStep();
    await expect(this.paymentMethod).toBeVisible();
    await this.paymentMethod.selectOption('cash-on-delivery');
  }

  async confirmPaymentTwice() {
    await expect(this.finishButton).toBeVisible();
    await expect(this.finishButton).toBeEnabled();
    await this.finishButton.click();
    await expect(this.finishButton).toBeVisible();
    await expect(this.finishButton).toBeEnabled();
    await this.finishButton.click();
  }
}

module.exports = { CheckoutPage };

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

  get confirmButton() {
    return this.page.getByRole('button', { name: /^Confirm$/ });
  }

  get orderComplete() {
    return this.page.getByText(/Thanks for your order/i);
  }

  async continueCheckoutWizard() {
    if (await this.proceedToCheckoutButton.isVisible()) {
      await this.proceedToCheckoutButton.click();
    }
  }

  async clickVisibleProceed() {
    const candidates = [this.proceedButton, this.proceedToCheckoutButton];

    for (const locator of candidates) {
      const count = await locator.count();
      for (let i = 0; i < count; i++) {
        const button = locator.nth(i);
        if (await button.isVisible()) {
          await button.click();
          return;
        }
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
    if (await this.paymentMethod.isVisible()) {
      return;
    }

    await this.page.getByRole('listitem').filter({ hasText: /^Payment$/ }).click();
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

  async confirmPaymentOnce() {
    await expect(this.confirmButton).toBeVisible();
    await expect(this.confirmButton).toBeEnabled();
    await this.confirmButton.click();
  }

  async confirmPaymentTwice() {
    await expect(this.confirmButton).toBeVisible();
    await expect(this.confirmButton).toBeEnabled();
    await this.confirmButton.click();

    await expect(this.page.getByText(/Payment was successful/i)).toBeVisible({ timeout: 15000 });

    await expect(this.confirmButton).toBeVisible();
    await expect(this.confirmButton).toBeEnabled();
    await this.confirmButton.click({ force: true });

    await expect(this.orderComplete).toBeVisible({ timeout: 20000 });
  }
}

module.exports = { CheckoutPage };

import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get street(): Locator {
    return this.page.locator('[data-test="street"]');
  }

  get city(): Locator {
    return this.page.locator('[data-test="city"]');
  }

  get state(): Locator {
    return this.page.locator('[data-test="state"]');
  }

  get country(): Locator {
    return this.page.locator('[data-test="country"]');
  }

  get postalCode(): Locator {
    return this.page.locator('[data-test="postal_code"]');
  }

  get proceedButton(): Locator {
    return this.page.locator('[data-test="proceed-2"]');
  }

  get paymentMethod(): Locator {
    return this.page.locator('[data-test="payment-method"]');
  }

  get finishButton(): Locator {
    return this.page.locator('[data-test="finish"]');
  }

  get paymentSuccess(): Locator {
    return this.page.locator('[data-test="payment-success-message"]');
  }

  get orderComplete(): Locator {
    return this.page.getByText('Thanks for your order');
  }

  async fillBillingAddress(data: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }) {
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

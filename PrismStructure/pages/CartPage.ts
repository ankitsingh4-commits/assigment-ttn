import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get proceedCheckout(): Locator {
    return this.page.locator('[data-test="proceed-1"]');
  }

  get cartQuantity(): Locator {
    return this.page.locator('[data-test="cart-quantity"]');
  }

  get lineItems(): Locator {
    return this.page.locator('[data-test="product-name"]');
  }

  async proceedToCheckout() {
    await this.proceedCheckout.click();
  }
}

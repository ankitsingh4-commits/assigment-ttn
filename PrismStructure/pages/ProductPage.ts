import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get addToCartButton(): Locator {
    return this.page.locator('[data-test="add-to-cart"]');
  }

  get productName(): Locator {
    return this.page.locator('[data-test="product-name"]');
  }

  get quantityInput(): Locator {
    return this.page.locator('[data-test="quantity"]');
  }

  async addToCart(quantity?: number) {
    if (quantity) {
      await this.quantityInput.fill(String(quantity));
    }
    await this.addToCartButton.click();
  }
}

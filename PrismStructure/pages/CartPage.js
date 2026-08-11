class CartPage {
  constructor(page) {
    this.page = page;
  }

  get lineItems() {
    return this.page.locator('[data-test="product-title"]');
  }

  get proceedButton() {
    return this.page.locator('[data-test="proceed-1"]');
  }

  async proceedToCheckout() {
    await this.proceedButton.click();
  }
}

module.exports = { CartPage };

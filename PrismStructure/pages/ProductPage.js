class ProductPage {
  constructor(page) {
    this.page = page;
  }

  get addToCartButton() {
    return this.page.locator('[data-test="add-to-cart"]');
  }

  get quantity() {
    return this.page.locator('[data-test="quantity"]');
  }

  async addToCart(quantity = 1) {
    await this.quantity.fill(String(quantity));
    await this.addToCartButton.click();
  }
}

module.exports = { ProductPage };

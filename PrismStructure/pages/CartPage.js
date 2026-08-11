class CartPage {
  constructor(page) {
    this.page = page;
  }

  get lineItems() {
    return this.page.locator('[data-test="product-title"], [data-test="product-name"]');
  }

  get lineItemQuantities() {
    return this.page.locator(
      '[data-test="product-quantity"], [data-test="quantity"]',
    );
  }

  get lineItemUnitPrices() {
    return this.page.locator('[data-test="product-price"]');
  }

  get lineItemTotals() {
    return this.page.locator('[data-test="line-price"], [data-test="product-line-price"]');
  }

  get cartTotal() {
    return this.page.locator('[data-test="cart-total"], [data-test="total-price"]');
  }

  get proceedButton() {
    return this.page.locator('[data-test="proceed-1"]');
  }

  async proceedToCheckout() {
    await this.proceedButton.click();
  }

  async updateLineItemQuantity(lineIndex, quantity) {
    const quantityInput = this.lineItemQuantities.nth(lineIndex);
    await quantityInput.fill(String(quantity));
    await quantityInput.blur();
  }

  async getLineItemQuantity(lineIndex) {
    return Number(await this.lineItemQuantities.nth(lineIndex).inputValue());
  }

  async getLineItemUnitPrice(lineIndex) {
    return this.lineItemUnitPrices.nth(lineIndex).textContent();
  }

  async getLineItemTotal(lineIndex) {
    const lineTotalsCount = await this.lineItemTotals.count();
    if (lineTotalsCount > lineIndex) {
      return this.lineItemTotals.nth(lineIndex).textContent();
    }

    return this.lineItemUnitPrices.nth(lineIndex).textContent();
  }

  async getCartTotalText() {
    if (await this.cartTotal.count() > 0) {
      return this.cartTotal.textContent();
    }

    return null;
  }
}

module.exports = { CartPage };

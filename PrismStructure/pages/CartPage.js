class CartPage {
  constructor(page) {
    this.page = page;
  }

  get cartTable() {
    return this.page.getByRole('table').filter({
      has: this.page.getByRole('columnheader', { name: 'Item' }),
    });
  }

  get lineItems() {
    return this.cartTable.locator('tbody').first().getByRole('row');
  }

  get removeLineButtons() {
    return this.lineItems.locator('td').last().locator('button, [role="button"]');
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

  async clearCart() {
    await this.page.goto('/checkout', { waitUntil: 'domcontentloaded' });

    while (await this.removeLineButtons.count() > 0) {
      await this.removeLineButtons.first().click();
    }
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
    const footerTotal = this.page.locator('table tbody tr').last().locator('td').last();
    if (await footerTotal.isVisible()) {
      return footerTotal.textContent();
    }

    if (await this.cartTotal.count() > 0) {
      return this.cartTotal.textContent();
    }

    return null;
  }
}

module.exports = { CartPage };

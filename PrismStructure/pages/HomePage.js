const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  get signInLink() {
    return this.page.getByRole('link', { name: 'Sign in' });
  }

  get registerLink() {
    return this.page.getByRole('link', { name: 'Register' });
  }

  get productCards() {
    return this.page.locator('[data-test="product-name"]');
  }

  get searchInput() {
    return this.page.locator('[data-test="search-query"], input[placeholder*="Search"]');
  }

  get searchButton() {
    return this.page.locator('[data-test="search-submit"], button:has-text("Search")');
  }

  get emptySearchResults() {
    return this.page.getByText(/no products|no results|not found/i);
  }

  async openSignIn() {
    await this.page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
  }

  async openRegister() {
    await this.page.goto('/auth/register', { waitUntil: 'domcontentloaded' });
  }

  async searchProducts(term) {
    await this.searchInput.first().fill(term);
    await this.searchButton.first().click();
  }

  async openProductCard(index = 0) {
    await this.productCards.nth(index).click();
  }

  async openProductByName(name) {
    await this.productCards.filter({ hasText: name }).first().click();
  }
}

module.exports = { HomePage };

const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  get signInLink() {
    return this.page.getByRole('link', { name: 'Sign in' });
  }

  get registerLink() {
    return this.page.getByRole('link', { name: 'Register' });
  }

  get productCards() {
    return this.page.locator('[data-test="product-name"], a[href*="/product/"]');
  }

  async openSignIn() {
    await this.page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
  }

  async openRegister() {
    await this.page.goto('/auth/register', { waitUntil: 'domcontentloaded' });
  }
}

module.exports = { HomePage };

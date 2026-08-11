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

  async openSignIn() {
    await this.signInLink.click();
  }

  async openRegister() {
    await this.registerLink.click();
  }
}

module.exports = { HomePage };

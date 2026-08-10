import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}

export class HomePage extends BasePage {
  get signInLink(): Locator {
    return this.page.getByRole('link', { name: 'Sign in' });
  }

  get registerLink(): Locator {
    return this.page.getByRole('link', { name: 'Register' });
  }

  get productCards(): Locator {
    return this.page.locator('[data-test="product-name"]');
  }

  async openSignIn() {
    await this.signInLink.click();
  }

  async openRegister() {
    await this.registerLink.click();
  }
}

import { Page, Locator } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get firstName(): Locator {
    return this.page.locator('[data-test="first-name"]');
  }

  get email(): Locator {
    return this.page.locator('[data-test="email"]');
  }
}

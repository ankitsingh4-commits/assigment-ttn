import { Page, Locator } from '@playwright/test';

export class NavBar {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get cartLink(): Locator {
    return this.page.locator('[data-test="nav-cart"]');
  }

  get profileMenu(): Locator {
    return this.page.locator('[data-test="nav-profile"]');
  }

  get myInvoicesLink(): Locator {
    return this.page.getByRole('link', { name: 'My invoices' });
  }

  get myProfileLink(): Locator {
    return this.page.getByRole('link', { name: 'My profile' });
  }

  async openCart() {
    await this.cartLink.click();
  }

  async openMyInvoices() {
    await this.profileMenu.click();
    await this.myInvoicesLink.click();
  }

  async openMyProfile() {
    await this.profileMenu.click();
    await this.myProfileLink.click();
  }
}

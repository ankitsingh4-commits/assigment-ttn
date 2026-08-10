import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get firstName(): Locator {
    return this.page.locator('[data-test="first-name"]');
  }

  get lastName(): Locator {
    return this.page.locator('[data-test="last-name"]');
  }

  get email(): Locator {
    return this.page.locator('[data-test="email"]');
  }

  get password(): Locator {
    return this.page.locator('[data-test="password"]');
  }

  get registerButton(): Locator {
    return this.page.locator('[data-test="register-submit"]');
  }

  async register(firstName: string, lastName: string, email: string, password: string) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.email.fill(email);
    await this.password.fill(password);
    await this.registerButton.click();
  }
}

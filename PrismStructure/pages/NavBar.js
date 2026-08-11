class NavBar {
  constructor(page) {
    this.page = page;
  }

  get cartLink() {
    return this.page.locator('[data-test="nav-cart"]');
  }

  get profileMenu() {
    return this.page.locator('[data-test="nav-profile"]');
  }

  get myInvoicesLink() {
    return this.page.getByRole('link', { name: 'My invoices' });
  }

  get myProfileLink() {
    return this.page.getByRole('link', { name: 'My profile' });
  }

  get signOutLink() {
    return this.page.getByRole('link', { name: 'Sign out' });
  }

  async openCart() {
    await this.cartLink.click();
  }

  async openMyInvoices() {
    await this.page.goto('/account/invoices', { waitUntil: 'domcontentloaded' });
    const invoicesTab = this.page.getByRole('button', { name: 'Invoices', exact: true });
    if (await invoicesTab.isVisible()) {
      await invoicesTab.click();
    }
  }

  async openMyProfile() {
    await this.page.goto('/account/profile', { waitUntil: 'domcontentloaded' });
    const profileTab = this.page.getByRole('button', { name: 'Profile', exact: true });
    if (await profileTab.isVisible()) {
      await profileTab.click();
    }
  }

  async signOut() {
    await this.profileMenu.click();
    await this.signOutLink.click();
  }
}

module.exports = { NavBar };

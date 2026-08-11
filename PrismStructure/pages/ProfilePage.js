class ProfilePage {
  constructor(page) {
    this.page = page;
  }

  get email() {
    return this.page.locator('[data-test="email"]');
  }

  get firstName() {
    return this.page.locator('[data-test="first-name"]');
  }
}

module.exports = { ProfilePage };

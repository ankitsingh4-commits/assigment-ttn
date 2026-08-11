class ProfilePage {
  constructor(page) {
    this.page = page;
  }

  get firstName() {
    return this.page.getByLabel('First name');
  }

  get lastName() {
    return this.page.getByLabel('Last name');
  }

  get email() {
    return this.page.getByLabel('Email address');
  }
}

module.exports = { ProfilePage };

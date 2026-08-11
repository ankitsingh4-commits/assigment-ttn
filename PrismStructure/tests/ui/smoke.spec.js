const { test, expect } = require('../../fixtures/uiFixtures');
const { uniqueRegisterUser } = require('../../utils/dataGenerator');

test.describe('UI Smoke', () => {
  test('@smoke TC-UI-01 Homepage displays product catalog', async ({ homePage }) => {
    await homePage.goto('/');
    await expect(homePage.productCards.first()).toBeVisible();
  });

  test('@smoke TC-UI-02 User can register and login with valid credentials', async ({
    page,
    homePage,
    registerPage,
    loginPage,
    navBar,
  }) => {
    const user = uniqueRegisterUser();

    await homePage.goto('/');
    await homePage.openRegister();
    await expect(registerPage.firstNameInput).toBeVisible();
    await expect(registerPage.registerButton).toBeEnabled();

    await registerPage.register(user.firstName, user.lastName, user.email, user.password);

    await expect(navBar.profileMenu).toBeVisible();
    await expect(page.getByText(`${user.firstName} ${user.lastName}`)).toBeVisible();

    await navBar.signOut();
    await expect(homePage.signInLink).toBeVisible();

    await homePage.openSignIn();
    await expect(loginPage.emailInput).toBeVisible();
    await loginPage.login(user.email, user.password);

    await expect(navBar.profileMenu).toBeVisible();
    await expect(page.getByText(`${user.firstName} ${user.lastName}`)).toBeVisible();
  });

  test('@smoke TC-UI-03 Product detail page loads from home', async ({ page, homePage }) => {
    await homePage.goto('/');
    await homePage.productCards.first().click();
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });
});

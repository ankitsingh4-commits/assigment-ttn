const { test, expect } = require('../../fixtures/uiFixtures');
const { AuthApi } = require('../../api/AuthApi');
const { uniqueRegisterUser } = require('../../utils/dataGenerator');

test.describe('UI Smoke', () => {
  test('@smoke TC-UI-01 Homepage displays product catalog', async ({ homePage }) => {
    await homePage.goto('/');
    await expect(homePage.productCards.first()).toBeVisible();
  });

  test('@smoke TC-UI-02 User can register with valid credentials', async ({
    page,
    homePage,
    registerPage,
    loginPage,
  }) => {
    const user = uniqueRegisterUser();

    await homePage.goto('/');
    await homePage.openRegister();
    await expect(registerPage.firstNameInput).toBeVisible();
    await expect(registerPage.registerButton).toBeEnabled();

    await registerPage.register(user);

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
  });

  test('@smoke TC-UI-03 User can login with valid credentials', async ({
    page,
    request,
    homePage,
    loginPage,
    navBar,
  }) => {
    const user = uniqueRegisterUser();
    const authApi = new AuthApi(request);
    const { response } = await authApi.register(user.email, user.password, {
      first_name: user.firstName,
      last_name: user.lastName,
    });
    expect(response.status()).toBe(201);

    await homePage.goto('/');
    await homePage.openSignIn();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.submitButton).toBeEnabled();

    await loginPage.login(user.email, user.password);

    await expect(navBar.profileMenu).toBeVisible();
    await expect(page.getByText(`${user.firstName} ${user.lastName}`)).toBeVisible();
  });

  test('@smoke TC-UI-04 Product detail page loads from home', async ({ page, homePage }) => {
    await homePage.goto('/');
    await homePage.productCards.first().click();
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });
});

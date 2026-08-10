import { test, expect } from '../../fixtures/uiFixtures';
import { DEFAULT_USER } from '../../utils/env';

test.describe('UI Smoke', () => {
  test('@smoke TC-UI-01 Homepage displays product catalog', async ({ homePage }) => {
    await homePage.goto('/');
    await expect(homePage.productCards.first()).toBeVisible();
  });

  test('@smoke TC-UI-02 User can login with valid credentials', async ({
    page,
    homePage,
    loginPage,
    navBar,
  }) => {
    await homePage.goto('/');
    await homePage.openSignIn();
    await loginPage.login(DEFAULT_USER.email, DEFAULT_USER.password);
    await expect(navBar.profileMenu).toBeVisible();
    await expect(page.locator('[data-test="nav-profile"]')).toBeVisible();
  });

  test('@smoke TC-UI-03 Product detail page loads from home', async ({ page, homePage }) => {
    await homePage.goto('/');
    await homePage.productCards.first().click();
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
  });
});

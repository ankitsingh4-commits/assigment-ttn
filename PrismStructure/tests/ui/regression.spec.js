const { test, expect } = require('../../fixtures/uiFixtures');
const { getDefaultUser, getTestData } = require('../../utils/env');

test.describe('UI Regression', () => {
  test('@regression TC-UI-06 Invalid login shows error and keeps user signed out', async ({
    homePage,
    loginPage,
    navBar,
  }) => {
    const user = getDefaultUser();
    const { invalidCredentials } = getTestData();

    await homePage.goto('/');
    await homePage.openSignIn();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.submitButton).toBeEnabled();

    await loginPage.login(user.email, invalidCredentials.wrongPassword);

    await expect(loginPage.errorAlert).toBeVisible();
    await expect(loginPage.errorAlert).toContainText(/invalid|incorrect|wrong|credentials/i);
    await expect(navBar.profileMenu).not.toBeVisible();
    await expect(homePage.signInLink).toBeVisible();
  });

  test('@regression TC-UI-07 Profile shows registered user details', async ({
    page,
    homePage,
    loginPage,
    navBar,
    profilePage,
  }) => {
    const user = getDefaultUser();
    await homePage.goto('/');
    await homePage.openSignIn();
    await loginPage.login(user.email, user.password);
    await expect(navBar.profileMenu).toBeVisible();
    await navBar.openMyProfile();
    await expect(profilePage.firstName).toHaveValue('Jack', { timeout: 15000 });
    await expect(profilePage.lastName).toHaveValue('Howe');
  });
});

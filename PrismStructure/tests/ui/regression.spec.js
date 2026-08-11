const { test, expect } = require('../../fixtures/uiFixtures');
const { getDefaultUser, getTestData } = require('../../utils/env');

test.describe('UI Regression', () => {
  test('@regression TC-UI-05 End-to-end COD purchase and invoice', async ({
    page,
    homePage,
    loginPage,
    productPage,
    cartPage,
    checkoutPage,
    navBar,
  }) => {
    test.setTimeout(90000);
    const user = getDefaultUser();
    const { billingAddress } = getTestData();

    await homePage.goto('/');
    await homePage.openSignIn();
    await loginPage.login(user.email, user.password);
    await expect(navBar.profileMenu).toBeVisible();

    await homePage.goto('/');
    await expect(homePage.productCards.first()).toBeVisible();
    await homePage.productCards.first().click();
    await productPage.addToCart(2);
    await expect(page.getByText(/added to (shopping )?cart/i)).toBeVisible();

    await navBar.openCart();
    await expect(cartPage.lineItems.first()).toBeVisible();
    await cartPage.proceedToCheckout();
    await checkoutPage.continueCheckoutWizard();

    await checkoutPage.fillBillingAddress(billingAddress);
    await checkoutPage.selectCashOnDelivery();
    await checkoutPage.confirmPaymentTwice();

    await expect(checkoutPage.orderComplete).toBeVisible();

    await navBar.openMyInvoices();
    await expect(page.locator('[data-test="invoice-number"]').first()).toBeVisible();
  });

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

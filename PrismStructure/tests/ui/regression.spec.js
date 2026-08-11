const { test, expect } = require('../../fixtures/uiFixtures');
const { getDefaultUser, getTestData } = require('../../utils/env');

test.describe('UI Regression', () => {
  test('@regression TC-UI-05 Invalid login shows error and keeps user signed out', async ({
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

  test('@regression TC-UI-06 Profile shows registered user details', async ({
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

  test('@regression TC-UI-07 Search with no matches shows empty results', async ({
    homePage,
  }) => {
    const { search } = getTestData();

    await homePage.goto('/');
    await homePage.searchProducts(search.noMatchTerm);

    await expect(homePage.productCards).toHaveCount(0);
    await expect(homePage.emptySearchResults).toBeVisible();
  });

  test('@regression TC-UI-08 Single checkout confirm does not complete order', async ({
    homePage,
    loginPage,
    productPage,
    cartPage,
    checkoutPage,
    navBar,
    invoicePage,
  }) => {
    test.setTimeout(90000);
    const user = getDefaultUser();
    const { billingAddress } = getTestData();

    await homePage.goto('/');
    await homePage.openSignIn();
    await loginPage.login(user.email, user.password);
    await expect(navBar.profileMenu).toBeVisible();

    await navBar.openMyInvoices();
    const invoicesBeforeCheckout = await invoicePage.countInvoices();

    await homePage.goto('/');
    await homePage.productCards.first().click();
    await productPage.addToCart(1);

    await navBar.openCart();
    await expect(cartPage.lineItems.first()).toBeVisible();
    await cartPage.proceedToCheckout();
    await checkoutPage.continueCheckoutWizard();
    await checkoutPage.advanceFromSignInStep();
    await checkoutPage.fillBillingAddress(billingAddress);
    await checkoutPage.selectCashOnDelivery();
    await checkoutPage.confirmPaymentOnce();

    await expect(checkoutPage.orderComplete).not.toBeVisible();

    await navBar.openMyInvoices();
    const invoicesAfterCheckout = await invoicePage.countInvoices();
    expect(invoicesAfterCheckout).toBe(invoicesBeforeCheckout);
  });
});

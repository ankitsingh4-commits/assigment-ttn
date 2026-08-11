const { test, expect } = require('../../fixtures/uiFixtures');
const { getDefaultUser, getTestData } = require('../../utils/env');
const { uniqueEmail } = require('../../utils/dataGenerator');

test.describe('UI Regression', () => {
  test('@regression TC-UI-04 User registration with valid details', async ({
    page,
    homePage,
    registerPage,
    navBar,
  }) => {
    const { registerUser } = getTestData();
    const email = uniqueEmail('uireg');
    await homePage.goto('/');
    await homePage.openRegister();
    await registerPage.register(
      registerUser.firstName,
      registerUser.lastName,
      email,
      registerUser.password,
    );
    await expect(navBar.profileMenu).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(`${registerUser.firstName} ${registerUser.lastName}`)).toBeVisible();
  });

  test('@regression TC-UI-05 End-to-end COD purchase and invoice', async ({
    page,
    homePage,
    loginPage,
    productPage,
    cartPage,
    checkoutPage,
    navBar,
  }) => {
    const user = getDefaultUser();
    const { billingAddress } = getTestData();

    await homePage.goto('/');
    await homePage.openSignIn();
    await loginPage.login(user.email, user.password);
    await expect(navBar.profileMenu).toBeVisible();

    await homePage.productCards.first().click();
    await productPage.addToCart(2);
    await expect(page.getByText('Product added to shopping cart')).toBeVisible();

    await navBar.openCart();
    await expect(cartPage.lineItems.first()).toBeVisible();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillBillingAddress(billingAddress);
    await checkoutPage.selectCashOnDelivery();
    await checkoutPage.confirmPaymentTwice();

    await expect(checkoutPage.orderComplete).toBeVisible({ timeout: 20000 });

    await navBar.openMyInvoices();
    await expect(page.locator('[data-test="invoice-number"]').first()).toBeVisible();
  });

  test('@regression TC-UI-06 Login fails with invalid password', async ({
    homePage,
    loginPage,
  }) => {
    const user = getDefaultUser();
    const { invalidCredentials } = getTestData();
    await homePage.goto('/');
    await homePage.openSignIn();
    await loginPage.login(user.email, invalidCredentials.wrongPassword);
    await expect(loginPage.errorAlert).toBeVisible();
  });

  test('@regression TC-UI-07 Profile shows registered user details', async ({
    homePage,
    loginPage,
    navBar,
    profilePage,
  }) => {
    const user = getDefaultUser();
    await homePage.goto('/');
    await homePage.openSignIn();
    await loginPage.login(user.email, user.password);
    await navBar.openMyProfile();
    await expect(profilePage.email).toHaveValue(user.email);
    await expect(profilePage.firstName).not.toBeEmpty();
  });
});

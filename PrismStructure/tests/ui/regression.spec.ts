import { test, expect } from '../../fixtures/uiFixtures';
import { DEFAULT_USER } from '../../utils/env';
import { uniqueEmail } from '../../utils/dataGenerator';

test.describe('UI Regression', () => {
  test('@regression TC-UI-04 User registration with valid details', async ({
    page,
    homePage,
    registerPage,
    navBar,
  }) => {
    const email = uniqueEmail('uireg');
    await homePage.goto('/');
    await homePage.openRegister();
    await registerPage.register('Auto', 'Tester', email, 'Welcome01!');
    await expect(navBar.profileMenu).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Auto Tester')).toBeVisible();
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
    await homePage.goto('/');
    await homePage.openSignIn();
    await loginPage.login(DEFAULT_USER.email, DEFAULT_USER.password);
    await expect(navBar.profileMenu).toBeVisible();

    await homePage.productCards.first().click();
    await productPage.addToCart(2);
    await expect(page.getByText('Product added to shopping cart')).toBeVisible();

    await navBar.openCart();
    await expect(cartPage.lineItems.first()).toBeVisible();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillBillingAddress({
      street: 'Zoey Shore',
      city: 'Hesselbury',
      state: 'Florida',
      country: 'United States',
      postalCode: '1234AA',
    });

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
    await homePage.goto('/');
    await homePage.openSignIn();
    await loginPage.login(DEFAULT_USER.email, 'wrong-password-123');
    await expect(loginPage.errorAlert).toBeVisible();
  });

  test('@regression TC-UI-07 Profile shows registered user details', async ({
    page,
    homePage,
    loginPage,
    navBar,
    profilePage,
  }) => {
    await homePage.goto('/');
    await homePage.openSignIn();
    await loginPage.login(DEFAULT_USER.email, DEFAULT_USER.password);
    await navBar.openMyProfile();
    await expect(profilePage.email).toHaveValue(DEFAULT_USER.email);
    await expect(profilePage.firstName).not.toBeEmpty();
  });
});

const { test, expect } = require('../../fixtures/uiFixtures');
const { AuthApi } = require('../../api/AuthApi');
const { uniqueRegisterUser } = require('../../utils/dataGenerator');
const { getDefaultUser, getTestData } = require('../../utils/env');
const { parsePrice } = require('../../utils/price');

test.describe('UI Smoke', () => {
  test('@smoke TC-UI-01 Homepage displays product catalog', async ({ homePage }) => {
    await homePage.goto('/');
    await expect(homePage.productCards.first()).toBeVisible({ timeout: 15000 });
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

  test('@smoke TC-UI-04 End-to-end purchase with cart, COD checkout, and invoice', async ({
    page,
    request,
    homePage,
    loginPage,
    productPage,
    cartPage,
    checkoutPage,
    navBar,
    invoicePage,
  }) => {
    test.setTimeout(120000);
    const user = uniqueRegisterUser();
    const authApi = new AuthApi(request);
    const { response } = await authApi.register(user.email, user.password, {
      first_name: user.firstName,
      last_name: user.lastName,
    });
    expect(response.status()).toBe(201);

    const { billingAddress, search } = getTestData();
    const updatedQuantity = 3;

    await homePage.goto('/');
    await homePage.openSignIn();
    await loginPage.login(user.email, user.password);
    await expect(navBar.profileMenu).toBeVisible();

    await navBar.openMyInvoices();
    const invoicesBeforeCheckout = await invoicePage.countInvoices();

    await homePage.goto('/');
    await homePage.searchProducts(search.uiProductTerm);
    await expect(homePage.productCards.filter({ hasText: /Claw Hammer/i }).first()).toBeVisible();
    await homePage.openProductByName(/Claw Hammer/i);
    await expect(productPage.addToCartButton).toBeVisible();
    await productPage.addToCart(2);
    await expect(page.getByRole('alert', { name: /added to.*shopping cart/i })).toBeVisible();

    await homePage.goto('/');
    await homePage.searchProducts(search.existingProduct);
    await expect(homePage.productCards.filter({ hasText: search.existingProduct }).first()).toBeVisible();
    await homePage.openProductByName(search.existingProduct);
    await productPage.addToCart(1);
    await expect(page.getByRole('alert', { name: /added to.*shopping cart/i })).toBeVisible();

    await navBar.openCart();
    await expect(cartPage.lineItems.first()).toBeVisible();
    await expect(cartPage.lineItems).toHaveCount(2);
    await cartPage.updateLineItemQuantity(0, updatedQuantity);
    await expect(page.getByRole('alert', { name: /quantity updated/i })).toBeVisible();
    await expect(cartPage.lineItemQuantities.nth(0)).toHaveValue(String(updatedQuantity));

    const firstUnitPrice = parsePrice(await cartPage.getLineItemUnitPrice(0));
    const secondUnitPrice = parsePrice(await cartPage.getLineItemUnitPrice(1));
    const firstLineTotal = parsePrice(await cartPage.getLineItemTotal(0));
    const secondLineTotal = parsePrice(await cartPage.getLineItemTotal(1));

    expect(firstLineTotal).toBeCloseTo(firstUnitPrice * updatedQuantity, 2);
    expect(secondLineTotal).toBeCloseTo(secondUnitPrice * 1, 2);

    const cartTotalText = await cartPage.getCartTotalText();
    if (cartTotalText) {
      const cartTotal = parsePrice(cartTotalText);
      expect(cartTotal).toBeCloseTo(firstLineTotal + secondLineTotal, 2);
    }

    await cartPage.proceedToCheckout();
    await checkoutPage.continueCheckoutWizard();
    await checkoutPage.advanceFromSignInStep();
    await checkoutPage.fillBillingAddress(billingAddress);
    await checkoutPage.selectCashOnDelivery();
    await checkoutPage.confirmPaymentTwice();

    await navBar.openMyInvoices();
    await expect(invoicePage.invoiceNumbers.first()).toBeVisible({ timeout: 15000 });
    const invoicesAfterCheckout = await invoicePage.countInvoices();
    expect(invoicesAfterCheckout).toBeGreaterThan(invoicesBeforeCheckout);
    await expect(invoicePage.invoiceNumbers.first()).not.toBeEmpty();
  });
});

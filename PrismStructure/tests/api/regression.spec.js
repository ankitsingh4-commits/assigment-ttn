const { test, expect } = require('@playwright/test');
const { ToolshopFlow } = require('../../api/ToolshopFlow');
const { ProductApi } = require('../../api/ProductApi');
const { getTestData } = require('../../utils/env');
const { invoicePayload } = require('../../utils/dataGenerator');
const {
  invalidResourceId,
  expectTokenResponse,
  expectCartItemAdded,
  expectCartContainsProducts,
  expectCodInvoiceCreated,
  expectCodInvoiceDetails,
  expectPaginatedProducts,
  expectUnauthorized,
  expectNotFound,
  expectValidationErrors,
} = require('../../utils/apiAssertions');

test.describe('API Regression', () => {
  test('@regression TC-API-04 Full auth cart and invoice lifecycle', async ({ request }) => {
    const flow = new ToolshopFlow(request);

    const { response: registerResponse, email, password, payload } =
      await flow.registerUniqueUser();
    expect(registerResponse.status()).toBe(201);

    const { response: loginResponse, body: loginBody } = await flow.login(email, password);
    expect(loginResponse.status()).toBe(200);
    expectTokenResponse(loginBody);
    const token = loginBody.access_token;

    const productsResponse = await flow.listProducts();
    expect(productsResponse.status()).toBe(200);
    const productsBody = await productsResponse.json();
    expectPaginatedProducts(productsBody);

    const selectedProducts = await flow.selectProducts(2);
    expect(selectedProducts.length).toBe(2);

    const cartCreateResponse = await flow.createCart(token);
    expect(cartCreateResponse.status()).toBe(201);
    const cart = await cartCreateResponse.json();
    expect(cart.id).toEqual(expect.any(String));

    const cartSelections = [
      { productId: selectedProducts[0].id, quantity: 2 },
      { productId: selectedProducts[1].id, quantity: 1 },
    ];

    for (const selection of cartSelections) {
      const addResponse = await flow.addProductToCart(
        cart.id,
        selection.productId,
        selection.quantity,
        token,
      );
      expect(addResponse.status()).toBe(200);
      const addBody = await addResponse.json();
      expectCartItemAdded(addBody);
    }

    const cartGetResponse = await flow.getCart(cart.id, token);
    expect(cartGetResponse.status()).toBe(200);
    const cartBody = await cartGetResponse.json();
    expectCartContainsProducts(cartBody, cart.id, cartSelections);

    const { response: invoiceResponse, payload: invoiceRequest } =
      await flow.createCodInvoice(cart.id, token);
    expect([200, 201]).toContain(invoiceResponse.status());

    const createdInvoice = await invoiceResponse.json();
    expectCodInvoiceCreated(createdInvoice, invoiceRequest);

    const invoiceGetResponse = await flow.getInvoice(createdInvoice.id, token);
    expect(invoiceGetResponse.status()).toBe(200);
    const invoiceDetails = await invoiceGetResponse.json();
    expectCodInvoiceDetails(invoiceDetails, invoiceRequest, cartSelections.length);
    expect(invoiceRequest.payment_method).toBe('cash-on-delivery');
    expect(invoiceRequest.payment_details).toEqual({});
    expect(payload.email).toBe(email);
    expect(payload.password).toBe(password);
  });

  test('@regression TC-API-05 Invalid login is rejected with unauthorized response', async ({
    request,
  }) => {
    const flow = new ToolshopFlow(request);
    const { invalidCredentials } = getTestData();

    const { email, password } = await flow.registerUniqueUser();
    const { response: validLogin } = await flow.login(email, password);
    expect(validLogin.status()).toBe(200);

    const { response: invalidLogin, body: errorBody } = await flow.login(
      email,
      invalidCredentials.wrongPassword,
    );
    expectUnauthorized(invalidLogin, errorBody);
  });

  test('@regression TC-API-06 Invoice creation rejects missing and invalid bearer tokens', async ({
    request,
  }) => {
    const flow = new ToolshopFlow(request);

    const { email, password } = await flow.registerUniqueUser();
    const { body: loginBody } = await flow.login(email, password);
    const token = loginBody.access_token;

    const cartResponse = await flow.createCart(token);
    const cart = await cartResponse.json();
    const payload = invoicePayload(cart.id);

    const missingTokenResponse = await flow.createInvoiceWithPayload(payload);
    const missingTokenBody = await missingTokenResponse.json();
    expectUnauthorized(missingTokenResponse, missingTokenBody);

    const invalidTokenResponse = await flow.createInvoiceWithPayload(
      payload,
      'invalid-bearer-token',
    );
    const invalidTokenBody = await invalidTokenResponse.json();
    expectUnauthorized(invalidTokenResponse, invalidTokenBody);
  });

  test('@regression TC-API-07 Invalid cart and product IDs return not found', async ({
    request,
  }) => {
    const flow = new ToolshopFlow(request);
    const productApi = new ProductApi(request);
    const invalidId = invalidResourceId();

    const { email, password } = await flow.registerUniqueUser();
    const { body: loginBody } = await flow.login(email, password);
    const token = loginBody.access_token;

    const productsBody = await (await flow.listProducts()).json();
    const validProductId = productsBody.data[0].id;

    const invalidCartResponse = await flow.getCart(invalidId, token);
    const invalidCartBody = await invalidCartResponse.json();
    expectNotFound(invalidCartResponse, invalidCartBody);

    const invalidProductResponse = await productApi.getProduct(invalidId);
    const invalidProductBody = await invalidProductResponse.json();
    expectNotFound(invalidProductResponse, invalidProductBody);

    const addToInvalidCartResponse = await flow.addProductToCart(
      invalidId,
      validProductId,
      1,
      token,
    );
    const addToInvalidCartBody = await addToInvalidCartResponse.json();
    expectNotFound(addToInvalidCartResponse, addToInvalidCartBody);
    expect(addToInvalidCartBody.message).toMatch(/cart not found/i);

    const validCart = await (await flow.createCart(token)).json();
    const addInvalidProductResponse = await flow.addProductToCart(
      validCart.id,
      invalidId,
      1,
      token,
    );
    const addInvalidProductBody = await addInvalidProductResponse.json();
    expectNotFound(addInvalidProductResponse, addInvalidProductBody);
  });

  test('@regression TC-API-08 Invoice with missing required fields returns validation errors', async ({
    request,
  }) => {
    const flow = new ToolshopFlow(request);

    const { email, password } = await flow.registerUniqueUser();
    const { body: loginBody } = await flow.login(email, password);
    const token = loginBody.access_token;

    const incompletePayload = {
      payment_method: 'cash-on-delivery',
      payment_details: {},
    };

    const response = await flow.createInvoiceWithPayload(incompletePayload, token);
    const body = await response.json();
    expectValidationErrors(response, body, [
      'billing_street',
      'billing_city',
      'billing_country',
      'cart_id',
    ]);
    expect(body.id).toBeUndefined();
    expect(body.invoice_number).toBeUndefined();
  });
});

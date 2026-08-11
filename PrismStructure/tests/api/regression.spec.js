const { test, expect } = require('@playwright/test');
const { ToolshopFlow } = require('../../api/ToolshopFlow');
const { ProductApi } = require('../../api/ProductApi');
const { getTestData } = require('../../utils/env');
const {
  expectUserResponse,
  expectTokenResponse,
  expectCartItemAdded,
  expectCartContainsProducts,
  expectCodInvoiceCreated,
  expectCodInvoiceDetails,
  expectPaginatedProducts,
} = require('../../utils/apiAssertions');

test.describe('API Regression', () => {
  test('@regression TC-API-04 Register new user via API', async ({ request }) => {
    const flow = new ToolshopFlow(request);
    const { response, payload } = await flow.registerUniqueUser();

    expect(response.status()).toBe(201);
    const body = await response.json();
    expectUserResponse(body, payload);
  });

  test('@regression TC-API-05 Full auth cart and invoice lifecycle', async ({ request }) => {
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

  test('@regression TC-API-06 Login with wrong password is rejected', async ({ request }) => {
    const flow = new ToolshopFlow(request);
    const { invalidCredentials } = getTestData();

    const { email, password } = await flow.registerUniqueUser();
    const { response: validLogin } = await flow.login(email, password);
    expect(validLogin.status()).toBe(200);

    const { response: invalidLogin } = await flow.login(
      email,
      invalidCredentials.wrongPassword,
    );
    expect(invalidLogin.status()).toBe(401);

    const errorBody = await invalidLogin.json();
    expect(errorBody.access_token).toBeUndefined();
  });

  test('@regression TC-API-07 Product search returns matching results', async ({ request }) => {
    const { search } = getTestData();
    const productApi = new ProductApi(request);
    const response = await productApi.search(search.existingProduct);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expectPaginatedProducts(body);

    const match = body.data.find((product) =>
      product.name.toLowerCase().includes(search.existingProduct.toLowerCase()),
    );
    expect(match).toBeTruthy();
  });
});

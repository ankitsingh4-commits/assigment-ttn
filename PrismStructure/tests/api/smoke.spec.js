const { test, expect } = require('@playwright/test');
const { ToolshopFlow } = require('../../api/ToolshopFlow');
const {
  expectPaginatedProducts,
  expectTokenResponse,
  expectCartCreated,
} = require('../../utils/apiAssertions');

test.describe('API Smoke', () => {
  test('@smoke TC-API-01 List products returns paginated catalog', async ({ request }) => {
    const flow = new ToolshopFlow(request);
    const response = await flow.listProducts();

    expect(response.status()).toBe(200);
    const body = await response.json();
    expectPaginatedProducts(body);
  });

  test('@smoke TC-API-02 Register and login returns bearer token', async ({ request }) => {
    const flow = new ToolshopFlow(request);

    const { response: registerResponse, email, password, payload } =
      await flow.registerUniqueUser();
    expect(registerResponse.status()).toBe(201);

    const { response: loginResponse, body: loginBody } = await flow.login(email, password);
    expect(loginResponse.status()).toBe(200);
    expectTokenResponse(loginBody);

    expect(payload.email).toBe(email);
    expect(payload.password).toBe(password);
  });

  test('@smoke TC-API-03 Authenticated user can create a cart', async ({ request }) => {
    const flow = new ToolshopFlow(request);

    const { email, password } = await flow.registerUniqueUser();
    const { body: loginBody } = await flow.login(email, password);
    const token = loginBody.access_token;

    const cartResponse = await flow.createCart(token);
    expect(cartResponse.status()).toBe(201);

    const cartBody = await cartResponse.json();
    expectCartCreated(cartBody);
  });
});

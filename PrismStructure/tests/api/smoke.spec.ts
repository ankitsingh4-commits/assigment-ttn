import { test, expect } from '@playwright/test';
import { ProductApi } from '../../api/ProductApi';
import { AuthApi } from '../../api/AuthApi';
import { CartApi } from '../../api/CartApi';
import { DEFAULT_USER } from '../../utils/env';

test.describe('API Smoke', () => {
  test('@smoke TC-API-01 List products returns success', async ({ request }) => {
    const productApi = new ProductApi(request);
    const response = await productApi.listProducts();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data?.length ?? body.length).toBeGreaterThan(0);
  });

  test('@smoke TC-API-02 Login returns access token', async ({ request }) => {
    const authApi = new AuthApi(request);
    const { response, body } = await authApi.login(DEFAULT_USER.email, DEFAULT_USER.password);
    expect(response.status()).toBe(200);
    expect(body.access_token).toBeTruthy();
  });

  test('@smoke TC-API-03 Create cart returns cart id', async ({ request }) => {
    const authApi = new AuthApi(request);
    const { body: loginBody } = await authApi.login(DEFAULT_USER.email, DEFAULT_USER.password);
    const cartApi = new CartApi(request);
    const response = await cartApi.createCart(loginBody.access_token);
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeTruthy();
  });
});

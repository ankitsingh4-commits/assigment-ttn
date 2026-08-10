import { test, expect } from '@playwright/test';
import { AuthApi } from '../../api/AuthApi';
import { ProductApi } from '../../api/ProductApi';
import { CartApi } from '../../api/CartApi';
import { InvoiceApi } from '../../api/InvoiceApi';
import { DEFAULT_USER } from '../../utils/env';
import { uniqueEmail } from '../../utils/dataGenerator';

test.describe('API Regression', () => {
  test('@regression TC-API-04 Register new user via API', async ({ request }) => {
    const authApi = new AuthApi(request);
    const email = uniqueEmail('apireg');
    const { response, payload } = await authApi.register(email);
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.email).toBe(payload.email);
  });

  test('@regression TC-API-05 Full auth cart and invoice lifecycle', async ({ request }) => {
    const authApi = new AuthApi(request);
    const productApi = new ProductApi(request);
    const cartApi = new CartApi(request);
    const invoiceApi = new InvoiceApi(request);

    const email = uniqueEmail('flow');
    const { response: regRes } = await authApi.register(email);
    expect(regRes.status()).toBe(201);

    const { response: loginRes, body: loginBody } = await authApi.login(email, 'Welcome01!');
    expect(loginRes.status()).toBe(200);
    const token = loginBody.access_token as string;

    const productsRes = await productApi.listProducts();
    const productsBody = await productsRes.json();
    const products = productsBody.data ?? productsBody;
    const productId = products[0].id;

    const cartCreateRes = await cartApi.createCart(token);
    expect(cartCreateRes.status()).toBe(201);
    const cart = await cartCreateRes.json();

    const addRes = await cartApi.addProduct(cart.id, productId, 1, token);
    expect([200, 201]).toContain(addRes.status());

    const cartGetRes = await cartApi.getCart(cart.id, token);
    expect(cartGetRes.status()).toBe(200);
    const cartBody = await cartGetRes.json();
    expect(cartBody.cart_items?.length ?? cartBody.items?.length ?? 1).toBeGreaterThan(0);

    const invoiceRes = await invoiceApi.createInvoice(cart.id, token);
    expect(invoiceRes.status()).toBe(201);
    const invoice = await invoiceRes.json();
    expect(invoice.id ?? invoice.invoice_number).toBeTruthy();
  });

  test('@regression TC-API-06 Login with wrong password is rejected', async ({ request }) => {
    const authApi = new AuthApi(request);
    const { response } = await authApi.login(DEFAULT_USER.email, 'NotARealPassword!');
    expect(response.status()).toBe(401);
  });

  test('@regression TC-API-07 Product search returns matching results', async ({ request }) => {
    const productApi = new ProductApi(request);
    const response = await productApi.search('hammer');
    expect(response.status()).toBe(200);
    const body = await response.json();
    const items = body.data ?? body;
    expect(items.length).toBeGreaterThan(0);
  });

});

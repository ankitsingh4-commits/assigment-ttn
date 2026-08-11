const { expect } = require('@playwright/test');

function expectPaginatedProducts(body) {
  expect(body).toMatchObject({
    current_page: expect.any(Number),
    data: expect.any(Array),
    total: expect.any(Number),
  });
  expect(body.data.length).toBeGreaterThan(0);

  const product = body.data[0];
  expect(product).toMatchObject({
    id: expect.any(String),
    name: expect.any(String),
    price: expect.any(Number),
  });
}

function expectTokenResponse(body) {
  expect(body).toMatchObject({
    access_token: expect.any(String),
    expires_in: expect.any(Number),
  });
  expect(body.access_token.length).toBeGreaterThan(0);
  expect(String(body.token_type).toLowerCase()).toBe('bearer');
}

function expectUserResponse(body, expected) {
  expect(body).toMatchObject({
    id: expect.any(String),
    email: expected.email,
    first_name: expected.first_name,
    last_name: expected.last_name,
  });
}

function expectCartCreated(body) {
  expect(body).toMatchObject({
    id: expect.any(String),
  });
}

function expectCartItemAdded(body) {
  expect(body).toMatchObject({
    result: expect.stringMatching(/item added|updated/i),
  });
}

function getCartLineItems(cartBody) {
  return cartBody.cart_items ?? cartBody.items ?? cartBody.cartItems ?? [];
}

function expectCartContainsProducts(cartBody, cartId, expectedItems) {
  expect(cartBody.id).toBe(cartId);

  const lineItems = getCartLineItems(cartBody);
  expect(lineItems.length).toBe(expectedItems.length);

  expectedItems.forEach((expectedItem) => {
    const line = lineItems.find(
      (item) =>
        item.product_id === expectedItem.productId ||
        item.product?.id === expectedItem.productId,
    );
    expect(line).toBeTruthy();
    const quantity = line.quantity ?? line.qty;
    expect(quantity).toBe(expectedItem.quantity);
  });
}

function expectCodInvoiceCreated(body, invoiceRequest) {
  expect(body).toMatchObject({
    id: expect.any(String),
    invoice_number: expect.any(String),
    billing_street: invoiceRequest.billing_street,
    billing_city: invoiceRequest.billing_city,
    billing_state: invoiceRequest.billing_state,
    billing_country: invoiceRequest.billing_country,
    billing_postal_code: invoiceRequest.billing_postal_code,
    subtotal: expect.any(Number),
    total: expect.any(Number),
  });
  expect(body.invoice_number).toMatch(/^INV-/);
  expect(body.total).toBeGreaterThan(0);
}

function expectCodInvoiceDetails(body, invoiceRequest, expectedLineCount) {
  expectCodInvoiceCreated(body, invoiceRequest);

  if (body.status !== undefined) {
    expect(body.status).toEqual(expect.any(String));
  }

  const invoiceLines = body.invoicelines ?? body.invoice_lines ?? [];
  expect(invoiceLines.length).toBe(expectedLineCount);

  invoiceLines.forEach((line) => {
    expect(line).toMatchObject({
      id: expect.any(String),
      product_id: expect.any(String),
      quantity: expect.any(Number),
      unit_price: expect.any(Number),
    });
  });
}

function invalidResourceId() {
  return '01INVALID00000000000000000000';
}

function expectUnauthorized(response, body) {
  expect(response.status()).toBe(401);
  const errorText = body.message ?? body.error;
  expect(errorText).toEqual(expect.any(String));
  expect(body.access_token).toBeUndefined();
}

function expectNotFound(response, body) {
  expect(response.status()).toBe(404);
  expect(body.message).toEqual(expect.any(String));
}

function expectValidationErrors(response, body, fields) {
  expect(response.status()).toBe(422);
  fields.forEach((field) => {
    expect(body[field]).toEqual(expect.any(Array));
    expect(body[field].length).toBeGreaterThan(0);
  });
}

module.exports = {
  invalidResourceId,
  expectPaginatedProducts,
  expectTokenResponse,
  expectUserResponse,
  expectCartCreated,
  expectCartItemAdded,
  getCartLineItems,
  expectCartContainsProducts,
  expectCodInvoiceCreated,
  expectCodInvoiceDetails,
  expectUnauthorized,
  expectNotFound,
  expectValidationErrors,
};

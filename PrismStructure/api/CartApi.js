const { ApiClient } = require('./ApiClient');

class CartApi {
  constructor(request) {
    this.client = new ApiClient(request);
  }

  async createCart(token) {
    return this.client.post('/carts', {}, token);
  }

  async getCart(cartId, token) {
    return this.client.get(`/carts/${cartId}`, token);
  }

  async addProduct(cartId, productId, quantity = 1, token) {
    const payload = { product_id: productId, quantity };

    const primary = await this.client.post(`/carts/${cartId}`, payload, token);
    if ([200, 201].includes(primary.status())) {
      return primary;
    }

    const alternate = await this.client.post('/carts', payload, token);
    if ([200, 201].includes(alternate.status())) {
      return alternate;
    }

    const items = await this.client.post(`/carts/${cartId}/items`, payload, token);
    if ([200, 201].includes(items.status())) {
      return items;
    }

    return this.client.post(`/carts/${cartId}/products`, payload, token);
  }
}

module.exports = { CartApi };

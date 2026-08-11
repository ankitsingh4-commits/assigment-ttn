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

  async addProduct(cartId, productId, quantity, token) {
    const payload = { product_id: productId, quantity };
    const primary = await this.client.post(`/carts/${cartId}/items`, payload, token);
    if ([200, 201].includes(primary.status())) {
      return primary;
    }
    return this.client.post(`/carts/${cartId}/products`, payload, token);
  }
}

module.exports = { CartApi };

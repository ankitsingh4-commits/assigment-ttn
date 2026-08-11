const { ApiClient } = require('./ApiClient');

class CartApi {
  constructor(request) {
    this.client = new ApiClient(request);
  }

  async createCart(token) {
    return this.client.post('/carts', undefined, token);
  }

  async getCart(cartId, token) {
    return this.client.get(`/carts/${cartId}`, token);
  }

  async addProduct(cartId, productId, quantity = 1, token) {
    return this.client.post(
      `/carts/${cartId}`,
      { product_id: productId, quantity },
      token,
    );
  }

  async updateQuantity(cartId, productId, quantity, token) {
    return this.client.put(
      `/carts/${cartId}/product/quantity`,
      { product_id: productId, quantity },
      token,
    );
  }
}

module.exports = { CartApi };

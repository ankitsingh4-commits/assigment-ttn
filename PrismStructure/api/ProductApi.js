const { ApiClient } = require('./ApiClient');

class ProductApi {
  constructor(request) {
    this.client = new ApiClient(request);
  }

  async listProducts() {
    return this.client.get('/products');
  }

  async getProduct(id) {
    return this.client.get(`/products/${id}`);
  }

  async search(query) {
    return this.client.get(`/products/search?q=${encodeURIComponent(query)}`);
  }
}

module.exports = { ProductApi };

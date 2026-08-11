const { AuthApi } = require('./AuthApi');
const { ProductApi } = require('./ProductApi');
const { CartApi } = require('./CartApi');
const { InvoiceApi } = require('./InvoiceApi');
const { invoicePayload, uniqueEmail, uniquePassword } = require('../utils/dataGenerator');

class ToolshopFlow {
  constructor(request) {
    this.request = request;
    this.authApi = new AuthApi(request);
    this.productApi = new ProductApi(request);
    this.cartApi = new CartApi(request);
    this.invoiceApi = new InvoiceApi(request);
  }

  async registerUniqueUser(overrides = {}) {
    const email = uniqueEmail('api');
    const password = uniquePassword();
    const { response, payload } = await this.authApi.register(email, password, overrides);
    return { response, email, password, payload };
  }

  async login(email, password) {
    return this.authApi.login(email, password);
  }

  async listProducts() {
    return this.productApi.listProducts();
  }

  async selectProducts(count = 2) {
    const response = await this.productApi.listProducts();
    const body = await response.json();
    const products = body.data ?? body;
    return products.slice(0, count).map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
    }));
  }

  async createCart(token) {
    return this.cartApi.createCart(token);
  }

  async addProductToCart(cartId, productId, quantity, token) {
    return this.cartApi.addProduct(cartId, productId, quantity, token);
  }

  async getCart(cartId, token) {
    return this.cartApi.getCart(cartId, token);
  }

  async createCodInvoice(cartId, token) {
    const payload = invoicePayload(cartId);
    const response = await this.invoiceApi.createInvoice(cartId, token);
    return { response, payload };
  }

  async createInvoiceWithPayload(payload, token) {
    return this.invoiceApi.createInvoiceWithPayload(payload, token);
  }

  async getInvoice(invoiceId, token) {
    return this.invoiceApi.getInvoice(invoiceId, token);
  }
}

module.exports = { ToolshopFlow };

import { APIRequestContext } from '@playwright/test';
import { ApiClient } from './ApiClient';

export class ProductApi {
  private client: ApiClient;

  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  async listProducts() {
    return this.client.get('/products');
  }

  async getProduct(id: string) {
    return this.client.get(`/products/${id}`);
  }

  async search(query: string) {
    return this.client.get(`/products/search?q=${encodeURIComponent(query)}`);
  }
}

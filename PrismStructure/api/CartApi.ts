import { APIRequestContext } from '@playwright/test';
import { ApiClient } from './ApiClient';

export class CartApi {
  private client: ApiClient;

  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  async createCart(token?: string) {
    return this.client.post('/carts', {}, token);
  }

  async addProduct(cartId: string, productId: string, quantity = 1, token?: string) {
    const primary = await this.client.post(
      `/carts/${cartId}`,
      { product_id: productId, quantity },
      token,
    );
    if (primary.status() === 200 || primary.status() === 201) {
      return primary;
    }

    const alternate = await this.client.post(
      '/carts',
      { product_id: productId, quantity },
      token,
    );
    if (alternate.status() === 200 || alternate.status() === 201) {
      return alternate;
    }

    return this.client.post(`/carts/${cartId}`, { id: productId, quantity }, token);
  }

  async getCart(cartId: string, token?: string) {
    return this.client.get(`/carts/${cartId}`, token);
  }
}

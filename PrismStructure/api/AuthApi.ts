import { APIRequestContext } from '@playwright/test';
import { ApiClient } from './ApiClient';
import { registerPayload } from '../utils/dataGenerator';

export class AuthApi {
  private client: ApiClient;

  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  async register(email?: string) {
    const payload = registerPayload(email);
    const response = await this.client.post('/users/register', payload);
    return { response, payload };
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/users/login', { email, password });
    const body = await response.json();
    return { response, body };
  }
}

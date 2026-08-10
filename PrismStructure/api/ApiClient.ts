import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../utils/env';

export class ApiClient {
  readonly request: APIRequestContext;
  readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL = API_BASE_URL) {
    this.request = request;
    this.baseURL = baseURL.replace(/\/$/, '');
  }

  private url(path: string) {
    return `${this.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
  }

  async get(path: string, token?: string): Promise<APIResponse> {
    return this.request.get(this.url(path), {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  async post(path: string, data?: unknown, token?: string): Promise<APIResponse> {
    return this.request.post(this.url(path), {
      data,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }
}

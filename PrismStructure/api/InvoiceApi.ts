import { APIRequestContext } from '@playwright/test';
import { ApiClient } from './ApiClient';
import { invoicePayload } from '../utils/dataGenerator';

export class InvoiceApi {
  private client: ApiClient;

  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  async createInvoice(cartId: string, token: string) {
    const payload = invoicePayload(cartId);
    return this.client.post('/invoices', payload, token);
  }

  async getInvoice(invoiceId: string, token: string) {
    return this.client.get(`/invoices/${invoiceId}`, token);
  }

  async searchInvoices(token: string, query = '') {
    const path = query ? `/invoices/search?q=${encodeURIComponent(query)}` : '/invoices/search';
    return this.client.get(path, token);
  }
}

const { ApiClient } = require('./ApiClient');
const { invoicePayload } = require('../utils/dataGenerator');

class InvoiceApi {
  constructor(request) {
    this.client = new ApiClient(request);
  }

  async createInvoice(cartId, token) {
    const payload = invoicePayload(cartId);
    return this.client.post('/invoices', payload, token);
  }

  async createInvoiceWithPayload(payload, token) {
    return this.client.post('/invoices', payload, token);
  }

  async getInvoice(invoiceId, token) {
    return this.client.get(`/invoices/${invoiceId}`, token);
  }

  async searchInvoices(token, query = '') {
    const path = query ? `/invoices/search?q=${encodeURIComponent(query)}` : '/invoices/search';
    return this.client.get(path, token);
  }
}

module.exports = { InvoiceApi };

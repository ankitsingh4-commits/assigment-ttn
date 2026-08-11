class InvoicePage {
  constructor(page) {
    this.page = page;
  }

  get invoiceNumbers() {
    return this.page.getByRole('cell').filter({ hasText: /^INV-/ });
  }

  get invoiceRows() {
    return this.page.getByRole('row').filter({ has: this.page.getByRole('link', { name: 'Details' }) });
  }

  async countInvoices() {
    return this.invoiceNumbers.count();
  }
}

module.exports = { InvoicePage };

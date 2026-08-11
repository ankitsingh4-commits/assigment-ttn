class InvoicePage {
  constructor(page) {
    this.page = page;
  }

  get invoiceNumbers() {
    return this.page.locator('[data-test="invoice-number"]');
  }

  get invoiceRows() {
    return this.page.locator('[data-test="invoice-number"]');
  }

  async countInvoices() {
    return this.invoiceNumbers.count();
  }
}

module.exports = { InvoicePage };

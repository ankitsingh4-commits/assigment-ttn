const { ApiClient } = require('./ApiClient');
const { registerPayload } = require('../utils/dataGenerator');

class AuthApi {
  constructor(request) {
    this.client = new ApiClient(request);
  }

  async login(email, password) {
    const response = await this.client.post('/users/login', { email, password });
    const body = await response.json();
    return { response, body };
  }

  async register(email, password, overrides = {}) {
    const payload = registerPayload(email, password, overrides);
    const response = await this.client.post('/users/register', payload);
    return { response, payload };
  }
}

module.exports = { AuthApi };

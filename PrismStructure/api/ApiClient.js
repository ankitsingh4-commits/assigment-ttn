const { API_BASE_URL } = require('../utils/env');

class ApiClient {
  constructor(request, baseURL = API_BASE_URL) {
    this.request = request;
    this.baseURL = baseURL.replace(/\/$/, '');
  }

  url(path) {
    return `${this.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
  }

  async get(path, token) {
    return this.request.get(this.url(path), {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  async post(path, data, token) {
    return this.request.post(this.url(path), {
      data,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }
}

module.exports = { ApiClient };

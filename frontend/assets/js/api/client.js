const API_BASE_URL = CONFIG.API_BASE_URL;

const client = {
  _buildUrl(endpoint) {
    return `${API_BASE_URL}${endpoint}`;
  },

  async _request(method, endpoint, body = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (body) options.body = JSON.stringify(body);

    const response = await fetch(this._buildUrl(endpoint), options);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Error en la solicitud');
      error.statusCode = response.status;
      error.errorCode  = data.errorCode || null;
      error.errors     = data.errors || null;
      throw error;
    }

    return data;
  },

  get(endpoint) {
    return this._request('GET', endpoint);
  },

  post(endpoint, body) {
    return this._request('POST', endpoint, body);
  },

  put(endpoint, body) {
    return this._request('PUT', endpoint, body);
  },

  delete(endpoint) {
    return this._request('DELETE', endpoint);
  },
};
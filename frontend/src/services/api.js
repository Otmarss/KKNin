const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`📡 API Call: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  },

  // Auth endpoints
  auth: {
    register: (data) => apiClient.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    login: (data) => apiClient.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  // Dashboard endpoints
  dashboard: {
    getStats: () => apiClient.request('/dashboard/stats'),
    getProfile: () => apiClient.request('/dashboard/profile'),
  },
};

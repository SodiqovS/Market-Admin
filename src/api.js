// src/api.js
import axios from 'axios';

const BASE_URL = 'https://api.sodiqdev.cloud';

const ApiService = {
  // Helper function to get the access token from local storage
  getAccessToken: () => localStorage.getItem('access_token'),

  // Helper function to get the refresh token from local storage
  getRefreshToken: () => localStorage.getItem('refresh_token'),

  // Method to refresh the access token if expired
  refreshAccessToken: async () => {
    const refreshToken = ApiService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.get(`${BASE_URL}/refresh`, 
      { headers: 
        { Authorization: `Bearer ${refreshToken}` } }
    );

    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    return access_token;
  },

  // Method to attach Authorization header
  attachToken: (config = {}) => {
    const token = ApiService.getAccessToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },

  // Method to handle login and store tokens
  login: async (code) => {
    const response = await axios.post(`${BASE_URL}/login`, { code });
    const { user, access_token, refresh_token } = response.data;

    if (!user.is_admin) {
      throw new Error('You are not an admin');
    }

    // Store tokens in local storage
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    return response.data;
  },

  // Helper method to handle 401 errors and refresh token
  handleRequest: async (request) => {
    try {
      return await request();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const newAccessToken = await ApiService.refreshAccessToken();
          return await request(newAccessToken);
        } catch (refreshError) {
          if (refreshError.response && refreshError.response.status === 401) {
            // Refresh token is invalid, clear storage and redirect to login
            localStorage.clear();
            window.location.href = '/login';
          }
          throw refreshError;
        }
      }
      throw error;
    }
  },

  getProfile: async () => {
    return ApiService.handleRequest(async () => {
      const config = ApiService.attachToken({});
      const response = await axios.get(`${BASE_URL}/user/profile`, config);
      return response.data;
    });
  },

  // Method to get products with optional query parameters
  getProducts: async (params = {}) => {
    return ApiService.handleRequest(async () => {
      const config = ApiService.attachToken({
        params: {
          ...params,
          categories: params.categories?.length > 0 ? params.categories.join(',') : undefined,
        },
      });
      const response = await axios.get(`${BASE_URL}/products`, config);
      return response.data;
    });
  },

  // Method to get a single product by ID
  getProduct: async (id) => {
    return ApiService.handleRequest(async () => {
      const config = ApiService.attachToken({});
      const response = await axios.get(`${BASE_URL}/products/${id}`, config);
      return response.data;
    });
  },

  // Method to get all categories
  getCategories: async () => {
    return ApiService.handleRequest(async () => {
      const config = ApiService.attachToken({});
      const response = await axios.get(`${BASE_URL}/products/category`, config);
      return response.data;
    });
  },

  // Method to add a new product
  addProduct: async (productData) => {
    return ApiService.handleRequest(async () => {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('quantity', productData.quantity);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category_id', productData.category_id);
      productData.images.forEach(image => formData.append('images', image));

      const config = ApiService.attachToken({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const response = await axios.post(`${BASE_URL}/products`, formData, config);
      return response.data;
    });
  },

  // Method to update an existing product by ID
  updateProduct: async (id, productData) => {
    return ApiService.handleRequest(async () => {
      const config = ApiService.attachToken({
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const response = await axios.patch(`${BASE_URL}/products/${id}`, productData, config);
      return response.data;
    });
  },

  // Method to get a single category by ID
  getCategoryById: async (id) => {
    return ApiService.handleRequest(async () => {
      const config = ApiService.attachToken({});
      const response = await axios.get(`${BASE_URL}/products/category/${id}`, config);
      return response.data;
    });
  },

  // Method to create a new category
  createCategory: async (formData) => {
    return ApiService.handleRequest(async () => {
      const config = ApiService.attachToken({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const response = await axios.post(`${BASE_URL}/products/category`, formData, config);
      return response.data;
    });
  },

  // Method to update an existing category by ID
  updateCategory: async (id, categoryData) => {
    return ApiService.handleRequest(async () => {
      const config = ApiService.attachToken({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const response = await axios.patch(`${BASE_URL}/products/category/${id}`, categoryData, config);
      return response.data;
    });
  },

  getCustomers: async (params = {}) => {
    return ApiService.handleRequest(async () => {
      const config = ApiService.attachToken({
        params: {
          ...params,
          is_admin: params.is_admin === 'all' ? undefined : params.is_admin,
          size: params.size || 30, // Default page size to 30
          page: params.page || 1, // Default page to 1
        },
      });
      const response = await axios.get(`${BASE_URL}/user`, config);
      return response.data;
    });
  },

  // Method to get a single user by ID
  getCustomerById: async (id) => {
    return ApiService.handleRequest(async () => {
      const config = ApiService.attachToken({});
      const response = await axios.get(`${BASE_URL}/user/${id}`, config);
      return response.data;
    });
  },
};

export default ApiService;

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

    const response = await axios.post(`${BASE_URL}/refresh-token`, { refresh_token: refreshToken });
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    return access_token;
  },

  // Method to attach Authorization header
  attachToken: (config) => {
    const token = ApiService.getAccessToken();
    if (token) {
      config.headers = config.headers || {}; // Ensure headers object exists
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },

  // Corrected method to handle login and store tokens
  login: async (code) => {
    const response = await axios.post(`${BASE_URL}/login`, { code });
    return response.data;
  },

  // Method to get products with optional query parameters
  getProducts: async (params = {}) => {
    const config = ApiService.attachToken({
      params: {
        ...params,
        categories: params.categories?.length > 0 ? params.categories.join(',') : undefined,
      },
    });
    const response = await axios.get(`${BASE_URL}/products`, config);
    return response.data;
  },

  // Method to get a single product by ID
  getProduct: async (id) => {
    const config = ApiService.attachToken({});
    const response = await axios.get(`${BASE_URL}/products/${id}`, config);
    return response.data;
  },

  // Method to get all categories
  getCategories: async () => {
    const config = ApiService.attachToken({});
    const response = await axios.get(`${BASE_URL}/products/category`, config);
    return response.data;
  },

  // Method to add a new product
  addProduct: async (productData) => {
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
  },

  // Method to update an existing product by ID
  updateProduct: async (id, productData) => {
    const config = ApiService.attachToken({
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await axios.patch(`${BASE_URL}/products/${id}`, productData, config);
    return response.data;
  },

  // Method to get a single category by ID
  getCategoryById: async (id) => {
    const config = ApiService.attachToken({});
    const response = await axios.get(`${BASE_URL}/products/category/${id}`, config);
    return response.data;
  },

  // Method to create a new category
  createCategory: async (formData) => {
    const config = ApiService.attachToken({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const response = await axios.post(`${BASE_URL}/products/category`, formData, config);
    return response.data;
  },

  // Method to update an existing category by ID
  updateCategory: async (id, data) => {
    const config = ApiService.attachToken({
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await axios.patch(`${BASE_URL}/products/category/${id}`, data, config);
    return response.data;
  },
};

export default ApiService;

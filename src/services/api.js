import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (name, email, password, confirmPassword) => {
  try {
    const response = await api.post('/register', { name, email, password, confirmPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// New product-related functions

export const getAllProducts = async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching all products:', error.response ? error.response.data : error.message);
      throw error;
    }
  };
  
  export const getProductInformation = async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product information:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

export default api;
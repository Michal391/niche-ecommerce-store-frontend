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

  // New review-related functions

export const addReview = async (productId, reviewData) => {
  try {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateReview = async (productId, reviewData) => {
  try {
    const response = await api.patch(`/products/${productId}/reviews`, reviewData);
    return response.data.review;
  } catch (error) {
    console.error('Error updating review:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getProductReviews = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product reviews:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserProductReview = async (productId, userId) => {
  try {
    const response = await api.get(`/products/${productId}/reviews/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.error === "user review not found for product") {
      return null;
    }
    console.error('Error fetching user review:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteReview = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default api;
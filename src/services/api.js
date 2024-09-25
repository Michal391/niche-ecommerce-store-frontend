import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password }, { withCredentials: true });
    console.log('API Response:', response); // Log the entire response to inspect
    return response.data; // Return the data (if any) from the server
  } catch (error) {
    console.error('Login API error:', error); // Log any errors for debugging
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

// New cart related functions

export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCart = async (productId, quantity) => {
  try {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// get user profile name, surname, email
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`); // Assuming this is your API endpoint for user profile
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};


export default api;
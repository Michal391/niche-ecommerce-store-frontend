import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { addToCart, removeFromCart, getCart, reduceItemQuantity } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [error, setError] = useState(null);

  const updateCartItemCount = useCallback((cartData) => {
    if (cartData && cartData.items) {
      const count = cartData.items.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(count);
    } else {
      setCartItemCount(0);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      const cartData = await getCart();
      setCart(cartData);
      updateCartItemCount(cartData);
      setError(null);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to fetch cart. Please try again.');
    }
  }, [updateCartItemCount]);

  const addItemToCart = useCallback(async (productId, quantity) => {
    try {
      await addToCart(productId, quantity);
      await fetchCart();
      setError(null);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setError('Failed to add item to cart. Please try again.');
    }
  }, [fetchCart]);

  const clearCart = useCallback(() => {
    setCart(null);
    setCartItemCount(0);
    console.log("Cart cleared");
  }, []);

  const removeItemFromCart = useCallback(async (productId) => {
    try {
      await removeFromCart(productId);
      await fetchCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError('Failed to remove item from cart. Please try again.');
    }
  }, [fetchCart]);

  const reduceItemInCart = useCallback(
    async (productId) => {
      try {
        await reduceItemQuantity(productId);
        await fetchCart();
        setError(null);
      } catch (error) {
        console.error('Error reducing item quantity in cart:', error);
        setError('Failed to reduce item quantity in cart. Please try again.');
      }
    },
    [fetchCart]
  );

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cart, cartItemCount, error, fetchCart, addItemToCart, removeItemFromCart, clearCart, reduceItemInCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
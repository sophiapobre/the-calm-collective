import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart } from '../api/cartService';

// Create the CartContext
const CartContext = createContext();

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Function to update cart count
  // If count is provided, set it directly (optimistic update)
  // If no count provided, fetch from server
  const updateCartCount = async (count) => {
    // If count is provided directly, set it immediately (no API call)
    if (typeof count === 'number') {
      setCartItemCount(count);
      return;
    }

    // Otherwise, fetch from server
    try {
      setLoading(true);
      const cartId = localStorage.getItem('cartId');
      
      if (cartId) {
        const cart = await getCart(cartId);
        
        if (cart && cart.items) {
          // Sum up all quantities from cart items
          const totalCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
          setCartItemCount(totalCount);
        } else {
          setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      console.error('Error updating cart count:', error);
      setCartItemCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Load cart count when component mounts
  useEffect(() => {
    updateCartCount();
  }, []);

  // Helper function to clear cart count (useful after checkout)
  const clearCartCount = () => {
    setCartItemCount(0);
  };

  // Context value that will be provided to children
  const value = {
    cartItemCount,
    loading,
    updateCartCount,
    clearCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
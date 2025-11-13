import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, deleteCart } from '../../api/cartService';
import { getProduct, getProductAttribute, getProductAttributePrice } from '../../api/productService';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageUtils';

import './Cart.css';

// Adapted code from Code with Yousaf https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { clearCartCount, updateCartCount } = useCart();

    const navigate = useNavigate();

    useEffect(() => {
      fetchCartItems();
    }, []);

    async function fetchCartItems(showLoadingSpinner = true) {
      if (showLoadingSpinner) {
        setLoading(true);
      }
      const cartId = localStorage.getItem('cartId');

      // If no cartId is saved, do not create a new one
      if (!cartId) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        // Get items array from cart
        const cart = await getCart(cartId);

        // Fetch product details for each item
        let productDetails = [];
        for (const item of cart.items) {
          const product = await getProduct(item.productId);

          let variantName = null;
          let variantValue = null;
          let variantPrice = null;

          if (item.productAttributeId) {
            const attribute = await getProductAttribute(item.productAttributeId);
            variantName = attribute.attributeName;
            variantValue = attribute.attributeValue;

            const priceObj = await getProductAttributePrice(item.productId, item.productAttributeId);
            variantPrice = priceObj.price;
          }

          productDetails.push({
            ...product,
            productAttributeId: item.productAttributeId,
            count: item.quantity,
            variantName,
            variantValue,
            price: variantPrice !== null ? variantPrice : product.price
          });
        } 
        setCartItems(productDetails);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    }

    const handleClearCart = async () => {
      const cartId = localStorage.getItem('cartId');

      if (cartId) {
        await deleteCart(cartId);
        localStorage.removeItem('cartId');
        setCartItems([]);
        clearCartCount();
      }
    }

    const handleRemoveItem = async (productId, productAttributeId) => {
      const cartId = localStorage.getItem('cartId');
      if (!cartId) return;

      // Optimistic UI update - remove item immediately
      const previousItems = [...cartItems];
      const updatedItems = cartItems.filter(item => 
        !(item._id === productId && item.productAttributeId === productAttributeId)
      );
      setCartItems(updatedItems);

      try {
        // Call API to remove item from cart
        const response = await fetch(`http://localhost:4000/api/shopping-cart/${cartId}/items`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, productAttributeId })
        });

        if (response.ok) {
          // Update cart count in navbar
          const cart = await getCart(cartId);
          const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
          updateCartCount(totalItems);
        } else {
          // Revert if API call fails
          setCartItems(previousItems);
          alert('Failed to remove item from cart');
        }
      } catch (error) {
        console.error('Error removing item:', error);
        setCartItems(previousItems);
        alert('Failed to remove item from cart');
      }
    }

    const handleUpdateQuantity = async (productId, productAttributeId, newQuantity) => {
      if (newQuantity < 1) return;

      const cartId = localStorage.getItem('cartId');
      if (!cartId) return;

      // Optimistic UI update - update quantity immediately
      const previousItems = [...cartItems];
      const updatedItems = cartItems.map(item => {
        if (item._id === productId && item.productAttributeId === productAttributeId) {
          return { ...item, count: newQuantity };
        }
        return item;
      });
      setCartItems(updatedItems);

      try {
        // Call API to update item quantity
        const response = await fetch(`http://localhost:4000/api/shopping-cart/${cartId}/items/quantity`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, productAttributeId, quantity: newQuantity })
        });

        if (response.ok) {
          // Update cart count in navbar
          const cart = await getCart(cartId);
          const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
          updateCartCount(totalItems);
        } else {
          // Revert if API call fails
          setCartItems(previousItems);
          alert('Failed to update quantity');
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
        setCartItems(previousItems);
        alert('Failed to update quantity');
      }
    }

    let totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.count, 0);

    if (loading) {
      return (
        <div className='cart-page'>
          <div className='cart-header'>
            <h1>Shopping Cart</h1>
            <p className='cart-subtitle'>Review and manage your items</p>
          </div>
          <div className='cart-loading-container'>
            <div className="cart-loading-spinner"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      );
    }

    if (cartItems.length === 0) {
        return (
            <div className='cart-page'>
                <div className='cart-header'>
                  <h1>Shopping Cart</h1>
                  <p className='cart-subtitle'>Review and manage your items</p>
                </div>
                <div className='cart-empty'>
                  <div className='cart-empty-icon'>🛒</div>
                  <h3>Your cart is empty</h3>
                  <p>Add some items to get started!</p>
                  <button className='cart-continue-shopping' onClick={() => navigate('/')}>
                    Continue shopping
                  </button>
                </div>
            </div>
        );
    }

    return (
        <div className='cart-page'>
            <div className='cart-header'>
              <h1>Shopping Cart</h1>
              <p className='cart-subtitle'>Review and manage your items</p>
            </div>
            
            <div className='cart-content'>
              <div className='cart-items-section'>
                {
                    cartItems.map(item => (
                        <div className='cart-item-card' key={`${item._id}-${item.productAttributeId || 'default'}`}>
                            <img 
                              src={getImageUrl(item.image)} 
                              alt={item.name}
                              className='cart-item-image'
                            />
                            <div className='cart-item-details'>
                              <h3 className='cart-item-name'>{item.name}</h3>
                              {
                                item.productAttributeId && item.variantName && item.variantValue && (
                                  <p className='cart-item-variant'>{item.variantName}: {item.variantValue}</p>
                                )
                              }
                              <p className='cart-item-price'>${item.price.toFixed(2)}</p>
                            </div>
                            <div className='cart-item-actions'>
                              <div className='cart-quantity-controls'>
                                <button 
                                  className='cart-qty-btn'
                                  onClick={() => handleUpdateQuantity(item._id, item.productAttributeId, item.count - 1)}
                                  disabled={item.count <= 1}
                                >
                                  −
                                </button>
                                <span className='cart-quantity-display'>{item.count}</span>
                                <button 
                                  className='cart-qty-btn'
                                  onClick={() => handleUpdateQuantity(item._id, item.productAttributeId, item.count + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <p className='cart-item-subtotal'>${(item.price * item.count).toFixed(2)}</p>
                              <button 
                                className='cart-remove-btn'
                                onClick={() => handleRemoveItem(item._id, item.productAttributeId)}
                              >
                                Remove
                              </button>
                            </div>
                        </div>
                    ))
                }
              </div>

              <div className='cart-summary-section'>
                <div className='cart-summary-card'>
                  <h2>Order Summary</h2>
                  <div className='cart-summary-row'>
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.count, 0)} items):</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className='cart-summary-total'>
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <button className='cart-checkout-btn' onClick={() => navigate('/Checkout')}>
                    Proceed to Checkout
                  </button>
                  <button className='cart-clear-btn' onClick={() => handleClearCart()}>
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
        </div>
    );
}

export default Cart;
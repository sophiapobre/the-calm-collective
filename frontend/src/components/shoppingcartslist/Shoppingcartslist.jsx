import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { getCart } from '../../api/cartService';
import { getProduct, getProductAttribute, getProductAttributePrice } from '../../api/productService';
import { useAuth } from '../../context/AuthContext'; 

import './Shoppingcartslist.css';

const Shoppingcartslist = () => {
    const [carts, setCarts] = useState([]);
    const [cartsWithDetails, setCartsWithDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const { getAuthToken } = useAuth(); 

    // Fetch shopping carts with authentication
    useEffect(() => {
      // Only show loading spinner after 300ms delay
      const loadingTimer = setTimeout(() => {
        if (loading) {
          setShowLoading(true);
        }
      }, 300);

      const fetchCarts = async () => {
        try {
          const token = getAuthToken();
          
          if (!token) {
            setError('Authentication required');
            setLoading(false);
            return;
          }

          const response = await fetch('http://localhost:4000/api/shopping-cart', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            if (response.status === 401) {
              alert('Session expired. Please log in again.');
              setError('Authentication failed');
            } else if (response.status === 403) {
              alert('Access denied. Admin privileges required.');
              setError('Access denied');
            } else {
              alert(`Failed to load shopping carts. Server error: ${response.status}`);
              setError('Failed to load shopping carts');
            }
            setCarts([]);
            setLoading(false);
            return;
          }

          const data = await response.json();
          setCarts(Array.isArray(data) ? data : []); // Ensure it's always an array
        } catch (err) {
          console.error('Error fetching carts:', err);
          alert('Network error. Please check your connection and try again.');
          setError('Network error');
          setCarts([]); // Set empty array on error
        } finally {
          setLoading(false);
          setShowLoading(false);
        }
      };

      fetchCarts();

      return () => clearTimeout(loadingTimer);
    }, [getAuthToken]);

    // Fetch items in each cart
    useEffect(() => {
      if (!carts.length) {
        setCartsWithDetails([]);
        return;
      }

      async function fetchCartItems() {
        try {
          let cartsWithDetails = [];
          const token = getAuthToken();

          for (const cart of carts) {
            try {
              // Get cart data
              const cartData = await getCart(cart.cartId);

              if (!cartData.items) {
                console.warn(`Cart ${cart.cartId} has no items, skipping...`);
                continue; // Skip this cart but continue with others
              }

              // Get product details for each item
              let itemsWithDetails = [];
              for (const item of cartData.items) {
                try {
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

                  itemsWithDetails.push({
                    productId: item.productId,
                    productName: product.name,
                    productPrice: variantPrice ? variantPrice : product.price,
                    productAttributeId: item.productAttributeId,
                    attributeName: variantName,
                    attributeValue: variantValue,
                    quantity: item.quantity,
                  });
                } catch (productError) {
                  console.error(`Error loading product details for ${item.productId}:`, productError);
                  // Add item with basic info even if product details fail
                  itemsWithDetails.push({
                    productId: item.productId,
                    productName: 'Product details unavailable',
                    productPrice: 0,
                    productAttributeId: item.productAttributeId,
                    attributeName: null,
                    attributeValue: null,
                    quantity: item.quantity,
                  });
                }
              }
              
              cartsWithDetails.push({
                cartId: cart.cartId,
                items: itemsWithDetails,
              });
            } catch (cartError) {
              console.error(`Error processing cart ${cart.cartId}:`, cartError);
              // Continue with next cart instead of failing completely
            }
          }
          
          setCartsWithDetails(cartsWithDetails);
        } catch (err) {
          console.error('Error fetching cart details:', err);
          alert('Failed to load cart details. Some information may be missing.');
          setError('Failed to load cart details');
        }
      }

      fetchCartItems();
    }, [carts, getAuthToken]);

    if (loading && showLoading) {
      return (
        <div className='admin-carts-page'>
          <div className='admin-carts-header'>
            <h1>Shopping Carts</h1>
            <p className='admin-carts-subtitle'>View all active customer shopping carts</p>
          </div>
          <div className='admin-carts-loading-container'>
            <div className="admin-carts-loading-spinner"></div>
            <p>Loading shopping carts...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className='admin-carts-page'>
          <div className='admin-carts-header'>
            <h1>Shopping Carts</h1>
            <p className='admin-carts-subtitle'>View all active customer shopping carts</p>
          </div>
          <div className="admin-carts-error-container">
            <div className="admin-carts-error-icon">⚠️</div>
            <h3>Error: {error}</h3>
            {error.includes('Authentication') && (
              <p>Please make sure you're logged in as an admin.</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className='admin-carts-page'>
        <div className='admin-carts-header'>
          <h1>Shopping Carts</h1>
          <p className='admin-carts-subtitle'>View all active customer shopping carts</p>
        </div>
        
        <div className='admin-carts-container'>
          {!loading && carts.length === 0 ? (
            <div className="admin-carts-empty">
              <div className="admin-carts-empty-icon">🛒</div>
              <h3>No active shopping carts</h3>
              <p>There are currently no customers with items in their carts</p>
            </div>
          ) : (
            <div className='admin-carts-list'>
              {cartsWithDetails.map(cart => {
                const cartInfo = carts.find(c => c.cartId === cart.cartId);
                const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
                const totalPrice = cart.items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);

                return (
                  <div className='admin-cart-card' key={cart.cartId}>
                    <div className='admin-cart-card-header'>
                      <div className='admin-cart-info'>
                        <h3>Cart #{cart.cartId}</h3>
                        <p className='admin-cart-customer'>
                          <span className='admin-label'>Customer:</span>{' '}
                          {cartInfo?.userId ? (
                            <>
                              {cartInfo.userId.name || 'Unknown'} 
                              {cartInfo.userId.email && <span className='admin-cart-email'> ({cartInfo.userId.email})</span>}
                            </>
                          ) : (
                            'Anonymous'
                          )}
                        </p>
                        {cartInfo?.createdAt && (
                          <p className='admin-cart-date'>
                            <span className='admin-label'>Created:</span>{' '}
                            {new Date(cartInfo.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                        {cartInfo?.updatedAt && (
                          <p className='admin-cart-date'>
                            <span className='admin-label'>Last Updated:</span>{' '}
                            {new Date(cartInfo.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                      <div className='admin-cart-summary'>
                        <div className='admin-summary-item'>
                          <span className='admin-summary-label'>Items:</span>
                          <span className='admin-summary-value'>{totalItems}</span>
                        </div>
                        <div className='admin-summary-item'>
                          <span className='admin-summary-label'>Total:</span>
                          <span className='admin-summary-value'>${totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className='admin-cart-items'>
                      <h4>Cart Items:</h4>
                      {cart.items.map((item, idx) => (
                        <div className='admin-cart-item' key={idx}>
                          <div className='admin-item-main-info'>
                            <div className='admin-item-name-section'>
                              <span className='admin-item-name'>{item.productName}</span>
                              {item.attributeName && (
                                <span className='admin-item-variant'>
                                  {item.attributeName}: {item.attributeValue}
                                </span>
                              )}
                            </div>
                            <div className='admin-item-price-section'>
                              <span className='admin-item-price'>${item.productPrice}</span>
                              <span className='admin-item-quantity'>Qty: {item.quantity}</span>
                              <span className='admin-item-subtotal'>${(item.productPrice * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className='admin-item-ids'>
                            <span>Product ID: {item.productId}</span>
                            {item.productAttributeId && (
                              <span>Attribute ID: {item.productAttributeId}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    )
}

export default Shoppingcartslist;
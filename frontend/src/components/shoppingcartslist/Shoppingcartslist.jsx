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
    const [error, setError] = useState(null);
    
    const { getAuthToken } = useAuth(); 

    // Fetch shopping carts with authentication
    useEffect(() => {
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
        }
      };

      fetchCarts();
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

    if (loading) {
      return (
        <div className='overall-admin-container'>
          <h1>Shopping Carts List</h1>
          <div className='admin-container'>
            <p>Loading shopping carts...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className='overall-admin-container'>
          <h1>Shopping Carts List</h1>
          <div className='admin-container'>
            <p style={{ color: 'red' }}>Error: {error}</p>
            {error.includes('Authentication') && (
              <p>Please make sure you're logged in as an admin.</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className='overall-admin-container'>
        <h1>Shopping Carts List</h1>
        <div className='admin-container'>
          {carts.length === 0 && <p>There are currently no active shopping carts.</p>}

          <ul>
            {cartsWithDetails.map(cart => (
              <div className='admin-shoppingcart' key={cart.cartId}>
                <h4>Cart ID: {cart.cartId}</h4>
                <ul>
                  {cart.items.map((item, idx) => (
                    <li key={idx}>
                      <b>Product Name:</b> {item.productName} | <b>Product ID:</b> {item.productId}
                      <ul>
                        <li>
                          <b>Product Attribute:</b> {item.attributeName ? `${item.attributeName}: ${item.attributeValue}` : "None"} | <b>Product Attribute ID:</b> {item.productAttributeId ? item.productAttributeId : "None"}
                        </li>
                        <li><b>Price:</b> ${item.productPrice}</li>
                        <li><b>Quantity:</b> {item.quantity}</li>
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ul>
        </div>
      </div>
    )
}

export default Shoppingcartslist;
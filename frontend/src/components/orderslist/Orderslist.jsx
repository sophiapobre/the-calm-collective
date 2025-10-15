import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { getCart } from '../../api/cartService';
import { getProduct, getProductAttribute, getProductAttributePrice } from '../../api/productService';
import { useAuth } from '../../context/AuthContext';

import './Orderslist.css';
const Orderslist = () => {
    const [orders, setOrders] = useState([]);
    const [ordersWithDetails, setOrdersWithDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { getAuthToken } = useAuth();

    // Fetch orders with authentication
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const token = getAuthToken();

          if (!token) {
            setError('Authentication required');
            setLoading(false);
            return;
          }

          const response = await fetch('http://localhost:4000/api/orders', {
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
              alert(`Failed to load orders. Server error: ${response.status}`);
              setError('Failed to load orders');
            }
            setOrders([]);
            setLoading(false);
            return;
          }

          const data = await response.json();
          setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Error fetching orders:', err);
          alert('Network error. Please check your connection and try again.');
          setError('Network error');
          setOrders([]);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }, [getAuthToken]);

    // Fetch items in each order
    useEffect(() => {
      if (!orders.length) {
        setOrdersWithDetails([]);
        return;
      }

      async function fetchOrderItems() {
        try {
          let ordersWithDetails = [];
          const token = getAuthToken();

          for (const order of orders) {
            try {
              // Get order by order number
              const response = await fetch(`http://localhost:4000/api/orders/${order.orderNumber}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (!response.ok) {
                if (response.status === 401) {
                  alert('Session expired while loading order details. Please log in again.');
                  return; // Stop processing
                } else if (response.status === 404) {
                  console.warn(`Order ${order.orderNumber} not found, skipping...`);
                  continue; // Skip this order but continue with others
                } else {
                  console.error(`Error loading order ${order.orderNumber}: ${response.status}`);
                  continue; // Skip this order but continue with others
                }
              }

              const orderDetails = await response.json();

              if (!orderDetails.items) {
                continue; // Skip if order details are not found
              }

              // Get product details for each item
              let itemsWithDetails = [];
              for (const item of orderDetails.items) {
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
              
              ordersWithDetails.push({
                orderNumber: orderDetails.orderNumber,
                customerName: order.customerName,
                items: itemsWithDetails,
              });
            } catch (orderError) {
              console.error(`Error processing order ${order.orderNumber}:`, orderError);
              // Continue with next order
            }
          }
          
          setOrdersWithDetails(ordersWithDetails);
        } catch (err) {
          console.error('Error fetching order details:', err);
          alert('Failed to load order details. Some information may be missing.');
        }
      }

      fetchOrderItems();
    }, [orders, getAuthToken]);

    if (loading) {
      return (
        <div className='overall-admin-container'>
          <h1>Orders List</h1>
          <div className='admin-container'>
            <p>Loading orders...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className='overall-admin-container'>
          <h1>Orders List</h1>
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
        <h1>Orders List</h1>
        <div className='admin-container'>
          {orders.length === 0 && <p>There are no completed orders yet.</p>}

          <ul>
            {ordersWithDetails.map(order => (
              <div className='admin-shoppingcart' key={order.orderNumber}>
                <h4>Order ID: {order.orderNumber} | Customer Name: {order.customerName}</h4>
                <ul>
                  {order.items.map((item, idx) => (
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

export default Orderslist;
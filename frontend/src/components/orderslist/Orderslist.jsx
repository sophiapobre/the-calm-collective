import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

import './Orderslist.css';

const Orderslist = () => {
    const [orders, setOrders] = useState([]);
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
          
          // Process orders to use snapshot data
          const processedOrders = (Array.isArray(data) ? data : []).map(order => ({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            createdAt: order.createdAt,
            subtotal: order.subtotal,
            total: order.total,
            items: order.items.map(item => ({
              productId: item.productId,
              productName: item.productSnapshot?.name || 'Product details unavailable',
              productPrice: item.finalPrice || item.productSnapshot?.price || 0,
              productAttributeId: item.productAttributeId,
              attributeName: item.attributeSnapshot?.attributeName || null,
              attributeValue: item.attributeSnapshot?.attributeValue || null,
              quantity: item.quantity,
              // Additional snapshot data if needed
              productDescription: item.productSnapshot?.description,
              productImage: item.productSnapshot?.image,
              productCategory: item.productSnapshot?.category
            }))
          }));

          setOrders(processedOrders);
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
            {orders.map(order => (
              <div className='admin-shoppingcart' key={order.orderNumber}>
                <h4>
                  Order ID: {order.orderNumber} | Customer Name: {order.customerName}
                  {order.createdAt && (
                    <span> | Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                  )}
                </h4>
                
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      <b>Product Name:</b> {item.productName} | <b>Product ID:</b> {item.productId}
                      <ul>
                        <li>
                          <b>Product Attribute:</b> {item.attributeName ? `${item.attributeName}: ${item.attributeValue}` : "None"} 
                          {item.productAttributeId && (
                            <span> | <b>Product Attribute ID:</b> {item.productAttributeId}</span>
                          )}
                        </li>
                        <li><b>Price:</b> ${item.productPrice}</li>
                        <li><b>Quantity:</b> {item.quantity}</li>
                        <li><b>Total:</b> ${(item.productPrice * item.quantity).toFixed(2)}</li>
                      </ul>
                    </li>
                  ))}
                </ul>
                
                {/* Add order totals */}
                <div className="order-totals" style={{ marginTop: '10px', fontWeight: 'bold' }}>
                  {order.subtotal && <div>Subtotal: ${order.subtotal.toFixed(2)}</div>}
                  {order.total && <div>Total: ${order.total.toFixed(2)}</div>}
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    )
}

export default Orderslist;
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
            deliveryAddress: order.deliveryAddress,
            createdAt: order.createdAt,
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
        <div className='admin-orders-page'>
          <div className='admin-orders-header'>
            <h1>Orders</h1>
            <p className='admin-orders-subtitle'>View all completed customer orders</p>
          </div>
          <div className='admin-orders-loading-container'>
            <div className="admin-orders-loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className='admin-orders-page'>
          <div className='admin-orders-header'>
            <h1>Orders</h1>
            <p className='admin-orders-subtitle'>View all completed customer orders</p>
          </div>
          <div className="admin-orders-error-container">
            <div className="admin-orders-error-icon">⚠️</div>
            <h3>Error: {error}</h3>
            {error.includes('Authentication') && (
              <p>Please make sure you're logged in as an admin.</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className='admin-orders-page'>
        <div className='admin-orders-header'>
          <h1>Orders</h1>
          <p className='admin-orders-subtitle'>View all completed customer orders</p>
        </div>
        
        <div className='admin-orders-container'>
          {orders.length === 0 ? (
            <div className="admin-orders-empty">
              <div className="admin-orders-empty-icon">📦</div>
              <h3>No completed orders</h3>
              <p>There are no completed orders yet</p>
            </div>
          ) : (
            <div className='admin-orders-list'>
              {orders.map(order => {
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <div className='admin-order-card' key={order.orderNumber}>
                    <div className='admin-order-card-header'>
                      <div className='admin-order-info'>
                        <h3>Order #{order.orderNumber}</h3>
                        <p className='admin-order-customer'>
                          <span className='admin-order-label'>Customer:</span> {order.customerName}
                        </p>
                        <p className='admin-order-customer'>
                          <span className='admin-order-label'>Address:</span> {order.deliveryAddress || "Not Available"}
                        </p>
                        {order.createdAt && (
                          <p className='admin-order-date'>
                            <span className='admin-order-label'>Date:</span>{' '}
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                      <div className='admin-order-summary'>
                        <div className='admin-order-summary-item'>
                          <span className='admin-order-summary-label'>Items:</span>
                          <span className='admin-order-summary-value'>{totalItems}</span>
                        </div>
                        <div className='admin-order-summary-item'>
                          <span className='admin-order-summary-label'>Total:</span>
                          <span className='admin-order-summary-value'>${(order.total || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className='admin-order-items'>
                      <h4>Order Items:</h4>
                      {order.items.map((item, idx) => (
                        <div className='admin-order-item' key={idx}>
                          <div className='admin-order-item-main-info'>
                            <div className='admin-order-item-name-section'>
                              <span className='admin-order-item-name'>{item.productName}</span>
                              {item.attributeName && (
                                <span className='admin-order-item-variant'>
                                  {item.attributeName}: {item.attributeValue}
                                </span>
                              )}
                            </div>
                            <div className='admin-order-item-price-section'>
                              <span className='admin-order-item-price'>${item.productPrice}</span>
                              <span className='admin-order-item-quantity'>Qty: {item.quantity}</span>
                              <span className='admin-order-item-subtotal'>${(item.productPrice * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className='admin-order-item-ids'>
                            <span>Product ID: {item.productId}</span>
                            {item.productAttributeId && (
                              <span>Attribute ID: {item.productAttributeId}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className='admin-order-totals'>
                      <div className='admin-order-total-row admin-order-total-final'>
                        <span className='admin-order-total-label'>Order Total:</span>
                        <span className='admin-order-total-value'>${(order.total || 0).toFixed(2)}</span>
                      </div>
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

export default Orderslist;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

import './MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const { getAuthToken } = useAuth();

    // Fetch orders with authentication
    useEffect(() => {
      // Only show loading spinner after 300ms delay
      const loadingTimer = setTimeout(() => {
        if (loading) {
          setShowLoading(true);
        }
      }, 300);

      const fetchOrders = async () => {
        try {
          const token = getAuthToken();

          if (!token) {
            setError('Authentication required');
            setLoading(false);
            return;
          }

          const response = await fetch('http://localhost:4000/api/orders/user/my-orders', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            if (response.status === 401) {
              alert('Session expired. Please log in again.');
              setError('Authentication failed');
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
              // Additional snapshot data
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
          setShowLoading(false);
        }
      };

      fetchOrders();

      return () => clearTimeout(loadingTimer);
    }, [getAuthToken]);

    if (loading && showLoading) {
      return (
        <div className='my-orders-container'>
          <h1>My Orders</h1>
          <div className='loading-container'>
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className='my-orders-container'>
          <h1>My Orders</h1>
          <div className='error-container'>
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            {error.includes('Authentication') && (
              <p className="error-subtext">Please make sure you're logged in.</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className='my-orders-container'>
        <div className="my-orders-header">
          <h1>My Orders</h1>
          <p className="orders-count">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
        </div>
        
        <div className='orders-list'>
          {!loading && orders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon">📦</div>
              <h3>No orders yet</h3>
              <p>When you place orders, they'll appear here.</p>
              <Link to="/categories" className="shop-now-btn">Start shopping</Link>
            </div>
          ) : (
            orders.map(order => (
              <div className='order-card' key={order.orderNumber}>
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-number">Order #{order.orderNumber}</h3>
                    <p className="order-date">
                      Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="order-name"><strong>Customer Name:</strong> {order.customerName}</p>
                    <p className="order-address"><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                  </div>
                  <div className="order-status">
                    <span className="status-badge completed">Completed</span>
                  </div>
                </div>
                
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div className="order-item" key={idx}>
                      <div className="item-image">
                        {item.productImage ? (
                          <img 
                            src={`http://localhost:4000/images/${item.productImage}`}
                            alt={item.productName}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="image-placeholder"><span>Image not available</span></div>';
                            }}
                          />
                        ) : (
                          <div className="image-placeholder">
                            <span>Image not available</span>
                          </div>
                        )}
                      </div>
                      <div className="item-details">
                        <h4 className="item-name">{item.productName}</h4>
                        
                        {item.attributeName && (
                          <div className="item-variant">
                            <span className="variant-label">{item.attributeName}: {item.attributeValue}</span>
                          </div>
                        )}
                        
                        <div className="item-price-qty">
                          <span className="item-price">${item.productPrice.toFixed(2)}</span>
                          <span className="item-quantity">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      
                      <div className="item-total">
                        <span className="total-label">Total</span>
                        <span className="total-amount">${(item.productPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="order-summary">
                  <div className="summary-row total-row">
                    <span>Order Total:</span>
                    <span>${order.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
}

export default MyOrders;
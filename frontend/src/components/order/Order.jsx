import { API_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';

import './Order.css';

// Adapted code from Code with Yousaf https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf
const Order = () => {
    // Get order number from params
    const { orderNumber } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      async function fetchOrderDetails() {
        try {
          // Get order by order number
          const response = await fetch(`${API_URL}/api/orders/${orderNumber}`);
          
          if (!response.ok) {
            setError('Order not found');
            setLoading(false);
            return;
          }
          
          const orderData = await response.json();
          setOrder(orderData);
        } catch (err) {
          console.error('Failed to fetch order:', err);
          setError('Failed to load order');
        } finally {
          setLoading(false);
        }
      }
      fetchOrderDetails();
    }, [orderNumber]);

    if (loading) {
      return (
        <div className='order-container'>
          <div className='loading-container'>
            <div className="loading-spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      );
    }

    if (error || !order) {
      return (
        <div className='order-container'>
          <div className='error-container'>
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error || 'Order not found'}</p>
          </div>
        </div>
      );
    }

    return (
        <div className='order-container'>
            <div className='order-confirmation-header'>
              <div className="success-icon">✓</div>
              <h1>Order Confirmed!</h1>
              <p className="confirmation-message">Thank you for your purchase, {order.firstName}!</p>
            </div>

            <div className='order-footer'>
              <p className='shipping-note'>📦 Your order will be shipped within 2-3 business days</p>
            </div>

            <div className='order-details-card'>
              <h2>Order Details</h2>
              <div className='details-grid'>
                <div className='detail-item'>
                  <span className='detail-label'>Order Number:</span>
                  <span className='detail-value'>#{order.orderNumber}</span>
                </div>
                <div className='detail-item'>
                  <span className='detail-label'>Customer Name:</span>
                  <span className='detail-value'>{order.firstName} {order.lastName}</span>
                </div>
                <div className='detail-item'>
                  <span className='detail-label'>Delivery Address:</span>
                  <span className='detail-value'>{order.deliveryAddress}</span>
                </div>
                <div className='detail-item'>
                  <span className='detail-label'>Order Date:</span>
                  <span className='detail-value'>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className='order-items-card'>
              <h2>Order Items</h2>
              <div className='order-items-list'>
                {
                  order.items.map((item, idx) => (
                    <div className='order-item' key={idx}>
                      <div className='order-item-image'>
                        {item.productSnapshot?.image ? (
                          <img 
                            src={getImageUrl(item.productSnapshot.image)} 
                            alt={item.productSnapshot.name}
                          />
                        ) : (
                          <div className="image-placeholder">
                            <span>No image</span>
                          </div>
                        )}
                      </div>
                      <div className='order-item-details'>
                        <h4 className='order-item-name'>{item.productSnapshot?.name}</h4>
                        {
                          item.attributeSnapshot?.attributeName && item.attributeSnapshot?.attributeValue && (
                            <p className='order-item-variant'>
                              {item.attributeSnapshot.attributeName}: {item.attributeSnapshot.attributeValue}
                            </p>
                          )
                        }
                        <div className='order-item-price-qty'>
                          <span className='order-item-price'>${item.finalPrice.toFixed(2)}</span>
                          <span className='order-item-quantity'>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className='order-item-total'>
                        <span className='total-label'>Total</span>
                        <span className='total-amount'>${(item.finalPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                }
              </div>

              <div className='order-summary'>
                <div className='summary-row total-row'>
                  <span>Order Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
        </div>
    );
}

export default Order;
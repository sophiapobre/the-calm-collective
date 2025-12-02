
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { deleteCart } from '../../api/cartService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageUtils';

import './Checkout.css';

// Adapted code from Code with Yousaf https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf
const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const { fetchWithAuth } = useAuth();
    const { clearCartCount } = useCart();

    const handleSubmit = async (event) => {
      event.preventDefault();

      const cartId = localStorage.getItem('cartId');
      
      if (!cartId) {
        alert('Please add items to your cart before checkout.');
        return;
      }

      setSubmitting(true);

      try {
        const payload = { 
          firstName, 
          lastName, 
          deliveryAddress: address, 
          cartId 
        };

        // Create order
        const response = await fetchWithAuth(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/orders`, {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        const responseData = await response.json();

        if (!response.ok) {
          alert(`Order could not be placed: ${responseData.message || 'Please try again.'}`);
          setSubmitting(false);
          return;
        }

        const order = responseData;
        
        // Delete the cart once the order is placed
        handleClearCart();
        
        // Reset cart count in navbar to 0
        clearCartCount();

        // Redirect to order confirmation page
        navigate(`/orders/${order.orderNumber}`);

      } catch (err) {
        alert('Error placing order. Please try again.');
        console.error('Full error:', err);
        setSubmitting(false);
      }
    }

    useEffect(() => {
      async function fetchCartItems() {
        setLoading(true);
        const cartId = localStorage.getItem('cartId');

        // If no cartId is saved, do not create a new one
        if (!cartId) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        try {
          // Get cart with all product details in one request
          const response = await fetch(`${API_URL}/api/shopping-cart/${cartId}/items-detailed`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch cart');
          }

          const data = await response.json();

          // Transform the data to match the component's expected format
          const productDetails = data.items.map(item => ({
            _id: item.product?._id || item.productId,
            name: item.product?.name || 'Product unavailable',
            description: item.product?.description || '',
            image: item.product?.image || '',
            price: item.finalPrice,
            productAttributeId: item.productAttributeId,
            count: item.quantity,
            variantName: item.attribute?.attributeName || null,
            variantValue: item.attribute?.attributeValue || null
          }));

          setCartItems(productDetails);
        } catch (error) {
          console.error('Error fetching cart items:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchCartItems();
    }, []);

    const handleClearCart = async () => {
      const cartId = localStorage.getItem('cartId');

      if (cartId) {
        await deleteCart(cartId);
        localStorage.removeItem('cartId');
        setCartItems([]);
      }
    }

    let totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.count, 0);

    if (loading) {
      return (
        <div className='checkout-container'>
          <div className='checkout-header'>
            <h1>Checkout</h1>
          </div>
          <div className='checkout-loading-container'>
            <div className="checkout-loading-spinner"></div>
            <p>Loading your order...</p>
          </div>
        </div>
      );
    }

    if (cartItems.length === 0) {
      return (
        <div className='checkout-container'>
          <div className='checkout-header'>
            <h1>Checkout</h1>
          </div>
          <div className='checkout-empty'>
            <div className='checkout-empty-icon'>🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some items before checking out!</p>
            <button className='checkout-continue-shopping' onClick={() => navigate('/')}>
              Continue shopping
            </button>
          </div>
        </div>
      );
    }

    return (
        <div className='checkout-container'>
            <div className='checkout-header'>
              <h1>Checkout</h1>
            </div>

            <p className='checkout-subtitle'>Please enter your details to place your order. Orders will be shipped within 2-3 business days.</p>

            <form onSubmit={handleSubmit} className='checkout-form'>
              <div className='checkout-content'>
                <div className='checkout-left'>
                  <div className='customer-info-section'>
                    <h2>Customer Information</h2>
                    
                    <div className='form-row'>
                      <div className='form-group'>
                        <label htmlFor="firstName">First Name *</label>
                        <input 
                          type="text" 
                          id="firstName"
                          value={firstName}
                          onChange={event => setFirstName(event.target.value)} 
                          placeholder="Enter your first name"
                          required 
                        />
                      </div>
                      
                      <div className='form-group'>
                        <label htmlFor="lastName">Last Name *</label>
                        <input 
                          type="text" 
                          id="lastName"
                          value={lastName}
                          onChange={event => setLastName(event.target.value)} 
                          placeholder="Enter your last name"
                          required 
                        />
                      </div>
                    </div>

                    <div className='form-group'>
                      <label htmlFor="address">Delivery Address *</label>
                      <input 
                        type="text" 
                        id="address"
                        value={address}
                        onChange={event => setAddress(event.target.value)} 
                        placeholder="Enter your delivery address"
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className='checkout-right'>
                  <div className='order-summary-section'>
                    <h2>Order Summary</h2>
                    <div className='order-items'>
                      {
                        cartItems.map(item => (
                          <div className='checkout-item' key={item.productAttributeId ? item.productAttributeId : item._id}>
                            <div className='checkout-item-image'>
                              <img src={getImageUrl(item.image)} alt={item.name}/>
                            </div>
                            <div className='checkout-item-details'>
                              <h4 className='checkout-item-name'>{item.name}</h4>
                              {
                                item.productAttributeId && item.variantName && item.variantValue && (
                                  <p className='checkout-item-variant'>{item.variantName}: {item.variantValue}</p>
                                )
                              }
                              <div className='checkout-item-price-qty'>
                                <span className='checkout-item-price'>${item.price.toFixed(2)}</span>
                                <span className='checkout-item-quantity'>Qty: {item.count}</span>
                              </div>
                            </div>
                            <div className='checkout-item-total'>
                              ${(item.price * item.count).toFixed(2)}
                            </div>
                          </div>
                        ))
                      }
                    </div>

                    <div className='order-total'>
                      <div className='total-row grand-total'>
                        <span>Total:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <button type='submit' className='button-place-order' disabled={submitting}>
                      {submitting ? (
                        <>
                          <span className="button-spinner"></span>
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
        </div>
    );
}

export default Checkout;
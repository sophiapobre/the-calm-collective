import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, deleteCart } from '../../api/cartService';
import { getProduct, getProductAttribute, getProductAttributePrice } from '../../api/productService';
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

    const navigate = useNavigate();
    const { getAuthToken } = useAuth();
    const { clearCartCount } = useCart();

    const handleSubmit = async (event) => {
      event.preventDefault();

      const cartId = localStorage.getItem('cartId');
      
      if (!cartId) {
        alert('Please add items to your cart before checkout.');
        return;
      }

      try {
        // Get token if user is logged in (optional)
        const token = getAuthToken();

        const headers = {
          'Content-Type': 'application/json'
        }

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const payload = { 
          firstName, 
          lastName, 
          deliveryAddress: address, 
          cartId 
        };

        // Create order
        const response = await fetch('http://localhost:4000/api/orders', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
        });

        const responseData = await response.json();

        if (!response.ok) {
          alert(`Order could not be placed: ${responseData.message || 'Please try again.'}`);
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
      }
    }

    useEffect(() => {
      async function fetchCartItems() {
        const cartId = localStorage.getItem('cartId');

        // If no cartId is saved, do not create a new one
        if (!cartId) {
          setCartItems([]);
          return;
        }

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

                    <button type='submit' className='button-place-order'>
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </form>
        </div>
    );
}

export default Checkout;
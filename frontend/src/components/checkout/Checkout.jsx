import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, deleteCart } from '../../api/cartService';
import { getProduct, getProductAttribute, getProductAttributePrice } from '../../api/productService';

import './Checkout.css';

// Adapted code from Code with Yousaf https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf
const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [name, setName] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
      event.preventDefault();

      const cartId = localStorage.getItem('cartId');
      
      if (!cartId) {
        alert('Please add items to your cart before checkout.');
        return;
      }

      try {
        // Create order
        const response = await fetch('http://localhost:4000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, cartId })
        });

        if (response.status !== 200) {
          const error = await response.json();
          alert('Order could not be placed. Please try again.');
          return;
        }

        const order = await response.json();
        
        // Delete the cart once the order is placed
        handleClearCart();

        // Redirect to order confirmation page
        navigate(`/orders/${order.orderNumber}`);

      } catch (err) {
        alert('Error placing order. Please try again.');
        console.error(err);
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
        <div>
            <h1>Checkout</h1>

            <form onSubmit={handleSubmit}>
              <div className='name-container'>
                Please enter your details and review your order.
                <h4>Name:</h4>
                <input type="text" onChange={event => setName(event.target.value)} required />      
              </div>      

              {
                  cartItems.map(item => (
                      <div className='cart-item' key={item.productAttributeId ? item.productAttributeId : item._id}>
                          <h4>{item.name}</h4>
                          {
                            item.productAttributeId && item.variantName && item.variantValue && (
                              <p>{item.variantName}: {item.variantValue}</p>
                            )
                          }
                          <p>Price: ${item.price}</p>
                          <img src={`/images/${item.image}`} alt=''/>
                          <p>Quantity: {item.count}</p>
                          <p>Product Total: ${(item.price * item.count)}</p>
                      </div>
                  ))
              }

              <div className='cart-total'>
                  <h3>TOTAL: ${totalPrice}</h3>
              </div>
              
              <div className='clear-cart-container'>
                  <button type ='submit' className='button-checkout'>
                      Place order
                  </button>
              </div>

            </form>
        </div>
    );
}

export default Checkout;
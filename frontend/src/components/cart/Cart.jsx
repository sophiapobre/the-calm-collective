import React, { useState, useEffect } from 'react';
import { createNewCart, addItemToCart, getCart, deleteCart } from '../../api/cartService';

import './Cart.css';

// Adapted code from Code with Yousaf https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

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
            const response = await fetch(`http://localhost:4000/api/products/${item.productId}`);
            const product = await response.json();

            productDetails.push({ 
              ...product, 
              productAttributeId: item.productAttributeId, 
              count: item.quantity 
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

    if (cartItems.length === 0) {
        return (
            <div>
                <h1>Shopping Cart</h1>
                <p className='empty-cart'>Your shopping cart is empty.</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Shopping Cart</h1>
            
            {
                cartItems.map(item => (
                    <div className='cart-item' key={item._id}>
                        <h4>{item.name}</h4>
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
                <button className='button-clear-cart' onClick={() => handleClearCart()}>
                    Clear Cart
                </button>
            </div>
        </div>
    );
}

export default Cart;
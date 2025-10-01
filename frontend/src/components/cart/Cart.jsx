import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, deleteCart } from '../../api/cartService';
import { getProduct, getProductAttribute, getProductAttributePrice } from '../../api/productService';

import './Cart.css';

// Adapted code from Code with Yousaf https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    const navigate = useNavigate();

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

    if (cartItems.length === 0) {
        return (
            <div>
                <h1>Shopping Cart</h1>
                <p className='empty-cart'>Your shopping cart is empty.</p>
            </div>
        );
    }

    return (
        <div className='cart-container'>
            <h1>Shopping Cart</h1>
            
            {
                cartItems.map(item => (
                    <div className='cart-item' key={item._id}>
                        <h4>{item.name}</h4>
                        {
                          item.productAttributeId && item.variantName && item.variantValue && (
                            <p>{item.variantName}: {item.variantValue}</p>
                          )
                        }
                        <p>Price: ${item.price}</p>
                        <img src={`http://localhost:4000/images/${item.image}`} alt=''/>
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
                <button className='button-checkout' onClick={() => navigate('/Checkout')}>
                    Checkout
                </button>
            </div>
        </div>
    );
}

export default Cart;
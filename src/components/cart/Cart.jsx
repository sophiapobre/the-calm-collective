import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../store/slices/cartSlice';

import './Cart.css';

// Adapted code from Code with Yousaf https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf
const Cart = () => {
    const cartItems = useSelector(state => state.cart.cart);
    const dispatch = useDispatch();

    let itemCounts = {};
    let totalPrice = 0;

    if (cartItems.length === 0) {
        return (
            <div>
                <h1>Shopping Cart</h1>
                <p className='empty-cart'>Your shopping cart is empty.</p>
            </div>
        );
    }

    // Tally item frequencies
    for (const item of cartItems) {
        if (itemCounts[item.id] !== undefined) {
            itemCounts[item.id].count += 1;
        } else {
            itemCounts[item.id] = { ...item, count: 1 };
        }

        totalPrice += item.price;
    }

    return (
        <div>
            <h1>Shopping Cart</h1>
            
            {
                Object.values(itemCounts).map(item => (
                    <div className='cart-item' key={item.id}>
                        <h4>{item.name}</h4>
                        <p>Price: ${item.price}</p>
                        <img src={item.image} alt=''/>
                        <p>Quantity: {item.count}</p>
                        <p>Product Total: ${(item.price * item.count)}</p>
                    </div>
                ))
            }

            <div className='cart-total'>
                <h3>TOTAL: ${totalPrice}</h3>
            </div>
            <div className='clear-cart-container'>
                <button className='button-clear-cart' onClick={() => dispatch(clearCart())}>
                    Clear Cart
                </button>
            </div>
        </div>
    );
}

export default Cart;
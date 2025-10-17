import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCart, deleteCart } from '../../api/cartService';
import { getProduct, getProductAttribute, getProductAttributePrice } from '../../api/productService';

import './Order.css';

// Adapted code from Code with Yousaf https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf
const Order = () => {
    // Get order number from params
    const { orderNumber } = useParams();

    const [customerName, setCustomerName] = useState('');
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
      async function fetchOrderDetails() {
        // Get order by order number
        const response = await fetch(`http://localhost:4000/api/orders/${orderNumber}`);
        
        if (!response.ok) {
          console.error('Failed to fetch order');
          return;
        }
        
        const order = await response.json();

        setCustomerName(order.customerName);

        // Fetch product details for each item
        let productDetails = [];
        for (const item of order.items) {
          let variantName = null;
          let variantValue = null;

          if (item.attributeSnapshot) {
            variantName = item.attributeSnapshot.attributeName;
            variantValue = item.attributeSnapshot.attributeValue;
          }

          productDetails.push({
            name: item.productSnapshot.name,
            description: item.productSnapshot.description,
            image: item.productSnapshot.image,
            category: item.productSnapshot.category,
            productAttributeId: item.productAttributeId,
            count: item.quantity,
            variantName,
            variantValue,
            price: item.finalPrice
          });
        } 
        setOrderItems(productDetails);
      }
      fetchOrderDetails();
    }, [orderNumber]);

    let totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.count, 0);

    return (
        <div className='order-container'>
            <h1>Order Confirmation</h1>
            <div className='thanks-container'>
              Thanks for your order, {customerName}!
            </div>
            <div className='ordernumber-container'>
              <b>Order Number:</b> {orderNumber}
            </div>
            {
                orderItems.map(item => (
                    <div className='cart-item' key={item._id}>
                        <h4>{item.name}</h4>
                        {
                          item.variantName && item.variantValue && (
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
        </div>
    );
}

export default Order;
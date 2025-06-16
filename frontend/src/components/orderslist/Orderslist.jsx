import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { getCart } from '../../api/cartService';
import { getProduct, getProductAttribute, getProductAttributePrice } from '../../api/productService';

import './Orderslist.css';

const Orderslist = () => {
    const [orders, setOrders] = useState([]);
    const [ordersWithDetails, setOrdersWithDetails] = useState([]);

    // Fetch orders
    useEffect(() => {
      fetch('http://localhost:4000/api/orders')
        .then(response => response.json())
        .then(data => setOrders(data))
        .catch(err => console.error(err));
    }, []);

    // Fetch items in each order
    useEffect(() => {
      async function fetchOrderItems() {
        let ordersWithDetails = [];

        for (const order of orders) {
          // Get order by order number
          const response = await fetch(`http://localhost:4000/api/orders/${order.orderNumber}`);
          const orderDetails = await response.json();

          // Get product details for each item
          let itemsWithDetails = [];
          for (const item of orderDetails.items) {
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

            itemsWithDetails.push({
              productId: item.productId,
              productName: product.name,
              productPrice: variantPrice ? variantPrice : product.price,
              productAttributeId: item.productAttributeId,
              attributeName: variantName,
              attributeValue: variantValue,
              quantity: item.quantity,
            });
          }
          
          ordersWithDetails.push({
            orderNumber: orderDetails.orderNumber,
            customerName: order.customerName,
            items: itemsWithDetails,
          });
        }
        setOrdersWithDetails(ordersWithDetails);
      }

      fetchOrderItems();
  }, [orders]);

  return (
    <div>
      <h1>Orders List</h1>
      <div className='admin-container'>
        {orders.length === 0 && <p>There are no completed orders yet.</p>}

        <ul>
          {ordersWithDetails.map(order => (
            <div className='admin-shoppingcart' key={order.orderNumber}>
              <h4>Order ID: {order.orderNumber} | Customer Name: {order.customerName}</h4>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    <b>Product Name:</b> {item.productName} | <b>Product ID:</b> {item.productId}
                    <ul>
                      <li>
                        <b>Product Attribute:</b> {item.attributeName ? `${item.attributeName}: ${item.attributeValue}` : "None"} | <b>Product Attribute ID:</b> {item.productAttributeId ? item.productAttributeId : "None"}
                      </li>
                      <li><b>Price:</b> ${item.productPrice}</li>
                      <li><b>Quantity:</b> {item.quantity}</li>
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Orderslist;
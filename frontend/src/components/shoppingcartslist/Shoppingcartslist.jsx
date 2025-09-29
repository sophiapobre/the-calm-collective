import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { getCart } from '../../api/cartService';
import { getProduct, getProductAttribute, getProductAttributePrice } from '../../api/productService';

import './Shoppingcartslist.css';

const Shoppingcartslist = () => {
    const [carts, setCarts] = useState([]);
    const [cartsWithDetails, setCartsWithDetails] = useState([]);

    // Fetch shopping carts
    useEffect(() => {
      fetch('http://localhost:4000/api/shopping-cart')
        .then(response => response.json())
        .then(data => setCarts(data))
        .catch(err => console.error(err));
    }, []);

    // Fetch items in each cart
    useEffect(() => {
      async function fetchCartItems() {
        let cartsWithDetails = [];

        for (const cart of carts) {
          // Get cart
          const cartData = await getCart(cart.cartId);

          // Get product details for each item
          let itemsWithDetails = [];
          for (const item of cartData.items) {
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
          
          cartsWithDetails.push({
            cartId: cart.cartId,
            items: itemsWithDetails,
          });
        }
        setCartsWithDetails(cartsWithDetails);
      }

      fetchCartItems();
  }, [carts]);

  return (
    <div className='overall-admin-container'>
      <h1>Shopping Carts List</h1>
      <div className='admin-container'>
        {carts.length === 0 && <p>There are currently no active shopping carts.</p>}

        <ul>
          {cartsWithDetails.map(cart => (
            <div className='admin-shoppingcart' key={cart.cartId}>
              <h4>Cart ID: {cart.cartId}</h4>
              <ul>
                {cart.items.map((item, idx) => (
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

export default Shoppingcartslist;
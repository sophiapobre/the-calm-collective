import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createNewCart, addItemToCart } from '../../api/cartService';
import { getProduct, getProductAttributesAndPrices } from '../../api/productService';

import './Item.css';

// Adapted code from GreatStack Tutorial https://www.youtube.com/watch?v=jbfuzcrfjqQ&ab_channel=GreatStack and Code with Yousaf https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf
const Item = () => {
    // Add to product confirmation message
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Add to cart handler
    const handleAddToCart = async (productId, productAttributeId) => {
      // Retrieve cartId if it exists, otherwise create a new cart
      let cartId = localStorage.getItem('cartId'); 
      if (!cartId) {
        cartId = await createNewCart();
      }

      // Add item to cart
      await addItemToCart(cartId, productId, productAttributeId);

      // Display confrimation message for 2 seconds
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    }

    // Get product ID from params
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [attributesAndPrices, setAttributesAndPrices] = useState([]);

    // Fetch product by ID
    useEffect(() => {
      getProduct(productId)
        .then(setProduct)
        .catch(console.error);
    }, []);

    // Fetch product attributes and prices
    useEffect(() => {
      getProductAttributesAndPrices(productId)
        .then(setAttributesAndPrices)
        .catch(console.error);
    }, [productId]);

    const [selectedAttribute, setSelectedAttribute] = useState(null);

    // Set default selected attribute as the first attribute price by default
    useEffect(() => {
      if (attributesAndPrices.length > 0 && !selectedAttribute) {
        setSelectedAttribute(attributesAndPrices[0]);
      }
    }, [attributesAndPrices, selectedAttribute]);

    // Variant selection handler
    const handleVariantSelection = async (event) => {
      const productAttributeId = event.target.value;
      const selected = attributesAndPrices.find(attr => attr._id === productAttributeId);
      setSelectedAttribute(selected);
    }

    // Product not found message
    if (product === null) {
      return (
        <div>Product not found.</div>
      );
    }

    return (
        <div className='item-details'>
            <div className='item-left'>
                <img src={`/images/${product.image}`} alt=''/>
            </div>
            <div className='item-right'>
                <h1>{product.name}</h1>
                {
                  attributesAndPrices.length > 0 && selectedAttribute ? (
                    <div className='product-attribute-selection'>
                      <h3>${selectedAttribute.price}</h3>
                      <h4>Select {attributesAndPrices[0].attributeName}:</h4>
                      
                      <select onChange={handleVariantSelection} value={selectedAttribute._id}>
                        {attributesAndPrices.map(attr => (
                          <option key={attr._id} value={attr._id}>{attr.attributeValue}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <h3>${product.price}</h3>
                  )
                }
    
                <p>{product.description}</p>
                
                <button className='button-add-to-cart' onClick={() => handleAddToCart(product._id, selectedAttribute ? selectedAttribute._id : null)}>
                    Add to Cart
                </button>

                {showConfirmation && (
                    <div className='confirmation-message'>
                        <p>Added to cart!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Item
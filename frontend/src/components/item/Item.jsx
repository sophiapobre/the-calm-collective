import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createNewCart, addItemToCart } from '../../api/cartService';
import { getProduct, getProductAttributesAndPrices } from '../../api/productService';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageUtils';

import './Item.css';

// Adapted code from GreatStack Tutorial https://www.youtube.com/watch?v=jbfuzcrfjqQ&ab_channel=GreatStack and Code with Yousaf https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf
const Item = () => {
    // Add quantity state
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const { updateCartCount } = useCart();

    // Add to cart handler
    const handleAddToCart = async (productId, productAttributeId) => {
      setAddingToCart(true);
      try {
        // Retrieve cartId if it exists, otherwise create a new cart
        let cartId = localStorage.getItem('cartId'); 
        if (!cartId) {
          cartId = await createNewCart();
        }

        // Ensure quantity is a number and at least 1
        const qty = parseInt(quantity) || 1;

        // Add item to cart with quantity
        await addItemToCart(cartId, productId, productAttributeId, qty);

        // Update cart count in navbar
        updateCartCount();

        // Display confirmation message
        alert(`Added ${qty} item(s) to cart!`);
        
        // Reset quantity to 1 after adding
        setQuantity(1);
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart. Please try again.');
      } finally {
        setAddingToCart(false);
      }
    }

    // Quantity handlers
    const increaseQuantity = () => {
      setQuantity(prev => prev + 1);
    }

    const decreaseQuantity = () => {
      setQuantity(prev => prev > 1 ? prev - 1 : 1);
    }

    const handleQuantityChange = (e) => {
      const value = e.target.value;
  
      // Allow empty string while typing
      if (value === '') {
        setQuantity('');
        return;
      }
      
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 1) {
        setQuantity(numValue);
      }
    }

    const handleQuantityBlur = () => {
      // If quantity is empty or invalid, reset to 1
      if (quantity === '' || quantity < 1) {
        setQuantity(1);
      }
    }

    // Get product ID from params
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [attributesAndPrices, setAttributesAndPrices] = useState([]);

    // Fetch product by ID
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [productData, attributesData] = await Promise.all([
            getProduct(productId),
            getProductAttributesAndPrices(productId)
          ]);
          
          setProduct(productData);
          setAttributesAndPrices(attributesData);
        } catch (error) {
          console.error('Error fetching product data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
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
    if (loading) {
      return (
        <div className='item-loading-container'>
          <div className="item-loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      );
    }

    if (product === null) {
      return (
        <div className='item-error-container'>
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist.</p>
        </div>
      );
    }

    return (
        <div className='main-item-details'>
            <div className='item-left'>
                <img src={getImageUrl(product.image)} alt=''/>
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
                
                {/* Quantity selector */}
                <div className='quantity-selector'>
                  <label htmlFor='quantity'>Quantity:</label>
                  <div className='quantity-controls'>
                    <button 
                      className='quantity-btn' 
                      onClick={decreaseQuantity}
                      aria-label='Decrease quantity'
                    >
                      -
                    </button>
                    <input 
                      type='number' 
                      id='quantity'
                      className='quantity-input'
                      value={quantity} 
                      onChange={handleQuantityChange}
                      onBlur={handleQuantityBlur}
                      min='1'
                    />
                    <button 
                      className='quantity-btn' 
                      onClick={increaseQuantity}
                      aria-label='Increase quantity'
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  className='button-add-to-cart' 
                  onClick={() => handleAddToCart(product._id, selectedAttribute ? selectedAttribute._id : null)}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <>
                      <span className="button-spinner"></span>
                      Adding...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>

            </div>
        </div>
    )
}

export default Item
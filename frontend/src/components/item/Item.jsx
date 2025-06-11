import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

import './Item.css';

// Adapted code from GreatStack Tutorial https://www.youtube.com/watch?v=jbfuzcrfjqQ&ab_channel=GreatStack and Code with Yousaf https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf
const Item = () => {
    // Add to product confirmation message
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Add to cart handler
    const dispatch = useDispatch();
    const handleClick = () => {
      dispatch(addToCart(product));
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    }

    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    // Fetch product by ID
    useEffect(() => {
      fetch(`http://localhost:4000/api/products/${productId}`)
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(err => console.error(err));
    }, [productId]);

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
                <h3>${product.price}</h3>
                <p>{product.description}</p>
                
                <button className='button-add-to-cart' onClick={handleClick}>
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
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

import './Item.css';

// Adapted code from GreatStack Tutorial https://www.youtube.com/watch?v=jbfuzcrfjqQ&ab_channel=GreatStack and Code with Yousaf https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf
const Item = (props) => {
    const {item} = props;

    const dispatch = useDispatch();

    return (
        <div className='item-details'>
            <div className='item-left'>
                <img src={item.image} alt=''/>
            </div>
            <div className='item-right'>
                <h1>{item.name}</h1>
                <h3>${item.price}</h3>
                <p>{item.description}</p>
                
                <button className='button-add-to-cart' onClick={() => dispatch(addToCart(item))}>
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

export default Item
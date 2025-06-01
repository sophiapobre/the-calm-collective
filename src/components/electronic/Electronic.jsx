import React from 'react';
import { Link } from 'react-router-dom'; 

import './Electronic.css';
import data from '../assets/products.js';

// Adapted code from GreatStack Tutorial
const Electronic = (item) => {
    const electronicProducts = data.filter(item => item.category === 'electronics');

    return (
        <div className='electronic-container'>
            {
                electronicProducts.map((item) => (
                    <div className='electronic'>
                        <Link to={`/product/${item.id}`} className='link'>
                            <img src={item.image} alt='' className='electronic-img'/>
                            <p>{item.name}</p>
                        </Link>
                        <div className='electronic-price'>
                            ${item.price}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Electronic;
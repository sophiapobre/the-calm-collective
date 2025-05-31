import React from 'react';
import { Link } from 'react-router-dom'

import './Shoe.css';
import data from '../assets/products.js'

// Adapted code from GreatStack Tutorial
const Shoe = (item) => {
    const shoeProducts = data.filter(item => item.category === 'shoes');

    return (
        <div className='shoe-container'>
            {
                shoeProducts.map((item) => (
                    <div className='shoe'>
                        <Link to='/' className='link'>
                            <img src={item.image} alt='' className='shoe-img'/>
                            <p>{item.name}</p>
                        </Link>
                        <div className='shoe-price'>
                            ${item.price}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Shoe
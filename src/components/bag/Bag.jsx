import React from 'react';
import { Link } from 'react-router-dom'

import './Bag.css';
import data from '../assets/products.js'

// Adapted code from GreatStack Tutorial https://www.youtube.com/watch?v=jbfuzcrfjqQ&ab_channel=GreatStack
const Bag = (item) => {
    const electronicProducts = data.filter(item => item.category === 'bags');

    return (
        <div className='bag-container'>
            {
                electronicProducts.map((item) => (
                    <div className='bag'>
                        <Link to={`/product/${item.id}`} className='link'>
                            <img src={item.image} alt='' className='bag-img'/>
                            <p>{item.name}</p>
                        </Link>
                        <div className='bag-price'>
                            ${item.price}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Bag
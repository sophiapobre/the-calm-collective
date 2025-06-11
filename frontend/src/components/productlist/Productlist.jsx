import React from 'react';

import './Productlist.css';
import Bag from '../bag/Bag'
import Shoe from '../shoe/Shoe';
import Electronic from '../electronic/Electronic';

const Productlist = () => {
    return (
        <div className='product-grid'>
            <div className='category-section'>
                <h1>Categories</h1>
                <h2 className='categories-title'>Electronics</h2>
                <div className='product-container'>
                    <Electronic />
                </div>
            </div>

            <div className='category-section'>
                <h2 className='categories-title'>Bags</h2>
                <div className='product-container'>
                    <Bag />
                </div>
            </div>

            <div className='category-section'>
                <h2 className='categories-title'>Shoes</h2>
                <div className='product-container'>
                    <Shoe />
                </div>
            </div>
        </div>
    )
}

export default Productlist
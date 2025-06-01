import React from 'react';

import Bag from '../components/bag/Bag'
import Shoe from '../components/shoe/Shoe';
import Electronic from '../components/electronic/Electronic';

const Categories = () => {
    return (
        <div>
            <h1>Categories</h1>

            <h2 className='categories-title'>Electronics</h2>
            <Electronic />
            
            <h2 className='categories-title'>Bags</h2>
            <Bag />
            
            <h2 className='categories-title'>Shoes</h2>
            <Shoe />  
        </div>
    )
}

export default Categories;
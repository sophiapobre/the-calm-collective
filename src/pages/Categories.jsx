import React from 'react';

import Bag from '../components/bag/Bag'
import Shoe from '../components/shoe/Shoe';
import Electronic from '../components/electronic/Electronic';

const Categories = () => {
    return (
        <div>
            <h1>Electronics</h1>
            <Electronic />
            
            <h1>Bags</h1>
            <Bag />
            
            <h1>Shoes</h1>
            <Shoe />

            
        </div>
    )
}

export default Categories;
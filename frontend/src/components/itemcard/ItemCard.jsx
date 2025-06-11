import React from 'react';
import { Link } from 'react-router-dom'; 

import './ItemCard.css';

// Adapted code from GreatStack Tutorial https://www.youtube.com/watch?v=jbfuzcrfjqQ&ab_channel=GreatStack
const ItemCard = ({products}) => {
    return (
        <div className='itemcard-container'>
            {
                products.map((item) => (
                  <div className='itemcard' key={item._id}>
                    <Link to={`/product/${item._id}`} className='link'>
                        <img src={`/images/${item.image}`} alt='' className='itemcard-img'/>
                        <p>{item.name}</p>
                    </Link>
                    <div className='itemcard-price'>
                        ${item.price}
                    </div>
                  </div>
                ))
            }
        </div>
    )
}

export default ItemCard;
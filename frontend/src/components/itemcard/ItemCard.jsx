import React from 'react';
import { Link } from 'react-router-dom'; 
import { getImageUrl } from '../../utils/imageUtils';

import './ItemCard.css';

// Adapted code from GreatStack Tutorial https://www.youtube.com/watch?v=jbfuzcrfjqQ&ab_channel=GreatStack
const ItemCard = ({products}) => {
    return (
        <>
            {
                products.map((item) => (
                  <div className='itemcard' key={item._id}>
                    <Link to={`/products/${item._id}`} className='link'>
                        <img src={getImageUrl(item.image)} alt='' className='itemcard-img'/>
                        <p className="itemcard-name">{item.name}</p>
                    </Link>
                    <div className='itemcard-price'>
                        ${item.price}
                    </div>
                  </div>
                ))
            }
        </>
    )
}

export default ItemCard;
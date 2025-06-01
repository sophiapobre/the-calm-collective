import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { useParams } from 'react-router';

import Item from '../components/item/Item';

// Adapted code from GreatStack Tutorial
const Product = () => {
    const {products} = useContext(StoreContext);
    const {productId} = useParams();
    const product = products.find((e) => e.id == Number(productId));
    
    return (
        <div>
            <Item item={product}/>
        </div>
    )
}

export default Product;
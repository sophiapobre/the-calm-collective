import React, { useState, useEffect } from 'react';
import ItemCard from '../itemcard/ItemCard'; // Adjust the path if needed

import './Productlist.css';

const Productlist = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Fetch products
    useEffect(() => {
        fetch('http://localhost:4000/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err));
    }, []);

    // Fetch categories
    useEffect(() => {
        fetch('http://localhost:4000/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className='product-grid'>
            <h1>Categories</h1>

            {categories.map(category => (
                <div className='category-section' key={category.name}>
                    <h2 className='categories-title'>
                        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </h2>
                    <div className='product-container'>
                        <ItemCard products={products.filter(product => product.category === category.name)} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Productlist
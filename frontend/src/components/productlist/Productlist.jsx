import React, { useState, useEffect } from 'react';
import ItemCard from '../itemcard/ItemCard';

import './Productlist.css';

const Productlist = () => {
    const [productsByCategory, setProductsByCategory] = useState({});
    const [categories, setCategories] = useState([]);

    // Fetch categories
    useEffect(() => {
        fetch('http://localhost:4000/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));
    }, []);

    // Fetch products by category
    useEffect(() => {
      categories.forEach(category => {
        fetch(`http://localhost:4000/api/category-products/category/${category.name}`)
          .then(response => response.json())
          .then(data => {
            // Update state with products for the category
            setProductsByCategory(previous => ({
                ...previous,
                [category.name]: data
          }));
          })
          .catch(err => console.error(err));
      });
    }, [categories])

    return (
        <div className='product-grid'>
            <h1>Categories</h1>

            {categories
              // Only render products for categories other than 'best sellers'
              // This is because 'best sellers' has its own page
              .filter(category => category.name !== 'best sellers')
              .map(category => (
                <div className='category-section' key={category.name}>
                  <h2 className='categories-title'>
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  </h2>
                  <div className='product-container'>
                    <ItemCard products={productsByCategory[category.name] ?? []} />
                  </div>
                </div>
            ))}
        </div>
    );
}

export default Productlist
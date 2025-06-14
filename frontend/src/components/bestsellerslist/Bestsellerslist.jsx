import React, { useState, useEffect } from 'react';
import ItemCard from '../itemcard/ItemCard';
import { getProductCategoryNames } from '../../api/productService';

import './Bestsellerslist.css';

const Bestsellerslist = () => {
    const [products, setProducts] = useState([]);
    const [productCategories, setProductCategories] = useState({});

    // Fetch best seller products
    useEffect(() => {
      fetch(`http://localhost:4000/api/category-products/category/${encodeURIComponent('best sellers')}`)
        .then(response => response.json())
        .then(data => {
          setProducts(data);
        })
        .catch(err => console.error(err));
    }, [])
    
    // Fetch specific category name (shoes/bags/electronics) of each best seller product
    useEffect(() => {
      async function fetchProductCategories() {
        let associations = {};

        for (const product of products) {
          const categoryNames = await getProductCategoryNames(product._id);
          
          for (const categoryName of categoryNames) {
            if (categoryName !== 'best sellers') {
              if (!associations[categoryName]) {
                associations[categoryName] = [];
              }
              associations[categoryName].push(product);
            }
          }
        }

        setProductCategories(associations);
      }
      fetchProductCategories();
    }, [products]);

    return (
        <div className='product-grid'>
            <h1>Best Sellers</h1>

            {Object.entries(productCategories).map(([category, products]) => (
              <div key={category} className='category-section'>
                <h2 className='categories-title'>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
                <div className='product-container'>
                  {products.map(product => (
                    <ItemCard key={product._id} products={[product]} />
                  ))}
                </div>
              </div>
            ))}
        </div>
    );
}

export default Bestsellerslist
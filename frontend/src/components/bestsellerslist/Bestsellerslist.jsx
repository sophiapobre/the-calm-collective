import React, { useState, useEffect } from 'react';
import ItemCard from '../itemcard/ItemCard';
import { getProductCategoryNames } from '../../api/productService';

import './Bestsellerslist.css';

const Bestsellerslist = () => {
    const [products, setProducts] = useState([]);
    const [productCategories, setProductCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);

    // Fetch best seller products
    useEffect(() => {
      // Only show loading spinner after 300ms delay
      const loadingTimer = setTimeout(() => {
        if (loading) {
          setShowLoading(true);
        }
      }, 300);

      fetch(`http://localhost:4000/api/category-products/category/${encodeURIComponent('best sellers')}`)
        .then(response => response.json())
        .then(data => {
          setProducts(data);
        })
        .catch(err => console.error(err));

      return () => clearTimeout(loadingTimer);
    }, [loading])
    
    // Fetch specific category name (shoes/bags/electronics) of each best seller product
    useEffect(() => {
      if (products.length === 0) return;

      async function fetchProductCategories() {
        try {
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
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
          setShowLoading(false);
        }
      }
      fetchProductCategories();
    }, [products]);

    if (loading && showLoading) {
        return (
            <div className='product-grid'>
                <div className='loading-container'>
                    <div className="loading-spinner"></div>
                    <p>Loading best sellers...</p>
                </div>
            </div>
        );
    }

    const categoryEntries = Object.entries(productCategories);

    return (
        <div className='product-grid'>
            <div className='categories-header'>
                <h1>Best Sellers</h1>
                <p className='categories-subtitle'>Our most popular products across all categories</p>
            </div>

            {!loading && categoryEntries.length === 0 ? (
                <div className="empty-categories">
                    <div className="empty-icon">⭐</div>
                    <h3>No best sellers yet</h3>
                    <p>Check back soon for our top products!</p>
                </div>
            ) : (
                categoryEntries.map(([category, products]) => (
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
                ))
            )}
        </div>
    );
}

export default Bestsellerslist
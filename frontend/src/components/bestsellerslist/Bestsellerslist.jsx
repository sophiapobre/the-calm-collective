import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import ItemCard from '../itemcard/ItemCard';

import './Bestsellerslist.css';

const Bestsellerslist = () => {
    const [products, setProducts] = useState([]);
    const [productCategories, setProductCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);

    // Fetch best seller products and their categories in one go
    useEffect(() => {
      const loadingTimer = setTimeout(() => {
        if (loading) {
          setShowLoading(true);
        }
      }, 300);

      async function fetchBestSellers() {
        try {
          // Fetch best sellers
          const response = await fetch(`${API_URL}/api/category-products/category/${encodeURIComponent('best sellers')}`);
          const data = await response.json();
          setProducts(data);

          if (data.length === 0) {
            setLoading(false);
            setShowLoading(false);
            return;
          }

          // Fetch categories for all products in parallel
          const categoryPromises = data.map(product =>
            fetch(`${API_URL}/api/category-products/product/${product._id}`)
              .then(res => res.json())
              .then(categories => ({ product, categories }))
              .catch(err => {
                console.error(`Error fetching categories for product ${product._id}:`, err);
                return { product, categories: [] };
              })
          );

          const results = await Promise.all(categoryPromises);

          // Organize products by category
          const associations = {};
          results.forEach(({ product, categories }) => {
            categories.forEach(cat => {
              const categoryName = cat.categoryId?.name || cat.name;
              if (categoryName && categoryName !== 'best sellers') {
                if (!associations[categoryName]) {
                  associations[categoryName] = [];
                }
                associations[categoryName].push(product);
              }
            });
          });

          setProductCategories(associations);
        } catch (err) {
          console.error('Error fetching best sellers:', err);
        } finally {
          setLoading(false);
          setShowLoading(false);
        }
      }

      fetchBestSellers();

      return () => clearTimeout(loadingTimer);
    }, []);

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
                <p className='categories-subtitle'>Beloved staples for rest and renewal</p>
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
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import ItemCard from '../itemcard/ItemCard';

import './Bestsellerslist.css';

const Bestsellerslist = () => {
    const [productCategories, setProductCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);

    // Fetch best sellers organized by category in one request
    useEffect(() => {
      const loadingTimer = setTimeout(() => {
        if (loading) {
          setShowLoading(true);
        }
      }, 300);

      async function fetchBestSellers() {
        try {
          // Fetch best sellers organized by their other categories in one request
          const response = await fetch(`${API_URL}/api/category-products/best-sellers-by-category`);
          const data = await response.json();

          setProductCategories(data);
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
                <div className='categories-header'>
                    <h1>Best Sellers</h1>
                    <p className='categories-subtitle'>Beloved staples for rest and renewal</p>
                </div>
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
                            {category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
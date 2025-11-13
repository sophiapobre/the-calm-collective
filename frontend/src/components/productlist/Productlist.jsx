import API_URL from '../../config';
import React, { useState, useEffect } from 'react';
import ItemCard from '../itemcard/ItemCard';

import './Productlist.css';

const Productlist = () => {
    const [productsByCategory, setProductsByCategory] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);

    // Fetch categories
    useEffect(() => {
        // Only show loading spinner after 300ms delay
        const loadingTimer = setTimeout(() => {
            if (loading) {
                setShowLoading(true);
            }
        }, 300);

        fetch('${API_URL}/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));

        return () => clearTimeout(loadingTimer);
    }, [loading]);

    // Fetch products by category
    useEffect(() => {
      if (categories.length === 0) return;

      const fetchAllProducts = async () => {
        try {
          const promises = categories.map(category =>
            fetch(`${API_URL}/api/category-products/category/${category.name}`)
              .then(response => response.json())
              .then(data => ({ category: category.name, data }))
          );

          const results = await Promise.all(promises);
          
          const newProductsByCategory = {};
          results.forEach(({ category, data }) => {
            newProductsByCategory[category] = data;
          });

          setProductsByCategory(newProductsByCategory);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
          setShowLoading(false);
        }
      };

      fetchAllProducts();
    }, [categories]);

    if (loading && showLoading) {
        return (
            <div className='product-grid'>
                <div className='loading-container'>
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    const filteredCategories = categories
        .filter(category => category.name !== 'best sellers')
        .filter(category => productsByCategory[category.name] && productsByCategory[category.name].length > 0);

    return (
        <div className='product-grid'>
            <div className='categories-header'>
                <h1>Shop by Category</h1>
                <p className='categories-subtitle'>Curated collections for the senses</p>
            </div>

            {!loading && filteredCategories.length === 0 ? (
                <div className="empty-categories">
                    <div className="empty-icon">🛍️</div>
                    <h3>No products available</h3>
                    <p>Check back soon for new arrivals!</p>
                </div>
            ) : (
                filteredCategories.map(category => (
                    <div className='category-section' key={category.name}>
                        <h2 className='categories-title'>
                            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                        </h2>
                        <div className='product-container'>
                            <ItemCard products={productsByCategory[category.name] ?? []} />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Productlist
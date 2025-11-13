import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import ItemCard from '../itemcard/ItemCard';

import './Productlist.css';

const Productlist = () {
    const [productsByCategory, setProductsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);

    // Fetch categories and products in parallel
    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            if (loading) {
                setShowLoading(true);
            }
        }, 300);

        async function fetchAllData() {
            try {
                // Fetch categories
                const categoriesResponse = await fetch(`${API_URL}/api/categories`);
                const categories = await categoriesResponse.json();

                if (categories.length === 0) {
                    setLoading(false);
                    setShowLoading(false);
                    return;
                }

                // Fetch products for all categories in parallel
                const productPromises = categories.map(category =>
                    fetch(`${API_URL}/api/category-products/category/${encodeURIComponent(category.name)}`)
                        .then(response => response.json())
                        .then(data => ({ category: category.name, data }))
                        .catch(err => {
                            console.error(`Error fetching products for ${category.name}:`, err);
                            return { category: category.name, data: [] };
                        })
                );

                const results = await Promise.all(productPromises);

                // Organize products by category
                const newProductsByCategory = {};
                results.forEach(({ category, data }) => {
                    newProductsByCategory[category] = data;
                });

                setProductsByCategory(newProductsByCategory);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
                setShowLoading(false);
            }
        }

        fetchAllData();

        return () => clearTimeout(loadingTimer);
    }, []);

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

    const filteredCategories = Object.entries(productsByCategory)
        .filter(([categoryName, products]) => 
            categoryName !== 'best sellers' && products.length > 0
        );

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
                filteredCategories.map(([categoryName, products]) => (
                    <div className='category-section' key={categoryName}>
                        <h2 className='categories-title'>
                            {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                        </h2>
                        <div className='product-container'>
                            <ItemCard products={products} />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Productlist
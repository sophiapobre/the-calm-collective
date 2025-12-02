import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';

import './Productmanager.css';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const { fetchWithAuth } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products:', err);
                alert('Failed to load products. Please refresh the page.');
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }
        
        setDeletingId(id);

        try {
            // Send DELETE request to the backend
            const response = await fetchWithAuth(`${API_URL}/api/products/${id}`, { 
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Product deleted successfully');
                // Remove the deleted product from the state
                setProducts(products.filter(product => product._id !== id));
            } else if (response.status === 401) {
                alert('Session expired. Please log in again.');
                setError('Authentication failed');
            } else if (response.status === 403) {
                alert('Access denied. Admin privileges required.');
                setError('Access denied');
            } else {
                alert(`Failed to delete product. Server error: ${response.status}`);
                setError('Failed to delete product');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Network error. Please check your connection and try again.');
            setError('Network error');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className='product-manager-page'>
                <div className='product-manager-header'>
                    <h1>Manage Products</h1>
                    <p className='product-manager-subtitle'>Add, edit, or delete products from your catalog</p>
                </div>
                <div className='product-manager-loading-container'>
                    <div className="product-manager-loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='product-manager-page'>
                <div className='product-manager-header'>
                    <h1>Manage Products</h1>
                    <p className='product-manager-subtitle'>Add, edit, or delete products from your catalog</p>
                </div>
                <div className='product-manager-error-container'>
                    <div className='product-manager-error-icon'>⚠️</div>
                    <h3>Error Loading Products</h3>
                    <p>{error}</p>
                    <button className='product-manager-retry-btn' onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='product-manager-page'>
            <div className='product-manager-header'>
                <h1>Manage Products</h1>
                <p className='product-manager-subtitle'>Add, edit, or delete products from your catalog</p>
            </div>
            
            <div className='product-manager-actions'>
                <Link to='/admin/products/add'>
                    <button className='product-manager-add-btn'>+ Add New Product</button>
                </Link>
            </div>

            {products.length === 0 ? (
                <div className='product-manager-empty'>
                    <div className='product-manager-empty-icon'>📦</div>
                    <h3>No Products Yet</h3>
                    <p>Get started by adding your first product</p>
                    <Link to='/admin/products/add'>
                        <button className='product-manager-add-btn'>Add Product</button>
                    </Link>
                </div>
            ) : (
                <div className="product-manager-list">
                    {products.map(product => (
                        <div className="product-manager-card" key={product._id}>
                            <div className="product-manager-card-info">
                                <h3 className="product-manager-card-name">{product.name}</h3>
                                <p className="product-manager-card-id">ID: {product._id}</p>
                                <p className="product-manager-card-price">${product.price.toFixed(2)}</p>
                            </div>
                            <div className="product-manager-card-actions">
                                <button 
                                    className="product-manager-edit-btn" 
                                    onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                                    disabled={deletingId === product._id}
                                >
                                    Manage
                                </button>
                                <button 
                                    className="product-manager-delete-btn" 
                                    onClick={() => handleDelete(product._id)}
                                    disabled={deletingId === product._id}
                                >
                                    {deletingId === product._id ? (
                                        <>
                                            <span className="button-spinner"></span>
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductManager;
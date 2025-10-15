import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import './Productmanager.css';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getAuthToken } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/products');
                
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
        const token = getAuthToken();

        if (!token) {
            alert('You must be logged in to perform this action.');
            setError('Authentication required');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }
        
        try {
            // Send DELETE request to the backend
            const response = await fetch(`http://localhost:4000/api/products/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
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
        }
    };

    if (loading) {
        return (
            <div className='overall-admin-container'>
                <h1>Manage Products</h1>
                <div className='admin-container'>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='overall-admin-container'>
                <h1>Manage Products</h1>
                <div className='admin-container'>
                    <p style={{ color: 'red' }}>Error: {error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className='overall-admin-container'>
            <h1>Manage Products</h1>
            <div className='admin-container'>
                <Link to='/admin/products/add'>
                    <button className='admin-button'>Add a Product</button>
                </Link>
            </div>
            <div className="product-list">
                {products.map(product => (
                    <div className="product-row" key={product._id}>
                        <div className="product-id">
                            {product._id}
                        </div>
                        <span>{product.name}</span>
                        <div className="button-row">
                            <button className="admin-button" onClick={() => navigate(`/admin/products/edit/${product._id}`)}>
                                Manage
                            </button>
                            <button className="admin-button" onClick={() => handleDelete(product._id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductManager;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Productmanager.css';

const ProductManager = () => {
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all products
        fetch('http://localhost:4000/api/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this?')) {
          return;
        }
        
        // Send DELETE request to the backend
        const response = await fetch(`http://localhost:4000/api/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Product deleted successfully');
            
            // Remove the deleted product from the state
            setProducts(products.filter(product => product._id !== id));
        }
    };

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
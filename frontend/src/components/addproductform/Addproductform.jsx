import API_URL from '../../config';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Add this import

import './Addproductform.css';

function AddProductForm() {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [bestseller, setBestseller] = useState(false);

  const navigate = useNavigate();
  const { getAuthToken } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = getAuthToken();

    if (!token) {
      alert('You must be logged in to add products.');
      return;
    }

    if (Number(price) < 0) {
      alert('Price cannot be negative.');
      return;
    }

    // Collect form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }
    formData.append('category', category);
    formData.append('bestseller', bestseller);

    try {
      // Send POST request to backend with authentication
      const response = await fetch('${API_URL}/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser sets it automatically
        },
        body: formData
      });

      // Handle different response scenarios
      if (response.status === 201) {
        // Success - reset form and redirect
        setName('');
        setImage(null);
        setDescription('');
        setPrice('');
        setCategory('');
        setBestseller(false);

        alert('Product added successfully!');
        navigate('/admin/products');
      } else if (response.status === 400) {
        // Bad request - show specific error
        const data = await response.json();
        alert(`Failed to add product: ${data.message}`);
      } else if (response.status === 401) {
        alert('Session expired. Please log in again.');
      } else if (response.status === 403) {
        alert('Access denied. Admin privileges required.');
      } else {
        alert(`Failed to add product. Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-header">
        <h1>Add New Product</h1>
        <p className="add-product-subtitle">Fill in the details to add a product to your catalog</p>
      </div>
      
      <form className="add-product-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="add-product-form-group">
          <label htmlFor="product-name">Product Name *</label>
          <input 
            id="product-name"
            type="text"
            value={name} 
            onChange={event => setName(event.target.value)} 
            placeholder="Enter product name" 
            required 
          />
        </div>

        <div className="add-product-form-group">
          <label htmlFor="product-image">Product Image *</label>
          <input 
            id="product-image"
            type="file" 
            accept="image/*" 
            onChange={event => setImage(event.target.files[0])} 
            required 
          />
          <span className="add-product-help-text">Upload a clear product image (JPG, PNG)</span>
        </div>

        <div className="add-product-form-group">
          <label htmlFor="product-description">Description *</label>
          <textarea
            id="product-description"
            value={description} 
            onChange={event => setDescription(event.target.value)} 
            placeholder="Describe the product..." 
            rows="4"
            required 
          />
        </div>

        <div className="add-product-form-row">
          <div className="add-product-form-group">
            <label htmlFor="product-price">Price (USD) *</label>
            <input 
              id="product-price"
              type="number" 
              step="0.01"
              min="0"
              value={price} 
              onChange={event => setPrice(event.target.value)} 
              placeholder="0.00" 
              required 
            />
          </div>

          <div className="add-product-form-group">
            <label htmlFor="product-category">Category *</label>
            <input 
              id="product-category"
              type="text"
              value={category} 
              onChange={event => setCategory(event.target.value)} 
              placeholder="e.g., Tea, Candles" 
              required 
            />
          </div>
        </div>

        <div className="add-product-form-group">
          <div className="add-product-checkbox-row">
            <input
              type="checkbox"
              id="bestseller"
              checked={bestseller}
              onChange={e => setBestseller(e.target.checked)}
            />
            <label htmlFor="bestseller">Mark as Best Seller</label>
          </div>
        </div>

        <div className="add-product-form-actions">
          <button type="button" className="add-product-cancel-btn" onClick={() => navigate('/admin/products')}>
            Cancel
          </button>
          <button type="submit" className="add-product-submit-btn">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProductForm;
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
      const response = await fetch('http://localhost:4000/api/products', {
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
    <div className="overall-admin-container">
      <h1>Add a Product</h1>
      <form className="add-product-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input value={name} onChange={event => setName(event.target.value)} placeholder="Name" required />
        <input type="file" accept="image/*" onChange={event => setImage(event.target.files[0])} required />
        <input value={description} onChange={event => setDescription(event.target.value)} placeholder="Description" required />
        <input value={price} onChange={event => setPrice(event.target.value)} placeholder="Price" type="number" required />
        <input value={category} onChange={event => setCategory(event.target.value)} placeholder="Category" required />
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={e => setBestseller(e.target.checked)}
          />
          <label htmlFor="bestseller"> Best Seller?</label>
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProductForm;
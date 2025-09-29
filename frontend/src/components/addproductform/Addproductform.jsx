import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Addproductform.css';

function AddProductForm() {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [bestseller, setBestseller] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      formData.append('image', image)
    };
    formData.append('category', category);
    formData.append('bestseller', bestseller);

    // Send POST request to backend
    const response = await fetch('http://localhost:4000/api/products', {
      method: 'POST',
      body: formData
    });

    // Reset form, alert user, and redirect to /admin/products if successful
    if (response.status === 201) {
      setName('');
      setImage(null);
      setDescription('');
      setPrice('');
      setCategory('');

      alert('Product added successfully!');
      navigate('/admin/products');
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
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, getProductCategoryNames, getProductAttributesAndPrices } from '../../api/productService';
import { useAuth } from '../../context/AuthContext';
import ProductAttributesEditor from '../productattributeseditor/Productattributeseditor';

import './Editproductform.css';

function EditProductForm() {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [bestseller, setBestseller] = useState(false);
  const [displayImage, setDisplayImage] = useState(null);
  const [attributes, setAttributes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { productId } = useParams();
  const { getAuthToken } = useAuth();

  // Fetch product, categories, and attributes and prices
  useEffect(() => {
    const fetchProduct = async () => {
      const token = getAuthToken();
      
      if (!token) {
        alert('You must be logged in to edit products.');
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        // Use the existing API service function
        const data = await getProduct(productId);

        setName(data.name || '');
        setDisplayImage(data.image || null);
        setDescription(data.description || '');
        setPrice(data.price || '');        
      } catch (err) {
        console.error('Error fetching product:', err);
        alert('Failed to load product details. Please check your connection.');
        setError('Failed to load product');
        setLoading(false);
        return;
      }

      // Fetch category names using existing API service
      try {
        const names = await getProductCategoryNames(productId);

        for (const name of names) {
          if (name === 'best sellers') {
            setBestseller(true);
          } else {
            setCategory(name);
          }
        }
      } catch (err) {
        console.error('Error fetching product category names:', err);
        console.warn('Using default category settings');
      }

      // Fetch product attributes and prices using existing API service
      try {
        const attributesAndPrices = await getProductAttributesAndPrices(productId);
        setAttributes(attributesAndPrices);
      } catch (err) {
        console.error('Error fetching product attributes:', err);
        setAttributes([]);
      }

      setLoading(false);
    };
    
    fetchProduct();
  }, [productId, getAuthToken]);

  const handleEditProductSubmit = async (event) => {
    event.preventDefault();

    const token = getAuthToken();

    if (!token) {
      alert('You must be logged in to perform this action.');
      setError('Authentication required');
      return;
    }

    if (Number(price) < 0) {
      alert('Price cannot be negative.');
      return;
    }

    setSubmitting(true);

    // Gather form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('bestseller', bestseller);

    // Only add image if it was set
    if (image) {
      formData.append('image', image);
    }

    try {
      // Send form data to backend with authentication
      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser sets it automatically
        },
        body: formData
      });

      // If successful, alert user and redirect to admin products page
      if (response.ok) {
        alert('Product updated successfully!');
        navigate('/admin/products');
      } else if (response.status === 400) {
        const data = await response.json();
        alert(`Failed to update product. ${data.message}`);
      } else if (response.status === 401) {
        alert('Session expired. Please log in again.');
        setError('Authentication failed');
      } else if (response.status === 403) {
        alert('Access denied. Admin privileges required.');
        setError('Access denied');
      } else {
        alert(`Failed to update product. Server error: ${response.status}`);
        setError('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Network error. Please check your connection and try again.');
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) { 
    return (
      <div className="edit-product-container">
        <h2>Edit Product Details</h2>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-product-container">
        <h2>Edit Product Details</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="edit-product-container">
      <h2>Edit Product Details</h2>

      <form className="edit-product-form" onSubmit={handleEditProductSubmit} encType="multipart/form-data">
        <input 
          value={name} 
          onChange={event => setName(event.target.value)} 
          placeholder="Name" 
          required 
          disabled={submitting} // Disable during submission
        />
        {displayImage && (
          <img
            src={`http://localhost:4000/images/${displayImage}`}
            alt="Current Product"
          />
        )}
        <input 
          type="file" 
          accept="image/*" 
          onChange={event => setImage(event.target.files[0])} 
          disabled={submitting} // Disable during submission
        />
        <input 
          value={description} 
          onChange={event => setDescription(event.target.value)} 
          placeholder="Description" 
          required 
          disabled={submitting} // Disable during submission
        />
        <input 
          value={price} 
          onChange={event => setPrice(event.target.value)} 
          placeholder="Price" 
          type="number" 
          required 
          disabled={submitting} // Disable during submission
        />
        <input 
          value={category} 
          onChange={event => setCategory(event.target.value)} 
          placeholder="Category" 
          required 
          disabled={submitting} // Disable during submission
        />

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={event => setBestseller(event.target.checked)}
            disabled={submitting} // Disable during submission
          />
          <label htmlFor="bestseller"> Best Seller?</label>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>

      <h2>Manage Product Attributes</h2>
      <div className='manage-product-attributes-form'>
        <ProductAttributesEditor
          productId={productId}
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </div>
      
    </div>
  );
}

export default EditProductForm;
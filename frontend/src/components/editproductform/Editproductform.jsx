import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_URL from '../../config';
import { getProduct, getProductCategoryNames, getProductAttributesAndPrices } from '../../api/productService';
import { useAuth } from '../../context/AuthContext';
import ProductAttributesEditor from '../productattributeseditor/Productattributeseditor';
import { getImageUrl } from '../../utils/imageUtils';

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
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
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
      <div className="edit-product-page">
        <div className="edit-product-header">
          <h1>Edit Product</h1>
          <p className="edit-product-subtitle">Update product details and manage variants</p>
        </div>
        <div className="edit-product-loading-container">
          <div className="edit-product-loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-product-page">
        <div className="edit-product-header">
          <h1>Edit Product</h1>
          <p className="edit-product-subtitle">Update product details and manage variants</p>
        </div>
        <div className="edit-product-error-container">
          <div className="edit-product-error-icon">⚠️</div>
          <h3>Error Loading Product</h3>
          <p>{error}</p>
          <button className="edit-product-retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-page">
      <div className="edit-product-header">
        <h1>Edit Product</h1>
        <p className="edit-product-subtitle">Update product details and manage variants</p>
      </div>

      <div className="edit-product-section">
        <h2 className="edit-product-section-title">Product Details</h2>
        <form className="edit-product-form" onSubmit={handleEditProductSubmit} encType="multipart/form-data">
          <div className="edit-product-form-group">
            <label htmlFor="product-name">Product Name *</label>
            <input 
              id="product-name"
              type="text"
              value={name} 
              onChange={event => setName(event.target.value)} 
              placeholder="Enter product name" 
              required 
              disabled={submitting}
            />
          </div>

          <div className="edit-product-form-group">
            <label>Current Image</label>
            {displayImage && (
              <div className="edit-product-image-preview">
                <img
                  src={getImageUrl(displayImage)}
                  alt="Current Product"
                />
              </div>
            )}
          </div>

          <div className="edit-product-form-group">
            <label htmlFor="product-image">Update Image</label>
            <input 
              id="product-image"
              type="file" 
              accept="image/*" 
              onChange={event => setImage(event.target.files[0])} 
              disabled={submitting}
            />
            <span className="edit-product-help-text">Leave blank to keep current image</span>
          </div>

          <div className="edit-product-form-group">
            <label htmlFor="product-description">Description *</label>
            <textarea
              id="product-description"
              value={description} 
              onChange={event => setDescription(event.target.value)} 
              placeholder="Describe the product..." 
              rows="4"
              required 
              disabled={submitting}
            />
          </div>

          <div className="edit-product-form-row">
            <div className="edit-product-form-group">
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
                disabled={submitting}
              />
            </div>

            <div className="edit-product-form-group">
              <label htmlFor="product-category">Category *</label>
              <input 
                id="product-category"
                type="text"
                value={category} 
                onChange={event => setCategory(event.target.value)} 
                placeholder="e.g., Tea, Candles" 
                required 
                disabled={submitting}
              />
            </div>
          </div>

          <div className="edit-product-form-group">
            <div className="edit-product-checkbox-row">
              <input
                type="checkbox"
                id="bestseller"
                checked={bestseller}
                onChange={event => setBestseller(event.target.checked)}
                disabled={submitting}
              />
              <label htmlFor="bestseller">Mark as Best Seller</label>
            </div>
          </div>

          <div className="edit-product-form-actions">
            <button type="button" className="edit-product-cancel-btn" onClick={() => navigate('/admin/products')} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="edit-product-submit-btn" disabled={submitting}>
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="edit-product-section">
        <h2 className="edit-product-section-title">Product Variants</h2>
        <div className='edit-product-attributes-container'>
          <ProductAttributesEditor
            productId={productId}
            attributes={attributes}
            setAttributes={setAttributes}
          />
        </div>
      </div>
    </div>
  );
}

export default EditProductForm;
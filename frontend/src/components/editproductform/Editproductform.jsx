import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, getProductCategoryNames, getProductAttributesAndPrices } from '../../api/productService';
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

  const navigate = useNavigate();
  const { productId } = useParams();

  // Fetch product, categories, and attributes and prices
  useEffect(() => {
    async function fetchProduct() {
      // Fetch product details
      try {
        const data = await getProduct(productId);
        setName(data.name || '');
        setDisplayImage(data.image || null);
        setDescription(data.description || '');
        setPrice(data.price || '');        
      } catch (err) {
        console.error('Error fetching product:', err);
      }

      // Fetch category names
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
      }

      // Fetch product attributes and prices, if any
      try {
        const attributesAndPrices = await getProductAttributesAndPrices(productId);
        setAttributes(attributesAndPrices);
      } catch (err) {
        setAttributes([]);
      }
    }
    fetchProduct();
  }, [productId]);

  const handleEditProductSubmit = async (event) => {
    event.preventDefault();

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

    // Send form data to backend
    const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
      method: 'PUT',
      body: formData
    });

    // If successful, alert user and redirect to admin products page
    if (response.ok) {
      alert('Product updated successfully!');
      navigate('/admin/products');
    }
  };

  return (
    <div className="edit-product-container">
      <h2>Edit Product Details</h2>

      <form className="edit-product-form" onSubmit={handleEditProductSubmit} encType="multipart/form-data">
        <input value={name} onChange={event => setName(event.target.value)} placeholder="Name" required />
        {displayImage && (
          <img
            src={`http://localhost:4000/images/${displayImage}`}
            alt="Current Product"
          />
        )}
        <input type="file" accept="image/*" onChange={event => setImage(event.target.files[0])} />
        <input value={description} onChange={event => setDescription(event.target.value)} placeholder="Description" required />
        <input value={price} onChange={event => setPrice(event.target.value)} placeholder="Price" type="number" required />
        <input value={category} onChange={event => setCategory(event.target.value)} placeholder="Category" required />

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={event => setBestseller(event.target.checked)}
          />
          <label htmlFor="bestseller"> Best Seller?</label>
        </div>

        <button type="submit">Save Changes</button>
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
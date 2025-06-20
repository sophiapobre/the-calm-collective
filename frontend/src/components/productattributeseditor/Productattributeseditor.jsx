import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './Productattributeseditor.css'; 

const ProductAttributesEditor = ({ productId, attributes, setAttributes }) => {
  const [attributeName, setAttributeName] = useState('');
  const [attributeValues, setAttributeValues] = useState([]);
  const [attributeToAdd, setAttributeToAdd] = useState({ attributeValue: '', price: '' });

  const navigate = useNavigate();

  // Ensure that local state is synced with parent attributes
  useEffect(() => {
    if (attributes.length > 0) {
      setAttributeName(attributes[0].attributeName || '');

      // Set the attribute values (e.g., Small) and prices
      setAttributeValues(
        attributes.map(attribute => ({
          _id: attribute._id,
          attributeValue: attribute.attributeValue,
          price: attribute.price,
          toDelete: false,
        }))
      );
    } else {
      setAttributeName('');
      setAttributeValues([]);
    }
  }, [attributes]);

  // Handle input changes for existing product attribute values
  const handleAttributeValueChange = (idx, field, value) => {
    setAttributeValues(attributeValues =>
      attributeValues.map((attributeValue, i) => {
        if (i === idx) {
          return { 
            ...attributeValue,
            [field]: value 
          };
        } else {
          return attributeValue;
        }
      })
    );
  };

  // Handle delete checkbox toggle
  const handleDeleteToggle = idx => {
    setAttributeValues(attributeValues =>
      attributeValues.map((attributeValue, i) => {
        if (i === idx) {
          return { 
            ...attributeValue, 
            toDelete: !attributeValue.toDelete 
          };
        } else {
          return attributeValue;
        }
      })
    );
  };

  // Handle input changes for add attribute
  const handleAddAttributeChange = (field, value) => {
    setAttributeToAdd(attribute => ({ ...attribute, [field]: value }));
  };

  // Add new attribute to local state (for display only)
  const handleAddAttribute = event => {
    event.preventDefault();

    if (!attributeToAdd.attributeValue.trim() || !attributeToAdd.price.toString().trim()) {
      alert('Attribute value and price are required to add a new product attribute.');
      return;
    }

    if (Number(attributeToAdd.price) < 0) {
      alert('Price cannot be negative.');
      return;
    }

    setAttributeValues(attributeValues => [
      ...attributeValues,
      { _id: null, attributeValue: attributeToAdd.attributeValue, price: attributeToAdd.price, toDelete: false }
    ]);
    setAttributeToAdd({ attributeValue: '', price: '' });
  };

  // Save all changes
  const handleSaveAll = async event => {
    event.preventDefault();

    if (!attributeName.trim()) {
      alert('Attribute name is a required field.');
      return;
    }

    for (const attributeValue of attributeValues) {
      if (!attributeValue.toDelete && Number(attributeValue.price) < 0) {
        alert('Price cannot be negative.');
        return;
      }
    }

    // Delete attributes marked for deletion
    for (const attributeValue of attributeValues) {
      if (attributeValue.toDelete && attributeValue._id) {
        // Delete attribute price from backend
        const priceResponse = await fetch(`http://localhost:4000/api/product-attribute-prices/${productId}?productAttributeId=${attributeValue._id}`, {
          method: 'DELETE'
        });

        // Delete attribute from backend
        const attributeResponse = await fetch(`http://localhost:4000/api/product-attributes/attribute/${attributeValue._id}`, {
          method: 'DELETE'
        });

        if (!priceResponse.ok || !attributeResponse.ok) {
          alert('Failed to delete some attributes. Please try again.');
          return;
        }
      }
    }

    // Add new attributes (attributes with null _id & not marked for deletion)
    for (const attributeValue of attributeValues) {
      if (!attributeValue._id && !attributeValue.toDelete) {
        // Add attribute to backend
        const attributeResponse = await fetch(`http://localhost:4000/api/product-attributes/${productId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attributeName,
            attributeValue: attributeValue.attributeValue
          })
        });

        if (!attributeResponse.ok) {
          alert('Failed to add new attribute. Please try again.');
          return;
        }

        const newAttribute = await attributeResponse.json();

        // Add attribute price to backend
        const priceResponse = await fetch(`http://localhost:4000/api/product-attribute-prices/${productId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productAttributeId: newAttribute._id,
            price: attributeValue.price
          })
        });

        if (!priceResponse.ok) {
          alert('Failed to add price for new attribute. Please try again.');
          return;
        }
      }
    }

    // Update existing attributes (with _id & not marked for deletion)
    for (const attributeValue of attributeValues) {
      if (attributeValue._id && !attributeValue.toDelete) {
        // Update attribute name and value in backend
        const attributeResponse = await fetch(`http://localhost:4000/api/product-attributes/attribute/${attributeValue._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attributeName,
            attributeValue: attributeValue.attributeValue
          })
        });

        // Update price in backend
        const priceResponse = await fetch(`http://localhost:4000/api/product-attribute-prices/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productAttributeId: attributeValue._id,
            price: attributeValue.price
          })
        });

        if (!attributeResponse.ok || !priceResponse.ok) {
          alert('Failed to update attribute value or price. Please try again.');
          return;
        }
      }
    }

    // Fetch updates from backend and update parent's local state
    const response = await fetch(`http://localhost:4000/api/product-attributes/${productId}`);
    if (response.ok) {
      const updatedAttributes = await response.json();
      setAttributes(updatedAttributes);
      alert('Product attributes saved successfully!');
      navigate('/admin/products');
    } else {
      alert('Failed to refresh attributes.');
    }
  };

  return (
    <form className="product-attributes-section" onSubmit={handleSaveAll}>
      <div className="attribute-name-row">
        <input
          className="attribute-name-input"
          type="text"
          value={attributeName}
          onChange={e => setAttributeName(e.target.value)}
          placeholder="Attribute Name (e.g. Size)"
          required
        />
      </div>

      {attributeValues.map((attributeValue, idx) => (
        <div key={attributeValue._id || idx} className="attribute-row">
          <input
            value={attributeValue.attributeValue}
            onChange={event => handleAttributeValueChange(idx, 'attributeValue', event.target.value)}
            placeholder="Attribute Value"
            className="attribute-value-input"
            required
            disabled={attributeValue.toDelete}
          />
          <input
            value={attributeValue.price}
            onChange={event => handleAttributeValueChange(idx, 'price', event.target.value)}
            placeholder="Price"
            type="number"
            className="attribute-price-input"
            required
            disabled={attributeValue.toDelete}
          />
          <label className="attribute-delete-label">
            <input
              type="checkbox"
              checked={attributeValue.toDelete}
              onChange={() => handleDeleteToggle(idx)}
              className="attribute-delete-checkbox"
            />
            Delete?
          </label>
        </div>
      ))}

      <div className="attribute-add-row">
        <input
          value={attributeToAdd.attributeValue}
          onChange={event => handleAddAttributeChange('attributeValue', event.target.value)}
          placeholder="Attribute Value"
          style={{ width: 120 }}
        />
        <input
          value={attributeToAdd.price}
          onChange={event => handleAddAttributeChange('price', event.target.value)}
          placeholder="Price"
          type="number"
          style={{ width: 80 }}
        />
        <button type="button" onClick={handleAddAttribute}>Add</button>
      </div>

      <button className="attribute-action-button" type="submit">
        Save Changes
      </button>
    </form>
  );
};

export default ProductAttributesEditor;
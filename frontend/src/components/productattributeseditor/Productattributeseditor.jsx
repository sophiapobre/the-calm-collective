import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';

import './Productattributeseditor.css'; 

const ProductAttributesEditor = ({ productId, attributes, setAttributes }) => {
  const [attributeName, setAttributeName] = useState('');
  const [attributeValues, setAttributeValues] = useState([]);
  const [attributeToAdd, setAttributeToAdd] = useState({ attributeValue: '', price: '' });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { getAuthToken } = useAuth();

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

  // Save all changes using bulk endpoint
  const handleSaveAll = async event => {
    event.preventDefault();

    const token = getAuthToken();

    if (!token) {
      alert('You must be logged in to perform this action.');
      return;
    }

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

    setSubmitting(true);

    try {
      // Organize attributes into three arrays
      const attributesToDelete = attributeValues
        .filter(attr => attr.toDelete && attr._id)
        .map(attr => attr._id);

      const attributesToAdd = attributeValues
        .filter(attr => !attr._id && !attr.toDelete)
        .map(attr => ({
          attributeValue: attr.attributeValue,
          price: attr.price
        }));

      const attributesToUpdate = attributeValues
        .filter(attr => attr._id && !attr.toDelete)
        .map(attr => ({
          _id: attr._id,
          attributeValue: attr.attributeValue,
          price: attr.price
        }));

      // Make single bulk save request
      const response = await fetch(`${API_URL}/api/product-attributes/${productId}/bulk-save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attributeName,
          attributesToDelete,
          attributesToAdd,
          attributesToUpdate
        })
      });

      if (response.ok) {
        const updatedAttributes = await response.json();
        setAttributes(updatedAttributes);
        alert('Product attributes saved successfully!');
        navigate('/admin/products');
      } else if (response.status === 401) {
        alert('Session expired. Please log in again.');
      } else if (response.status === 403) {
        alert('Access denied. Admin privileges required.');
      } else if (response.status === 400) {
        const data = await response.json();
        alert(`Failed to save attributes: ${data.message}`);
      } else {
        alert('Failed to save attributes. Please try again.');
      }
    } catch (error) {
      console.error('Error saving attributes:', error);
      alert('Network error while saving attributes. Please check your connection.');
    } finally {
      setSubmitting(false);
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
          disabled={submitting} // Disable during submission
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
            disabled={attributeValue.toDelete || submitting} // Disable during submission
          />
          <input
            value={attributeValue.price}
            onChange={event => handleAttributeValueChange(idx, 'price', event.target.value)}
            placeholder="Price"
            type="number"
            className="attribute-price-input"
            required
            disabled={attributeValue.toDelete || submitting} // Disable during submission
          />
          <label className="attribute-delete-label">
            <input
              type="checkbox"
              checked={attributeValue.toDelete}
              onChange={() => handleDeleteToggle(idx)}
              className="attribute-delete-checkbox"
              disabled={submitting} // Disable during submission
            />
            Delete?
          </label>
        </div>
      ))}

      <div className="attribute-add-row">
        <input
          value={attributeToAdd.attributeValue}
          onChange={event => handleAddAttributeChange('attributeValue', event.target.value)}
          placeholder="Attribute Value (e.g. Small)"
          disabled={submitting} // Disable during submission
        />
        <input
          value={attributeToAdd.price}
          onChange={event => handleAddAttributeChange('price', event.target.value)}
          placeholder="Price"
          type="number"
          step="0.01"
          min="0"
          disabled={submitting} // Disable during submission
        />
        <button 
          type="button" 
          onClick={handleAddAttribute}
          disabled={submitting} // Disable during submission
        >
          Add
        </button>
      </div>

      <button className="attribute-action-button" type="submit" disabled={submitting}>
        {submitting ? (
          <>
            <span className="button-spinner"></span>
            Saving Changes...
          </>
        ) : (
          'Save Changes'
        )}
      </button>
    </form>
  );
};

export default ProductAttributesEditor;
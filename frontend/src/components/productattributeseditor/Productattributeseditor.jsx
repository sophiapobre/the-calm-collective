import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Save all changes
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
      // Create headers with authorization
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Delete attributes marked for deletion
      for (const attributeValue of attributeValues) {
        if (attributeValue.toDelete && attributeValue._id) {
          try {
            // Delete attribute price from backend
            const priceResponse = await fetch(`http://localhost:4000/api/product-attribute-prices/${productId}?productAttributeId=${attributeValue._id}`, {
              method: 'DELETE',
              headers
            });

            // Delete attribute from backend
            const attributeResponse = await fetch(`http://localhost:4000/api/product-attributes/attribute/${attributeValue._id}`, {
              method: 'DELETE',
              headers
            });

            if (!priceResponse.ok || !attributeResponse.ok) {
              if (priceResponse.status === 401 || attributeResponse.status === 401) {
                alert('Session expired. Please log in again.');
                return;
              }
              alert('Failed to delete some attributes. Please try again.');
              return;
            }
          } catch (error) {
            console.error('Error deleting attribute:', error);
            alert('Network error while deleting attributes. Please check your connection.');
            return;
          }
        }
      }

      // Add new attributes (attributes with null _id & not marked for deletion)
      for (const attributeValue of attributeValues) {
        if (!attributeValue._id && !attributeValue.toDelete) {
          try {
            // Add attribute to backend
            const attributeResponse = await fetch(`http://localhost:4000/api/product-attributes/${productId}`, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                attributeName,
                attributeValue: attributeValue.attributeValue
              })
            });

            if (!attributeResponse.ok) {
              if (attributeResponse.status === 401) {
                alert('Session expired. Please log in again.');
                return;
              }
              alert('Failed to add new attribute. Please try again.');
              return;
            }

            const newAttribute = await attributeResponse.json();

            // Add attribute price to backend
            const priceResponse = await fetch(`http://localhost:4000/api/product-attribute-prices/${productId}`, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                productAttributeId: newAttribute._id,
                price: attributeValue.price
              })
            });

            if (!priceResponse.ok) {
              if (priceResponse.status === 401) {
                alert('Session expired. Please log in again.');
                return;
              }
              alert('Failed to add price for new attribute. Please try again.');
              return;
            }
          } catch (error) {
            console.error('Error adding attribute:', error);
            alert('Network error while adding attributes. Please check your connection.');
            return;
          }
        }
      }

      // Update existing attributes (with _id & not marked for deletion)
      for (const attributeValue of attributeValues) {
        if (attributeValue._id && !attributeValue.toDelete) {
          try {
            // Update attribute name and value in backend
            const attributeResponse = await fetch(`http://localhost:4000/api/product-attributes/attribute/${attributeValue._id}`, {
              method: 'PUT',
              headers,
              body: JSON.stringify({
                attributeName,
                attributeValue: attributeValue.attributeValue
              })
            });

            // Update price in backend
            const priceResponse = await fetch(`http://localhost:4000/api/product-attribute-prices/${productId}`, {
              method: 'PUT',
              headers,
              body: JSON.stringify({
                productAttributeId: attributeValue._id,
                price: attributeValue.price
              })
            });

            if (!attributeResponse.ok || !priceResponse.ok) {
              if (attributeResponse.status === 401 || priceResponse.status === 401) {
                alert('Session expired. Please log in again.');
                return;
              }
              alert('Failed to update attribute value or price. Please try again.');
              return;
            }
          } catch (error) {
            console.error('Error updating attribute:', error);
            alert('Network error while updating attributes. Please check your connection.');
            return;
          }
        }
      }

      // Fetch updates from backend and update parent's local state
      try {
        const response = await fetch(`http://localhost:4000/api/product-attributes/${productId}`, {
          headers
        });

        if (response.ok) {
          const updatedAttributes = await response.json();
          setAttributes(updatedAttributes);
          alert('Product attributes saved successfully!');
          navigate('/admin/products');
        } else if (response.status === 401) {
          alert('Session expired. Please log in again.');
        } else {
          alert('Failed to refresh attributes.');
        }
      } catch (error) {
        console.error('Error refreshing attributes:', error);
        alert('Network error while refreshing attributes.');
      }

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
        {submitting ? 'Saving Changes...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default ProductAttributesEditor;
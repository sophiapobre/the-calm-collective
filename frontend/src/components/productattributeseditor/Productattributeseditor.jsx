import React, { useState, useEffect } from 'react';

const ProductAttributesEditor = ({ productId, attributes, setAttributes }) => {
  // State to manage attribute name, values, and prices at the child level
  const [attributeName, setAttributeName] = useState('');
  const [attributeValues, setAttributeValues] = useState([]);
  const [attributeToAdd, setAttributeToAdd] = useState({ attributeValue: '', price: '' });

  // Fetch product attribute names, values, and prices from the parent's local state
  useEffect(() => {
    if (attributes.length > 0) {
      // Set the main attribute name (e.g., Size)
      setAttributeName(attributes[0].attributeName || '');

      // Set the attribute values (e.g., Small) and prices
      setAttributeValues(attributes.map(attribute => ({
        _id: attribute._id,
        attributeValue: attribute.attributeValue,
        price: attribute.price
      })));

    } else {
      setAttributeName('');
      setAttributeValues([]);
    }
  }, [attributes]);

  // Update the attribute name in the backend and parent's local state
  // Called whenever the user clicks the "Save" button beside the attribute name input
  const handleSaveAttributeName = async () => {
    if (!attributeName.trim()) {
      alert('Attribute name is required.');
      return;
    }

    if (attributes.length === 0) {
      alert('Please add an attribute value and price alongside the attribute name.');
      return;
    }

    // Update attributes in the backend with the new name
    await Promise.all(attributes.map(attribute =>
      fetch(`http://localhost:4000/api/product-attributes/attribute/${attribute._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attributeName
        })
      })
    ));

    // Update attributes in the parent's local state
    setAttributes(attributes.map(attribute => ({ ...attribute, attributeName })));
    alert('Attribute name updated!');
  };

  // Update the child's local state when attribute value or price changes
  // Called whenever the user types in the attribute value or price input fields
  const handleAttributeChange = (idx, field, value) => {
    setAttributeValues(values => {
      const newValues = [];

      // Iterate through the attribute values and update the specific field
      for (let i = 0; i < values.length; i++) {
        if (i === idx) {
          // Create a shallow copy and update the field
          const updated = Object.assign({}, values[i]);
          updated[field] = value;
          newValues.push(updated);
        } else {
          newValues.push(values[i]);
        }
      }

      return newValues;
    });
  };

  // Update the attribute value and price in the backend and parent's local state
  // Called whenever the user clicks the "Save" button beside an existing attribute value & price input
  const handleUpdateAttribute = async (idx) => {
    // Validate the attribute value and price in the local state before proceeding
    const value = attributeValues[idx];
    if (!attributeName.trim() || !value.attributeValue.trim() || !value.price.toString().trim()) {
      alert('Please ensure that the attribute name, price, and value are set before updating an existing attribute value.');
      return;
    }

    // Update the attribute name and value in the backend
    const attributeResponse = await fetch(`http://localhost:4000/api/product-attributes/attribute/${value._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attributeName,
        attributeValue: value.attributeValue
      })
    });

    // Update the attribute price in the backend
    const attributePriceResponse = await fetch(`http://localhost:4000/api/product-attribute-prices/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productAttributeId: value._id,
        price: value.price
      })
    });

    if (attributeResponse.ok && attributePriceResponse.ok) {
      alert('Attribute name and value updated successfully!');

      // Update the parent's local state with the new values
      setAttributes(function(attributes) {
        let newAttributes = [];

        // Iterate through the parent's attributes and update the specific attribute
        for (let i = 0; i < attributes.length; i++) {
          let attribute = attributes[i];

          if (attribute._id === value._id) {
            // Create a shallow copy and update fields
            let updated = Object.assign({}, attribute);
            updated.attributeName = attributeName;
            updated.attributeValue = value.attributeValue;
            updated.price = value.price;
            newAttributes.push(updated);
          } else {
            newAttributes.push(attribute);
          }
        }
        
        return newAttributes;
      });

    } else {
      alert('Failed to update attribute name or value.');
      return;
    }
  };

  // Delete the attribute value and price in the backend and parent's local state
  // Called whenever the user clicks the "Delete" button beside an existing attribute value & price input
  const handleDeleteAttribute = async (idx) => {
    const val = attributeValues[idx];

    const priceResponse = await fetch(`http://localhost:4000/api/product-attribute-prices/${productId}?productAttributeId=${val._id}`, {
      method: 'DELETE'
    });

    const attributeResponse = await fetch(`http://localhost:4000/api/product-attributes/attribute/${val._id}`, {
      method: 'DELETE'
    });

    if (priceResponse.ok && attributeResponse.ok) {      
      // Remove value from the local state
      let newValues = [];
      for (let i = 0; i < attributeValues.length; i++) {
        if (i !== idx) {
          newValues.push(attributeValues[i]);
        }
      }
      setAttributeValues(newValues);

      // Remove from the parent's local state
      setAttributes(function(attributes) {
        let newAttributes = [];
        
        for (let j = 0; j < attributes.length; j++) {
          if (attributes[j]._id !== val._id) {
            newAttributes.push(attributes[j]);
          }
        }
        return newAttributes;
      });

      alert("Attribute name and value deleted successfully!");
    } else {
      alert('Failed to delete attribute value or price.');
      return;
    }
  };

  // Add a new attribute and price in the backend and the parent's local state
  // Called whenever the user submits the form to add a new attribute value & price
  const handleAddAttribute = async (event) => {
    event.preventDefault();

    if (attributeName.trim() === '') {
      alert('The attribute name, price, and value must be set before adding a new attribute value.');
      return;
    }

    const attributeResponse = await fetch(`http://localhost:4000/api/product-attributes/${productId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attributeName,
        attributeValue: attributeToAdd.attributeValue
      })
    });

    if (!attributeResponse.ok) {
      alert('Failed to add attribute value.');
      return;
    }

    const newAttributeData = await attributeResponse.json();

    const priceResponse = await fetch(`http://localhost:4000/api/product-attribute-prices/${productId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productAttributeId: newAttributeData._id,
        price: attributeToAdd.price
      })
    });

    if (!priceResponse.ok) {
      alert('Failed to add attribute price.');
      return;
    }

    const newAttribute = { ...newAttributeData, price: attributeToAdd.price };
    
    // Update the local state with the new attribute value and price
    let newAttributeValues = [];
    for (let i = 0; i < attributeValues.length; i++) {
      newAttributeValues.push(attributeValues[i]);
    }
    newAttributeValues.push({ _id: newAttribute._id, attributeValue: newAttribute.attributeValue, price: newAttribute.price });
    setAttributeValues(newAttributeValues);

    // Update the parent's local state with the new attribute
    var newAttributes = [];
    for (let j = 0; j < attributes.length; j++) {
      newAttributes.push(attributes[j]);
    }
    newAttributes.push(newAttribute);
    setAttributes(newAttributes);

    // Reset the add form
    setAttributeToAdd({ attributeValue: '', price: '' });
  };

  return (
    <div className='product-attributes-section'>
      <div className="attribute-name-row">
        <input
          className="attribute-name-input"
          type="text"
          value={attributeName}
          onChange={e => setAttributeName(e.target.value)}
          placeholder="Attribute Name (e.g. Size)"
        />
        <button type="button" className="attribute-action-button" onClick={handleSaveAttributeName}>Save</button>
      </div>

      {attributeValues.map((val, idx) => (
        <div key={val._id} className="attribute-row">
          <input
            value={val.attributeValue}
            onChange={e => handleAttributeChange(idx, 'attributeValue', e.target.value)}
            placeholder="Attribute Value"
            style={{ width: 120 }}
            required
          />
          <input
            value={val.price}
            onChange={e => handleAttributeChange(idx, 'price', e.target.value)}
            placeholder="Price"
            type="number"
            style={{ width: 80 }}
            required
          />
          <button type="button" onClick={() => handleUpdateAttribute(idx)}>Save</button>
          <button type="button" onClick={() => handleDeleteAttribute(idx)}>Delete</button>
        </div>
      ))}

      <form onSubmit={handleAddAttribute} className="add-attribute-form">
        <input
          value={attributeToAdd.attributeValue}
          onChange={e => setAttributeToAdd(val => ({ ...val, attributeValue: e.target.value }))}
          placeholder="Attribute Value"
          style={{ width: 120 }}
          required
        />
        <input
          value={attributeToAdd.price}
          onChange={e => setAttributeToAdd(val => ({ ...val, price: e.target.value }))}
          placeholder="Price"
          type="number"
          style={{ width: 80 }}
          required
        />
        <button className="attribute-action-button" type="submit">Add</button>
      </form>
    </div>
  );
};

export default ProductAttributesEditor;
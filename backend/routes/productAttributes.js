const express = require('express');
const router = express.Router();
const ProductAttribute = require('../models/productAttribute');

// Get all product attributes for a product
// GET /api/product-attributes/:productId
router.get('/:productId', async (request, response) => {
  try {
    // Get all product attributes for a product, if they exist
    const productAttributes = await ProductAttribute.find({ productId: request.params.productId });
    response.json(productAttributes); // Returns empty array if product has no attributes
  } catch (error) {
    console.error('Error fetching product attributes:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get a product attribute by ID
// GET /api/product-attributes/attribute/:attributeId
router.get('/attribute/:attributeId', async (request, response) => {
  try {
    const attribute = await ProductAttribute.findById(request.params.attributeId);
    
    if (!attribute) {
      return response.status(404).json({ message: 'Attribute not found' });
    }

    response.json(attribute);
  } catch (error) {
    console.error('Error fetching product attribute:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new product attribute for a product
// POST /api/product-attributes/:productId
router.post('/:productId', async (request, response) => {
  try {
    const { attributeName, attributeValue } = request.body;

    const newAttribute = new ProductAttribute({
      productId: request.params.productId,
      attributeName,
      attributeValue
    });

    await newAttribute.save();

    response.status(201).json(newAttribute);
  } catch (error) {
    response.status(500).json({ message: 'Error creating attribute' });
  }
});

// Update an existing product attribute by ID
// PUT /api/product-attributes/attribute/:attributeId
router.put('/attribute/:attributeId', async (request, response) => {
  try {
    const { attributeName, attributeValue } = request.body;

    const updatedAttribute = await ProductAttribute.findByIdAndUpdate(
      request.params.attributeId,
      { attributeName, attributeValue },
      { new: true }
    );

    if (!updatedAttribute) {
      return response.status(404).json({ message: 'Attribute not found' });
    }

    response.json(updatedAttribute);
  } catch (error) {
    response.status(500).json({ message: 'Error updating attribute' });
  }
});

// Delete a product attribute by ID
// DELETE /api/product-attributes/attribute/:attributeId
router.delete('/attribute/:attributeId', async (request, response) => {
  try {
    const deletedAttribute = await ProductAttribute.findByIdAndDelete(request.params.attributeId);

    if (!deletedAttribute) {
      return response.status(404).json({ message: 'Attribute not found' });
    }

    response.json({ message: 'Attribute deleted successfully' });
  } catch (error) {
    response.status(500).json({ message: 'Error deleting attribute' });
  }
});

module.exports = router;
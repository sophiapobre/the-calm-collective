const express = require('express');
const router = express.Router();
const ProductAttribute = require('../models/productattribute');

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

module.exports = router;
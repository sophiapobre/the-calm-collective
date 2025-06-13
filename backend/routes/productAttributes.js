const express = require('express');
const router = express.Router();
const ProductAttribute = require('../models/productattribute');

// GET /api/product-attributes/:productId
router.get('/:productId', async (request, response) => {
  try {
    // Get all product attributes for a product, if they exist
    const productAttributes = await ProductAttribute.find({ productId: request.params.productId });
    response.json(productAttributes); // Returns empty array if product has no attributes
  } catch (error) {
    console.error('Error fetching products:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
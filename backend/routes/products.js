const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Get all products
// GET /api/products
router.get('/', async (request, response) => {
  try {
    const products = await Product.find();
    response.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single product by productId
// GET /api/products/:productId
router.get('/:productId', async (request, response) => {
  try {
    const product = await Product.findById(request.params.productId);

    if (!product) {
      return response.status(404).json({ message: 'Product not found' });
    }

    response.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
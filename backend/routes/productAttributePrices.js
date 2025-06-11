const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET /api/product-attribute-prices
router.get('/', async (request, response) => {
  // try {
  //   const products = await Product.find();
  //   response.json(products);
  // } catch (error) {
  //   console.error('Error fetching products:', error);
  //   response.status(500).json({ message: 'Internal server error' });
  // }
});

module.exports = router;
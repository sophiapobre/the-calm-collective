const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const CategoryProduct = require('../models/categoryProduct');

// Get all products associated with a specific category
// GET /api/category-products/category/:categoryName
router.get('/category/:categoryName', async (request, response) => {
  try {
    // Find category
    const category = await Category.findOne({ name: request.params.categoryName });
    
    if (!category) {
      return response.status(404).json({ message: 'Category not found'});
    }

    // Find products associated with the category
    const associations = await CategoryProduct.find({ categoryId: category._id }).populate('productId');
    const products = associations.map(a => a.productId);

    response.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get all categories associated with a specific product
// GET /api/category-products/product/:productId
router.get('/product/:productId', async (request, response) => {
  try {
    // Find categories associated with the product
    const associations = await CategoryProduct.find({ productId: request.params.productId });
    
    if (!associations) {
      return response.status(404).json({ message: 'Product categories not found'});
    }

    response.json(associations);
  } catch (error) {
    console.error('Error fetching categories for product:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
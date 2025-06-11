const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const CategoryProduct = require('../models/categoryProduct');

// GET /api/category-products/:categoryName
router.get('/:categoryName', async (request, response) => {
  try {
    // Find category
    const category = await Category.findOne({ name: request.params.categoryName });
    
    if (category === null) {
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

module.exports = router;
const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// Get all categories
// GET /api/categories
router.get('/', async (request, response) => {
  try {
    const categories = await Category.find();
    response.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get a category by ID
// GET /api/categories/:categoryId
router.get('/:categoryId', async (request, response) => {
  try {
    const category = await Category.findById(request.params.categoryId);
    response.json(category);
  } catch (error) {
    console.error('Error fetching categories:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
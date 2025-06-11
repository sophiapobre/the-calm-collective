const express = require('express');
const router = express.Router();
const Category = require('../models/category');

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

module.exports = router;
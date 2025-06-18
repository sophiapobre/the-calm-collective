const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const ProductAttribute = require('../models/productAttribute');
const CategoryProduct = require('../models/categoryProduct');
const Category = require('../models/category');

// Get category names for a product
function getCategoryNames(productId, categoryProducts, categories) {
  let result = [];

  for (let i = 0; i < categoryProducts.length; i++) {
    // Find the categoryProduct association
    if (categoryProducts[i].productId.toString() === productId.toString()) {
      for (var j = 0; j < categories.length; j++) {
        // Find the category name
        if (categories[j]._id.toString() === categoryProducts[i].categoryId.toString()) {
          result.push(categories[j].name);
          break;
        }
      }
    }
  }
  return result;
}

// Get attribute name and values for a product
function getAttributeNameAndValues(productId, attributes) {
  let result = [];

  for (let i = 0; i < attributes.length; i++) {
    // Find the attributes matching the productId
    if (attributes[i].productId.toString() === productId.toString()) {
      result.push(attributes[i].attributeName);
      result.push(attributes[i].attributeValue);
    }
  }
  return result;
}

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

// GET /api/products/search?q=term1+term2
router.get('/search', async (request, response) => {
  // Get the search query from request parameters
  // E.g. /api/products/search?q=tumi+backpack
  const query = request.query.q;
  
  // Return empty array if no query
  if (!query) {
    return response.json([]);
  } 

  // Split query into separate search terms, ignoring case and extra spaces
  // E.g. "tumi backpack" -> ["tumi", "backpack"]
  let terms = [];
  let split = query.trim().split(/\s+/);
  for (let i = 0; i < split.length; i++) {
    terms.push(split[i].toLowerCase());
  }

  // Get all products, categories, categoryProducts, and attributes
  const products = await Product.find();
  const categories = await Category.find();
  const categoryProducts = await CategoryProduct.find();
  const attributes = await ProductAttribute.find();

  const results = [];
  for (const product of products) {
    // Join all relevant product information into one lowercase string
    const productSearchTerms = [
      product.name,
      product.description,
      ...getCategoryNames(product._id, categoryProducts, categories),
      ...getAttributeNameAndValues(product._id, attributes)
    ].join(' ').toLowerCase();

    // Check if all search terms are included in the product search terms
    if (terms.every(term => productSearchTerms.includes(term))) {
      results.push(product);
    }
  } 

  response.json(results);
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
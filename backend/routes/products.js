const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const ProductAttribute = require('../models/productAttribute');
const ProductAttributePrice = require('../models/productAttributePrice');
const CategoryProduct = require('../models/categoryProduct');
const Category = require('../models/category');
const multer = require('multer');
const path = require('path');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

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

// Search products by query
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

// Delete a product by ID
// DELETE /api/products/:productId
router.delete('/:productId', authenticateToken, requireAdmin, async (request, response) => {
  try {
    // Delete the product if it exists
    const product = await Product.findByIdAndDelete(request.params.productId);

    if (!product) {
      return response.status(404).json({ message: 'Product not found' });
    }

    // Delete any related CategoryProduct associations
    await CategoryProduct.deleteMany({ productId: request.params.productId });

    // Delete any related ProductAttributes and their prices
    const attributes = await ProductAttribute.find({ productId: request.params.productId });
    const attributeIds = attributes.map(attribute => attribute._id);
    for (const attributeId of attributeIds) {
      await ProductAttributePrice.deleteMany({ productAttributeId: attributeId });
    }
    await ProductAttribute.deleteMany({ productId: request.params.productId });
    
    response.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Set up storage for uploaded images
// Adapted from https://expressjs.com/en/resources/middleware/multer.html
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});
const upload = multer({ storage: storage });

// Add a product
// POST /api/products
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (request, response) => {
  try {
    const { name, description, price, category, bestseller } = request.body;
    const image = request.file ? request.file.filename : '';

    if (Number(price) < 0) {
      return response.status(400).json({ message: 'Price must be at least 0.0' });
    }

    // Create product
    const product = new Product({ name, description, price: Number(price), image });
    await product.save();

    // Add CateoryProduct association for provided general category
    if (category) {
      let categoryDoc = await Category.findOne({ name: category.toLowerCase() });
      
      // If category doesn't exist, create it
      if (!categoryDoc) {
        categoryDoc = new Category({ name: category.toLowerCase() });
        await categoryDoc.save();
      }

      // Create CategoryProduct association
      await CategoryProduct.create({ productId: product._id, categoryId: categoryDoc._id });
    }

    // Add "best sellers" CategoryProduct association if bestseller is true
    if (bestseller === 'true') {
      let bestSellersCategory = await Category.findOne({ name: 'best sellers' });
      
      // If category doesn't exist, create it
      if (!bestSellersCategory) {
        bestSellersCategory = new Category({ name: 'best sellers' });
        await bestSellersCategory.save();
      }

      // Create CategoryProduct association
      await CategoryProduct.create({ productId: product._id, categoryId: bestSellersCategory._id });
    }

    response.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Edit a product by ID
// PUT /api/products/:productId
router.put('/:productId', authenticateToken, requireAdmin, upload.single('image'), async (request, response) => {
  try {
    // Get the product, if it exists
    const product = await Product.findById(request.params.productId);

    if (!product) {
      return response.status(404).json({ message: 'Product not found' });
    }

    // Get product details from request body and update fields
    const { name, description, price, category, bestseller } = request.body;

    if (name) {
      product.name = name;
    }

    if (description) {
      product.description = description;
    }

    if (price) {
      if (Number(price) < 0) {
        return response.status(400).json({ message: 'Price must be at least 0.0' });
      }

      product.price = Number(price);
    }

    if (request.file) {
      product.image = request.file.filename;
    }

    // Save the updated product
    await product.save();

    // Delete all existing category associations (main category and "best sellers")
    await CategoryProduct.deleteMany({ productId: product._id });

    // Add new category association based on category in request body
    if (category) {
      // Find matching category document, or create one if it doesn't exist
      let categoryDoc = await Category.findOne({ name: category.toLowerCase() });

      if (!categoryDoc) {
        categoryDoc = new Category({ name: category.toLowerCase() });
        await categoryDoc.save();
      }

      // Create a category association
      await CategoryProduct.create({ productId: product._id, categoryId: categoryDoc._id });
    }

    // Add "best sellers" association if specified
    if (bestseller === 'true') {
      let bestSellersCategory = await Category.findOne({ name: 'best sellers' });
      if (!bestSellersCategory) {
        bestSellersCategory = new Category({ name: 'best sellers' });
        await bestSellersCategory.save();
      }
      await CategoryProduct.create({ productId: product._id, categoryId: bestSellersCategory._id });
    }

    response.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
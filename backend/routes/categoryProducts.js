const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const CategoryProduct = require('../models/categoryProduct');

// Get all categories with their products in one request (optimized for bulk fetching)
// GET /api/category-products/all-with-products
router.get('/all-with-products', async (request, response) => {
  try {
    // Get all categories
    const categories = await Category.find();
    
    // Get all category-product associations with populated products
    const associations = await CategoryProduct.find().populate('productId');
    
    // Organize products by category
    const result = categories.map(category => {
      const categoryProducts = associations
        .filter(assoc => assoc.categoryId.toString() === category._id.toString())
        .map(assoc => assoc.productId)
        .filter(product => product !== null); // Filter out any null products
      
      return {
        category: category.name,
        products: categoryProducts
      };
    });
    
    response.json(result);
  } catch (error) {
    console.error('Error fetching all categories with products:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get best sellers organized by their other categories (optimized)
// GET /api/category-products/best-sellers-by-category
router.get('/best-sellers-by-category', async (request, response) => {
  try {
    // Find best sellers category
    const bestSellersCategory = await Category.findOne({ name: 'best sellers' });
    
    if (!bestSellersCategory) {
      return response.json({});
    }

    // Find all products in best sellers category
    const bestSellerAssocs = await CategoryProduct.find({ 
      categoryId: bestSellersCategory._id 
    }).populate('productId');
    
    const bestSellerProducts = bestSellerAssocs.map(a => a.productId).filter(p => p !== null);
    
    if (bestSellerProducts.length === 0) {
      return response.json({});
    }

    // Get all product IDs
    const productIds = bestSellerProducts.map(p => p._id);
    
    // Find all category associations for these products (excluding best sellers)
    const allAssociations = await CategoryProduct.find({
      productId: { $in: productIds }
    }).populate('categoryId');
    
    // Organize products by their other categories
    const productsByCategory = {};
    
    bestSellerProducts.forEach(product => {
      // Find all categories for this product (excluding best sellers)
      const productCategories = allAssociations
        .filter(assoc => 
          assoc.productId.toString() === product._id.toString() &&
          assoc.categoryId &&
          assoc.categoryId.name !== 'best sellers'
        )
        .map(assoc => assoc.categoryId.name);
      
      // Add product to each of its categories
      productCategories.forEach(categoryName => {
        if (!productsByCategory[categoryName]) {
          productsByCategory[categoryName] = [];
        }
        productsByCategory[categoryName].push(product);
      });
    });
    
    response.json(productsByCategory);
  } catch (error) {
    console.error('Error fetching best sellers by category:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

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
    // Find categories associated with the product and populate the categoryId
    const associations = await CategoryProduct.find({ productId: request.params.productId }).populate('categoryId');
    
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
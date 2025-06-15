const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const ProductAttribute = require('../models/productAttribute');
const ProductAttributePrice = require('../models/productAttributePrice');

// Get all product attribute prices for a product
// GET /api/product-attribute-prices/:productId/all
router.get('/:productId/all', async (request, response) => {
  try {
    const { productId } = request.params;

    const product = await Product.findById(request.params.productId);

    if (!product) {
      return response.status(404).json({ message: 'Product not found' });
    }

    const attributes = await ProductAttribute.find({ productId: product._id });

    if (!attributes || attributes.length === 0) {
      return response.json([]); // Return empty array if no attributes found
    }

    const attributePrices = [];
    for (const attribute of attributes) {
      const productAttributePrice = await ProductAttributePrice.findOne({ productAttributeId: attribute._id });
      if (productAttributePrice) {
        attributePrices.push(productAttributePrice);
      }
    }

    response.json(attributePrices);
  } catch (error) {
    console.error('Error fetching products:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get price of a single product attribute
// GET /api/product-attribute-prices/:productId?productAttributeId=...
router.get('/:productId', async (request, response) => {
  try {
    const { productId } = request.params;
    const { productAttributeId } = request.query;

    const product = await Product.findById(request.params.productId);

    if (!product) {
      return response.status(404).json({ message: 'Product not found' });
    }

    const attributes = await ProductAttribute.find({ productId: product._id });

    if (!attributes || attributes.length === 0) {
      return response.status(404).json({ message: 'Product does not have any attributes' });
    }

    // Find the price for the given product attribute ID
    let price = null;;
    for (const attribute of attributes) {
      if (attribute._id.toString() === productAttributeId) {
        const productAttributePriceDoc = await ProductAttributePrice.findOne({ productAttributeId: attribute._id });
        price = productAttributePriceDoc ? productAttributePriceDoc.price : null;
        break;
      }
    }

    if (price === null) {
      return response.status(404).json({ message: 'Product does not have the provided attribute' });
    }

    response.json({ price: price });
  } catch (error) {
    console.error('Error fetching products:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
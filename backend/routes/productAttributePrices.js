const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const ProductAttribute = require('../models/productAttribute');
const ProductAttributePrice = require('../models/productAttributePrice');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get product attributes with their prices combined (optimized endpoint)
// GET /api/product-attribute-prices/:productId/with-attributes
router.get('/:productId/with-attributes', async (request, response) => {
  try {
    const { productId } = request.params;

    // Get all attributes for this product
    const attributes = await ProductAttribute.find({ productId });

    if (!attributes || attributes.length === 0) {
      return response.json([]);
    }

    // Get all attribute IDs
    const attributeIds = attributes.map(attr => attr._id);

    // Get all prices in one query
    const prices = await ProductAttributePrice.find({ 
      productAttributeId: { $in: attributeIds } 
    });

    // Combine attributes with their prices
    const attributesWithPrices = attributes.map(attribute => {
      const priceDoc = prices.find(p => 
        p.productAttributeId.toString() === attribute._id.toString()
      );
      
      return {
        _id: attribute._id,
        productId: attribute.productId,
        attributeName: attribute.attributeName,
        attributeValue: attribute.attributeValue,
        price: priceDoc ? priceDoc.price : null
      };
    }).filter(attr => attr.price !== null); // Only return attributes that have prices

    response.json(attributesWithPrices);
  } catch (error) {
    console.error('Error fetching product attributes with prices:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

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
    let price = null;
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

// Create a new product attribute price
// POST /api/product-attribute-prices/:productId
router.post('/:productId', authenticateToken, requireAdmin, async (request, response) => {
  try {
    const { productAttributeId, price } = request.body;

    if (Number(price) < 0) {
      return response.status(400).json({ message: 'Price must be at least 0.0' });
    }

    const newPrice = new ProductAttributePrice({
      productAttributeId,
      price: Number(price)
    });

    await newPrice.save();

    response.status(201).json(newPrice);
  } catch (error) {
    response.status(500).json({ message: 'Error creating attribute price' });
  }
});

// Update an existing product attribute price
// PUT /api/product-attribute-prices/:productId
router.put('/:productId', authenticateToken, requireAdmin, async (request, response) => {
  try {
    const { productAttributeId, price } = request.body;

    if (Number(price) < 0) {
      return response.status(400).json({ message: 'Price must be at least 0.0' });
    }

    const updatedPrice = await ProductAttributePrice.findOneAndUpdate(
      { productAttributeId },
      { price: Number(price) },
      { new: true }
    );

    if (!updatedPrice) {
      return response.status(404).json({ message: 'Attribute price not found' });
    }

    response.json(updatedPrice);
  } catch (error) {
    response.status(500).json({ message: 'Error updating attribute price' });
  }
});

// Delete a product attribute price
// DELETE /api/product-attribute-prices/:productId
router.delete('/:productId', authenticateToken, requireAdmin, async (request, response) => {
  try {
    const { productAttributeId } = request.query;

    const deletedAttribute = await ProductAttributePrice.findOneAndDelete({ productAttributeId });

    if (!deletedAttribute) {
      return response.status(404).json({ message: 'Attribute price not found' });
    }

    response.json({ message: 'Attribute price deleted' });
  } catch (error) {
    response.status(500).json({ message: 'Error deleting attribute price' });
  }
});

module.exports = router;
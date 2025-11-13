const express = require('express');
const router = express.Router();
const ProductAttribute = require('../models/productAttribute');
const ProductAttributePrice = require('../models/productAttributePrice');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Bulk save product attributes (create, update, delete) - optimized endpoint
// POST /api/product-attributes/:productId/bulk-save
router.post('/:productId/bulk-save', authenticateToken, requireAdmin, async (request, response) => {
  try {
    const { productId } = request.params;
    const { attributeName, attributesToDelete, attributesToAdd, attributesToUpdate } = request.body;

    if (!attributeName || !attributeName.trim()) {
      return response.status(400).json({ message: 'Attribute name is required' });
    }

    // Validate prices
    const allAttributes = [...(attributesToAdd || []), ...(attributesToUpdate || [])];
    for (const attr of allAttributes) {
      if (Number(attr.price) < 0) {
        return response.status(400).json({ message: 'Price cannot be negative' });
      }
    }

    // 1. Delete attributes and their prices in bulk
    if (attributesToDelete && attributesToDelete.length > 0) {
      await ProductAttributePrice.deleteMany({ 
        productAttributeId: { $in: attributesToDelete } 
      });
      await ProductAttribute.deleteMany({ 
        _id: { $in: attributesToDelete } 
      });
    }

    // 2. Add new attributes and prices
    const newAttributeIds = [];
    if (attributesToAdd && attributesToAdd.length > 0) {
      for (const attr of attributesToAdd) {
        const newAttribute = new ProductAttribute({
          productId,
          attributeName,
          attributeValue: attr.attributeValue
        });
        await newAttribute.save();
        newAttributeIds.push(newAttribute._id);

        // Create price
        const newPrice = new ProductAttributePrice({
          productAttributeId: newAttribute._id,
          price: attr.price
        });
        await newPrice.save();
      }
    }

    // 3. Update existing attributes and prices in bulk
    if (attributesToUpdate && attributesToUpdate.length > 0) {
      for (const attr of attributesToUpdate) {
        await ProductAttribute.findByIdAndUpdate(
          attr._id,
          { attributeName, attributeValue: attr.attributeValue }
        );

        await ProductAttributePrice.findOneAndUpdate(
          { productAttributeId: attr._id },
          { price: attr.price },
          { upsert: true }
        );
      }
    }

    // Return updated attributes with prices
    const updatedAttributes = await ProductAttribute.find({ productId });
    const attributeIds = updatedAttributes.map(a => a._id);
    const prices = await ProductAttributePrice.find({ 
      productAttributeId: { $in: attributeIds } 
    });

    const result = updatedAttributes.map(attr => {
      const priceDoc = prices.find(p => 
        p.productAttributeId.toString() === attr._id.toString()
      );
      return {
        _id: attr._id,
        productId: attr.productId,
        attributeName: attr.attributeName,
        attributeValue: attr.attributeValue,
        price: priceDoc ? priceDoc.price : null
      };
    });

    response.json(result);
  } catch (error) {
    console.error('Error bulk saving attributes:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get all product attributes for a product
// GET /api/product-attributes/:productId
router.get('/:productId', async (request, response) => {
  try {
    // Get all product attributes for a product, if they exist
    const productAttributes = await ProductAttribute.find({ productId: request.params.productId });
    response.json(productAttributes); // Returns empty array if product has no attributes
  } catch (error) {
    console.error('Error fetching product attributes:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get a product attribute by ID
// GET /api/product-attributes/attribute/:attributeId
router.get('/attribute/:attributeId', async (request, response) => {
  try {
    const attribute = await ProductAttribute.findById(request.params.attributeId);
    
    if (!attribute) {
      return response.status(404).json({ message: 'Attribute not found' });
    }

    response.json(attribute);
  } catch (error) {
    console.error('Error fetching product attribute:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new product attribute for a product
// POST /api/product-attributes/:productId
router.post('/:productId', authenticateToken, requireAdmin, async (request, response) => {
  try {
    const { attributeName, attributeValue } = request.body;

    const newAttribute = new ProductAttribute({
      productId: request.params.productId,
      attributeName,
      attributeValue
    });

    await newAttribute.save();

    response.status(201).json(newAttribute);
  } catch (error) {
    response.status(500).json({ message: 'Error creating attribute' });
  }
});

// Update an existing product attribute by ID
// PUT /api/product-attributes/attribute/:attributeId
router.put('/attribute/:attributeId', authenticateToken, requireAdmin, async (request, response) => {
  try {
    const { attributeName, attributeValue } = request.body;

    const updatedAttribute = await ProductAttribute.findByIdAndUpdate(
      request.params.attributeId,
      { attributeName, attributeValue },
      { new: true }
    );

    if (!updatedAttribute) {
      return response.status(404).json({ message: 'Attribute not found' });
    }

    response.json(updatedAttribute);
  } catch (error) {
    response.status(500).json({ message: 'Error updating attribute' });
  }
});

// Delete a product attribute by ID
// DELETE /api/product-attributes/attribute/:attributeId
router.delete('/attribute/:attributeId', authenticateToken, requireAdmin, async (request, response) => {
  try {
    const deletedAttribute = await ProductAttribute.findByIdAndDelete(request.params.attributeId);

    if (!deletedAttribute) {
      return response.status(404).json({ message: 'Attribute not found' });
    }

    response.json({ message: 'Attribute deleted successfully' });
  } catch (error) {
    response.status(500).json({ message: 'Error deleting attribute' });
  }
});

module.exports = router;
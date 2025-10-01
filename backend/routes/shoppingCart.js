const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const ShoppingCart = require('../models/shoppingCart');
const ProductAttribute = require('../models/productAttribute');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Create new cart
// POST /api/shopping-cart
router.post('/', async (request, response) => {
  try {
    const cart = new ShoppingCart({
      cartId: new mongoose.Types.ObjectId().toString(),
      items: []
    });

    await cart.save();
    response.json({ cartId: cart.cartId });
  } catch (error) {
    console.error('Error creating cart:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get all carts
// GET /api/shopping-cart
router.get('/', authenticateToken, requireAdmin, async (request, response) => {
  try {
    const carts = await ShoppingCart.find({});
    response.json(carts);
  } catch (error) {
    console.error('Error fetching carts:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get cart items by cartId
// GET /api/shopping-cart/:cartId/items
router.get('/:cartId/items', async (request, response) => {
  try {
    const cart = await ShoppingCart.findOne({ cartId: request.params.cartId });
    
    if (!cart) {
      return response.status(404).json({ message: 'Cart not found' });
    }

    response.json(cart);

  } catch (error) {
    console.error('Error fetching cart:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Add item to cart
// POST /api/shopping-cart/:cartId/items
router.post('/:cartId/items', async (request, response) => {
  try {
    const { productId, productAttributeId } = request.body;

    if (!productId) {
      return response.status(400).json({ message: 'Product ID is required' });
    }

    // Get product and cart, if they exist
    const product = await Product.findById(productId);
    const cart = await ShoppingCart.findOne({ cartId: request.params.cartId });

    if (!cart) {
      return response.status(404).json({ message: 'Cart not found' });
    }

    // Check if product requires a product attribute and if none was given
    const productAttributes = await ProductAttribute.find({ productId: product._id });
    if (productAttributes.length > 0 && !productAttributeId) {
      return response.status(400).json({ message: 'Product Attribute ID is required for this product' });
    }

    // Check if product actually has the given productAttributeId (if one was provided)
    if (productAttributeId) {
      let isFound = false;
      
      for (const attribute of productAttributes) {
        if (attribute._id.toString() === productAttributeId) {
          isFound = true;
          break;
        }
      }

      if (!isFound) {
        return response.status(400).json({ message: 'Product does not have the provided Product Attribute ID' });
      }
    }

    let itemFromCart = null;

    // Check if the given productAttributeId (if any) is already in the cart
    if (productAttributeId) {
      itemFromCart = cart.items.find(
        item => item.productId.equals(product._id) && item.productAttributeId && (item.productAttributeId.toString() === productAttributeId)
      );
    } else {
      itemFromCart = cart.items.find(
        item => item.productId.equals(product._id) && (!item.productAttributeId || item.productAttributeId === '')
      );
    }

    // Update cart
    if (!itemFromCart) {
      cart.items.push({
        productId: product._id,
        productAttributeId: productAttributeId,
        quantity: 1
      });
    } else {
      itemFromCart.quantity++;
    }

    await cart.save();
    response.json(cart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Delete cart
// DELETE /api/shopping-cart/:cartId
router.delete('/:cartId', async (request, response) => {
  try {
    const result = await ShoppingCart.deleteOne({ cartId: request.params.cartId });
    
    response.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
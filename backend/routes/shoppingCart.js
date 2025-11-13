const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const ShoppingCart = require('../models/shoppingCart');
const ProductAttribute = require('../models/productAttribute');
const ProductAttributePrice = require('../models/productAttributePrice');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

// Create new cart
// POST /api/shopping-cart (optional auth - works for both logged in and anonymous users)
router.post('/', optionalAuth, async (request, response) => {
  try {
    const cartData = {
      cartId: new mongoose.Types.ObjectId().toString(),
      items: []
    };

    // If user is authenticated, add their userId to the cart
    if (request.user) {
      cartData.userId = request.user.id;
    }

    const cart = new ShoppingCart(cartData);

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
    const carts = await ShoppingCart.find({}).populate('userId', 'name email');
    response.json(carts);
  } catch (error) {
    console.error('Error fetching carts:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get all carts with full product details (optimized for admin view)
// GET /api/shopping-cart/all-detailed
router.get('/all-detailed', authenticateToken, requireAdmin, async (request, response) => {
  try {
    // Get all carts with user info populated
    const carts = await ShoppingCart.find({}).populate('userId', 'name email');

    if (carts.length === 0) {
      return response.json([]);
    }

    // Collect all unique product IDs and attribute IDs across all carts
    const allProductIds = new Set();
    const allAttributeIds = new Set();

    carts.forEach(cart => {
      cart.items.forEach(item => {
        allProductIds.add(item.productId.toString());
        if (item.productAttributeId) {
          allAttributeIds.add(item.productAttributeId.toString());
        }
      });
    });

    // Fetch all products, attributes, and prices in bulk
    const products = await Product.find({ _id: { $in: Array.from(allProductIds) } });
    
    let attributes = [];
    let attributePrices = [];
    if (allAttributeIds.size > 0) {
      attributes = await ProductAttribute.find({ 
        _id: { $in: Array.from(allAttributeIds) } 
      });
      attributePrices = await ProductAttributePrice.find({ 
        productAttributeId: { $in: Array.from(allAttributeIds) } 
      });
    }

    // Build detailed carts array
    const detailedCarts = carts.map(cart => {
      const detailedItems = cart.items.map(item => {
        const product = products.find(p => 
          p._id.toString() === item.productId.toString()
        );
        
        let attributeDetails = null;
        let price = product ? product.price : 0;

        if (item.productAttributeId) {
          const attribute = attributes.find(a => 
            a._id.toString() === item.productAttributeId.toString()
          );
          const priceDoc = attributePrices.find(p => 
            p.productAttributeId.toString() === item.productAttributeId.toString()
          );

          if (attribute) {
            attributeDetails = {
              attributeName: attribute.attributeName,
              attributeValue: attribute.attributeValue
            };
          }

          if (priceDoc) {
            price = priceDoc.price;
          }
        }

        return {
          productId: item.productId,
          productName: product ? product.name : 'Product unavailable',
          productPrice: price,
          productAttributeId: item.productAttributeId,
          attributeName: attributeDetails?.attributeName || null,
          attributeValue: attributeDetails?.attributeValue || null,
          quantity: item.quantity
        };
      });

      return {
        cartId: cart.cartId,
        userId: cart.userId,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        items: detailedItems
      };
    });

    response.json(detailedCarts);
  } catch (error) {
    console.error('Error fetching detailed carts:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get cart items by cartId with full product details (optimized)
// GET /api/shopping-cart/:cartId/items-detailed
router.get('/:cartId/items-detailed', async (request, response) => {
  try {
    const cart = await ShoppingCart.findOne({ cartId: request.params.cartId });
    
    if (!cart) {
      return response.status(404).json({ message: 'Cart not found' });
    }

    if (cart.items.length === 0) {
      return response.json({ cartId: cart.cartId, items: [] });
    }

    // Get all unique product IDs and attribute IDs
    const productIds = [...new Set(cart.items.map(item => item.productId))];
    const attributeIds = cart.items
      .filter(item => item.productAttributeId)
      .map(item => item.productAttributeId);

    // Fetch all products in one query
    const products = await Product.find({ _id: { $in: productIds } });

    // Fetch all attributes in one query (if any)
    let attributes = [];
    let attributePrices = [];
    if (attributeIds.length > 0) {
      attributes = await ProductAttribute.find({ _id: { $in: attributeIds } });
      attributePrices = await ProductAttributePrice.find({ 
        productAttributeId: { $in: attributeIds } 
      });
    }

    // Build detailed items array
    const detailedItems = cart.items.map(item => {
      const product = products.find(p => p._id.toString() === item.productId.toString());
      
      let attributeDetails = null;
      let price = product ? product.price : 0;

      if (item.productAttributeId) {
        const attribute = attributes.find(a => 
          a._id.toString() === item.productAttributeId.toString()
        );
        const priceDoc = attributePrices.find(p => 
          p.productAttributeId.toString() === item.productAttributeId.toString()
        );

        if (attribute) {
          attributeDetails = {
            attributeName: attribute.attributeName,
            attributeValue: attribute.attributeValue
          };
        }

        if (priceDoc) {
          price = priceDoc.price;
        }
      }

      return {
        productId: item.productId,
        productAttributeId: item.productAttributeId,
        quantity: item.quantity,
        product: product ? {
          _id: product._id,
          name: product.name,
          description: product.description,
          image: product.image,
          price: product.price
        } : null,
        attribute: attributeDetails,
        finalPrice: price
      };
    });

    response.json({
      cartId: cart.cartId,
      items: detailedItems
    });

  } catch (error) {
    console.error('Error fetching detailed cart:', error);
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
    const { productId, productAttributeId, quantity } = request.body;

    if (!productId) {
      return response.status(400).json({ message: 'Product ID is required' });
    }

    if (!quantity || quantity < 1) {
      return response.status(400).json({ message: 'Quantity must be at least 1' });
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
        quantity: quantity
      });
    } else {
      itemFromCart.quantity += quantity;
    }

    await cart.save();
    response.json(cart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Remove item from cart
// DELETE /api/shopping-cart/:cartId/items
router.delete('/:cartId/items', async (request, response) => {
  try {
    const { productId, productAttributeId } = request.body;

    if (!productId) {
      return response.status(400).json({ message: 'Product ID is required' });
    }

    const cart = await ShoppingCart.findOne({ cartId: request.params.cartId });

    if (!cart) {
      return response.status(404).json({ message: 'Cart not found' });
    }

    // Find and remove the item
    if (productAttributeId) {
      cart.items = cart.items.filter(
        item => !(item.productId.toString() === productId && 
                  item.productAttributeId && 
                  item.productAttributeId.toString() === productAttributeId)
      );
    } else {
      cart.items = cart.items.filter(
        item => !(item.productId.toString() === productId && !item.productAttributeId)
      );
    }

    await cart.save();
    response.json(cart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Update item quantity in cart
// PATCH /api/shopping-cart/:cartId/items/quantity
router.patch('/:cartId/items/quantity', async (request, response) => {
  try {
    const { productId, productAttributeId, quantity } = request.body;

    if (!productId) {
      return response.status(400).json({ message: 'Product ID is required' });
    }

    if (!quantity || quantity < 1) {
      return response.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await ShoppingCart.findOne({ cartId: request.params.cartId });

    if (!cart) {
      return response.status(404).json({ message: 'Cart not found' });
    }

    // Find and update the item
    let itemFound = false;
    if (productAttributeId) {
      const item = cart.items.find(
        item => item.productId.toString() === productId && 
                item.productAttributeId && 
                item.productAttributeId.toString() === productAttributeId
      );
      if (item) {
        item.quantity = quantity;
        itemFound = true;
      }
    } else {
      const item = cart.items.find(
        item => item.productId.toString() === productId && !item.productAttributeId
      );
      if (item) {
        item.quantity = quantity;
        itemFound = true;
      }
    }

    if (!itemFound) {
      return response.status(404).json({ message: 'Item not found in cart' });
    }

    await cart.save();
    response.json(cart);
  } catch (error) {
    console.error('Error updating item quantity:', error);
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
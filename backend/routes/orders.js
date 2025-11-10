const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const ShoppingCart = require('../models/shoppingCart');
const Counter = require('../models/counter');
const Product = require('../models/product');
const ProductAttribute = require('../models/productAttribute');
const ProductAttributePrice = require('../models/productAttributePrice');
const Category = require('../models/category');
const CategoryProduct = require('../models/categoryProduct');
const mongoose = require('mongoose');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

// Adapted from https://stackoverflow.com/questions/48239888/auto-increment-sequence-in-mongoose
async function getNextOrderNumber() {
  const counter = await Counter.findOneAndUpdate(
    { name: 'orderNumber' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (!counter) {
    throw new Error('Counter not found or created');
  }

  return counter.seq;
}

// Get all orders
// GET /api/orders (admin only)
router.get('/', authenticateToken, requireAdmin, async (request, response) => {
  try {
    const orders = await Order.find();
    response.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user's orders
// GET /api/orders/user/my-orders (login required)
router.get('/user/my-orders', authenticateToken, async (request, response) => {
  try {
    const orders = await Order.find({ userId: request.user._id });
    response.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get order by order number
// GET /api/orders/:orderNumber (optional auth)
router.get('/:orderNumber', optionalAuth, async (request, response) => {
  try {
    let query = { orderNumber: request.params.orderNumber };
    
    // If not admin, only show own orders
    if (request.user && request.user.role !== 'admin') {
      query.userId = request.user._id; // Add userId to Order model
    }

    // If user is not an admin and not logged in, allow access to any order (for demo purposes)

    const order = await Order.findOne(query);

    if (!order) {
      return response.status(404).json({ message: 'Order not found' });
    }

    response.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Create new order
// POST /api/orders (optional auth)
router.post('/', optionalAuth, async (request, response) => {
  // Get firstName, lastName, deliveryAddress and cartId from request body
  const { firstName, lastName, deliveryAddress, cartId } = request.body;

  if (!firstName) {
    return response.status(400).json({ message: 'First name is required' });
  }

  if (!lastName) {
    return response.status(400).json({ message: 'Last name is required' });
  }

  if (!deliveryAddress) {
    return response.status(400).json({ message: 'Delivery address is required' });
  }

  if (!cartId) {
    return response.status(400).json({ message: 'Cart ID is required' });
  }

  try {
    // Get cart by Cart ID
    const cart = await ShoppingCart.findOne({ cartId });

    if (!cart) {
      return response.status(404).json({ message: 'Cart not found' });
    }

    if (!cart.items || cart.items.length === 0) {
      return response.status(400).json({ message: 'Cart is empty' });
    }

    let orderTotal = 0;
    let orderItems = [];

    for (const item of cart.items) {

      // Fetch product details
      const product = await Product.findById(item.productId);

      // Fetch product category
      const categoryProduct = await CategoryProduct.findOne({ productId: product._id });
      let categoryName = null;
      if (categoryProduct) {
        const categoryData = await Category.findById(categoryProduct.categoryId);
        categoryName = categoryData ? categoryData.name : 'Unknown';
      } else {
        categoryName = 'Unknown';
      }

      // Fetch product attribute details if they exist
      const productAttribute = await ProductAttribute.findById(item.productAttributeId);
      let attributeId = productAttribute ? productAttribute._id : null;
      let attributeName = null;
      let attributeValue = null;
      let attributePrice = null;
      if (productAttribute) {
        attributeName = productAttribute.attributeName;
        attributeValue = productAttribute.attributeValue;

        const productAttributePrice = await ProductAttributePrice.findOne({ 
          productId: item.productId,
          productAttributeId: attributeId 
        });
        attributePrice = productAttributePrice ? productAttributePrice.price : null;
      }

      const orderItem = {
        productId: item.productId,
        productAttributeId: attributeId || null,
        productSnapshot: {
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: categoryName
        },
        attributeSnapshot: productAttribute ? {
          attributeName: attributeName,
          attributeValue: attributeValue,
          price: attributePrice
        } : null,
        quantity: item.quantity,
        finalPrice: attributePrice ? attributePrice : product.price
      };

      orderItems.push(orderItem);
      orderTotal += orderItem.finalPrice * item.quantity;
    }

    const orderNumber = await getNextOrderNumber();
    const customerName = `${firstName} ${lastName}`;
    
    const order = new Order({
      customerName: customerName,
      firstName: firstName,
      lastName: lastName,
      deliveryAddress: deliveryAddress,
      orderNumber: orderNumber.toString(),
      userId: request.user ? request.user._id : null, // Add userId if authenticated
      items: orderItems,
      total: orderTotal
    });

    await order.save();
    response.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
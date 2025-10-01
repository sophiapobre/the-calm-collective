const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const ShoppingCart = require('../models/shoppingCart');
const Counter = require('../models/counter');
const mongoose = require('mongoose');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

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
// GET /api/orders/user/my-orders
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
// GET /api/orders/:orderNumber
router.get('/:orderNumber', authenticateToken, async (request, response) => {
  try {
    let query = { orderNumber: request.params.orderNumber };
    
    // If not admin, only show own orders
    if (request.user.role !== 'admin') {
      query.userId = request.user._id; // Add userId to Order model
    }

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
// POST /api/orders
router.post('/', authenticateToken, async (request, response) => {
  // Get name and cartId from request body
  const { name, cartId } = request.body;

  if (!name) {
    return response.status(400).json({ message: 'Customer name is required' });
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

    const orderNumber = await getNextOrderNumber();
    const order = new Order({
      customerName: name,
      orderNumber: orderNumber.toString(),
      userId: request.user ? request.user._id : null, // Add userId if authenticated
      items: cart.items
    });

    await order.save();
    response.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
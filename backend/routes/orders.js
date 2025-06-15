const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const ShoppingCart = require('../models/shoppingCart');
const Counter = require('../models/counter');
const mongoose = require('mongoose');

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
// GET /api/orders
router.get('/', async (request, response) => {
  try {
    const orders = await Order.find();
    response.json(orders);
  } catch (error) {
    console.error('Error fetching products:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
});

// Get order by order number
// GET /api/orders/:orderNumber
router.get('/:orderNumber', async (request, response) => {
  try {
    const order = await Order.findOne({ orderNumber: request.params.orderNumber });

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
router.post('/', async (request, response) => {
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
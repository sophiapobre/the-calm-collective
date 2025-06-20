const mongoose = require('mongoose');
const Order = require('../models/order');
const Counter = require('../models/counter');

mongoose.connect('mongodb://mongo:27017/e-commerce')
  .then(async () => {
    // Clear all orders
    await Order.deleteMany();

    // Reset order number counter
    await Counter.deleteOne({ name: 'orderNumber' });
    await Counter.create({ name: 'orderNumber', seq: 102472935018420 }); // Set default to random high number
    
    console.log('All orders cleared successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
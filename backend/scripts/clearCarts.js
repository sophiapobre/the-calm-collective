require('dotenv').config();
const mongoose = require('mongoose');
const ShoppingCart = require('../models/shoppingCart');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(async () => {
    // Clear all shopping carts
    await ShoppingCart.deleteMany();
    
    console.log('All carts cleared successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
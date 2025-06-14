const mongoose = require('mongoose');
const ShoppingCart = require('../models/shoppingCart');

mongoose.connect('mongodb://127.0.0.1:27017/e-commerce')
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
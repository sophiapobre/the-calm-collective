require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product');
const products = require('../products');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(async () => {
    // Clear products
    await Product.deleteMany();

    // Add products to the Product model
    await Product.insertMany(products);

    console.log('Products imported successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
const mongoose = require('mongoose');
const Product = require('../models/product');
const products = require('../products');

mongoose.connect('mongodb://mongo:27017/e-commerce')
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
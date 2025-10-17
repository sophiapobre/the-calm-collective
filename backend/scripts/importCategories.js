require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/category');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(async () => {
    // Clear categories
    await Category.deleteMany();

    // Add categories to the Category model
    await Category.insertMany([
      { name: 'shoes' },
      { name: 'bags' },
      { name: 'electronics' },
      { name: 'best sellers' }
    ]);

    console.log('Categories imported successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
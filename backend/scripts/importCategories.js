const mongoose = require('mongoose');
const Category = require('../models/category');

mongoose.connect('mongodb://127.0.0.1:27017/e-commerce')
  .then(async () => {
    // Clear categories
    await Category.deleteMany();

    // Add categories to the Category model
    await Category.insertMany([
      { name: 'shoes' },
      { name: 'bags' },
      { name: 'electronics' }
    ]);

    console.log('Categories imported successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
const mongoose = require('mongoose');
const Category = require('../models/category');
const Product = require('../models/product');
const CategoryProduct = require('../models/categoryproduct');

mongoose.connect('mongodb://127.0.0.1:27017/e-commerce')
  .then(async () => {
    // Clear associations
    let associations = [];

    // Find all products
    const products = await Product.find();

    for (const product of products) {
      // Find category of the product
      const category = await Category.findOne({ name: product.category });

      // Add to category product associations
      if (category !== null) {
        associations.push({
          categoryId: category._id,
          productId: product._id
        });
      }
    }

    // Add associations to the CategoryProduct model
    await CategoryProduct.insertMany(associations);

    console.log('CategoryProducts imported successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
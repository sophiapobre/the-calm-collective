require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/category');
const Product = require('../models/product');
const CategoryProduct = require('../models/categoryProduct');

const productCategoryMap = [
  { productName: 'Asics Gel Nimbus 26', categoryName: 'shoes' },
  { productName: 'Brooks Ghost Max 2', categoryName: 'shoes' },
  { productName: 'Hoka Clifton 10', categoryName: 'shoes' },
  { productName: 'Apple iPhone 16', categoryName: 'electronics' },
  { productName: 'Nintendo Switch 2', categoryName: 'electronics' },
  { productName: 'Samsonite Rosaline Eco Backpack', categoryName: 'bags' },
  { productName: 'Tumi Montana Backpack', categoryName: 'bags' },
  { productName: 'Hoka Clifton 10', categoryName: 'best sellers' },
  { productName: 'Nintendo Switch 2', categoryName: 'best sellers' },
  { productName: 'Samsonite Rosaline Eco Backpack', categoryName: 'best sellers' },
  { productName: 'Tumi Montana Backpack', categoryName: 'best sellers' },
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(async () => {
    // Clear associations
    await CategoryProduct.deleteMany({});
    let associations = [];

    for (const item of productCategoryMap) {
      // Find product and category
      const product = await Product.findOne({ name: item.productName });
      const category = await Category.findOne({ name: item.categoryName });

      if (product !== null && category !== null) {
        associations.push({
          categoryId: category._id,
          productId: product._id
        });
      } else {
        console.log(`Either ${item.productName} or ${item.categoryName} is missing from database`);
      }
    }

    if (associations.length > 0) {
      await CategoryProduct.insertMany(associations);
      console.log('CategoryProducts imported successfully');
    } else {
      console.log('No CategoryProducts imported');
    }

    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
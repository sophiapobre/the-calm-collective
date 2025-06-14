const mongoose = require('mongoose');
const Product = require('../models/product');
const ProductAttribute = require('../models/productAttribute');

mongoose.connect('mongodb://127.0.0.1:27017/e-commerce')
  .then(async () => {
    // Clear product attributes
    await ProductAttribute.deleteMany({});

    const products = await Product.find();
    let productAttributes = [];

    for (const product of products) {
      if (product.name === 'Apple iPhone 16') {
        productAttributes.push(
          { productId: product._id, attributeName: 'Storage', attributeValue: '128GB' },
          { productId: product._id, attributeName: 'Storage', attributeValue: '256GB' }
        );
      } else if (product.name === 'Hoka Clifton 10') {
        productAttributes.push(
          { productId: product._id, attributeName: 'Size', attributeValue: '6.5' },
          { productId: product._id, attributeName: 'Size', attributeValue: '6.5 Wide' }
        );
      }
    }

    await ProductAttribute.insertMany(productAttributes);

    console.log('ProductAttributes imported successfully: ');
    console.log(productAttributes);
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
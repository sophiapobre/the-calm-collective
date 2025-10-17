require('dotenv').config();
const mongoose = require('mongoose');
const ProductAttribute = require('../models/productAttribute');
const ProductAttributePrice = require('../models/productAttributePrice');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(async () => {
    // Clear product attribute prices
    await ProductAttributePrice.deleteMany({});

    const attributes = await ProductAttribute.find();
    let attributePrices = [];

    for (const attribute of attributes) {
      if (attribute.attributeName === 'Storage' && attribute.attributeValue === '128GB') {
        attributePrices.push(
          { productAttributeId: attribute._id, price: 1279 },
        );
      } else if (attribute.attributeName === 'Storage' && attribute.attributeValue === '256GB') {
        attributePrices.push(
          { productAttributeId: attribute._id, price: 1579 }
        );
      } else if (attribute.attributeName === 'Size' && attribute.attributeValue === '6.5') {
        attributePrices.push(
          { productAttributeId: attribute._id, price: 170 }
        );
      } else if (attribute.attributeName === 'Size' && attribute.attributeValue === '6.5 Wide') {
        attributePrices.push(
          { productAttributeId: attribute._id, price: 150 }
        );
      }
    }

    await ProductAttributePrice.insertMany(attributePrices);

    console.log('ProductAttributePrices imported successfully: ');
    console.log(attributePrices);
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  attributeName: String,
  attributeValue: String
});

module.exports = mongoose.model('ProductAttribute', productAttributeSchema);
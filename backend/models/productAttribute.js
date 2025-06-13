const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  attributeName: {
    type: String,
    required: true
  },
  attributeValue: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('ProductAttribute', productAttributeSchema);
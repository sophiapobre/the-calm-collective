const mongoose = require('mongoose');

const productAttributePriceSchema = new mongoose.Schema({
  productAttributeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductAttribute',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0.0
  }
});

module.exports = mongoose.model('ProductAttributePrice', productAttributePriceSchema);
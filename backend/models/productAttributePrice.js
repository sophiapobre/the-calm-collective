const mongoose = require('mongoose');

const productAttributePriceSchema = new mongoose.Schema({
  productAttributeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductAttribute'
  },
  price: Number
});

module.exports = mongoose.model('ProductAttributePrice', productAttributePriceSchema);
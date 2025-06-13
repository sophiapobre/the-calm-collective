const mongoose = require('mongoose');

const shoppingCartSchema = new mongoose.Schema({
  cartId: String,
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      productAttributeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductAttribute'
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model('ShoppingCart', shoppingCartSchema);
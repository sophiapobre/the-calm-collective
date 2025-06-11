const mongoose = require('mongoose');

const shoppingCartSchema = new mongoose.Schema({
  cartId: String,
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      productAttributeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductAttribute'
      },
      quantity: Number
    }
  ]
});

module.exports = mongoose.model('ShoppingCart', shoppingCartSchema);
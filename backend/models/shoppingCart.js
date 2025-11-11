const mongoose = require('mongoose');

const shoppingCartSchema = new mongoose.Schema({
  cartId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('ShoppingCart', shoppingCartSchema);
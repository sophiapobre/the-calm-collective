const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  orderNumber: String,
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
      quantity: Number,
      price: Number
    }
  ]
});

module.exports = mongoose.model('Order', orderSchema);
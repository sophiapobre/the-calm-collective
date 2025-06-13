const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  orderNumber: String,
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

module.exports = mongoose.model('Order', orderSchema);
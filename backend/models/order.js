const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  userId: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for guest orders
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
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
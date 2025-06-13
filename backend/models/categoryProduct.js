const mongoose = require('mongoose');

const categoryProductSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

module.exports = mongoose.model('CategoryProduct', categoryProductSchema);
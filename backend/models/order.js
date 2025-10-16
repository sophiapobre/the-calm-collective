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
    required: false
  },
  items: [
    {
      // Keep the reference for admin purposes
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      productAttributeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductAttribute'
      },
      
      // SNAPSHOT: Store product details at time of order
      productSnapshot: {
        name: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        image: {
          type: String
        },
        category: {
          type: String,
          required: true
        }
      },
      
      // SNAPSHOT: Store attribute details if they exist
      attributeSnapshot: {
        attributeName: String,    // e.g., "Size"
        attributeValue: String,   // e.g., "Large"
        price: Number            // Attribute-specific price
      },
      
      quantity: {
        type: Number,
        required: true
      },
      
      // Store the final price paid
      finalPrice: {
        type: Number,
        required: true
      }
    }
  ],
  
  // Store totals at order level
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
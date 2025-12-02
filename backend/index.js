const port = process.env.PORT || 4000;

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');

const cookieParser = require('cookie-parser');

// Add environment variables support
require('dotenv').config();

// Configure CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',  // Local development
      'http://localhost:5173',  // Vite dev server (if you switch to Vite)
      process.env.FRONTEND_URL  // Production frontend URL (set in Vercel)
    ].filter(Boolean); // Remove undefined values
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// MongoDB connection
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/e-commerce';
mongoose.connect(mongoUrl)
  .then(() => console.log(`Connected to MongoDB at ${mongoUrl}`))
  .catch((err) => console.error('MongoDB connection error:', err));

// API creation
app.get('/', (request, response) => {
  response.send('App is running');
})

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

const categoryRoutes = require('./routes/categories');
app.use('/api/categories', categoryRoutes);

const categoryProductRoutes = require('./routes/categoryProducts');
app.use('/api/category-products', categoryProductRoutes);

const productAttributeRoutes = require('./routes/productAttributes');
app.use('/api/product-attributes', productAttributeRoutes);

const productAttributePriceRoutes = require('./routes/productAttributePrices');
app.use('/api/product-attribute-prices', productAttributePriceRoutes);

const shoppingCartRoutes = require('./routes/shoppingCart');
app.use('/api/shopping-cart', shoppingCartRoutes);

const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

app.use('/images', express.static('public/images'));

app.listen(port, (error) => {
    if (error) {
        console.error(`Error starting server: ${error}`);
    } else {
        console.log(`Server is running on port ${port}`);
    }
})
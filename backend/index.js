const port = 4000;

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/e-commerce')

// API creation
app.get('/', (request, response) => {
  response.send('App is running');
})

app.listen(port, (error) => {
    if (error) {
        console.error(`Error starting server: ${error}`);
    } else {
        console.log(`Server is running on port ${port}`);
    }
})


// Import routes

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
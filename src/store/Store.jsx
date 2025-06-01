import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';

// Adapted code from Code With Yousaf
const store = configureStore({
    reducer: {
        cart: cartSlice
    }
})

export default store;
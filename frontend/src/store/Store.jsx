import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';

// Adapted code from Code with Yousaf https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf
const store = configureStore({
    reducer: {
        cart: cartSlice
    }
})

export default store;
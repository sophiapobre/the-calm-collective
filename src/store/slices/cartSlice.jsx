import { createSlice } from '@reduxjs/toolkit';

// Adapted code from Code With Yousaf
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: []
    },
    reducers: {
        addToCart : (state, action) => {
            state.cart.push(action.payload);
        },
        clearCart : (state) => {
            state.cart = [];
        }
    }
});

export default cartSlice.reducer;
export const { addToCart, clearCart } = cartSlice.actions;
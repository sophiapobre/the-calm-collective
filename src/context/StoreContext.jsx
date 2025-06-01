import React, { createContext } from 'react';
import products from '../components/assets/products.js';

export const StoreContext = createContext(null);

// Adapted code from GreatStack Tutorial
const StoreContextProvider = (props) => {
    const context = {products};

    return (
        <StoreContext.Provider value={context}>
           {props.children} 
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
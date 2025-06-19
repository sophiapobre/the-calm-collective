import { React, useState } from 'react';
import { Link } from 'react-router-dom'

import './Productmanager.css';

const ProductManager = (item) => {

    return (
        <div>
            <h1>Manage Products</h1>
            <div className='admin-container'>
                <Link to='/admin/products/add'>
                    <button className='admin-button'>Add a Product</button>
                </Link>
            </div>
        </div>
    )
}

export default ProductManager;
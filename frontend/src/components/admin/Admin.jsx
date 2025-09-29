import { React, useState } from 'react';
import { Link } from 'react-router-dom'

import './Admin.css';

const Admin = (item) => {

    return (
        <div className='overall-admin-container'>
            <h1>Admin</h1>
            <div className='admin-container'>
                <Link to='/admin/shopping-carts'>
                    <button className='admin-button'>View Shopping Carts</button>
                </Link>
                <Link to='/admin/orders'>
                    <button className='admin-button'>View Orders</button>
                </Link>
                <Link to='/admin/products'>
                    <button className='admin-button'>Manage Products</button>
                </Link>
            </div>
        </div>
    )
}

export default Admin;
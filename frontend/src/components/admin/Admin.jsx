import React from 'react';
import { Link } from 'react-router-dom'

import './Admin.css';

const Admin = (item) => {

    return (
        <div className='overall-admin-container'>
            <div className='admin-header'>
                <h1>Admin Dashboard</h1>
                <p className='admin-subtitle'>Manage your online shop</p>
            </div>
            <div className='admin-container'>
                <div className='admin-card-grid'>
                    <Link to='/admin/shopping-carts' className='admin-card-link'>
                        <div className='admin-card'>
                            <div className='admin-card-icon'>🛒</div>
                            <h3>Shopping Carts</h3>
                            <p>View active shopping carts</p>
                        </div>
                    </Link>
                    <Link to='/admin/orders' className='admin-card-link'>
                        <div className='admin-card'>
                            <div className='admin-card-icon'>📦</div>
                            <h3>Orders</h3>
                            <p>View completed orders</p>
                        </div>
                    </Link>
                    <Link to='/admin/products' className='admin-card-link'>
                        <div className='admin-card'>
                            <div className='admin-card-icon'>📝</div>
                            <h3>Products</h3>
                            <p>Add, edit, or delete products</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Admin;
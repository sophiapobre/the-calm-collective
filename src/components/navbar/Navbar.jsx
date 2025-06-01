import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './Navbar.css';
import logo from '../assets/logo.png';
import cartImage from '../assets/cart.png';

// Adapted code from GreatStack Tutorial
const Navbar = () => {
    const cartItems = useSelector(state => state.cart.cart);

    return (
        <div className='navbar'>
            <Link to='/' className='link'>
                <div className='nav-logo'>
                    <img src={logo} alt=''/>
                    <p>RandomShop</p>
                </div>
            </Link>
            
            <ul className='nav-menu'>
                <li>
                    <Link to='/' className='link'>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to='/Categories' className='link'>
                    Categories
                    </Link>
                </li>
                <li>
                    <Link to='/Search' className='link'>
                    Search
                    </Link>
                </li>
            </ul>
            
            <div className='nav-login-cart'>
                <button>Login</button>
                <Link to='/Checkout'>
                    <img src={cartImage} alt=''/>
                </Link>
                <Link to='/Checkout'>
                    <div className='nav-cart-count'>{cartItems.length}</div>
                </Link>
            </div>
        </div>
    )
}

export default Navbar
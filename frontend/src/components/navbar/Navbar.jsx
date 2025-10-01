import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';
import logo from '../assets/logo.png';
import cartImage from '../assets/cart.png';

const Navbar = () => {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">RandomShop</Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={handleNavCollapse}
          aria-controls="navbarSupportedContent" 
          aria-expanded={!isNavCollapsed} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleNavCollapse}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories" onClick={handleNavCollapse}>
                Categories
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/bestsellers" onClick={handleNavCollapse}>
                Best Sellers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search" onClick={handleNavCollapse}>
                Search
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin" onClick={handleNavCollapse}>
                Admin
              </Link>
            </li>
          </ul>

          <div className="navbar-nav ml-auto">
            <Link to="/cart" onClick={handleNavCollapse}>
              <img className="cart-icon" src={cartImage} alt="Cart" style={{ width: '25px', height: '25px' }} />
            </Link>
            <button className="login-button">Login</button>
          </div>
        </div>
      </nav>
    )
}

export default Navbar